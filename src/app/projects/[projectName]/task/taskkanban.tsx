import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Inbox, ChevronLeft, ChevronRight } from "lucide-react";
import TaskCard from "./taskcard";
import { Task } from "./schemas/task";
import { Team } from "@/app/projects/schemas/team";
import ViewAndEditModal, { type TaskViewEditPayload } from "./viewAndEdit";
import DeleteTaskModal from "./deleteTask";
import TaskDetailModal from "./taskDetailModal";
import {
  filterTasks,
  getStatusConfig,
  normalizeTaskStatus,
  TASK_STATUS_OPTIONS,
} from "./task-utils";

type TaskKanbanProps = {
  searchQuery: string;
  statusFilter: string;
  dueFilter: string;
  priorityFilter?: string;
  assignmentFilter?: string;
  teams?: Team[];
  tasks: Task[];
  onUpdateTask: (
    payload: TaskViewEditPayload,
    options?: { showSuccessToast?: boolean }
  ) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void> | void;
  onAddTask?: (status?: string) => void;
  canEditTasks: boolean;
  canDeleteTasks: boolean;
  statusOptions?: string[];
};

export default function TaskKanban({
  searchQuery,
  statusFilter,
  dueFilter,
  priorityFilter = "all",
  assignmentFilter = "all",
  teams = [],
  tasks,
  onUpdateTask,
  onDeleteTask,
  onAddTask,
  canEditTasks,
  canDeleteTasks,
  statusOptions = TASK_STATUS_OPTIONS,
}: TaskKanbanProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dropTargetStatus, setDropTargetStatus] = useState<string | null>(null);
  const [pendingTaskIds, setPendingTaskIds] = useState<string[]>([]);
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

  // Auto-scroll & Horizontal navigation states
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const scrollDirectionRef = useRef<number>(0);
  const scrollSpeedRef = useRef<number>(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isAutoScrollingLeft, setIsAutoScrollingLeft] = useState(false);
  const [isAutoScrollingRight, setIsAutoScrollingRight] = useState(false);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const filteredTasks = useMemo(
    () =>
      filterTasks({
        tasks: localTasks,
        searchQuery,
        statusFilter,
        dueFilter,
        priorityFilter,
        assignmentFilter,
      }),
    [dueFilter, priorityFilter, assignmentFilter, searchQuery, statusFilter, localTasks]
  );

  const columns = useMemo(
    () =>
      statusOptions.map((status) => ({
        status,
        config: getStatusConfig(status),
        tasks: filteredTasks.filter(
          (task) => normalizeTaskStatus(task.status) === status
        ),
      })),
    [filteredTasks, statusOptions]
  );

  const boardKey = `${statusFilter}-${dueFilter}-${priorityFilter}-${assignmentFilter}-${searchQuery}`;

  // Stop active auto-scroll
  const stopAutoScroll = useCallback(() => {
    scrollDirectionRef.current = 0;
    scrollSpeedRef.current = 0;
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  }, []);

  // Start active auto-scroll loop
  const startAutoScroll = useCallback(() => {
    if (animFrameRef.current !== null) return;
    const step = () => {
      const container = scrollContainerRef.current;
      if (container && scrollDirectionRef.current !== 0) {
        container.scrollLeft += scrollDirectionRef.current * scrollSpeedRef.current;
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        animFrameRef.current = null;
      }
    };
    animFrameRef.current = requestAnimationFrame(step);
  }, []);

  // Update visibility of left/right navigation scroll buttons
  const updateScrollButtons = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const hasOverflow = el.scrollWidth > el.clientWidth + 4;
    setCanScrollLeft(hasOverflow && el.scrollLeft > 10);
    setCanScrollRight(
      hasOverflow && el.scrollLeft < el.scrollWidth - el.clientWidth - 10
    );
  }, []);

  // Smooth scroll container by given pixel delta
  const scrollByAmount = (amount: number) => {
    scrollContainerRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  // Observe container size changes to maintain accurate scroll indicators
  useEffect(() => {
    updateScrollButtons();
    const el = scrollContainerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => updateScrollButtons());
    observer.observe(el);
    return () => observer.disconnect();
  }, [columns, updateScrollButtons]);

  // Window drag listeners for edge auto-scrolling
  useEffect(() => {
    if (!draggedTaskId) {
      stopAutoScroll();
      setIsAutoScrollingLeft(false);
      setIsAutoScrollingRight(false);
      return;
    }

    const handleWindowDragOver = (e: DragEvent) => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX;
      const edgeZone = 140; // Detection zone in pixels from left/right edge

      const distFromLeft = mouseX - rect.left;
      const distFromRight = rect.right - mouseX;

      // Near or past left edge -> scroll left
      if (distFromLeft < edgeZone && container.scrollLeft > 0) {
        const intensity = Math.max(
          0.2,
          (edgeZone - Math.max(0, distFromLeft)) / edgeZone
        );
        scrollDirectionRef.current = -1;
        scrollSpeedRef.current = Math.max(4, Math.round(intensity * 25));
        setIsAutoScrollingLeft(true);
        setIsAutoScrollingRight(false);
        startAutoScroll();
      }
      // Near or past right edge -> scroll right
      else if (
        distFromRight < edgeZone &&
        container.scrollLeft < container.scrollWidth - container.clientWidth - 2
      ) {
        const intensity = Math.max(
          0.2,
          (edgeZone - Math.max(0, distFromRight)) / edgeZone
        );
        scrollDirectionRef.current = 1;
        scrollSpeedRef.current = Math.max(4, Math.round(intensity * 25));
        setIsAutoScrollingRight(true);
        setIsAutoScrollingLeft(false);
        startAutoScroll();
      } else {
        setIsAutoScrollingLeft(false);
        setIsAutoScrollingRight(false);
        stopAutoScroll();
      }
    };

    const handleWindowDragEnd = () => {
      setDraggedTaskId(null);
      setDropTargetStatus(null);
      setIsAutoScrollingLeft(false);
      setIsAutoScrollingRight(false);
      stopAutoScroll();
    };

    window.addEventListener("dragover", handleWindowDragOver);
    window.addEventListener("dragend", handleWindowDragEnd);
    window.addEventListener("drop", handleWindowDragEnd);

    return () => {
      window.removeEventListener("dragover", handleWindowDragOver);
      window.removeEventListener("dragend", handleWindowDragEnd);
      window.removeEventListener("drop", handleWindowDragEnd);
      stopAutoScroll();
    };
  }, [draggedTaskId, startAutoScroll, stopAutoScroll]);

  // Translate vertical wheel scroll to horizontal when hovering over board
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

    // Check if hovered inside a scrollable column that still has vertical room
    const target = e.target as HTMLElement | null;
    const verticalScrollable = target?.closest(
      ".overflow-y-auto"
    ) as HTMLElement | null;
    if (verticalScrollable && verticalScrollable !== container) {
      const canScrollDown =
        e.deltaY > 0 &&
        verticalScrollable.scrollTop <
          verticalScrollable.scrollHeight - verticalScrollable.clientHeight - 1;
      const canScrollUp = e.deltaY < 0 && verticalScrollable.scrollTop > 1;
      if (canScrollDown || canScrollUp) {
        return;
      }
    }

    const atLeftEdge = container.scrollLeft <= 0 && e.deltaY < 0;
    const atRightEdge =
      container.scrollLeft >= container.scrollWidth - container.clientWidth - 2 &&
      e.deltaY > 0;

    if (!atLeftEdge && !atRightEdge) {
      container.scrollLeft += e.deltaY * 0.85;
      updateScrollButtons();
    }
  };

  const handleDrop = async (targetStatus: string, taskId?: string) => {
    stopAutoScroll();
    setIsAutoScrollingLeft(false);
    setIsAutoScrollingRight(false);

    if (!canEditTasks) {
      return;
    }

    const activeTaskId =
      taskId && taskId.trim() ? taskId : draggedTaskId;
    if (!activeTaskId) {
      return;
    }

    const task = localTasks.find((item) => item.id === activeTaskId);
    if (!task) {
      setDraggedTaskId(null);
      setDropTargetStatus(null);
      return;
    }

    const normalizedCurrentStatus = normalizeTaskStatus(task.status);
    if (normalizedCurrentStatus === targetStatus) {
      setDraggedTaskId(null);
      setDropTargetStatus(null);
      return;
    }

    // Save previous state for rollback on API failure
    const previousTasks = [...localTasks];

    // Optimistically update card position in local state immediately
    setLocalTasks((prev) =>
      prev.map((t) => (t.id === activeTaskId ? { ...t, status: targetStatus } : t))
    );

    setPendingTaskIds((prev) => [...prev, activeTaskId]);
    setDraggedTaskId(null);
    setDropTargetStatus(null);

    try {
      await onUpdateTask(
        {
          id: task.id,
          status: targetStatus,
        },
        {
          showSuccessToast: false,
        }
      );
    } catch (err) {
      console.error("Failed to update task status:", err);
      // Rollback on error
      setLocalTasks(previousTasks);
    } finally {
      setPendingTaskIds((prev) => prev.filter((id) => id !== activeTaskId));
    }
  };

  return (
    <>
      <AnimatePresence mode="sync">
        <div className="relative h-full w-full min-h-0 overflow-hidden group/kanban">
          {/* Floating Navigation Controls (when not dragging) */}
          {canScrollLeft && !draggedTaskId && (
            <button
              type="button"
              onClick={() => scrollByAmount(-360)}
              aria-label="Scroll board left"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-30 flex size-9 items-center justify-center rounded-full border border-v2-neutral-400/80 bg-v2-neutral-600/90 text-v2-neutral-100 shadow-xl backdrop-blur-md transition-all hover:bg-v2-neutral-500 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="size-5" />
            </button>
          )}

          {canScrollRight && !draggedTaskId && (
            <button
              type="button"
              onClick={() => scrollByAmount(360)}
              aria-label="Scroll board right"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-30 flex size-9 items-center justify-center rounded-full border border-v2-neutral-400/80 bg-v2-neutral-600/90 text-v2-neutral-100 shadow-xl backdrop-blur-md transition-all hover:bg-v2-neutral-500 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronRight className="size-5" />
            </button>
          )}

          {/* Auto-scroll Edge Glow Overlays (Active during Drag) */}
          <AnimatePresence>
            {isAutoScrollingLeft && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute left-0 top-0 bottom-3 w-32 bg-gradient-to-r from-sky-500/25 via-sky-500/10 to-transparent flex items-center justify-start pl-4 z-30"
              >
                <div className="flex items-center gap-1.5 rounded-full bg-v2-neutral-600/90 border border-sky-400/50 px-2.5 py-1 text-xs font-semibold text-sky-300 shadow-lg animate-pulse">
                  <ChevronLeft className="size-4" />
                  <span>Scrolling left</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isAutoScrollingRight && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute right-0 top-0 bottom-3 w-32 bg-gradient-to-l from-sky-500/25 via-sky-500/10 to-transparent flex items-center justify-end pr-4 z-30"
              >
                <div className="flex items-center gap-1.5 rounded-full bg-v2-neutral-600/90 border border-sky-400/50 px-2.5 py-1 text-xs font-semibold text-sky-300 shadow-lg animate-pulse">
                  <span>Scrolling right</span>
                  <ChevronRight className="size-4" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div
            ref={scrollContainerRef}
            onWheel={handleWheel}
            onScroll={updateScrollButtons}
            className="h-full min-h-0 max-w-full overflow-x-auto overflow-y-hidden pb-3 custom-scrollbar"
          >
            <motion.div
              key={boardKey}
              className="flex h-full min-h-0 w-max min-w-full gap-4"
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.05, delayChildren: 0.04 },
                },
              }}
            >
              {columns.map((column) => {
                const isDropActive = dropTargetStatus === column.status;
                return (
                  <motion.section
                    key={column.status}
                    className={`flex h-full min-h-0 w-[min(340px,calc(100vw-3rem))] shrink-0 flex-col rounded-2xl border transition-all duration-200 sm:w-[340px] ${
                      isDropActive
                        ? "border-sky-500/80 bg-sky-500/10 shadow-lg ring-2 ring-sky-500/25"
                        : "border-v2-neutral-500/60 bg-v2-neutral-500/15"
                    }`}
                    onDragOver={(event) => {
                      event.preventDefault();
                      if (draggedTaskId) {
                        setDropTargetStatus(column.status);
                      }
                    }}
                    onDragLeave={() => {
                      if (dropTargetStatus === column.status) {
                        setDropTargetStatus(null);
                      }
                    }}
                    onDrop={async (event) => {
                      event.preventDefault();
                      const taskId = event.dataTransfer.getData("text/plain");
                      await handleDrop(column.status, taskId);
                    }}
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      show: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.24, ease: "easeOut" },
                      },
                    }}
                  >
                    {/* ClickUp Column Header */}
                    <div className="flex shrink-0 items-center justify-between border-b border-v2-neutral-500/60 p-3.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="size-2.5 rounded-full shrink-0 shadow-xs"
                          style={{ backgroundColor: column.config.dotColor }}
                        />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-v2-neutral-200 truncate">
                          {column.config.label}
                        </h3>
                        <span className="grid size-5 place-items-center rounded-full bg-v2-neutral-500/40 text-[10px] font-bold text-v2-neutral-300 border border-v2-neutral-500/80">
                          {column.tasks.length}
                        </span>
                      </div>

                      {/* Inline Quick Add button */}
                      {canEditTasks && onAddTask && (
                        <button
                          type="button"
                          onClick={() => onAddTask(column.status)}
                          title={`Add task to ${column.config.label}`}
                          className="p-1 rounded-lg text-v2-neutral-400 hover:text-v2-neutral-100 hover:bg-v2-neutral-500/40 transition-colors cursor-pointer"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Task Column Cards list */}
                    <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3 custom-scrollbar">
                      {column.tasks.length > 0 ? (
                        column.tasks.map((task) => (
                          <div key={task.id}>
                            <TaskCard
                              id={task.id}
                              title={task.title}
                              desc={task.description}
                              due={task.due_date}
                              priority={task.priority}
                              status={task.status}
                              assignee={task.assignee}
                              teams={task.teams}
                              onClick={() => setSelectedTask(task)}
                              onDeleteClick={
                                canDeleteTasks
                                  ? (taskId) => setDeleteTaskId(taskId)
                                  : undefined
                              }
                              canDelete={canDeleteTasks}
                              draggable={canEditTasks && !pendingTaskIds.includes(task.id)}
                              isDragging={draggedTaskId === task.id}
                              onDragStart={(event) => {
                                event.dataTransfer.effectAllowed = "move";
                                event.dataTransfer.setData("text/plain", task.id);
                                setDraggedTaskId(task.id);
                              }}
                              onDragEnd={() => {
                                setDraggedTaskId(null);
                                setDropTargetStatus(null);
                                stopAutoScroll();
                                setIsAutoScrollingLeft(false);
                                setIsAutoScrollingRight(false);
                              }}
                            />
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-v2-neutral-500/50 bg-v2-neutral-500/10 px-4 py-10 text-center">
                          <Inbox className="size-5 text-v2-neutral-400 mb-1.5 opacity-50" />
                          <span className="text-xs text-v2-neutral-400 font-medium">
                            No tasks in this stage
                          </span>
                          {canEditTasks && onAddTask && (
                            <button
                              type="button"
                              onClick={() => onAddTask(column.status)}
                              className="mt-2 text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                            >
                              + Add a task
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.section>
                );
              })}
            </motion.div>
          </div>
        </div>
      </AnimatePresence>

      <AnimatePresence>
        {selectedTask ? (
          <TaskDetailModal
            task={selectedTask}
            canEdit={canEditTasks}
            onClose={() => setSelectedTask(null)}
            onEdit={() => {
              setEditingTask(selectedTask);
              setSelectedTask(null);
            }}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {editingTask ? (
          <ViewAndEditModal
            data={{
              id: editingTask.id,
              title: editingTask.title,
              description: editingTask.description,
              due_date: editingTask.due_date,
              status: editingTask.status,
              priority: editingTask.priority,
              assignee: editingTask.assignee,
              teams: editingTask.teams,
            }}
            availableTeams={teams}
            onCancel={() => setEditingTask(null)}
            onSave={async (payload) => {
              await onUpdateTask(payload);
              setEditingTask(null);
            }}
            statusOptions={statusOptions}
            canEdit={canEditTasks}
          />
        ) : null}
      </AnimatePresence>

      {canDeleteTasks ? (
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
      ) : null}
    </>
  );
}
