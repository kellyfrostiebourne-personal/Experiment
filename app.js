import { MAX_TASK_LENGTH, parseTasks, saveTasksToStorage, STORAGE_KEY } from './todoLogic.js';
let tasks = [];

function setStatus(message) {
  const el = document.getElementById('status');
  if (!el) return;
  el.textContent = message;
  if (message) {
    setTimeout(() => { el.textContent = ''; }, 4000);
  }
}

function loadTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  const { tasks: loaded, statusKey } = parseTasks(raw ?? null);
  tasks = loaded;
  if (statusKey) setStatus(statusKey);
}

function saveTasks() {
  try {
    saveTasksToStorage(tasks, { setItem: (k, v) => localStorage.setItem(k, v) });
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      setStatus('Could not save. Storage may be full.');
    } else {
      setStatus('Could not save. Storage may be disabled or unavailable.');
    }
  }
}

function renderTasks() {
  const list = document.getElementById('todo-list');
  list.innerHTML = '';

  for (const task of tasks) {
    const li = document.createElement('li');
    if (task.completed) li.classList.add('completed');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', "Mark \"" + (task.text || 'task').replace(/"/g, "'") + "\" complete");
    checkbox.addEventListener('change', () => {
      const t = tasks.find(x => x.id === task.id);
      if (t) t.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const textSpan = document.createElement('span');
    textSpan.className = 'task-text';
    textSpan.textContent = task.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.setAttribute('aria-label', "Delete \"" + (task.text || 'task').replace(/"/g, "'") + "\"");
    deleteBtn.addEventListener('click', () => {
      const idx = tasks.findIndex(x => x.id === task.id);
      tasks = tasks.filter(x => x.id !== task.id);
      saveTasks();
      renderTasks();
      var nextDelete = list.querySelectorAll('.delete-btn')[idx];
      var nextFocus = nextDelete || document.getElementById('todo-input') || document.querySelector('#todo-form button');
      if (nextFocus && nextFocus.focus) nextFocus.focus();
    });

    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  }
}

function init() {
  loadTasks();
  renderTasks();

  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) {
      setStatus('Please enter a task.');
      input.focus();
      return;
    }
    if (text.length > MAX_TASK_LENGTH) {
      setStatus('Task is too long. Shorten it to ' + MAX_TASK_LENGTH + ' characters or fewer.');
      input.focus();
      return;
    }
    tasks.push({
      id: Date.now().toString(),
      text: text.slice(0, MAX_TASK_LENGTH),
      completed: false
    });
    saveTasks();
    renderTasks();
    input.value = '';
    input.focus();
    setStatus('Task added.');
  });
}

document.addEventListener('DOMContentLoaded', init);
