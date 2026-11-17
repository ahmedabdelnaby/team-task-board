import { useTaskActions } from "./context/TaskContext";
import { useReferenceData } from "./hooks/useReferenceData";
import { useVisibleTasks } from "./hooks/useVisibleTasks";
import AddTaskForm from "./components/AddTaskForm";
import FilterBar from "./components/FilterBar";
import TaskItem from "./components/TaskItem";
import TaskSummary from "./components/TaskSummary";
import styles from "./App.module.css";

export default function App() {
  const { status, retry } = useReferenceData();
  const { toggleTask, updateTask, deleteTask } = useTaskActions();

  if (status.type === "loading") {
    return (
      <div className={styles.centred}>
        <div className={styles.spinner} aria-label="Loading…" />
        <p className={styles.loadingText}>Loading team data…</p>
      </div>
    );
  }

  if (status.type === "error") {
    return (
      <div className={styles.centred}>
        <p className={styles.errorText}>{status.message}</p>
        <button className={styles.retryBtn} onClick={retry}>
          Retry
        </button>
      </div>
    );
  }

  const { members, projects } = status;

  return (
    <ReadyView
      members={members}
      projects={projects}
      onToggle={toggleTask}
      onUpdate={updateTask}
      onDelete={deleteTask}
    />
  );
}

function ReadyView({ members, projects, onToggle, onUpdate, onDelete }) {
  const { visibleTasks, summary } = useVisibleTasks(members, projects);

  return (
    <div className={styles.layout}>
      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        <header className={styles.brand}>
          <span className={styles.brandIcon}>✦</span>
          <span className={styles.brandName}>Team Task Board (TTB)</span>
        </header>
        <AddTaskForm members={members} projects={projects} />
      </aside>

      {/* ── Main app area ── */}
      <main className={styles.main}>
        <div className={styles.topBar}>
          <TaskSummary summary={summary} />
          <FilterBar projects={projects} />
        </div>

        {visibleTasks.length === 0 ? (
          <div className={styles.empty}>
            <p>No tasks match your filters.</p>
          </div>
        ) : (
          <ul className={styles.list}>
            {visibleTasks.map((task) => (
              <li key={task.id}>
                <TaskItem
                  task={task}
                  members={members}
                  onToggle={onToggle}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
