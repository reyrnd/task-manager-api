import express from "express";
import { getAllTasks, getTaskById, createTask, updateTaskStatus, deleteTask } from "../controllers/tasksController.js";

const router = express.Router();

// Routes
router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.patch('/:id', updateTaskStatus);
router.delete('/:id', deleteTask);

export default router;