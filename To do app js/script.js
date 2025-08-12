// Todo App Class
class TodoApp {
    constructor() {
        this.tasks = this.loadTasks();
        this.taskInput = document.getElementById('taskInput');
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
        this.totalTasks = document.getElementById('totalTasks');
        this.completedTasks = document.getElementById('completedTasks');
        this.pendingTasks = document.getElementById('pendingTasks');
        this.clearAllBtn = document.getElementById('clearAll');
        
        this.init();
    }

    // Initialize the app
    init() {
        this.bindEvents();
        this.renderTasks();
        this.updateStats();
    }

    // Bind event listeners
    bindEvents() {
        this.addBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask();
            }
        });
        this.clearAllBtn.addEventListener('click', () => this.clearAllTasks());
    }

    // Add a new task
    addTask() {
        const taskText = this.taskInput.value.trim();
        
        if (taskText === '') {
            this.showInputError();
            return;
        }

        const task = {
            id: Date.now(),
            text: taskText,
            completed: false,
            createdAt: new Date().toLocaleString()
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        this.taskInput.value = '';
        this.taskInput.focus();
    }

    // Show input error styling
    showInputError() {
        this.taskInput.style.borderColor = '#dc3545';
        this.taskInput.placeholder = 'Please enter a task!';
        
        setTimeout(() => {
            this.taskInput.style.borderColor = '#e0e0e0';
            this.taskInput.placeholder = 'Add a new task...';
        }, 2000);
    }

    // Toggle task completion status
    toggleTask(id) {
        this.tasks = this.tasks.map(task => {
            if (task.id === id) {
                task.completed = !task.completed;
            }
            return task;
        });
        
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
    }

    // Delete a task
    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
    }

    // Clear all tasks
    clearAllTasks() {
        if (this.tasks.length === 0) return;
        
        if (confirm('Are you sure you want to delete all tasks?')) {
            this.tasks = [];
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
        }
    }

    // Render all tasks to the DOM
    renderTasks() {
        this.todoList.innerHTML = '';

        if (this.tasks.length === 0) {
            this.showEmptyState();
            return;
        }

        this.tasks.forEach(task => {
            const li = this.createTaskElement(task);
            this.todoList.appendChild(li);
        });

        this.clearAllBtn.style.display = this.tasks.length > 0 ? 'block' : 'none';
    }

    // Create a single task element
    createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `todo-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <div class="todo-checkbox ${task.completed ? 'checked' : ''}" onclick="todoApp.toggleTask(${task.id})">
                ${task.completed ? '✓' : ''}
            </div>
            <span class="todo-text">${this.escapeHtml(task.text)}</span>
            <button class="delete-btn" onclick="todoApp.deleteTask(${task.id})" title="Delete task">
                ×
            </button>
        `;

        return li;
    }

    // Show empty state message
    showEmptyState() {
        this.todoList.innerHTML = `
            <div class="empty-state">
                <h3>No tasks yet!</h3>
                <p>Add your first task above to get started.</p>
            </div>
        `;
        this.clearAllBtn.style.display = 'none';
    }

    // Update statistics display
    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const pending = total - completed;

        this.totalTasks.textContent = total;
        this.completedTasks.textContent = completed;
        this.pendingTasks.textContent = pending;
    }

    // Escape HTML to prevent XSS attacks
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Save tasks to localStorage
    saveTasks() {
        localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
    }

    // Load tasks from localStorage
    loadTasks() {
        const saved = localStorage.getItem('todoTasks');
        return saved ? JSON.parse(saved) : [];
    }
}

// Global variable to hold the app instance
let todoApp;

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    todoApp = new TodoApp();
});