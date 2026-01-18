import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { useToast } from "../context/ToastContext";
import { taskApi } from "../API/api.js";
import "../assets/css/dashboard.css";

export default function Dashboard() {
  const { logout } = useAuth();
  const { showToast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await taskApi.getTasks();
      setTasks(res.data);
    } catch (err) {
      console.log("Failed to load tasks");
      showToast("Failed to load task");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (newTaskData) => {
    try {
      const res = await taskApi.createTask(newTaskData);
      setTasks([res.data, ...tasks]);
      showToast("Task added successfully!", "success");
    } catch (err) {
      showToast("Failed to add task");
      console.log("Failed to add task", err);
    }
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks(tasks.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
  };

  const handleDeleteTask = async (taskId) => {
    const prevTasks = [...tasks];
    setTasks(tasks.filter((t) => t._id !== taskId));
    try {
      await taskApi.deleteTask(taskId);
      showToast("Task deleted successfully!", "success");
    } catch (error) {
      setTasks(prevTasks);
      showToast("Failed to delete Task");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header glass-effect">
        <div className="header-content">
          <div className="header-left">
            <h1 className="dashboard-title">
              <span className="title-gradient">My Tasks</span>
              <span className="title-badge">{tasks.length}</span>
            </h1>
            <p className="dashboard-subtitle">
              Manage your tasks in a futuristic workspace
            </p>
          </div>

          <button onClick={logout} className="btn btn-logout">
            <span className="btn-icon">↪</span>
            Logout
          </button>
        </div>

        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">
                {tasks.filter((t) => !t.completed).length}
              </div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">
                {tasks.filter((t) => t.completed).length}
              </div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <div className="stat-value">{tasks.length}</div>
              <div className="stat-label">Total</div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-grid">
          <div className="content-main">
            <div className="section-card glass-effect">
              <div className="section-header">
                <h2 className="section-title">
                  <span className="title-icon">➕</span>
                  Add New Task
                </h2>
                <div className="section-divider"></div>
              </div>
              <TaskForm onAdd={handleAddTask} />
            </div>

            <div className="section-card glass-effect">
              <div className="section-header">
                <h2 className="section-title">
                  <span className="title-icon">📋</span>
                  Task List
                </h2>
                <div className="section-divider"></div>
              </div>

              {loading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p className="loading-text">Loading your tasks...</p>
                </div>
              ) : (
                <TaskList
                  tasks={tasks}
                  onUpdate={handleUpdateTask}
                  onDelete={handleDeleteTask}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
