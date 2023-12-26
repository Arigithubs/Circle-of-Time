document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const circle = document.getElementById('circle');
    const taskForm = document.getElementById('taskForm');
    const taskNameInput = document.getElementById('taskName');
    const taskDurationInput = document.getElementById('taskDuration');
    const taskColorInput = document.getElementById('taskColor');
    const colorPalette = document.getElementById('colorPalette');
    const colorOptions = colorPalette.querySelectorAll('.color-option');

    // Tasks (Loaded from local storage or default)
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [
        { name: 'Walk', duration: 2, color: '#e74c3c' },
        // Add more sample tasks as needed
    ];

    // Render tasks on the circle
    const renderTasks = () => {
        circle.innerHTML = '';
        tasks.forEach(task => {
            const taskElement = createTaskElement(task);
            taskElement.addEventListener('click', () => editTask(task));
            circle.appendChild(taskElement);
        });

        saveTasksToLocalStorage();
    };

    // Create a task element
    const createTaskElement = task => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');
        taskElement.style.backgroundColor = task.color;
        taskElement.style.transform = `rotate(${(task.duration / 24) * 360}deg)`;
        return taskElement;
    };

    // Open the task form
    const openTaskForm = () => taskForm.style.display = 'block';

    // Close the task form
    const closeTaskForm = () => taskForm.style.display = 'none';

    // Save a new task
    const saveTask = () => {
        const { name, duration, color } = getInputValues();

        if (isValidTask(name, duration, color)) {
            const newTask = { name, duration, color };
            tasks.push(newTask);
            renderTasks();
            closeTaskForm();
        } else {
            alert('Please fill in all fields with valid values.');
        }
    };

    // Edit an existing task
    const editTask = task => {
        setInputValues(task);
        selectColorOption(task.color);
        openTaskForm();

        saveButton.removeEventListener('click', saveTask);
        saveButton.addEventListener('click', () => saveEditedTask(task));
    };

    // Save edits to an existing task
    const saveEditedTask = task => {
        const { name, duration, color } = getInputValues();

        if (isValidTask(name, duration, color)) {
            task.name = name;
            task.duration = duration;
            task.color = color;
            renderTasks();
            closeTaskForm();
        } else {
            alert('Please fill in all fields with valid values.');
        }
    };

    // Delete a task
    const deleteTask = task => {
        const taskIndex = tasks.indexOf(task);
        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1);
            renderTasks();
        }
    };

    // Right-click to delete a task
    circle.addEventListener('contextmenu', event => {
        event.preventDefault();
        const clickedTask = event.target.closest('.task');
        if (clickedTask) {
            const task = tasks.find(t => t.color === clickedTask.style.backgroundColor);
            deleteTask(task);
        }
    });

    // Highlight the selected color option
    const selectColorOption = color => {
        colorOptions.forEach(option => {
            option.classList.remove('selected');
            if (option.dataset.color === color) {
                option.classList.add('selected');
                option.style.transform = 'scale(1.2)';
            } else {
                option.style.transform = 'scale(1)';
            }
        });
    };

    // Click a color option
    colorPalette.addEventListener('click', event => {
        const colorOption = event.target.closest('.color-option');
        if (colorOption) {
            taskColorInput.value = colorOption.dataset.color;
            selectColorOption(colorOption.dataset.color);
        }
    });

    // Event listeners for buttons
    document.getElementById('addTaskButton').addEventListener('click', openTaskForm);
    document.getElementById('cancelButton').addEventListener('click', closeTaskForm);

    // Find the 'saveButton' element after the 'taskForm' is defined
    const saveButton = document.getElementById('saveButton');

    // Check if 'saveButton' is found before adding the event listener
    if (saveButton) {
        saveButton.addEventListener('click', saveTask);
    }

    // Initial rendering of tasks
    renderTasks();

    // Helper functions

    const getInputValues = () => ({
        name: taskNameInput.value,
        duration: parseInt(taskDurationInput.value),
        color: taskColorInput.value
    });

    const setInputValues = task => {
        taskNameInput.value = task.name;
        taskDurationInput.value = task.duration;
        taskColorInput.value = task.color;
    };

    const isValidTask = (name, duration, color) =>
        name && !isNaN(duration) && duration > 0 && color;

    const saveTasksToLocalStorage = () =>
        localStorage.setItem('tasks', JSON.stringify(tasks));
});
