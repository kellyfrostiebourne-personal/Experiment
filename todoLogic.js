export const MAX_TASK_LENGTH = 500;
export const STORAGE_KEY = 'todos';

export function isValidTask(t) {
  if (!t) return false;
  return typeof t.id === 'string' && typeof t.text === 'string' && typeof t.completed === 'boolean';
}

/**
 * Parse and validate raw localStorage string. Returns { tasks, statusKey }.
 * statusKey is a message key for setStatus when something went wrong (invalid data, etc.).
 */
export function parseTasks(raw) {
  if (raw === null || raw === undefined) {
    return { tasks: [] };
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return { tasks: [], statusKey: 'List reset; saved data was invalid.' };
    }
    const tasks = parsed.filter(isValidTask);
    const statusKey = tasks.length !== parsed.length ? 'Some saved items were invalid and were removed.' : null;
    return { tasks, statusKey };
  } catch (_) {
    return { tasks: [], statusKey: 'List reset; saved data could not be read.' };
  }
}

/**
 * Save tasks to a storage-like object. Throws on QuotaExceededError or other errors.
 * @param {Array} tasks
 * @param {{ getItem: Function, setItem: Function }} storage
 */
export function saveTasksToStorage(tasks, storage) {
  storage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
