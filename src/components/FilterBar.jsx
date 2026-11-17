import { useState, useEffect } from "react";
import { useTaskState, useTaskActions } from "../context/TaskContext";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import styles from "./FilterBar.module.css";

export default function FilterBar({ projects }) {
  const { filters } = useTaskState();
  const { setFilter } = useTaskActions();

  const [searchInput, setSearchInput] = useState(filters.search);

  const debouncedSearch = useDebouncedValue(searchInput, 300);

  useEffect(() => {
    setFilter({ search: debouncedSearch });
  }, [debouncedSearch, setFilter]);

  return (
    <div className={styles.bar}>
      {/* Search */}
      <div className={styles.searchWrap}>
        <label htmlFor="search" className={styles.srOnly}>
          Search tasks
        </label>
        <input
          id="search"
          type="search"
          className={styles.search}
          placeholder="Search tasks…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      {/* Status */}
      <div className={styles.group}>
        <label htmlFor="status-filter" className={styles.label}>
          Status
        </label>
        <select
          id="status-filter"
          className={styles.select}
          value={filters.status}
          onChange={(e) => setFilter({ status: e.target.value })}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Project */}
      <div className={styles.group}>
        <label htmlFor="project-filter" className={styles.label}>
          Project
        </label>
        <select
          id="project-filter"
          className={styles.select}
          value={filters.projectId}
          onChange={(e) => setFilter({ projectId: e.target.value })}
        >
          <option value="all">All projects</option>
          {projects?.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
