import { describe, it, expect, vi } from 'vitest';
import { isValidTask, parseTasks, saveTasksToStorage, MAX_TASK_LENGTH, STORAGE_KEY } from './todoLogic.js';

describe('isValidTask', () => {
  it('returns true for a valid task (happy path)', () => {
    expect(isValidTask({ id: '1', text: 'Buy milk', completed: false })).toBe(true);
    expect(isValidTask({ id: '2', text: 'Done', completed: true })).toBe(true);
  });

  it('returns false for null or undefined (exception path)', () => {
    expect(isValidTask(null)).toBe(false);
    expect(isValidTask(undefined)).toBe(false);
  });

  it('returns false when id is missing or not a string (exception path)', () => {
    expect(isValidTask({ text: 'x', completed: false })).toBe(false);
    expect(isValidTask({ id: 123, text: 'x', completed: false })).toBe(false);
  });

  it('returns false when text is missing or not a string (exception path)', () => {
    expect(isValidTask({ id: '1', completed: false })).toBe(false);
    expect(isValidTask({ id: '1', text: 99, completed: false })).toBe(false);
  });

  it('returns false when completed is missing or not a boolean (exception path)', () => {
    expect(isValidTask({ id: '1', text: 'x' })).toBe(false);
    expect(isValidTask({ id: '1', text: 'x', completed: 'yes' })).toBe(false);
  });
});

describe('parseTasks', () => {
  it('returns empty tasks for null or undefined (happy path - no data)', () => {
    expect(parseTasks(null)).toEqual({ tasks: [] });
    expect(parseTasks(undefined)).toEqual({ tasks: [] });
  });

  it('returns parsed valid tasks for valid JSON array (happy path)', () => {
    const raw = JSON.stringify([
      { id: '1', text: 'One', completed: false },
      { id: '2', text: 'Two', completed: true }
    ]);
    expect(parseTasks(raw)).toEqual({
      tasks: [
        { id: '1', text: 'One', completed: false },
        { id: '2', text: 'Two', completed: true }
      ],
      statusKey: null
    });
  });

  it('returns empty tasks and statusKey for invalid JSON (error path)', () => {
    const result = parseTasks('not json');
    expect(result.tasks).toEqual([]);
    expect(result.statusKey).toBe('List reset; saved data could not be read.');
  });

  it('returns empty tasks and statusKey when parsed value is not an array (exception path)', () => {
    const result = parseTasks('{"foo": 1}');
    expect(result.tasks).toEqual([]);
    expect(result.statusKey).toBe('List reset; saved data was invalid.');
  });

  it('filters invalid items and sets statusKey when some invalid (exception path)', () => {
    const raw = JSON.stringify([
      { id: '1', text: 'Valid', completed: false },
      { id: '2' },
      { text: 'No id', completed: false }
    ]);
    const result = parseTasks(raw);
    expect(result.tasks).toEqual([{ id: '1', text: 'Valid', completed: false }]);
    expect(result.statusKey).toBe('Some saved items were invalid and were removed.');
  });
});

describe('saveTasksToStorage', () => {
  it('calls storage.setItem with STORAGE_KEY and JSON string (happy path)', () => {
    const storage = { setItem: vi.fn() };
    const tasks = [{ id: '1', text: 'x', completed: false }];
    saveTasksToStorage(tasks, storage);
    expect(storage.setItem).toHaveBeenCalledTimes(1);
    expect(storage.setItem).toHaveBeenCalledWith(STORAGE_KEY, JSON.stringify(tasks));
  });

  it('throws when storage.setItem throws (error path)', () => {
    const storage = {
      setItem: vi.fn(() => {
        const e = new Error('Quota exceeded');
        e.name = 'QuotaExceededError';
        throw e;
      })
    };
    expect(() => saveTasksToStorage([], storage)).toThrow('Quota exceeded');
    expect(storage.setItem).toHaveBeenCalled();
  });
});

describe('constants', () => {
  it('MAX_TASK_LENGTH is 500', () => {
    expect(MAX_TASK_LENGTH).toBe(500);
  });
  it('STORAGE_KEY is "todos"', () => {
    expect(STORAGE_KEY).toBe('todos');
  });
});
