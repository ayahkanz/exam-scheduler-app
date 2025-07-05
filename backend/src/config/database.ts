import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME || 'ujian_mahasiswa',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0
};

// Create a new pool instance
const pool = mysql.createPool(dbConfig);

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT NOW() as test_time');
    connection.release();
    console.log('Database connection test successful:', (rows as any)[0]);
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
};

// Helper function to run migrations
export const runMigrations = async (): Promise<void> => {
  try {
    const connection = await pool.getConnection();
    
    // Read and execute migration files
    const fs = require('fs');
    const path = require('path');
    const migrationsDir = path.join(__dirname, '../../migrations');
    
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter((file: string) => file.endsWith('.sql'))
      .sort();
    
    for (const file of migrationFiles) {
      console.log(`Running migration: ${file}`);
      const migrationPath = path.join(migrationsDir, file);
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
      
      // Split SQL by semicolon and execute each statement
      const statements = migrationSQL.split(';').filter((stmt: string) => stmt.trim());
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            await connection.execute(statement);
          } catch (error: any) {
            // Skip duplicate key errors (indexes already exist)
            if (error.code === 'ER_DUP_KEYNAME') {
              console.log(`Skipping duplicate index: ${error.sqlMessage}`);
              continue;
            }
            throw error;
          }
        }
      }
    }
    
    connection.release();
    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};

export default pool; 