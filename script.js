let todos = JSON.parse(localStorage.getItem('taskFlow_todos')) || [];
let currentFilter = 'all';

const dateDisplay = document.getElementById('date-display');
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clear-completed-btn');
const progressText = document.getElementById('progress-text');
const progressPercent = document.getElementById('progress-percent');
const progressFill = document.getElementById('progress-fill');

const checkIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
const trashIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;

function init() {
  setDate();
  renderTodos();
}

function setDate() {
  const options = { weekday: 'long', month: 'short', day: 'numeric' };
  dateDisplay.textContent = new Date().toLocaleDateString('en-US', options);
}
function saveTodos() {
  localStorage.setItem('taskFlow_todos', JSON.stringify(todos));
}

function updateProgress() {
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  progressText.textContent = `${completed} of ${total} completed`;
  progressPercent.textContent = `${percentage}%`;
  progressFill.style.width = `${percentage}%`;

  if (percentage === 100 && total > 0) {
    progressFill.classList.add('completed-all');
  } else {
    progressFill.classList.remove('completed-all');
  }
}

todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();
  
  if (text) {
    todos.push({
      id: Date.now().toString(),
      text: text,
      completed: false
    });
    todoInput.value = '';
    saveTodos();
    renderTodos();
  }
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTodos();
  });
});

clearCompletedBtn.addEventListener('click', () => {
  todos = todos.filter(t => !t.completed);
  saveTodos();
  renderTodos();
});

todoList.addEventListener('click', (e) => {
  const todoItem = e.target.closest('.todo-item');
  if (!todoItem) return;

  const id = todoItem.dataset.id;

  if (e.target.closest('.delete-btn')) {

    todos = todos.filter(t => t.id !== id);
    saveTodos();
    renderTodos();
  } else if (e.target.closest('.custom-checkbox') || e.target.closest('.todo-text')) {
  
    const todo = todos.find(t => t.id === id);
    todo.completed = !todo.completed;
    saveTodos();
    renderTodos();
  }
});

function renderTodos() {
  todoList.innerHTML = '';
  
  let filteredTodos = todos;
  if (currentFilter === 'active') filteredTodos = todos.filter(t => !t.completed);
  if (currentFilter === 'completed') filteredTodos = todos.filter(t => t.completed);

  if (filteredTodos.length === 0) {
    emptyState.classList.remove('hidden');
    todoList.style.display = 'none';
  } else {
    emptyState.classList.add('hidden');
    todoList.style.display = 'flex';
    
    filteredTodos.forEach(todo => {
      const li = document.createElement('li');
      li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
      li.dataset.id = todo.id;
      
      li.innerHTML = `
        <div class="custom-checkbox">
          ${checkIcon}
        </div>
        <span class="todo-text">${todo.text}</span>
        <button class="delete-btn" aria-label="Delete task">
          ${trashIcon}
        </button>
      `;
      todoList.appendChild(li);
    });
  }
  
  updateProgress();
}

init();
