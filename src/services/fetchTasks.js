import api from './api'

function fetchTasks() {
    api
      .get("/tasks")
      .then((response) => setTodos(response.data))
      .catch((err) => {
        console.error("ops! ocorreu um erro" + err);
      });
  }


export default fetchTasks
