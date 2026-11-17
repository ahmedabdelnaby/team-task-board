import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { tasksReducer, initState } from "../state/tasksReducer";

const TaskStateContext = createContext(null);
const TaskActionsContext = createContext(null);

const STORAGE_KEY = "ttb_tasks";
const FILTER_KEY = "ttb_filters";

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(tasksReducer, undefined, initState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
  }, [state.tasks]);

  useEffect(() => {
    localStorage.setItem(FILTER_KEY, JSON.stringify(state.filters));
  }, [state.filters]);

  const addTask = useCallback((taskData) => {
    dispatch({
      type: "ADD_TASK",
      id: crypto.randomUUID(),
      ...taskData,
    });
  }, []);

  const toggleTask = useCallback((id) => {
    dispatch({ type: "TOGGLE_TASK", id });
  }, []);

  const updateTask = useCallback((id, changes) => {
    dispatch({ type: "UPDATE_TASK", id, changes });
  }, []);

  const deleteTask = useCallback((id) => {
    dispatch({ type: "DELETE_TASK", id });
  }, []);

  const setFilter = useCallback((filters) => {
    dispatch({ type: "SET_FILTER", filters });
  }, []);

  const actions = { addTask, toggleTask, updateTask, deleteTask, setFilter };

  return (
    <TaskStateContext.Provider value={state}>
      <TaskActionsContext.Provider value={actions}>
        {children}
      </TaskActionsContext.Provider>
    </TaskStateContext.Provider>
  );
}

export function useTaskState() {
  const context = useContext(TaskStateContext);
  if (context === null) {
    throw new Error("useTaskState must be used inside <TaskProvider>");
  }
  return context;
}

export function useTaskActions() {
  const context = useContext(TaskActionsContext);
  if (context === null) {
    throw new Error("useTaskActions must be used inside <TaskProvider>");
  }
  return context;
}
