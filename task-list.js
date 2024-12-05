class TaskList extends HTMLElement {
    constructor() {
        super();
        this.tasks = [];
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    connectedCallback() {
        this.shadowRoot.querySelector('form').addEventListener('submit', (e) => {
            e.preventDefault();
            const taskText = e.target.elements.task.value.trim();
            if (taskText) this.addTask(taskText);
            e.target.reset();
        });
    }

    addTask(text) {
        this.tasks.push({ text, completed: false, editing: false });
        this.render();
    }

    toggleTask(index) {
        this.tasks[index].completed = !this.tasks[index].completed;
        this.render();
    }

    deleteTask(index) {
        this.tasks.splice(index, 1);
        this.render();
    }

    editTask(index) {
        this.tasks[index].editing = true;
        this.render();
    }

    saveTask(index, newText) {
        this.tasks[index].text = newText;
        this.tasks[index].editing = false;
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                body {
                    background-color: #fff3e0;
                    font-family: Arial, sans-serif;
                }
                ul {
                    list-style-type: none;
                    padding: 0;
                }
                li {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background-color: #ffcc80;
                    padding: 10px;
                    margin-bottom: 5px;
                    border-radius: 5px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }
                .completed {
                    color: #388e3c;
                }
                form {
                    display: flex;
                    margin-bottom: 20px;
                }
                input {
                    flex-grow: 1;
                    padding: 10px;
                    border: 1px solid #ff9800;
                    border-radius: 5px;
                }
                button {
                    padding: 10px;
                    background-color: #ff9800;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
                button:hover {
                    background-color: #fb8c00;
                }
                .edit-input {
                    flex-grow: 1;
                    padding: 5px;
                    margin-right: 10px;
                }
            </style>
            <form>
                <input type="text" name="task" placeholder=" Добавить задачу" required>
                <button type="submit">Добавить</button>
            </form>
            <ul>
                ${this.tasks.map((task, index) => `
                    <li>
                        ${task.editing ? `
                            <input class="edit-input" type="text" value="${task.text}" onblur="this.getRootNode().host.saveTask(${index}, this.value)" />
                        ` : `
                            <span style="cursor: pointer;" onclick="this.getRootNode().host.toggleTask(${index})">${task.text}</span>
                        `}
                        <button onclick="this.getRootNode().host.deleteTask(${index})">удалить</button> 
                        <button onclick="this.getRootNode().host.editTask(${index})">${task.editing ? 'сохранить' : 'редактировать'}</button>
                        </li>
                    `).join('')}
                </ul>
            `;
        }
    }
    
    customElements.define('task-list', TaskList);

