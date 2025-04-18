# TodoMaster

A beautiful, responsive Todo List application built with React, TypeScript, and Node.js.

## Features

- Create, edit, and delete tasks
- Mark tasks as complete/incomplete
- Filter tasks by status (All, Active, Completed)
- Assign priority levels to tasks (Low, Medium, High)
- Responsive design for all device sizes
- Beautiful animations and transitions

## Tech Stack

- Frontend:
  - React
  - TypeScript
  - Tailwind CSS
  - Lucide React (for icons)
  - Axios (for API requests)

- Backend:
  - Node.js
  - Express
  - UUID (for generating unique IDs)

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev:all
   ```

This will start both the React frontend and the Node.js backend.

## Project Structure

- `/src` - Frontend React application
  - `/components` - UI components
  - `/services` - API service layer
  - `/types` - TypeScript type definitions
- `/server` - Backend Node.js application

## API Endpoints

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo