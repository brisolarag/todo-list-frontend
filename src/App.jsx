import { useState , useEffect } from 'react'
import './App.css'

import Todo from './components/Todo'
import TodoForm from './components/TodoForm';
import Search from './components/Search';
import Loader from './components/Loader';


import api from './services/api'






function App() {
  const [todos, setTodos] = useState([]);

  function fetchTasks() {
    api
      .get("/tasks")
      .then((response) => {
        const data = new Date();
        const options = {weekday: 'long', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const dataFormatada = data.toLocaleDateString('pt-BR', options);
        const formatted = response.data.map((task) => ({
          ...task,
          date: dataFormatada
        }));
  
        setTodos(formatted);
      })
      .catch((err) => {
        console.error("ops! ocorreu um erro" + err);
      });
  }

  useEffect(() => fetchTasks(), [])
  
  const [search, setSearch] = useState("")
  const [showLoader, setShowLoader] = useState(false);

  const addTodo = (text, type) => {
    setShowLoader(true)
    
    const dateUTC = new Date(Date.now()).toUTCString()
    function addTask(text, type) {
      api
        .post("/tasks", {
          title: text,
          type: type
        })
        .then((response) => {
          const newTodo = {
            id: response.data.insertId,
            title: text,
            type: type,
            status: 0,
            date: dateUTC
          }
          setTimeout(() => {
            setShowLoader(false)
            setTodos([...todos, newTodo])
          }, 500)
        })
        .catch((err) => {
          console.error("ops! ocorreu um erro" + err);
        })
    }

    addTask(text, type)
  }

  const removeTodo = (id) => {
      api
        .delete(`/tasks/${id}`)
        .catch((e) => {console.log("erro: " + e); return})
      
      const newTodos = [...todos]
      const filtered = newTodos.filter(todo => {
        if (todo.id !== id) {
          return todo
        } else return null
      })
      setTodos(filtered)
    } 

  const completeTodo = (id) => {
    // Encontre a tarefa com base no ID
    const todoToUpdate = todos.find((todo) => todo.id === id);
  
    if (todoToUpdate) {
      // Inverta o status atual da tarefa
      const updatedStatus =  todoToUpdate.status === 1? 0 : 1
  
      // Faça uma chamada para a API para atualizar o status da tarefa
      api
        .put(`/tasks/${id}`, {
          status: updatedStatus
        })
        .then(() => {
          // Atualize o estado da tarefa no frontend
          setTodos((prevTodos) =>
            prevTodos.map((todo) =>
              todo.id === id ? { ...todo, status: updatedStatus } : todo
            )
          );
        })
        .catch((err) => {
          console.error("ops! ocorreu um erro" + err);
        });
    }
  };

  return <div className="app">
    <h1>LISTA DE TAREFAS</h1>
    <Search search={search} setSearch={setSearch}/>
    <div className='todo-list'>
      {todos
      .filter((todo) => 
      todo.title.toLowerCase().includes(search.toLowerCase())
      )
      .map((todo) => (
        <Todo 
        key={todo.id} 
        todo={todo} 
        removeTodo={removeTodo} 
        completeTodo={completeTodo}
        />
        ))}
    </div>
    <TodoForm addTodo={addTodo}/>
    

    <p className='author'>by Gabriel Brisolara</p>
    {showLoader && <Loader />}

  </div>


}

export default App
