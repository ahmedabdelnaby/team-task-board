import styles from './TaskSummary.module.css';

export default function TaskSummary({ summary }) {
  return (
    <div className={styles.bar}>
      <div className={styles.stat}>
        <span className={styles.number}>{summary.total}</span>
        <span className={styles.label}>Total</span>
      </div>
      <div className={styles.divider} />
      <div className={styles.stat}>
        <span className={styles.number}>{summary.completed}</span>
        <span className={styles.label}>Done</span>
      </div>
      <div className={styles.divider} />
      <div className={`${styles.stat} ${summary.overdue > 0 ? styles.danger : ''}`}>
        <span className={styles.number}>{summary.overdue}</span>
        <span className={styles.label}>Overdue</span>
      </div>
    </div>
  );
}
