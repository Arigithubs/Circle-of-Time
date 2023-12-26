// Mystical Day Planner JavaScript

class Task {
    constructor(name, duration, color, time) {
        this.name = name;
        this.duration = duration;
        this.color = color;
        this.time = time;
    }
}

const circle = document.getElementById('circle');
const colorPalette = document.getElementById('colorPalette');
const taskForm = document.getElementById('taskForm');
const taskNameInput = document.getElementById('taskName');
const taskDurationInput = document.getElementById('taskDuration');
const taskColorInput = document.getElementById('taskColor');
const saveButton = document.getElementById('saveButton');
const cancelButton = document.getElementById('cancelButton');

let tasks = [];
let selectedTask = null;

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

        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = `${task.name} - ${task.duration} hours`;
        taskElement.appendChild(tooltip);

        taskElement.addEventListener('click', () => openTaskForm(task));

        circle.appendChild(taskElement);
    });
}

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

    taskForm.style.display = 'flex';
}

function closeTaskForm() {
    taskForm.style.display = 'none';
}

document.getElementById('addTaskButton').addEventListener('click', openTaskForm);
cancelButton.addEventListener('click', closeTaskForm);
saveButton.addEventListener('click', saveTask);

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

renderTasks();
