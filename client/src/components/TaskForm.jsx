import { useState } from "react";
import { useToast } from "../context/ToastContext";

const TaskForm = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      setIsSubmitting(true);
      onAdd({ title, description });
      setTitle("");
      setDescription("");
      // showToast("Task created successfully!", "success");
    } catch (err) {
      console.log(err, "Failed to create task");
      showToast("Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-row">
          <div className="input-group">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              required
              className="input-field"
              disabled={isSubmitting}
            />
          </div>

          <div className="input-group">
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add description (optional)..."
              className="input-field"
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-add-task"
          >
            <span className="btn-content">
              {isSubmitting ? (
                <>
                  <span className="loading-spinner-small"></span>
                  Adding...
                </>
              ) : (
                <>
                  <span className="btn-icon">⚡</span>
                  Add Task
                </>
              )}
            </span>
          </button>
        </div>
      </form>
    </>
  );
};

export default TaskForm;
