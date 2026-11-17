import { memo, useState } from 'react';
import styles from './TaskItem.module.css';

const PRIORITY_LABEL = { low: 'Low', medium: 'Medium', high: 'High' };

const TaskItem = memo(function TaskItem({
  task,
  members,
  onToggle,
  onUpdate,
  onDelete,
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).format(new Date(task.dueDate + 'T00:00:00'));

  return (
    <article className={`${styles.card} ${task.completed ? styles.completed : ''}`}>
      {/* ── Top row ── */}
      <div className={styles.topRow}>
        <button
          className={styles.toggle}
          onClick={() => onToggle(task.id)}
          aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          <span className={styles.checkbox} aria-hidden="true">
            {task.completed ? '✓' : ''}
          </span>
        </button>

        <span className={`${styles.title} ${task.completed ? styles.strikethrough : ''}`}>
          {task.title}
        </span>

        {task.isOverdue && (
          <span className={styles.overdueBadge} aria-label="Overdue">Overdue</span>
        )}
      </div>

      {/* ── Meta row ── */}
      <div className={styles.meta}>
        <span className={styles.project}>{task.projectName}</span>
        <span className={styles.assignee}>{task.assigneeName}</span>
        <span className={styles.date}>Due {formattedDate}</span>
        <span className={`${styles.priority} ${styles[task.priority]}`}>
          {PRIORITY_LABEL[task.priority]}
        </span>
      </div>

      {/* ── Inline update controls ── */}
      <div className={styles.controls}>
        <label className={styles.controlLabel} htmlFor={`assignee-${task.id}`}>
          Assignee
        </label>
        <select
          id={`assignee-${task.id}`}
          className={styles.select}
          value={task.assigneeId ?? ''}
          onChange={(e) =>
            onUpdate(task.id, { assigneeId: e.target.value || null })
          }
        >
          <option value="">Unassigned</option>
          {members?.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>

        <label className={styles.controlLabel} htmlFor={`priority-${task.id}`}>
          Priority
        </label>
        <select
          id={`priority-${task.id}`}
          className={styles.select}
          value={task.priority}
          onChange={(e) => onUpdate(task.id, { priority: e.target.value })}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* ── Delete with confirmation ── */}
      <div className={styles.deleteRow}>
        {!confirmDelete ? (
          <button
            className={styles.deleteBtn}
            onClick={() => setConfirmDelete(true)}
          >
            Delete
          </button>
        ) : (
          <div className={styles.confirmBox}>
            <span>Delete this task?</span>
            <button
              className={styles.confirmYes}
              onClick={() => onDelete(task.id)}
            >
              Yes, delete
            </button>
            <button
              className={styles.confirmNo}
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </article>
  );
});

export default TaskItem;
