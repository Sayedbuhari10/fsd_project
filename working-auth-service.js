const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const port = 8081;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection - using exact working config
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'smart_energy_demo'
};

// Initialize database connection
async function initDatabase() {
  try {
    console.log('Connecting to database with config:', dbConfig);
    
    // First connect without database to create it
    const tempConfig = { ...dbConfig };
    delete tempConfig.database;
    const connection = await mysql.createConnection(tempConfig);
    console.log('✅ Database connected successfully');
    
    // Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    console.log('✅ Database created/exists');
    
    await connection.end();
    
    // Now connect directly to the database
    const dbConnection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to smart_energy_demo database');
    
    // Create users table
    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS user_account (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        display_name VARCHAR(255),
        role VARCHAR(100)
      )
    `);
    console.log('✅ Users table created/exists');
    
    // Create appliances table
    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS appliance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        name VARCHAR(255) NOT NULL,
        watts INT NOT NULL,
        status BOOLEAN DEFAULT TRUE
      )
    `);
    console.log('✅ Appliances table created/exists');
    
    // Insert demo user if not exists
    const [existingUsers] = await dbConnection.query(
      'SELECT * FROM user_account WHERE username = ?',
      ['demo.admin']
    );
    
    if (existingUsers.length === 0) {
      await dbConnection.query(
        'INSERT INTO user_account (username, password, display_name, role) VALUES (?, ?, ?, ?)',
        ['demo.admin', 'laragon123', 'Demo Admin', 'HOME_OWNER']
      );
      console.log('✅ Demo user created: demo.admin / laragon123');
    }
    
    await dbConnection.end();
    console.log('✅ Database initialization complete');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
}

// Routes
app.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt:', { username, password });
    
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database for login');
    
    const [users] = await connection.query(
      'SELECT * FROM user_account WHERE username = ? AND password = ?',
      [username, password]
    );
    
    await connection.end();
    
    if (users.length > 0) {
      const user = users[0];
      console.log('✅ Login successful for:', username);
      res.json({
        authenticated: true,
        user: {
          id: user.id,
          username: user.username,
          displayName: user.display_name,
          role: user.role
        },
        message: 'Login successful'
      });
    } else {
      console.log('❌ Login failed for:', username);
      res.status(401).json({
        message: 'Invalid username or password'
      });
    }
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/auth/logout', (req, res) => {
  res.status(204).send();
});

// Simulation service endpoints
app.get('/simulation/appliances/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Getting appliances for user:', userId);
    
    const connection = await mysql.createConnection(dbConfig);
    await connection.changeUser({ database: dbConfig.database });
    
    const [appliances] = await connection.query(
      'SELECT * FROM appliance WHERE user_id = ?',
      [userId]
    );
    
    await connection.end();
    console.log('✅ Retrieved appliances:', appliances.length);
    res.json(appliances);
  } catch (error) {
    console.error('❌ Get appliances error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/simulation/appliances', async (req, res) => {
  try {
    const { userId, name, watts } = req.body;
    console.log('Adding appliance:', { userId, name, watts });
    
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database for appliance addition');
    
    const [result] = await connection.query(
      'INSERT INTO appliance (user_id, name, watts, status) VALUES (?, ?, ?, ?)',
      [userId, name, watts, true]
    );
    
    await connection.end();
    
    console.log('✅ Added appliance with ID:', result.insertId);
    res.json({
      id: result.insertId,
      userId,
      name,
      watts,
      status: true
    });
  } catch (error) {
    console.error('❌ Add appliance error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start server
app.listen(port, async () => {
  console.log(`🚀 Working auth service running on port ${port}`);
  await initDatabase();
});
