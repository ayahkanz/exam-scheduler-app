const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'ujian_mahasiswa',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'your_password',
};

const pool = new Pool(dbConfig);

async function seedData() {
  const client = await pool.connect();
  
  try {
    console.log('Starting to seed database...');
    
    // Read seed data file
    const seedFilePath = path.join(__dirname, '002_seed_data.sql');
    
    if (!fs.existsSync(seedFilePath)) {
      console.log('No seed data file found. Skipping...');
      return;
    }
    
    const seedSQL = fs.readFileSync(seedFilePath, 'utf8');
    
    console.log('Executing seed data...');
    await client.query(seedSQL);
    
    console.log('✅ Database seeded successfully');
    
    // Verify seeded data
    const roomCount = await client.query('SELECT COUNT(*) FROM ruang');
    const courseCount = await client.query('SELECT COUNT(*) FROM matakuliah');
    const studentCount = await client.query('SELECT COUNT(*) FROM mahasiswa');
    
    console.log(`📊 Seeded data summary:`);
    console.log(`   - Rooms: ${roomCount.rows[0].count}`);
    console.log(`   - Courses: ${courseCount.rows[0].count}`);
    console.log(`   - Students: ${studentCount.rows[0].count}`);
    
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedData()
    .then(() => {
      console.log('Seeding process completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding process failed:', error);
      process.exit(1);
    });
}

module.exports = { seedData }; 