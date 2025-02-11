import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Form({ setTodos, loadTasks }) {
  const [task, setTask] = useState("");
  // const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.trim()) return;

    try {
      const res = await axios.post("http://localhost:5000/api/add", { task });
      loadTasks();
      toast.success("Task added successfully!");

      setTask(""); // Clear input field

      // Optionally, update the tasks list if `setTodos` is available
      if (setTodos) {
        setTodos((prevTodos) => [...prevTodos, res.data]);
      }
    } catch (error) {
      toast.error("Task not added");
      console.error(error);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex items-center space-x-2 bg-white p-4 rounded-lg shadow-md"
      >
        <input
          type="text"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          name="task"
          placeholder="Enter your task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all cursor-pointer"
        >
          ➕ Add
        </button>
      </form>
    </div>
  );
}
