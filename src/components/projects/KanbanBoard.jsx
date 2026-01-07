import { useState, useRef } from 'react';
import { MoreHorizontal, Plus, GripVertical } from 'lucide-react';
import TaskCard from './TaskCard';
import './KanbanBoard.css';

const defaultColumns = [
  { id: 'todo', title: 'To Do', color: '#6366f1' },
  { id: 'in-progress', title: 'In Progress', color: '#f59e0b' },
  { id: 'review', title: 'In Review', color: '#8b5cf6' },
  { id: 'done', title: 'Done', color: '#22c55e' },
];

export default function KanbanBoard({
  tasks = [],
  onTaskMove,
  onTaskClick,
  onAddTask,
  columns = defaultColumns
}) {
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const dragRef = useRef(null);

  const getTasksByColumn = (columnId) => {
    return tasks.filter(task => task.status === columnId);
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    dragRef.current = task;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);
    // Add dragging class after a small delay to avoid flickering
    setTimeout(() => {
      e.target.classList.add('dragging');
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
    setDraggedTask(null);
    setDragOverColumn(null);
    dragRef.current = null;
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  const handleDragLeave = (e) => {
    // Only clear if leaving the column entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (dragRef.current && dragRef.current.status !== columnId) {
      onTaskMove?.(dragRef.current.id, columnId);
    }
  };

  return (
    <div className="kanban-board">
      {columns.map((column) => (
        <div
          key={column.id}
          className={`kanban-column ${dragOverColumn === column.id ? 'drag-over' : ''}`}
          onDragOver={(e) => handleDragOver(e, column.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <div className="kanban-column-header">
            <div className="kanban-column-title">
              <span
                className="kanban-column-indicator"
                style={{ background: column.color }}
              />
              <h3>{column.title}</h3>
              <span className="kanban-column-count">
                {getTasksByColumn(column.id).length}
              </span>
            </div>
            <div className="kanban-column-actions">
              <button className="kanban-action-btn" onClick={() => onAddTask?.(column.id)}>
                <Plus size={16} />
              </button>
              <button className="kanban-action-btn">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>

          <div className="kanban-column-content">
            {getTasksByColumn(column.id).map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onClick={() => onTaskClick?.(task)}
              />
            ))}

            {getTasksByColumn(column.id).length === 0 && (
              <div className="kanban-empty">
                <p>No tasks</p>
              </div>
            )}
          </div>

          <button
            className="kanban-add-task"
            onClick={() => onAddTask?.(column.id)}
          >
            <Plus size={16} />
            <span>Add Task</span>
          </button>
        </div>
      ))}
    </div>
  );
}
