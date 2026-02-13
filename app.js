const STORAGE_KEY = 'todos';
let tasks = [];

function loadTasks() {
  tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
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
    checkbox.setAttribute('aria-label', 'Mark complete');
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
    deleteBtn.addEventListener('click', () => {
      tasks = tasks.filter(x => x.id !== task.id);
      saveTasks();
      renderTasks();
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
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('todo-input');
    const text = input.value.trim();
    if (!text) return;
    tasks.push({
      id: Date.now().toString(),
      text,
      completed: false
    });
    saveTasks();
    renderTasks();
    input.value = '';
    input.focus();
  });
}

document.addEventListener('DOMContentLoaded', init);
