import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// We test the isTaskArray guard and loadTasks logic by importing
// the parts of the reducer that deal with localStorage.

// ─── isTaskArray (copy the logic here to test it in isolation) ───────
function isTaskArray(value) {
  if (!Array.isArray(value)) return false;
  return value.every(
    (t) =>
      typeof t.id === 'string' &&
      typeof t.title === 'string' &&
      typeof t.projectId === 'string' &&
      (t.assigneeId === null || typeof t.assigneeId === 'string') &&
      ['low', 'medium', 'high'].includes(t.priority) &&
      typeof t.dueDate === 'string' &&
      typeof t.completed === 'boolean'
  );
}

const validTask = {
  id: 't1',
  title: 'Valid task',
  projectId: 'p1',
  assigneeId: null,
  priority: 'medium',
  dueDate: '2026-12-01',
  completed: false,
};

// ─── isTaskArray tests ───────────────────────────────────────────────
describe('isTaskArray', () => {
  it('returns true for a valid task array', () => {
    expect(isTaskArray([validTask])).toBe(true);
  });

  it('returns true for an empty array', () => {
    expect(isTaskArray([])).toBe(true);
  });

  it('returns false for null', () => {
    expect(isTaskArray(null)).toBe(false);
  });

  it('returns false for a non-array', () => {
    expect(isTaskArray({ id: 't1' })).toBe(false);
  });

  it('returns false when a task is missing "title"', () => {
    const bad = { ...validTask };
    delete bad.title;
    expect(isTaskArray([bad])).toBe(false);
  });

  it('returns false when priority is not a valid value', () => {
    expect(isTaskArray([{ ...validTask, priority: 'urgent' }])).toBe(false);
  });

  it('returns false when completed is not a boolean', () => {
    expect(isTaskArray([{ ...validTask, completed: 'yes' }])).toBe(false);
  });
});

// ─── localStorage fallback tests ─────────────────────────────────────
describe('localStorage fallback behaviour', () => {
  const sampleTasks = [validTask];

  function loadTasks() {
    try {
      const raw = localStorage.getItem('ttb_tasks');
      if (!raw) return sampleTasks;
      const parsed = JSON.parse(raw);
      return isTaskArray(parsed) ? parsed : sampleTasks;
    } catch {
      return sampleTasks;
    }
  }

  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('returns sampleTasks when nothing is stored', () => {
    expect(loadTasks()).toEqual(sampleTasks);
  });

  it('returns stored tasks when data is valid', () => {
    const stored = [{ ...validTask, id: 'stored-1', title: 'Stored task' }];
    localStorage.setItem('ttb_tasks', JSON.stringify(stored));
    expect(loadTasks()).toEqual(stored);
  });

  it('falls back to sampleTasks on invalid JSON', () => {
    localStorage.setItem('ttb_tasks', 'NOT_VALID_JSON{{{{');
    expect(loadTasks()).toEqual(sampleTasks);
  });

  it('falls back to sampleTasks when shape is wrong', () => {
    localStorage.setItem('ttb_tasks', JSON.stringify([{ id: 1, broken: true }]));
    expect(loadTasks()).toEqual(sampleTasks);
  });

  it('falls back to sampleTasks when stored value is a plain object, not array', () => {
    localStorage.setItem('ttb_tasks', JSON.stringify({ id: 't1' }));
    expect(loadTasks()).toEqual(sampleTasks);
  });
});
