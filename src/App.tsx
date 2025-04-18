import { CheckCircle2, ListTodo } from 'lucide-react';
import { useEffect, useState } from 'react';
import AddTodoForm from './components/AddTodoForm';
import TodoFilter from './components/TodoFilter';
import TodoList from './components/TodoList';
import { createTodo, deleteTodo, fetchTodos, updateTodo } from './services/api';
import { TodoFilter as FilterType, Priority, Todo } from './types/todo';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTodos();
        setTodos(data);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Server error';
        setError(message);
        // Log full error để debug
        console.error('Fetch error details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    // Thêm retry mechanism
    const retryTimer = setTimeout(() => {
      loadTodos();
    }, 5000);

    return () => clearTimeout(retryTimer);
  }, []);
  const handleAddTodo = async (text: string, priority: Priority) => {
    try {
      const newTodo = await createTodo({
        text,
        completed: false,
        priority
      });
      setTodos([...todos, newTodo]);
    } catch (err) {
      console.error('Failed to add todo:', err);
      setError('Failed to add task. Please try again.');
    }
  };

  const handleToggleComplete = async (id: string) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      const updatedTodo = await updateTodo(id, { completed: !todo.completed });
      setTodos(todos.map(t => t.id === id ? updatedTodo : t));
    } catch (err) {
      console.error('Failed to update todo:', err);
      setError('Failed to update task. Please try again.');
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter(t => t.id !== id));
    } catch (err) {
      console.error('Failed to delete todo:', err);
      setError('Failed to delete task. Please try again.');
    }
  };

  const handleEditTodo = async (id: string, text: string) => {
    try {
      const updatedTodo = await updateTodo(id, { text });
      setTodos(todos.map(t => t.id === id ? updatedTodo : t));
    } catch (err) {
      console.error('Failed to edit todo:', err);
      setError('Failed to edit task. Please try again.');
    }
  };

  const todoCount = {
    all: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center mb-2">
            <ListTodo size={32} className="text-blue-500 mr-2" />
            <h1 className="text-3xl font-bold text-gray-800">My Todo-List</h1>
          </div>
          <p className="text-gray-600">Organize your tasks efficiently</p>
        </header>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-6 relative">
            {error}
            <button
              className="absolute top-3 right-3 text-red-700"
              onClick={() => setError(null)}
            >
              &times;
            </button>
          </div>
        )}

        <AddTodoForm onAddTodo={handleAddTodo} />

        <TodoFilter
          currentFilter={filter}
          onFilterChange={setFilter}
          todoCount={todoCount}
        />

        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-6 w-24 bg-gray-200 rounded mb-4"></div>
              <div className="h-32 w-full bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : (
          <>
            <TodoList
              todos={todos}
              filter={filter}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTodo}
              onEdit={handleEditTodo}
            />

            {todoCount.completed > 0 && (
              <div className="flex items-center justify-center mt-8 text-sm text-gray-500">
                <CheckCircle2 size={16} className="text-green-500 mr-1" />
                <span>You've completed {todoCount.completed} {todoCount.completed === 1 ? 'task' : 'tasks'}!</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;