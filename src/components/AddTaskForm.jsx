import { useState } from 'react';
import { useTaskActions } from '../context/TaskContext';
import styles from './AddTaskForm.module.css';

const today = () => new Date().toISOString().slice(0, 10);

const empty = {
  title: '',
  projectId: '',
  assigneeId: '',
  priority: '',
  dueDate: '',
};


export default function AddTaskForm({ members, projects }) {
  const { addTask } = useTaskActions();
  const [fields, setFields]   = useState(empty);
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});

  function validate(f) {
    const e = {};
    if (f.title.trim().length < 3)   e.title    = 'Title must be at least 3 characters.';
    if (f.title.trim().length > 80)  e.title    = 'Title must be 80 characters or fewer.';
    if (!f.projectId)                e.projectId = 'Project is required.';
    if (!f.priority)                 e.priority  = 'Priority is required.';
    if (!f.dueDate)                  e.dueDate   = 'Due date is required.';
    if (f.dueDate && f.dueDate < today()) e.dueDate = 'Due date cannot be in the past.';
    return e;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  }

  function handleBlur(e) {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const allTouched = Object.fromEntries(Object.keys(empty).map((k) => [k, true]));
    setTouched(allTouched);
    const validationErrors = validate(fields);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    addTask({
      title:      fields.title.trim(),
      projectId:  fields.projectId,
      assigneeId: fields.assigneeId || null,
      priority:   fields.priority,
      dueDate:    fields.dueDate,
    });

    setFields(empty);
    setErrors({});
    setTouched({});
  }

  const validationErrors = validate(fields);
  const isInvalid = Object.keys(validationErrors).length > 0;

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h2 className={styles.heading}>Add a task</h2>

      {/* Title */}
      <div className={styles.field}>
        <label htmlFor="title" className={styles.label}>Title</label>
        <input
          id="title"
          name="title"
          className={`${styles.input} ${touched.title && errors.title ? styles.inputError : ''}`}
          type="text"
          value={fields.title}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="e.g. Fix login crash on Android"
        />
        {touched.title && errors.title && (
          <span className={styles.error} role="alert">{errors.title}</span>
        )}
      </div>

      {/* Project */}
      <div className={styles.field}>
        <label htmlFor="projectId" className={styles.label}>Project</label>
        <select
          id="projectId"
          name="projectId"
          className={`${styles.input} ${touched.projectId && errors.projectId ? styles.inputError : ''}`}
          value={fields.projectId}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          <option value="">Select a project…</option>
          {projects?.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        {touched.projectId && errors.projectId && (
          <span className={styles.error} role="alert">{errors.projectId}</span>
        )}
      </div>

      {/* Assignee (optional) */}
      <div className={styles.field}>
        <label htmlFor="assigneeId" className={styles.label}>
          Assignee <span className={styles.optional}>(optional)</span>
        </label>
        <select
          id="assigneeId"
          name="assigneeId"
          className={styles.input}
          value={fields.assigneeId}
          onChange={handleChange}
        >
          <option value="">Unassigned</option>
          {members?.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      {/* Priority */}
      <div className={styles.field}>
        <label htmlFor="priority" className={styles.label}>Priority</label>
        <select
          id="priority"
          name="priority"
          className={`${styles.input} ${touched.priority && errors.priority ? styles.inputError : ''}`}
          value={fields.priority}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          <option value="">Select priority…</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        {touched.priority && errors.priority && (
          <span className={styles.error} role="alert">{errors.priority}</span>
        )}
      </div>

      {/* Due date */}
      <div className={styles.field}>
        <label htmlFor="dueDate" className={styles.label}>Due date</label>
        <input
          id="dueDate"
          name="dueDate"
          type="date"
          className={`${styles.input} ${touched.dueDate && errors.dueDate ? styles.inputError : ''}`}
          value={fields.dueDate}
          min={today()}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.dueDate && errors.dueDate && (
          <span className={styles.error} role="alert">{errors.dueDate}</span>
        )}
      </div>

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={touched.title && isInvalid}
      >
        Add task
      </button>
    </form>
  );
}
