const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME || 'ujian_mahasiswa',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

async function runMigrations() {
  const pool = mysql.createPool(dbConfig);
  const connection = await pool.getConnection();
  
  try {
    console.log('Starting database migrations...');
    
    // Read migration files
    const migrationsDir = path.join(__dirname);
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    console.log(`Found ${migrationFiles.length} migration files`);
    
    for (const file of migrationFiles) {
      console.log(`Running migration: ${file}`);
      const migrationPath = path.join(migrationsDir, file);
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
      
      try {
        // Split SQL by semicolon and execute each statement
        const statements = migrationSQL.split(';').filter(stmt => stmt.trim());
        for (const statement of statements) {
          if (statement.trim()) {
            await connection.execute(statement);
          }
        }
        console.log(`✅ Successfully executed: ${file}`);
      } catch (error) {
        console.error(`❌ Failed to execute ${file}:`, error.message);
        // Continue with other migrations even if one fails
      }
    }
    
    console.log('✅ All migrations completed');
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    connection.release();
    await pool.end();
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('Migration process completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration process failed:', error);
      process.exit(1);
    });
}

module.exports = { runMigrations }; 