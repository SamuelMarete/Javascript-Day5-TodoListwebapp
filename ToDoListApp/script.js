document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const filterButtons = document.querySelectorAll('.filter-buttons button');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskName = document.getElementById('task-name').value.trim();
        const taskDesc = document.getElementById('task-desc').value.trim();

        if (!taskName || !taskDesc) {
            showNotification('Task Name and Description cannot be empty!');
            return;
        }

        const task = {
            id: Date.now().toString(),
            name: taskName,
            description: taskDesc,
            completed: false,
            createdAt: new Date().toISOString(),
        };

        tasks.push(task);
        saveTasks();
        renderTasks();
        taskForm.reset();
        showNotification('Task added successfully!');
    });

    taskList.addEventListener('click', (e) => {
        const taskId = e.target.closest('.task-item')?.dataset.id;
    
        if (!taskId) return;
        if(e.target.classList.contains('delete-task') || e.target.closest('.delete-task')) {
            if(confirm('Are you sure you want to delete this task?')){
                tasks = tasks.filter(task => task.id !==taskId);
                saveTasks();
                renderTasks();
                showNotification('Task deleted successfully!');
            }
        } else if (e.target.classList.contains('complete-task') || e.target.closest('.complete-task')) {
            const task = tasks.find(task => task.id === taskId);
            if (task) {
                task.completed = !task.completed;
                saveTasks();
                renderTasks();
                showNotification('Task status updated!');
            }
        } else if (e.target.classList.contains('edit-task') || e.target.closest('.edit-task')) {
            const task = tasks.find(task => task.id === taskId);
            if (task) {
                document.getElementById('task-name').value = task.name;
                document.getElementById('task-desc').value = task.description;
                tasks = tasks.filter(task => task.id !== taskId);
                saveTasks();
                renderTasks();
                showNotification('Task ready for editing.');
            }
        }
    });
    

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            renderTasks(button.dataset.filter);
        });
    });

    function renderTasks(filter = 'all') {
        taskList.innerHTML = '';
        if (tasks.length === 0) {
            taskList.innerHTML = `<p class="empty-state">No tasks to display.</p>`;
            return;
        }

        const filteredTasks = tasks.filter(task => {
            if (filter === 'completed') return task.completed;
            if (filter === 'incomplete') return !task.completed;
            return true;
        });

        filteredTasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.classList.add('task-item');
            if (task.completed) taskItem.classList.add('completed');
            taskItem.dataset.id = task.id;

            taskItem.innerHTML = `
                <div class="task-details">
                    <h3>${task.name}</h3>
                    <p>${task.description}</p>
                    <small>Created on: ${new Date(task.createdAt).toLocaleString()}</small>
                </div>
                <div class="task-actions">
                    <button class="complete-task" aria-label="Mark as complete"><i class="fas fa-check"></i></button>
                    <button class="edit-task" aria-label="Edit task"><i class="fas fa-pencil-alt"></i></button>
                    <button class="delete-task" aria-label="Delete task"><i class="fas fa-trash"></i></button>
                </div>
            `;

            taskList.appendChild(taskItem);
        });
    }

    // Initial render to load tasks from local storage
    renderTasks();
});
