export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

export type TodoFilter = 'all' | 'active' | 'completed';

export type Priority = 'low' | 'medium' | 'high';