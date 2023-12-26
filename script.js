// script.js

document.addEventListener('DOMContentLoaded', function () {
    const circle = document.getElementById('circle');
    const taskForm = document.getElementById('taskForm');
    const taskNameInput = document.getElementById('taskName');
    const taskDurationInput = document.getElementById('taskDuration');
    const taskColorInput = document.getElementById('taskColor');
    const saveButton = document.getElementById('saveButton');

    // Sample task data for testing
    let tasks = [
        { name: 'Walk', duration: 2, color: '#27ae60' },
        // Add more sample tasks as needed
    ];

    // Function to render tasks within the circle
    function renderTasks() {
        circle.innerHTML = ''; // Clear existing tasks
        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task');
            taskElement.style.backgroundColor = task.color;
            taskElement.style.transform = `rotate(${(task.duration / 24) * 360}deg)`;
            taskElement.addEventListener('click', () => editTask(task));
            circle.appendChild(taskElement);
        });
    }

    // Function to open the task form for editing or adding tasks
    function openTaskForm() {
        taskForm.style.display = 'block';
    }

    // Function to close the task form
    function closeTaskForm() {
        taskForm.style.display = 'none';
    }

    // Function to add or edit a task
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

    // Function to edit a task
    function editTask(task) {
        taskNameInput.value = task.name;
        taskDurationInput.value = task.duration;
        taskColorInput.value = task.color;
        openTaskForm();

        saveButton.removeEventListener('click', saveTask); // Remove previous listener
        saveButton.addEventListener('click', () => saveEditedTask(task));
    }

    // Function to save an edited task
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

    // Event listeners
    document.getElementById('addTaskButton').addEventListener('click', openTaskForm);
    document.getElementById('cancelButton').addEventListener('click', closeTaskForm);
    saveButton.addEventListener('click', saveTask);

    // Initial render of tasks
    renderTasks();
});
