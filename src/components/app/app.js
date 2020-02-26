import React, { Component } from 'react'

import AppHeader from '../app-header'
import Search from '../search'
import TodoList from '../todo-list'
import ItemStatusFilter from '../item-status-filter';
import ItemAddForm from '../item-add-form';

import './app.css';

export default class app extends Component {
  maxId = 100;

  state = {
    todoData: [
      this.createDodoItem('Drink Coffee'),
      this.createDodoItem('Make Awesome App'),
      this.createDodoItem('Have a lunch')
    ],
    term: '',
    filter: 'all'
  }

  createDodoItem(label){
    return{
      label,
      important: false,
      done: false,
      id: this.maxId++
    }
  }

  deleteItem = (id) => {
    this.setState(({ todoData }) => {
      const idx = todoData.findIndex((el) => el.id ===id)

      const newArr = [
        ...todoData.slice(0, idx), 
        ...todoData.slice(idx + 1)
      ]

      return {
        todoData: newArr
      }
    })
  }

  addItem = (text) => {
    // generet id
    const newItem = this.createDodoItem(text)
    // add element in array
    this.setState(({ todoData }) => {
      const newArr = [
        ...todoData,
        newItem
      ]

      return {
        todoData: newArr
      }
    })
  }

  toggleProperty(arr ,id, propName){
    const idx = arr.findIndex((el) => el.id === id)

    // 1. ipdate object
    const oldItem = arr[idx];
    const newItem = {...oldItem, [propName]: !oldItem[propName]}

    return[
      ...arr.slice(0, idx), 
      newItem,
      ...arr.slice(idx + 1)
    ]
  }

  onToggleImportant = (id) => {
    this.setState(({todoData}) => {
      return {
        todoData: this.toggleProperty(todoData, id, 'important')
      }
    })
  }

  onToggleDone = (id) => {
    this.setState(({todoData}) => {
      return {
        todoData: this.toggleProperty(todoData, id, 'done')
      }
    })
  }

  onSearch = (term) => {
    this.setState({term})
  }

  search = (todoData, term) => {

    if(term.length === 0){
      return todoData
    }

    return todoData.filter((item) => {
      return item.label.toLowerCase().indexOf(term.toLowerCase()) > -1
    })
  }

  onFilterChange = (filter) => {
    this.setState({filter})
  }

  filter = (todoData, filter) => {
    switch(filter){
      case 'all':
        return todoData;
      case 'active':
        return todoData.filter((item) => !item.done);
      case 'done':
        return todoData.filter((item) => item.done);
      default: 
      return todoData
    }
  }

  render() {
    const {todoData, term, filter} = this.state;

    const doneCounter = todoData.filter((el) => el.done).length
    const todoCounter = todoData.length - doneCounter
    const visibleSearch = this.filter(
      this.search(todoData, term), filter)


    return (
      <div className="todo-app">
        <AppHeader toDo={todoCounter} done={doneCounter} />
          <div className="top-panel d-flex">
            <Search onSearch={this.onSearch}/>
            <ItemStatusFilter 
              onFilterChange={this.onFilterChange}
              filter={filter}/>
          </div>
  
        <TodoList 
          todos={visibleSearch} 
          onToggleImportant = {this.onToggleImportant}
          onToggleDone = {this.onToggleDone}
          onDeleted = {this.deleteItem}/>
        <ItemAddForm
         addItem = {this.addItem}/>
      </div>
    )
  }
}
