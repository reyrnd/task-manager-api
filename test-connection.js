import pool from './config/db.js';

const testConnection = async () => {
    try {
        const result = await pool.query('SELECT NOW()');
        console.log('✅ Connected! Server time:', result.rows[0].now);
    } catch (err) {
        console.error('❌ Connection failed:', err.message);
    } finally {
        await pool.end();
    }
};

testConnection();