import { Todo } from '../todos/models/todo.model';

/**
 * En el store, definiremos el estado global de la aplicación
 */

export const Filters = {
    All: 'all',
    Completed: 'Completed',
    Pending: 'Pending',
}

//Información global de la aplicación.
const state = {
    todos: [
        new Todo('Piedra del alma'),
        new Todo('Piedra del infinito'),
        new Todo('Piedra del tiempo'),
        new Todo('Piedra del poder'),
        new Todo('Piedra del campo'),
    ],
    filter: Filters.All,
}

/**
 * 
 */
const initStore = () => {
    loadStore();
    // console.log("initStore",state);
}

/**
 * 
 */
const loadStore = () => {
    // console.log(localStorage.getItem('state'));//getItem: le pasmaos el key y obtenemos el valor
    if(!localStorage.getItem('state')) return;
    const {todos = [], filter = Filters.All} = JSON.parse(localStorage.getItem('state'));//Obtenemos el valor de la llave, y lo gudaramos en una const, donde si no vienen datos por defecto tendran un valor = [] o = Filter.All.
    state.todos = todos;
    state.filter = filter;
}

const saveStateToLocalStorage  = () =>{
    // localStorage.setItem('state', 'Hola mundo');//Guardar un valor en el localStorage
    // console.log("Stringify: ", JSON.stringify(state))//stringify serializa a string todo el objeto.
    // console.log(state);
    localStorage.setItem('state', JSON.stringify(state));
}

/**
 * 
 * @param {String} filter 
 * @returns 
 */
const getTodos = (filter = Filters.All) => {
    switch (filter) {
        case Filters.All:
            // console.log("getTodos",state.todos);
            // return state.todos.filter(todo => todo.done);
            return [...state.todos];
        case Filters.Completed:
            return state.todos.filter(todo => todo.done);
        case Filters.Pending:
            return state.todos.filter(todo => !todo.done);
        default:
            throw new Error(`Option ${filter} is not valid.`);
    }
}

/**
 * Agregar todo
 * @param {String} description 
 */
const addTodo = (description) => {
    if (!description) throw new Error('Description is required');
    state.todos.push(new Todo(description));
    saveStateToLocalStorage();
}

/**
 * Actualizar estados.
 * @param {String} todoId 
 */
const toggleTodo = (todoId) => {
    state.todos = state.todos.map(todo => {
        if (todo.id === todoId) {
            todo.done = !todo.done;
        }
        return todo;
    });

    saveStateToLocalStorage();
}

/**
 * Eliminar un todo
 * @param {String} todoId 
 */
const deleteTodo = (todoId) => {
    state.todos = state.todos.filter(todo => todo.id !== todoId);
    saveStateToLocalStorage();
}

/**
 * Eliminar todos
 */
const deleteCompleted = () => {
    state.todos = state.todos.filter(todo => !todo.done);
    saveStateToLocalStorage();
}

/**
 * Setear un filtro.
 * Si no recibe ningun parametro, por defecto sera Filter.All.
 * @param {Filters} newFilter 
 */
const setFilter = (newFilter = Filters.All) => {
    state.filter = newFilter;
    saveStateToLocalStorage();
}

/**
 * 
 */
const getCurrentFilter = () => {
    // console.info("getCurrentFilter: "+state.filter);
    return state.filter;
}

//Exportamos las funciones, si no se exportan seran privadas.
export default {
    addTodo,
    deleteCompleted,
    deleteTodo,
    getCurrentFilter,
    getTodos,
    initStore,
    loadStore,
    setFilter,
    toggleTodo,
}