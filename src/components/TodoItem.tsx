import React, { useState, useEffect } from 'react';
import { Todo } from '../types/todo';
import { Check, Trash, Edit, X, Check as SaveIcon } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleComplete, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [notification, setNotification] = useState<{
    type: 'complete' | 'edit' | 'delete' | null;
    visible: boolean;
  }>({ type: null, visible: false });

  const handleToggleComplete = async () => {
    try {
      await onToggleComplete(todo.id);
      showNotification('complete');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(todo.id);
      showNotification('delete');
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editText.trim()) {
      try {
        await onEdit(todo.id, editText);
        setIsEditing(false);
        showNotification('edit');
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  const showNotification = (type: 'complete' | 'edit' | 'delete') => {
    setNotification({ type, visible: true });
  };

  useEffect(() => {
    if (notification.visible) {
      const timer = setTimeout(() => {
        setNotification({ type: null, visible: false });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [notification.visible]);

  const notificationConfig = {
    complete: {
      message: 'Task completed!',
      bgColor: '#10b981', // Emerald-500
      icon: <Check size={14} />
    },
    edit: {
      message: 'Task updated!',
      bgColor: '#3b82f6', // Blue-500
      icon: <Check size={14} />
    },
    delete: {
      message: 'Task deleted!',
      bgColor: '#ef4444', // Red-500
      icon: <Check size={14} />
    }
  };

  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  return (
    <div className={`flex items-center p-4 mb-3 rounded-lg border transition-all duration-300 relative ${todo.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
      }`}>
      {/* Notification */}
      {notification.visible && notification.type && (
        <div style={{
          position: 'absolute',
          top: '-1.5rem',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          animation: 'fadeInOut 2s ease-in-out forwards'
        }}>
          <div style={{
            backgroundColor: notificationConfig[notification.type].bgColor,
            color: 'white',
            padding: '0.25rem 0.75rem',
            borderRadius: '0.5rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            fontSize: '0.875rem'
          }}>
            {notificationConfig[notification.type].icon}
            <span className="ml-1">{notificationConfig[notification.type].message}</span>
          </div>
        </div>
      )}

      <button
        onClick={handleToggleComplete}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center transition-colors ${todo.completed ? 'border-green-500 bg-green-500' : 'border-gray-300 hover:border-blue-400'
          }`}
      >
        {todo.completed && <Check size={14} className="text-white" />}
      </button>

      <div className="flex-1">
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
        ) : (
          <div className="flex items-center">
            <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
              {todo.text}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ml-2 ${priorityColors[todo.priority]}`}>
              {todo.priority}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center ml-2 space-x-1">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="p-1 text-green-600 hover:bg-green-50 rounded-full transition-colors"
              disabled={!editText.trim()}
            >
              <SaveIcon size={18} />
            </button>
            <button
              onClick={handleCancel}
              className="p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleEdit}
              className="p-1 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors"
            >
              <Trash size={18} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TodoItem;