document.addEventListener('DOMContentLoaded', () => {
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

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const saveTasksToLocalStorage = () =>
        localStorage.setItem('tasks', JSON.stringify(tasks));

    const renderTasks = () => {
        circle.innerHTML = '';
        tasks.forEach(task => {
            const taskElement = createTaskElement(task);
            taskElement.addEventListener('click', () => editTask(task));
            taskElement.addEventListener('contextmenu', event => deleteTask(event, task));
            taskElement.addEventListener('mouseover', () => showTooltip(taskElement, task));
            taskElement.addEventListener('mouseout', () => hideTooltip(taskElement));
            circle.appendChild(taskElement);
        });

        saveTasksToLocalStorage();
    };

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

    const calculateRotation = task => {
        const existingRotations = tasks.map(t => (t.duration / 24) * 360);
        const taskRotation = (task.duration / 24) * 360;
        let rotateDegree = taskRotation;
        let index = 1;

        while (existingRotations.includes(rotateDegree)) {
            rotateDegree = taskRotation + index * 5;
            index++;
        }

        return rotateDegree;
    };

    const openTaskForm = () => {
        clearForm();
        taskForm.style.display = 'block';
    };

    const closeTaskForm = () => {
        taskForm.style.display = 'none';
    };

    const saveTask = () => {
        const { name, duration, time, color } = getInputValues();

        if (isValidTask(name, duration, time, color)) {
            const newTask = { name, duration, time, color };
            tasks.push(newTask);
            animateTask(newTask, 'add');
            renderTasks();
            closeTaskForm();
        } else {
            alert('Please fill in all fields with valid values.');
        }
    };

    const editTask = task => {
        setInputValues(task);
        openTaskForm();

        saveButton.removeEventListener('click', saveTask);
        saveButton.addEventListener('click', () => saveEditedTask(task));
    };

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

    const deleteTask = (event, task) => {
        event.preventDefault();
        const confirmDelete = confirm(`Are you sure you want to delete the task "${task.name}"?`);
        if (confirmDelete) {
            animateTask(task, 'remove');
            tasks = tasks.filter(t => t !== task);
            renderTasks();
        }
    };

    const animateTask = (task, action) => {
        const taskElement = createTaskElement(task);
        taskElement.style.transition = 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out';
        if (action === 'add') {
            taskElement.style.transform = 'scale(1.2)';
            setTimeout(() => {
                taskElement.style.transform = 'scale(1)';
            }, 10);
        } else if (action === 'remove') {
            taskElement.style.opacity = '0';
            setTimeout(() => {
                taskElement.remove();
            }, 300);
        }
        circle.appendChild(taskElement);
    };

    colorPalette.addEventListener('click', event => {
        const colorOption = event.target.closest('.color-option');
        if (colorOption) {
            taskColorInput.value = colorOption.dataset.color;
            selectColorOption(colorOption.dataset.color);
        }
    });

    if (addTaskButton) {
        addTaskButton.addEventListener('click', openTaskForm);
    }

    if (cancelButton) {
        cancelButton.addEventListener('click', closeTaskForm);
    }

    if (saveButton) {
        saveButton.addEventListener('click', saveTask);
    }

    window.addEventListener('resize', () => renderTasks());

    renderTasks();

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
        const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
        return regex.test(time);
    };

    const clearForm = () => {
        taskNameInput.value = '';
        taskDurationInput.value = '';
        taskTimeInput.value = '';
        taskColorInput.value = colorOptions[0].dataset.color;
        selectColorOption(colorOptions[0].dataset.color);
    };

    const updateColorPalette = () => {
        const usedColors = tasks.map(task => task.color);
        colorOptions.forEach(option => {
            const color = option.dataset.color;
            option.style.display = usedColors.includes(color) ? 'none' : 'block';
        });
    };

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

    const showTooltip = (taskElement, task) => {
        const tooltip = document.createElement('div');
        tooltip.classList.add('tooltip');
        tooltip.innerHTML = `<span>${task.name}</span><br><span>${task.duration} hours at ${task.time}</span>`;
        taskElement.appendChild(tooltip);
    };

    const hideTooltip = taskElement => {
        const tooltip = taskElement.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    };
});
