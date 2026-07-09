import pool from "../config/db.js";

const VALID_PRIORITIES = ['low', 'medium', 'high'];
const VALID_STATUSES = ['todo', 'inprogress', 'done'];

// GET /tasks
export const getAllTasks = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err); // log error di console server
        res.status(500).json({ message: 'Internal server error' }); // pesan generic ke client
    }
};

// GET /tasks/:id
export const getTaskById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// POST /tasks
export const createTask = async (req, res) => {
    const { title, description, priority, due_date, status } = req.body;

    // Validasi server — jangan percaya validasi form doang
    if (!title || title.trim() === '') {
        return res.status(400).json({ message: 'Title is required' });
    }

    if (!due_date) {
        return res.status(400).json({ message: 'Due date is required' });
    }

    if (priority && !VALID_PRIORITIES.includes(priority)) {
        return res.status(400).json({ message: 'Invalid priority value' });
    }

    if (status && !VALID_STATUSES.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO tasks (title, description, priority, due_date, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, description, priority, due_date, status]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create task' });
    }
};

// UPDATE or PATCH /tasks/:id
export const updateTaskStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Validasi server
    if (status && !VALID_STATUSES.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
    }

    try {
        const result = await pool.query(
            'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update task' });
    }
};

// DELETE /tasks/:id
export const deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM tasks WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete task' });
    }
};
