import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

const MONGO_URI = 'mongodb+srv://vuongchiminh866:minh2004@cluster0.k8xlb.mongodb.net/my-todo-list?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ Error connecting to MongoDB:', err));


const todoSchema = new mongoose.Schema({
  id: String,
  text: String,
  completed: Boolean,
  priority: String,
  createdAt: Date
});

const Todo = mongoose.model('Todo', todoSchema);


app.use(cors());
app.use(express.json());


app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching todos' });
  }
});

app.post('/api/todos', async (req, res) => {
  const { text, completed, priority } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const newTodo = new Todo({
    id: uuidv4(),
    text,
    completed: completed || false,
    priority: priority || 'medium',
    createdAt: new Date()
  });

  try {
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(500).json({ error: 'Error creating todo' });
  }
});

app.put('/api/todos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const updatedTodo = await Todo.findOneAndUpdate(
      { id },
      { $set: req.body },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: 'Error updating todo' });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTodo = await Todo.findOneAndDelete({ id });

    if (!deletedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Error deleting todo' });
  }
});


app.use(express.static(path.join(__dirname, '../dist')));


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});


app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
