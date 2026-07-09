import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});

// Biar ketauan kalau pool error di background (misal koneksi putus)
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

export default pool;