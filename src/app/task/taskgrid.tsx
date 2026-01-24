import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TaskCard from "./taskcard";
import { Task } from "./schemas/task";
import ViewAndEditModal, { type TaskViewEditPayload } from "./viewAndEdit";
import DeleteTaskModal from "./deleteTask";


type TaskGridProps = {
  searchQuery: string;
  statusFilter: string;
  dueFilter: string;
  tasks: Task[];
  onUpdateTask: (payload: TaskViewEditPayload) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void> | void;
};

const normalizeStatus = (status: string) =>
  status.trim().toLowerCase().replace(/[\s-]+/g, "_");

const isSameDay = (date: Date, other: Date) =>
  date.getFullYear() === other.getFullYear() &&
  date.getMonth() === other.getMonth() &&
  date.getDate() === other.getDate();

const isInThisWeek = (date: Date, today: Date) => {
  const start = new Date(today);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay());
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return date >= start && date <= end;
};

const isInThisMonth = (date: Date, today: Date) =>
  date.getFullYear() === today.getFullYear() &&
  date.getMonth() === today.getMonth();

export default function TaskGrid({
  searchQuery,
  statusFilter,
  dueFilter,
  tasks,
  onUpdateTask,
  onDeleteTask,
}: TaskGridProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const normalizedQuery = (searchQuery || "").toLowerCase();
  const normalizedStatus = (statusFilter || "all").toLowerCase();
  const normalizedDue = (dueFilter || "all").toLowerCase();
  const today = new Date();
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const gridKey = `${normalizedStatus}-${normalizedDue}-${normalizedQuery}`;

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(normalizedQuery) ||
      task.description.toLowerCase().includes(normalizedQuery);

    const matchesStatus =
      normalizedStatus === "all" ||
      normalizeStatus(task.status) === normalizedStatus;

    if (!matchesSearch || !matchesStatus) {
      return false;
    }

    if (normalizedDue === "all") {
      return true;
    }

    const dueDate = new Date(`${task.due_date}T00:00:00`);
    if (normalizedDue === "today") {
      return isSameDay(dueDate, today);
    }
    if (normalizedDue === "this-week") {
      return isInThisWeek(dueDate, today);
    }
    if (normalizedDue === "this-month") {
      return isInThisMonth(dueDate, today);
    }

    return true;
  });

  return (
    <>
      <AnimatePresence mode="sync">
        <motion.div
          key={gridKey}
          className="grid grid-cols-3 gap-4"
          initial="hidden"
          animate="show"
          exit="hidden"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.06, delayChildren: 0.05 },
            },
          }}
        >
          {filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              className="h-full"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              variants={{
                hidden: { opacity: 0, y: 12 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.25, ease: "easeOut" },
                },
              }}
            >
              <TaskCard
                id={task.id}
                title={task.title}
                desc={task.description}
                due={task.due_date}
                priority={task.priority}
                status={task.status}
                assigned_to={task.teams.map(team => team.name)}
                onClick={() => setSelectedTask(task)}
                onDeleteClick={(taskId) => setDeleteTaskId(taskId)}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
      <AnimatePresence>
        {selectedTask && (
          <ViewAndEditModal
            data={{
              id: selectedTask.id,
              title: selectedTask.title,
              description: selectedTask.description,
              due_date: selectedTask.due_date,
              status: selectedTask.status,
              priority: selectedTask.priority,
              teams: selectedTask.teams,
            }}
            onCancel={() => setSelectedTask(null)}
            onSave={async (payload) => {
              await onUpdateTask(payload);
              setSelectedTask(null);
            }}
          />
        )}
      </AnimatePresence>
      <DeleteTaskModal
        open={deleteTaskId !== null}
        taskId={deleteTaskId}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTaskId(null);
          }
        }}
        onConfirm={(taskId) => {
          onDeleteTask(taskId);
          setDeleteTaskId(null);
        }}
      />
    </>
  );
}
