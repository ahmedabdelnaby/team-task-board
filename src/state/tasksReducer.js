import { sampleTasks } from "../data/sampleTasks";

const STORAGE_KEY = "ttb_tasks";
const FILTER_KEY = "ttb_filters";

function isTaskArray(tasks) {
  if (!Array.isArray(tasks)) return false;
  return tasks.every(
    (task) =>
      typeof task.id === "string" &&
      typeof task.title === "string" &&
      typeof task.projectId === "string" &&
      (task.assigneeId === null || typeof task.assigneeId === "string") &&
      ["low", "medium", "high"].includes(task.priority) &&
      typeof task.dueDate === "string" &&
      typeof task.completed === "boolean",
  );
}

function loadTasks() {
  try {
    const tasks = localStorage.getItem(STORAGE_KEY);

    if (!tasks) return sampleTasks;

    const parsedTasks = JSON.parse(tasks);

    return isTaskArray(parsedTasks) ? parsedTasks : sampleTasks;
  } catch {
    return sampleTasks;
  }
}

function loadFilters() {
  try {
    const filters = localStorage.getItem(FILTER_KEY);
    if (!filters) return defaultFilters;
    return { ...defaultFilters, ...JSON.parse(filters) };
  } catch {
    return defaultFilters;
  }
}

const defaultFilters = {
  status: "all",
  projectId: "all",
  search: "",
};

export function initState() {
  return {
    tasks: loadTasks(),
    filters: loadFilters(),
  };
}

export function tasksReducer(state, action) {
  switch (action.type) {
    case "ADD_TASK": {
      const newTask = {
        id: action.id,
        title: action.title,
        projectId: action.projectId,
        assigneeId: action.assigneeId ?? null,
        priority: action.priority,
        dueDate: action.dueDate,
        completed: false,
      };

      return { ...state, tasks: [...state.tasks, newTask] };
    }

    case "TOGGLE_TASK": {
      const tasks = state.tasks.map((task) =>
        task.id === action.id ? { ...task, completed: !task.completed } : task,
      );

      return { ...state, tasks };
    }

    case "UPDATE_TASK": {
      const tasks = state.tasks.map((task) =>
        task.id === action.id ? { ...task, ...action.changes } : task,
      );

      return { ...state, tasks };
    }

    case "DELETE_TASK": {
      const tasks = state.tasks.filter((task) => task.id !== action.id);

      return { ...state, tasks };
    }

    case "SET_FILTER": {
      return {
        ...state,
        filters: { ...state.filters, ...action.filters },
      };
    }

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}
