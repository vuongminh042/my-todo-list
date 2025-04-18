import React from 'react';
import { Todo, TodoFilter as FilterType } from '../types/todo';
import TodoItem from './TodoItem';
import { ClipboardList } from 'lucide-react';

interface TodoListProps {
  todos: Todo[];
  filter: FilterType;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ 
  todos, 
  filter,
  onToggleComplete, 
  onDelete, 
  onEdit 
}) => {
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; // 'all' filter
  });

  if (filteredTodos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-500">
        <ClipboardList size={48} className="mb-2 opacity-40" />
        {todos.length === 0 ? (
          <p>No tasks yet. Add your first task above!</p>
        ) : (
          <p>No {filter} tasks found.</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-1 transition-all" data-test="todo-list">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default TodoList;