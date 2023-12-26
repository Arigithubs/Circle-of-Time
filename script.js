// script.js

document.addEventListener('DOMContentLoaded', function () {
    const circle = document.getElementById('circle');
    const taskForm = document.getElementById('taskForm');

    // Sample task data for testing
    const tasks = [
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
            circle.appendChild(taskElement);
        });
    }

    // Function to open the task form for editing or adding tasks
    function openTaskForm() {
        // Implement the logic to display and populate the form
        taskForm.style.display = 'block';
        // You can add logic to pre-fill form fields for editing tasks
    }

    // Event listener to open the task form on circle click
    circle.addEventListener('click', openTaskForm);

    // Initial render of tasks
    renderTasks();
});

