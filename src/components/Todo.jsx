import React from 'react'


const Todo = ({todo, completeTodo, removeTodo}) => {
  return (
    <div className="todo">
        <div className="content">
            <p style={{textDecoration: todo.status ? "line-through" : "" }}>{todo.title}</p>
            <p style={{fontSize: '10px', textDecoration: todo.status ? "line-through" : "" }}>[{todo.type}]</p>
            <p style={{fontSize: '10px', textDecoration: todo.status ? "line-through" : "" }}>{todo.date}</p>
        </div>
        <div>
            <button className='complete' onClick={() => completeTodo(todo.id)}>Completar</button>
            <button className='remove' onClick={() => removeTodo(todo.id)}>x</button>
        </div>
    </div>
  )
}

export default Todo