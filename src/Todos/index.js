import React, { Component } from 'react'

import Context from '../Context'

const R = require('ramda')
let initialIndex = 1

const createTodo = task => ({task, isCompleted: false, id: initialIndex++})
const filters = ['all', 'active', 'completed']

class TodosProvider extends Component {
  state = {
    todos: [],
    filter: filters[0],
    taskInputValue: ''
  }

  addTodo = task => () => {
    this.setState(state => ({
      todos: task ? R.append(createTodo(task), state.todos) : state.todos,
      taskInputValue: ''
    }))
  }

  markAsCompleted = id => () => this.setState(state => ({todos: R.map(R.when(
    R.propSatisfies(todoId => id === todoId, 'id'),
    todo => R.assoc('isCompleted', !todo.isCompleted, todo)
  ), state.todos)}))

  handleTaskChange = taskInputValue => this.setState({taskInputValue})

  render() {
    return (
      <Context.Provider value={{
        state: this.state,
        actions: {
          addTodo: this.addTodo,
          handleTaskChange: this.handleTaskChange,
          markAsCompleted: this.markAsCompleted
        }
      }}>
        {this.props.children}
      </Context.Provider>
    )
  }
}

const Header = () => (
  <header className="header">
    <h1>todos list</h1>
  </header>
)

class TodoForm extends Component {
  render() {
    return(
      <Context.Consumer>
        { ({state: {taskInputValue}, actions: {addTodo, handleTaskChange}}) =>
          <form onSubmit={addTodo(taskInputValue)}>
            <input className="new-todo" placeholder="What needs to be done?" value={taskInputValue} onChange={R.pipe(R.path(['target', 'value']), handleTaskChange)} />
          </form>
        }
      </Context.Consumer>
    )
  }
}

const Todos = () => (
  <TodosProvider>
    <section className="todoapp">
      <Header />
      <section className="main">
        <TodoForm />
        {/* <input className="toggle-all" type="checkbox" /> */}
        <TodoList />
        <TodoFooter />
      </section>
    </section>
  </TodosProvider>
)
const TodoList = () => (
  <Context.Consumer>
    {({ state: {todos}, actions: { markAsCompleted } }) => (
      <ul className="todo-list">
      {console.log(todos)}
        {todos.map(todo => <Todo key={todo.id} {...todo} markAsCompleted={markAsCompleted(todo.id)} />)}
      </ul>
    )
  }
  </Context.Consumer>
)

const Todo = props => (
  <li>
    <div className="view">
      <input className="toggle" type="checkbox" onChange={props.markAsCompleted} checked={props.isCompleted}/>
      <label>{props.task}</label>
      <button className="destroy"></button>
    </div>
    <input className="edit" value={props.task} readOnly/>
  </li>
)

const TodoFooter = () => (
  <Context.Consumer>
    { ({state: {todos}}) =>
      <footer className="footer">
        <span className="todo-count"><strong>{todos.length}</strong>
          {' '}
          <span>items left</span>
        </span>
        <ul className="filters">
          <li>
            <a href="#/" className="selected">All</a>
          </li>
          <span />
          <li><a href="#/active">Active</a></li>
          <span> </span>
          <li><a href="#/completed">Completed</a></li>
        </ul>
      </footer>

    }
  </Context.Consumer>
)


export default Todos