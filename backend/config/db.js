import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const dbUser = process.env.DB_USER || process.env.db_user || 'postgres';
const dbHost = process.env.DB_HOST || process.env.db_host || 'localhost';
const dbName = process.env.DB_NAME || process.env.db_name || 'Fitspiration';
const dbPassword = process.env.DB_PASSWORD || process.env.db_password || '';
const dbPort = Number(process.env.DB_PORT || process.env.db_port) || 5432;

const pool = new Pool({
    user: dbUser,
    host: dbHost,
    database: dbName,
    password: dbPassword,
    port: dbPort,
});

pool.on('connect', () => {
    console.log('connected to postgreSQL');
});

pool.on('error', (err) => {
    console.error('Postgres pool error', err);
});

export default pool;