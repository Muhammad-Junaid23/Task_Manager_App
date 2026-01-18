import { useState } from "react";
import { useToast } from "../context/ToastContext";
import { taskApi } from "../API/api.js";

const TaskList = ({ tasks, onUpdate, onDelete }) => {
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startEditing = (task) => {
    setEditingId(task._id);
    setEditingTitle(task.title);
    setEditingDescription(task.description || "");
  };

  const saveEdit = async (task) => {
    try {
      setIsSubmitting(true);
      const updated = await taskApi.updateTask(task._id, {
        title: editingTitle,
        description: editingDescription,
      });
      onUpdate(updated.data);
      setEditingId(null);
      showToast("Task updated successfully!", "success");
    } catch (error) {
      console.log("Failed to update task");
      showToast("Failed to update task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const toggleComplete = async (id, currentStatus) => {
    try {
      const updated = await taskApi.updateTask(id, {
        completed: !currentStatus,
      });
      onUpdate(updated.data);
      showToast(
        `Task marked as ${!currentStatus ? "completed" : "pending"}!`,
        "success",
      );
    } catch (error) {
      console.log("Failed to update task");
      showToast("Failed to update task");
    }
  };

  return (
    <div className="task-list-container">
      {tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3 className="empty-title">No tasks yet</h3>
          <p className="empty-text">
            Add your first task above to get started!
          </p>
        </div>
      ) : (
        <div className="tasks-grid">
          {tasks.map((task) => (
            <div
              key={task._id}
              className={`task-card ${task.completed ? "completed" : ""}`}
            >
              {editingId === task._id ? (
                <div className="task-edit-form">
                  <input
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    placeholder="Task title"
                    className="input-field"
                    autoFocus
                  />
                  <textarea
                    value={editingDescription}
                    onChange={(e) => setEditingDescription(e.target.value)}
                    placeholder="Description (optional)"
                    className="input-field textarea-field"
                    rows="3"
                  />
                  <div className="edit-actions">
                    <button
                      onClick={() => saveEdit(task)}
                      disabled={isSubmitting}
                      className="btn btn-save"
                    >
                      {isSubmitting ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={cancelEdit}
                      disabled={isSubmitting}
                      className="btn btn-cancel"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="task-header">
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() =>
                          toggleComplete(task._id, task.completed)
                        }
                        className="checkbox-input"
                      />
                      <span className="checkbox-custom"></span>
                    </label>

                    <div className="task-title-container">
                      <h3
                        className={`task-title ${task.completed ? "completed" : ""}`}
                      >
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="task-description">{task.description}</p>
                      )}
                    </div>

                    <div className="task-actions">
                      <button
                        onClick={() => startEditing(task)}
                        className="btn-action btn-edit"
                        title="Edit task"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => onDelete(task._id)}
                        className="btn-action btn-delete"
                        title="Delete task"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div className="task-footer">
                    <span
                      className={`task-status ${task.completed ? "completed" : "pending"}`}
                    >
                      {task.completed ? "✅ Completed" : "⏳ Pending"}
                    </span>
                    {/* <span className="task-id">#{task._id.slice(-6)}</span> */}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
