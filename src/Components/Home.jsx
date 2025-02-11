import { useEffect, useState } from "react";
import Form from "./Form";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [load, setLoad] = useState(false);

  // Load tasks from API
  const loadTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks");
      setTodos(res.data);
      // toast.success("Tasks loaded successfully!");
    } catch (error) {
      toast.error("Failed to load tasks. Try again.");
      console.error(error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [setTodos]);

  // Function to delete a task
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/delete/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
      toast.success("Task deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete task.");
      console.error(error);
    }
  };

  const handleUpdate = async (id, status) => {
    // Optimistically update UI first

    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo._id === id ? { ...todo, completed: !status } : todo
      )
    );

    try {
      const res = await axios.put(`http://localhost:5000/api/update/${id}`, {
        completed: !status,
      });
      toast.success("Task status updated!");
    } catch (error) {
      toast.error("Failed to update task.");
      console.error(error);

      // Rollback UI in case of error
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === id ? { ...todo, completed: status } : todo
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          📝 Todo List
        </h2>

        {/* Form Component */}
        <Form setTodos={setTodos} setLoad={setLoad}  loadTasks={loadTasks}/>

        {/* Todo List */}
        <div className="mt-6">
          {todos.length === 0 ? (
            <div className="text-gray-500 text-center p-4 bg-gray-200 rounded-lg">
              <p className="text-lg">📭 No tasks added yet!</p>
              <p className="text-sm">Start by adding a new task above.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {todos.map((todo,index) => (
                <li
                  key={todo._id||index}
                  className="bg-blue-100 text-blue-900 p-3 rounded-lg shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      key={todo._id+1}
                      checked={!!todo.completed}
                      onChange={() => handleUpdate(todo._id, todo.completed)}
                      className="cursor-pointer"
                    />
                    <span
                      className={`${
                        todo.completed ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {todo.task}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(todo._id)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    ✖
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
