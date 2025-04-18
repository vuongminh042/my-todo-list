import React, { useState, useEffect } from 'react';
import { Plus, Check } from 'lucide-react';
import { Priority } from '../types/todo';

interface AddTodoFormProps {
  onAddTodo: (text: string, priority: Priority) => void;
}

const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAddTodo }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      try {
        await onAddTodo(text.trim(), priority);
        setText('');
        setIsExpanded(false);
        setShowSuccess(true);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 transition-all duration-300 relative">
      {/* Success Notification with inline style */}
      {showSuccess && (
        <div style={{
          position: 'absolute',
          top: '-3rem',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          animation: 'fadeInOut 2s ease-in-out forwards'
        }}>
          <div style={{
            backgroundColor: '#10b981',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Check className="mr-2" size={18} />
            Task added successfully!
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex items-center">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="Add a new task..."
            className="flex-1 p-2 border-b-2 border-gray-200 focus:border-blue-500 outline-none transition-colors"
            data-test="add-todo-input"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className={`ml-2 p-2 rounded-full transition-all duration-200 ${text.trim()
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            data-test="add-todo-button"
          >
            <Plus size={20} />
          </button>
        </div>

        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-gray-100 animate-fadeIn">
            <div className="flex items-center">
              <label className="text-sm text-gray-600 mr-3">Priority:</label>
              <div className="flex space-x-2">
                {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${priority === p
                        ? p === 'low'
                          ? 'bg-blue-500 text-white'
                          : p === 'medium'
                            ? 'bg-yellow-500 text-white'
                            : 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddTodoForm;