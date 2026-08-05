document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const todoForm = document.getElementById('todo-form');
  const todoInput = document.getElementById('todo-input');
  const todoList = document.getElementById('todo-list');
  const dateDisplay = document.getElementById('date-display');
  const progressText = document.getElementById('progress-text');
  const progressPercent = document.getElementById('progress-percent');
  const progressFill = document.getElementById('progress-fill');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const clearCompletedBtn = document.getElementById('clear-completed-btn');
  const emptyState = document.getElementById('empty-state');

  // State
  let todos = JSON.parse(localStorage.getItem('todos')) || [];
  let currentFilter = 'all';

  // Display Current Date
  const options = { weekday: 'long', month: 'short', day: 'numeric' };
  dateDisplay.textContent = new Date().toLocaleDateString('en-US', options);

  // Initialize
  renderTodos();

  // Add Task Event
  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (text) {
      addTodo(text);
      todoInput.value = '';
    }
  });

  // Add Todo Function
  function addTodo(text) {
    const todo = {
      id: Date.now(),
      text,
      completed: false
    };
    todos.unshift(todo);
    saveAndRender();
  }

  // Toggle Todo Completion
  function toggleTodo(id) {
    todos = todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveAndRender();
  }

  // Delete Todo
  function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveAndRender();
  }

  // Filter Event Listeners
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderTodos();
    });
  });

  // Clear Completed Tasks
  clearCompletedBtn.addEventListener('click', () => {
    todos = todos.filter(todo => !todo.completed);
    saveAndRender();
  });

  // Save to LocalStorage and Render
  function saveAndRender() {
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
  }

  // Render Todos and Progress
  function renderTodos() {
    const filteredTodos = todos.filter(todo => {
      if (currentFilter === 'active') return !todo.completed;
      if (currentFilter === 'completed') return todo.completed;
      return true;
    });

    todoList.innerHTML = '';

    if (filteredTodos.length === 0) {
      emptyState.classList.remove('hidden');
    } else {
      emptyState.classList.add('hidden');
      filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
          <div class="todo-item-left">
            <div class="checkbox-custom" onclick="toggleTodo(${todo.id})"></div>
            <span class="todo-text">${escapeHTML(todo.text)}</span>
          </div>
          <button class="delete-btn" onclick="deleteTodo(${todo.id})" aria-label="Delete task">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        `;
        
        // Attach click to checkbox
        li.querySelector('.checkbox-custom').addEventListener('click', () => toggleTodo(todo.id));
        li.querySelector('.delete-btn').addEventListener('click', () => deleteTodo(todo.id));

        todoList.appendChild(li);
      });
    }

    updateProgress();
  }

  // Update Progress Bar
  function updateProgress() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    progressText.textContent = `${completed} of ${total} completed`;
    progressPercent.textContent = `${percentage}%`;
    progressFill.style.width = `${percentage}%`;
  }

  // Helper to prevent XSS
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }
});