import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

/**
 * Initialize database connection pool
 */
export function initDatabase(): mysql.Pool {
  if (pool) {
    return pool;
  }

  pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "plankjes_maffia",
    port: parseInt(process.env.DB_PORT || "3306"),
    waitForConnections: true,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || "10"),
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });

  return pool;
}

/**
 * Get database connection pool
 */
export function getPool(): mysql.Pool {
  if (!pool) {
    return initDatabase();
  }
  return pool;
}

/**
 * Execute a query
 */
export async function query<T = any>(
  sql: string,
  params?: any[]
): Promise<T[]> {
  const connectionPool = getPool();
  const [rows] = await connectionPool.execute(sql, params);
  return rows as T[];
}

/**
 * Execute a query and return first result
 */
export async function queryOne<T = any>(
  sql: string,
  params?: any[]
): Promise<T | null> {
  const results = await query<T>(sql, params);
  return results[0] || null;
}

/**
 * Execute an insert query and return insert ID
 */
export async function insert(sql: string, params?: any[]): Promise<number> {
  const connectionPool = getPool();
  const [result] = await connectionPool.execute(sql, params);
  return (result as mysql.ResultSetHeader).insertId;
}

/**
 * Execute an update/delete query and return affected rows
 */
export async function execute(sql: string, params?: any[]): Promise<number> {
  const connectionPool = getPool();
  const [result] = await connectionPool.execute(sql, params);
  return (result as mysql.ResultSetHeader).affectedRows;
}

/**
 * Begin a transaction
 */
export async function beginTransaction(): Promise<mysql.PoolConnection> {
  const connectionPool = getPool();
  const connection = await connectionPool.getConnection();
  await connection.beginTransaction();
  return connection;
}

/**
 * Commit a transaction
 */
export async function commit(connection: mysql.PoolConnection): Promise<void> {
  await connection.commit();
  connection.release();
}

/**
 * Rollback a transaction
 */
export async function rollback(connection: mysql.PoolConnection): Promise<void> {
  await connection.rollback();
  connection.release();
}

/**
 * Close database connection pool
 */
export async function closeDatabase(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

