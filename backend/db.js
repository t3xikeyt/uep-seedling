import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DB_NAME = process.env.DB_NAME || 'uep_seedling';
const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

export async function ensureDatabase() {
  const bootstrapPool = mysql.createPool({
    ...poolConfig,
    connectionLimit: 1,
    database: undefined,
  });

  const connection = await bootstrapPool.getConnection();
  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    console.log(`Database ready: ${DB_NAME}`);
  } finally {
    connection.release();
    await bootstrapPool.end();
  }
}

const pool = mysql.createPool({
  ...poolConfig,
  database: DB_NAME,
});

export default pool;
