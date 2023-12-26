document.addEventListener('DOMContentLoaded', function () {
    const circle = document.getElementById('circle');
    const taskForm = document.getElementById('taskForm');
    const taskNameInput = document.getElementById('taskName');
    const taskDurationInput = document.getElementById('taskDuration');
    const taskColorInput = document.getElementById('taskColor');
    const saveButton = document.getElementById('saveButton');
    const colorPalette = document.getElementById('colorPalette');
    const colorOptions = colorPalette.querySelectorAll('.color-option');

    // Load tasks from local storage or use default tasks
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [
        { name: 'Walk', duration: 2, color: '#e74c3c' },
        // Add more sample tasks as needed
    ];

    function renderTasks() {
        circle.innerHTML = '';
        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task');
            taskElement.style.backgroundColor = task.color;
            taskElement.style.transform = `rotate(${(task.duration / 24) * 360}deg)`;
            taskElement.addEventListener('click', () => editTask(task));
            circle.appendChild(taskElement);
        });

        // Save tasks to local storage
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function openTaskForm() {
        taskForm.style.display = 'block';
    }

    function closeTaskForm() {
        taskForm.style.display = 'none';
    }

    function saveTask() {
        const taskName = taskNameInput.value;
        const taskDuration = parseInt(taskDurationInput.value);
        const taskColor = taskColorInput.value;

        if (taskName && !isNaN(taskDuration) && taskDuration > 0 && taskColor) {
            const newTask = { name: taskName, duration: taskDuration, color: taskColor };
            tasks.push(newTask);
            renderTasks();
            closeTaskForm();
        } else {
            alert('Please fill in all fields with valid values.');
        }
    }

    function editTask(task) {
        taskNameInput.value = task.name;
        taskDurationInput.value = task.duration;
        taskColorInput.value = task.color;
        selectColorOption(task.color);
        openTaskForm();

        saveButton.removeEventListener('click', saveTask);
        saveButton.addEventListener('click', () => saveEditedTask(task));
    }

    function saveEditedTask(task) {
        const updatedName = taskNameInput.value;
        const updatedDuration = parseInt(taskDurationInput.value);
        const updatedColor = taskColorInput.value;

        if (updatedName && !isNaN(updatedDuration) && updatedDuration > 0 && updatedColor) {
            task.name = updatedName;
            task.duration = updatedDuration;
            task.color = updatedColor;
            renderTasks();
            closeTaskForm();
        } else {
            alert('Please fill in all fields with valid values.');
        }
    }

    function deleteTask(task) {
        const taskIndex = tasks.indexOf(task);
        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1);
            renderTasks();
        }
    }

    circle.addEventListener('contextmenu', function (event) {
        event.preventDefault(); // Prevent the default context menu
        const clickedTask = event.target.closest('.task');
        if (clickedTask) {
            const task = tasks.find(t => t.color === clickedTask.style.backgroundColor);
            deleteTask(task);
        }
    });

    function selectColorOption(color) {
        colorOptions.forEach(option => {
            option.classList.remove('selected');
            if (option.dataset.color === color) {
                option.classList.add('selected');
                option.style.transform = 'scale(1.2)';
            } else {
                option.style.transform = 'scale(1)';
            }
        });
    }

    colorPalette.addEventListener('click', function (event) {
        const colorOption = event.target.closest('.color-option');
        if (colorOption) {
            taskColorInput.value = colorOption.dataset.color;
            selectColorOption(colorOption.dataset.color);
        }
    });

    document.getElementById('addTaskButton').addEventListener('click', openTaskForm);
    document.getElementById('cancelButton').addEventListener('click', closeTaskForm);
    saveButton.addEventListener('click', saveTask);

    renderTasks();
});
