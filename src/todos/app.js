import html from './app.html?raw';//Forma de un importar un archivo HTML en crudo.
import todoStore, { Filters } from '../store/todo.store';
import { renderTodos, renderPending } from '../todos/uses-cases';

const ElementIDs = {
    ClearCompleted: '.clear-completed',
    NewTodoInput: '#new-todo-input',
    TodoList: '.todo-list',
    TodoFilters: '.filtro',
    PendingCountLabel: '#pending-count',
}


/**
 * 
 * @param {*} elementId 
 */
export const App = (elementId) => {
    const displayTodos = () => {
        const todos = todoStore.getTodos(todoStore.getCurrentFilter());
        // console.log("app.js", todos);
        renderTodos(ElementIDs.TodoList, todos);
        updatePendingCount();
    }

    const updatePendingCount = () =>{
        renderPending(ElementIDs.PendingCountLabel);
    }
    //Función anonima autoinvocada:Se invocara cuando se llama la función App.
    (() => {
        const app = document.createElement('div');
        app.innerHTML = html;
        document.querySelector(elementId).append(app);
        displayTodos();
    })();

    const newDescriptionInput = document.querySelector(ElementIDs.NewTodoInput);
    const todoListUl = document.querySelector(ElementIDs.TodoList);
    const todoDeleteCompleted = document.querySelector(ElementIDs.ClearCompleted);
    const filterLIs = document.querySelectorAll(ElementIDs.TodoFilters);

    newDescriptionInput.addEventListener('keyup', (event) => {
        // console.log(event);
        // console.log(event.target.value);
        if (event.keyCode !== 13) return;
        if (event.target.value.trim().length === 0) return;

        todoStore.addTodo(event.target.value);
        displayTodos();
        event.target.value = '';
    });

    todoListUl.addEventListener('click', (event) => {
        // console.log(event.target);
        const element = event.target.closest('[data-id]');
        todoStore.toggleTodo(element.getAttribute('data-id'));
        displayTodos();
    });

    todoListUl.addEventListener('click', (event) => {
        const isDetroyElement = event.target.className === 'destroy';
        const element = event.target.closest('[data-id]');
        if (!element || !isDetroyElement) return;
        todoStore.deleteTodo(element.getAttribute('data-id'));
        displayTodos();
    });

    todoDeleteCompleted.addEventListener('click', () => {
        todoStore.deleteCompleted();
        displayTodos();
    });

    filterLIs.forEach(element => {//como los filterUL son un arreglo debemos recorrerlo para poder acceder a cada elemento.
        element.addEventListener('click', (element) => {
            filterLIs.forEach(el => el.classList.remove('selected'));//Eliminar de los LI la clase selected, para que no muestre el selected en los demas.
            element.target.classList.add('selected');//Agregar la clase selected al elemento.
            switch (element.target.text) {
                case 'Todos':
                    todoStore.setFilter(Filters.All);
                    break;
                case 'Pendientes':
                    todoStore.setFilter(Filters.Pending);
                    break;
                case 'Completados':
                    todoStore.setFilter(Filters.Completed);
                    break;
            }
            displayTodos();
        });
    });
}