import { useMemo } from "react";
import { useTaskState } from "../context/TaskContext";

export function useVisibleTasks(members, projects) {
  const { tasks, filters } = useTaskState();
  const today = new Date().toISOString().slice(0, 10);

  const visibleTasks = useMemo(() => {
    let result = [...tasks];

    if (filters.status === "active") {
      result = result.filter((t) => !t.completed);
    } else if (filters.status === "completed") {
      result = result.filter((t) => t.completed);
    }

    if (filters.projectId !== "all") {
      result = result.filter((t) => t.projectId === filters.projectId);
    }

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(q));
    }

    result.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return a.dueDate.localeCompare(b.dueDate);
    });

    return result;
  }, [tasks, filters]);

  const summary = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const overdue = tasks.filter(
      (t) => !t.completed && t.dueDate < today,
    ).length;
    return { total, completed, overdue };
  }, [tasks, today]);

  const enriched = useMemo(() => {
    return visibleTasks.map((t) => ({
      ...t,
      projectName: projects?.find((p) => p.id === t.projectId)?.name ?? "—",
      assigneeName: t.assigneeId
        ? (members?.find((m) => m.id === t.assigneeId)?.name ?? "Unknown")
        : "Unassigned",
      isOverdue: !t.completed && t.dueDate < today,
    }));
  }, [visibleTasks, members, projects, today]);

  return { visibleTasks: enriched, summary };
}
