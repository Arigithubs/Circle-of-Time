document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const circle = document.getElementById('circle');
    const taskForm = document.getElementById('taskForm');
    const taskNameInput = document.getElementById('taskName');
    const taskDurationInput = document.getElementById('taskDuration');
    const taskTimeInput = document.getElementById('taskTime');
    const taskColorInput = document.getElementById('taskColor');
    const colorPalette = document.getElementById('colorPalette');
    const colorOptions = colorPalette.querySelectorAll('.color-option');
    const addTaskButton = document.getElementById('addTaskButton');
    const cancelButton = document.getElementById('cancelButton');
    const saveButton = document.getElementById('saveButton');

    // Tasks (Loaded from local storage or default)
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [
        { name: 'Walk the dog', duration: 2, time: '10:00 AM', color: '#e74c3c' },
        { name: 'Read a book', duration: 1, time: '2:00 PM', color: '#3498db' },
        { name: 'Work on project', duration: 3, time: '4:30 PM', color: '#2ecc71' },
        { name: 'Take a nap', duration: 1, time: '12:30 PM', color: '#f39c12' },
        { name: 'Exercise', duration: 1.5, time: '8:00 AM', color: '#9b59b6' },
    ];

    // Save tasks to local storage
    const saveTasksToLocalStorage = () =>
        localStorage.setItem('tasks', JSON.stringify(tasks));

    // Render tasks on the circle
    const renderTasks = () => {
        circle.innerHTML = '';
        tasks.forEach(task => {
            const taskElement = createTaskElement(task);
            taskElement.addEventListener('click', () => editTask(task));
            taskElement.addEventListener('contextmenu', event => deleteTask(event, task));
            circle.appendChild(taskElement);
        });

        saveTasksToLocalStorage();
    };

    // Create a task element
    const createTaskElement = task => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');
        taskElement.style.backgroundColor = task.color;
        const rotateDegree = calculateRotation(task);
        taskElement.style.transform = `rotate(${rotateDegree}deg)`;
        const taskContent = document.createElement('div');
        taskContent.classList.add('task-content');
        taskContent.innerHTML = `<span>${task.name}</span><br><span class="task-time">${task.time}</span>`;
        taskElement.appendChild(taskContent);
        return taskElement;
    };

    // Calculate rotation to avoid task overlap
    const calculateRotation = task => {
        const existingRotations = tasks.map(t => (t.duration / 24) * 360);
        const taskRotation = (task.duration / 24) * 360;
        let rotateDegree = taskRotation;
        let index = 1;

        while (existingRotations.includes(rotateDegree)) {
            rotateDegree = taskRotation + index * 5; // Adjust for 5-degree increments
            index++;
        }

        return rotateDegree;
    };

    // Open the task form
    const openTaskForm = () => {
        clearForm();
        taskForm.style.display = 'block';
    };

    // Close the task form
    const closeTaskForm = () => {
        taskForm.style.display = 'none';
    };

    // Save a new task
    const saveTask = () => {
        const { name, duration, time, color } = getInputValues();

        if (isValidTask(name, duration, time, color)) {
            const newTask = { name, duration, time, color };
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
        openTaskForm();

        saveButton.removeEventListener('click', saveTask);
        saveButton.addEventListener('click', () => saveEditedTask(task));
    };

    // Save edits to an existing task
    const saveEditedTask = task => {
        const { name, duration, time, color } = getInputValues();

        if (isValidTask(name, duration, time, color)) {
            task.name = name;
            task.duration = duration;
            task.time = time;
            task.color = color;
            renderTasks();
            closeTaskForm();
        } else {
            alert('Please fill in all fields with valid values.');
        }
    };

    // Delete a task
    const deleteTask = (event, task) => {
        event.preventDefault();
        const confirmDelete = confirm(`Are you sure you want to delete the task "${task.name}"?`);
        if (confirmDelete) {
            const taskIndex = tasks.indexOf(task);
            if (taskIndex !== -1) {
                tasks.splice(taskIndex, 1);
                renderTasks();
            }
        }
    };

    // Dynamically adjust color palette based on existing task colors
    const updateColorPalette = () => {
        const usedColors = tasks.map(task => task.color);
        colorOptions.forEach(option => {
            const color = option.dataset.color;
            option.style.display = usedColors.includes(color) ? 'none' : 'block';
        });
    };

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
    if (addTaskButton) {
        addTaskButton.addEventListener('click', openTaskForm);
    }

    if (cancelButton) {
        cancelButton.addEventListener('click', closeTaskForm);
    }

    if (saveButton) {
        saveButton.addEventListener('click', saveTask);
    }

    // Initial rendering of tasks
    renderTasks();

    // Helper functions
    const getInputValues = () => ({
        name: taskNameInput.value,
        duration: parseFloat(taskDurationInput.value),
        time: taskTimeInput.value,
        color: taskColorInput.value,
    });

    const setInputValues = task => {
        taskNameInput.value = task.name;
        taskDurationInput.value = task.duration;
        taskTimeInput.value = task.time;
        taskColorInput.value = task.color;
        selectColorOption(task.color);
    };

    const isValidTask = (name, duration, time, color) =>
        name && !isNaN(duration) && duration > 0 && isValidTime(time) && color;

    const isValidTime = time => {
        // Simple time validation, you can enhance it further
        const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
        return regex.test(time);
    };

    const clearForm = () => {
        taskNameInput.value = '';
        taskDurationInput.value = '';
        taskTimeInput.value = '';
        taskColorInput.value = colorOptions[0].dataset.color; // Default to the first color option
        selectColorOption(colorOptions[0].dataset.color);
    };

    // Dynamically adjust color palette on load
    updateColorPalette();
});
