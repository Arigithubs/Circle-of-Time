// Mystical Day Planner JavaScript

class Task {
    constructor(name, duration, color, time) {
        this.name = name;
        this.duration = duration;
        this.color = color;
        this.time = time;
    }

    getDescription() {
        return `${this.name} - ${this.duration} hours at ${this.time}:00`;
    }
}

const circle = document.getElementById('circle');
const colorPalette = document.getElementById('colorPalette');
const taskForm = document.getElementById('taskForm');
const taskNameInput = document.getElementById('taskName');
const taskDurationInput = document.getElementById('taskDuration');
const taskColorInput = document.getElementById('taskColor');
const taskTimeInput = document.getElementById('taskTime');
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
        tooltip.textContent = task.getDescription();
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
        taskTimeInput.value = task.time;
        saveButton.textContent = 'Update';
    } else {
        taskNameInput.value = '';
        taskDurationInput.value = '';
        taskColorInput.value = '#3498db';
        taskTimeInput.value = '';
        saveButton.textContent = 'Add';
    }

    taskForm.style.display = 'flex';
    taskForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function closeTaskForm() {
    taskForm.style.display = 'none';
}

function handleContextMenu(event) {
    event.preventDefault();
    
    const boundingRect = circle.getBoundingClientRect();
    const centerX = boundingRect.left + boundingRect.width / 2;
    const centerY = boundingRect.top + boundingRect.height / 2;
    
    const angleRad = Math.atan2(event.clientY - centerY, event.clientX - centerX);
    let angleDeg = (angleRad * 180) / Math.PI;

    if (angleDeg < 0) {
        angleDeg += 360;
    }

    const time = Math.floor((angleDeg / 360) * 24);
    openTaskForm({ name: '', duration: '', color: '#3498db', time });
}

circle.addEventListener('contextmenu', handleContextMenu);
cancelButton.addEventListener('click', closeTaskForm);
saveButton.addEventListener('click', saveTask);

function saveTask() {
    const name = taskNameInput.value.trim();
    const duration = parseFloat(taskDurationInput.value);
    const color = taskColorInput.value;
    const time = parseInt(taskTimeInput.value, 10);

    if (name === '' || isNaN(duration) || duration <= 0 || isNaN(time) || time < 0 || time > 23) {
        alert('Please enter valid task details.');
        return;
    }

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
