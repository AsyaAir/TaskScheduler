// Создание функции для добавления задач в список и их сохранения в Local Storage. 
document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('task');
    const taskList = document.getElementById('taskList');
    const noTasksMessage = document.getElementById('noTasksMessage');
    const cleanButton = document.getElementById('clean');
    const taskError = document.getElementById('taskError');
    // Значение по умолчанию поля ввода задачи
    const defaultTaskValue = "Задача / Task";

    // Удаление значения по умолчанию при фокусе
    taskInput.addEventListener('focus', function() {
        if (taskInput.value === defaultTaskValue) {
            taskInput.value = '';  // Очистить поле при фокусе
        }
    });
    // Восстановление значения по умолчанию при уходе фокуса, если поле пустое
    taskInput.addEventListener('blur', function() {
        if (taskInput.value.trim() === '') {
            taskInput.value = defaultTaskValue;  // Восстановить значение
        }
    });

    // Чтение задач из Local Storage при загрузке страницы
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    renderTasks();  // Вызов функции рендеринга задач при загрузке страницы

    // Добавление задачи в список
    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const taskText = taskInput.value.trim();

        if (taskText === '' || taskText === defaultTaskValue) {
            taskError.textContent = 'Please enter a task / Введите задачу';
            return;
        }
        // Очищение ошибки
        taskError.textContent = '';
        // Добавление задачи в список задач
        const newTask = { text: taskText, completed: false };
        tasks.push(newTask);
        saveTasks();
        // Очищение поля ввода
        taskInput.value = defaultTaskValue;  // Сбрасывание поля к значению по умолчанию
        // Рендеринг задачи
        renderTasks();
    });

    // Функция сохранения задач в Local Storage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    // Функция рендеринга задач на странице
    function renderTasks() {
        // Очистка списка задач
        taskList.innerHTML = '';
        // Проверка, есть ли задачи
        if (tasks.length === 0) {
            noTasksMessage.style.display = 'block';
            cleanButton.disabled = true;
        } else {
            noTasksMessage.style.display = 'none';
            cleanButton.disabled = false;
            tasks.forEach((task, index) => {
                const taskItem = document.createElement('li');
                taskItem.innerHTML = `
                    <span>${task.text}</span>
                    <input type="checkbox" ${task.completed ? 'checked' : ''} data-index="${index}">
                `;
                taskList.appendChild(taskItem);
            });
        }
    }

    // Добавление обработчика событий для изменения состояния чекбоксов
    taskList.addEventListener('change', function(event) {
        if (event.target.tagName === 'INPUT' && event.target.type === 'checkbox') {
            const index = event.target.getAttribute('data-index');
            tasks[index].completed = event.target.checked;  // Измение состояния задачи
            saveTasks();  // Обновление Local Storage
        }
    });

    // Очистка списка задач и Local Storage
    cleanButton.addEventListener('click', function() {
        tasks = [];  // Очистка массива задач
        saveTasks();  // Очистка Local Storage
        renderTasks();  // Обновление отображения на странице
    });
});