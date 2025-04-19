import axios from 'axios';
import { Todo } from '../types/todo';


// Create axios instance with timeout and error handling
const api = axios.create({
  baseURL: 'https://my-todo-list-2.onrender.com',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Thêm interceptor để bắt lỗi chi tiết hơn
api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Server is not responding.');
    }
    if (!error.response) {
      throw new Error('Network error. Server might be offline.');
    }
    throw error;
  }
);
export const fetchTodos = async (): Promise<Todo[]> => {
  try {
    const response = await api.get('/todos');
    return response.data;
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw new Error('Failed to fetch tasks. Server might be offline.');
  }
};

export const createTodo = async (todoData: Omit<Todo, 'id' | 'createdAt'>): Promise<Todo> => {
  try {
    const response = await api.post('/todos', todoData);
    return response.data;
  } catch (error) {
    console.error('Error creating todo:', error);
    throw new Error('Failed to create task. Please try again.');
  }
};

export const updateTodo = async (id: string, todoData: Partial<Todo>): Promise<Todo> => {
  try {
    const response = await api.put(`/todos/${id}`, todoData);
    return response.data;
  } catch (error) {
    console.error('Error updating todo:', error);
    throw new Error('Failed to update task. Please try again.');
  }
};

export const deleteTodo = async (id: string): Promise<void> => {
  try {
    await api.delete(`/todos/${id}`);
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw new Error('Failed to delete task. Please try again.');
  }
};