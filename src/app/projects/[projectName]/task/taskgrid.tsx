import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TaskCard from "./taskcard";
import { Task } from "./schemas/task";
import ViewAndEditModal, { type TaskViewEditPayload } from "./viewAndEdit";
import DeleteTaskModal from "./deleteTask";
import { filterTasks, TASK_STATUS_OPTIONS } from "./task-utils";

type TaskGridProps = {
  searchQuery: string;
  statusFilter: string;
  dueFilter: string;
  tasks: Task[];
  onUpdateTask: (payload: TaskViewEditPayload) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void> | void;
  statusOptions?: string[];
};

export default function TaskGrid({
  searchQuery,
  statusFilter,
  dueFilter,
  tasks,
  onUpdateTask,
  onDeleteTask,
  statusOptions = TASK_STATUS_OPTIONS,
}: TaskGridProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const gridKey = `${statusFilter}-${dueFilter}-${searchQuery}`;
  const filteredTasks = filterTasks({
    tasks,
    searchQuery,
    statusFilter,
    dueFilter,
  });

  return (
    <>
      <AnimatePresence mode="sync">
        <motion.div
          key={gridKey}
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
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
            statusOptions={statusOptions}
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
