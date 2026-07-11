import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import tasksRoutes from './routes/tasksRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { verifyToken } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: ['http://localhost:5173', 'https://taskmanager-rer.netlify.app'] }));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/tasks', verifyToken, tasksRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Task Manager API is running' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});