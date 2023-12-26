// Mystical Day Planner JavaScript

// Task data structure
class Task {
    constructor(name, duration, color, time) {
        this.name = name;
        this.duration = duration;
        this.color = color;
        this.time = time;
    }
}

// DOM Elements
const circle = document.getElementById('circle');
const colorPalette = document.getElementById('colorPalette');
const taskForm = document.getElementById('taskForm');
const taskNameInput = document.getElementById('taskName');
const taskDurationInput = document.getElementById('taskDuration');
const taskColorInput = document.getElementById('taskColor');
const saveButton = document.getElementById('saveButton');
const cancelButton = document.getElementById('cancelButton');

// Other Variables
let tasks = [];
let selectedTask = null;

// Functions

// Function to render tasks on the circle
function renderTasks() {
    circle.innerHTML = '';

    tasks.forEach((task) => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task';
        taskElement.style.backgroundColor = task.color;
        taskElement.style.transform = `rotate(${(task.time / 24) * 360}deg) translateX(150px)`;

        const taskContent = document.createElement('div');
        taskContent.className = 'task-content';
        taskContent.innerHTML = `<span>${task.name}</span><span>${task.duration}h</span>`;
        taskElement.appendChild(taskContent);

        // Add tooltip with task details
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = `${task.name} - ${task.duration} hours`;
        taskElement.appendChild(tooltip);

        // Add click event to edit task
        taskElement.addEventListener('click', () => openTaskForm(task));

        circle.appendChild(taskElement);
    });
}

// Function to open the task form for adding/editing tasks
function openTaskForm(task = null) {
    selectedTask = task;

    if (task) {
        taskNameInput.value = task.name;
        taskDurationInput.value = task.duration;
        taskColorInput.value = task.color;
        saveButton.textContent = 'Update';
    } else {
        taskNameInput.value = '';
        taskDurationInput.value = '';
        taskColorInput.value = '#3498db';
        saveButton.textContent = 'Add';
    }

    taskForm.style.display = 'block';
}

// Function to close the task form
function closeTaskForm() {
    taskForm.style.display = 'none';
}

// Event listeners for buttons
document.getElementById('addTaskButton').addEventListener('click', openTaskForm);
cancelButton.addEventListener('click', closeTaskForm);
saveButton.addEventListener('click', saveTask);

// Function to save a task (add or update)
function saveTask() {
    const name = taskNameInput.value.trim();
    const duration = parseFloat(taskDurationInput.value);
    const color = taskColorInput.value;

    if (name === '' || isNaN(duration) || duration <= 0) {
        alert('Please enter valid task details.');
        return;
    }

    const time = selectedTask ? selectedTask.time : Math.floor(Math.random() * 24);
    const newTask = new Task(name, duration, color, time);

    if (selectedTask) {
        const index = tasks.indexOf(selectedTask);
        tasks[index] = newTask;
    } else {
        tasks.push(newTask);
    }

    renderTasks();
    closeTaskForm();
}

// Initial rendering of tasks
renderTasks();
