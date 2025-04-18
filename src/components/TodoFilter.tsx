import React from 'react';
import { TodoFilter as FilterType } from '../types/todo';

interface TodoFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  todoCount: {
    all: number;
    active: number;
    completed: number;
  };
}

const TodoFilter: React.FC<TodoFilterProps> = ({ currentFilter, onFilterChange, todoCount }) => {
  const filters: { label: string; value: FilterType }[] = [
    { label: `All (${todoCount.all})`, value: 'all' },
    { label: `Active (${todoCount.active})`, value: 'active' },
    { label: `Completed (${todoCount.completed})`, value: 'completed' },
  ];

  return (
    <div className="flex flex-wrap justify-center sm:justify-start space-x-2 mb-6">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`px-4 py-2 rounded-md transition-colors ${
            currentFilter === filter.value
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default TodoFilter;