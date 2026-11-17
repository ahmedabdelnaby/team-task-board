import { describe, it, expect } from 'vitest';
import { tasksReducer } from '../state/tasksReducer';

// ─── Base state used in every test ───────────────────────────────────
const baseState = {
  tasks: [
    {
      id: 't1',
      title: 'Existing task',
      projectId: 'p1',
      assigneeId: 'm1',
      priority: 'medium',
      dueDate: '2026-12-01',
      completed: false,
    },
  ],
  filters: { status: 'all', projectId: 'all', search: '' },
};

// ─── ADD_TASK ────────────────────────────────────────────────────────
describe('ADD_TASK', () => {
  it('adds a new task to the list', () => {
    const action = {
      type: 'ADD_TASK',
      id: 't2',
      title: 'New task',
      projectId: 'p2',
      assigneeId: null,
      priority: 'high',
      dueDate: '2026-12-15',
    };
    const next = tasksReducer(baseState, action);
    expect(next.tasks).toHaveLength(2);
    expect(next.tasks[1].title).toBe('New task');
    expect(next.tasks[1].completed).toBe(false);
  });

  it('does not mutate the previous state', () => {
    const action = { type: 'ADD_TASK', id: 't3', title: 'X', projectId: 'p1', assigneeId: null, priority: 'low', dueDate: '2026-12-20' };
    const prev = { ...baseState, tasks: [...baseState.tasks] };
    tasksReducer(prev, action);
    expect(prev.tasks).toHaveLength(1); // original unchanged
  });
});

// ─── TOGGLE_TASK ─────────────────────────────────────────────────────
describe('TOGGLE_TASK', () => {
  it('flips completed from false to true', () => {
    const next = tasksReducer(baseState, { type: 'TOGGLE_TASK', id: 't1' });
    expect(next.tasks[0].completed).toBe(true);
  });

  it('flips completed back to false', () => {
    const completedState = {
      ...baseState,
      tasks: [{ ...baseState.tasks[0], completed: true }],
    };
    const next = tasksReducer(completedState, { type: 'TOGGLE_TASK', id: 't1' });
    expect(next.tasks[0].completed).toBe(false);
  });

  it('does not mutate the previous state', () => {
    const original = baseState.tasks[0].completed;
    tasksReducer(baseState, { type: 'TOGGLE_TASK', id: 't1' });
    expect(baseState.tasks[0].completed).toBe(original);
  });
});

// ─── UPDATE_TASK ─────────────────────────────────────────────────────
describe('UPDATE_TASK', () => {
  it('updates assigneeId', () => {
    const next = tasksReducer(baseState, { type: 'UPDATE_TASK', id: 't1', changes: { assigneeId: 'm2' } });
    expect(next.tasks[0].assigneeId).toBe('m2');
  });

  it('updates priority', () => {
    const next = tasksReducer(baseState, { type: 'UPDATE_TASK', id: 't1', changes: { priority: 'high' } });
    expect(next.tasks[0].priority).toBe('high');
  });

  it('does not mutate previous state', () => {
    tasksReducer(baseState, { type: 'UPDATE_TASK', id: 't1', changes: { priority: 'low' } });
    expect(baseState.tasks[0].priority).toBe('medium');
  });
});

// ─── DELETE_TASK ─────────────────────────────────────────────────────
describe('DELETE_TASK', () => {
  it('removes the task with the given id', () => {
    const next = tasksReducer(baseState, { type: 'DELETE_TASK', id: 't1' });
    expect(next.tasks).toHaveLength(0);
  });

  it('does not mutate previous state', () => {
    tasksReducer(baseState, { type: 'DELETE_TASK', id: 't1' });
    expect(baseState.tasks).toHaveLength(1);
  });
});

// ─── SET_FILTER ──────────────────────────────────────────────────────
describe('SET_FILTER', () => {
  it('updates the status filter', () => {
    const next = tasksReducer(baseState, { type: 'SET_FILTER', filters: { status: 'completed' } });
    expect(next.filters.status).toBe('completed');
  });

  it('merges filters without overwriting others', () => {
    const next = tasksReducer(baseState, { type: 'SET_FILTER', filters: { projectId: 'p2' } });
    expect(next.filters.status).toBe('all'); // unchanged
    expect(next.filters.projectId).toBe('p2');
  });
});

// ─── Unknown action ──────────────────────────────────────────────────
describe('unknown action', () => {
  it('throws for an unhandled action type', () => {
    expect(() =>
      tasksReducer(baseState, { type: 'UNKNOWN_ACTION' })
    ).toThrow('Unhandled action type: UNKNOWN_ACTION');
  });
});
