# Team Task Board

A single-page task management app built with React and JavaScript.

## Stack

- React 18 + Vite
- `useReducer` + Context API for state (no external state libraries)
- CSS Modules for styling
- Vitest for tests

## Install & run

```bash
npm install
npm run dev        # start dev server at http://localhost:5173
npm run build      # production build
npm test           # run tests
```

## Features

- Add tasks with title, project, assignee, priority, and due date
- Inline validation on the form (errors shown next to each field)
- Toggle tasks complete / incomplete
- Reassign and change priority directly on each task card
- Delete with an in-card confirmation step (no window.confirm)
- Overdue badge on incomplete tasks past their due date
- Filter by status, project, and free-text search (debounced 300ms)
- Tasks sorted: incomplete first, then by due date
- Task summary: total, completed, overdue counts
- Data persists in localStorage across page reloads
- Corrupted or missing localStorage falls back to sample tasks gracefully

## Project structure

```
src/
  api/           mockApi.js
  components/    TaskItem, AddTaskForm, FilterBar, TaskSummary
  context/       TaskContext.jsx (provider + hooks)
  data/          sampleTasks.js
  hooks/         useReferenceData, useVisibleTasks, useDebouncedValue
  state/         tasksReducer.js
  tests/         tasksReducer.test.js, storage.test.js
  styles/        global.css
```
