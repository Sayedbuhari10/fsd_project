const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const port = 8081;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection - try common Laragon passwords
const possiblePasswords = ['', 'root', 'laragon', 'password'];

async function createDatabaseConnection() {
  for (const password of possiblePasswords) {
    try {
      const connection = await mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: password
      });
      console.log(`Connected to MySQL with password: "${password}"`);
      return { connection, password };
    } catch (error) {
      console.log(`Failed with password "${password}": ${error.message}`);
    }
  }
  throw new Error('Could not connect to MySQL with any common password');
}

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
    const connection = await mysql.createConnection(dbConfig);
    
    // Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    
    // Switch to database
    await connection.changeUser({ database: dbConfig.database });
    
    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS user_account (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        display_name VARCHAR(255),
        role VARCHAR(100)
      )
    `);
    
    // Create appliances table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS appliance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        name VARCHAR(255) NOT NULL,
        watts INT NOT NULL,
        status BOOLEAN DEFAULT TRUE
      )
    `);
    
    // Insert demo user if not exists
    const [existingUsers] = await connection.query(
      'SELECT * FROM user_account WHERE username = ?',
      ['demo.admin']
    );
    
    if (existingUsers.length === 0) {
      await connection.query(
        'INSERT INTO user_account (username, password, display_name, role) VALUES (?, ?, ?, ?)',
        ['demo.admin', 'laragon123', 'Demo Admin', 'HOME_OWNER']
      );
      console.log('Demo user created: demo.admin / laragon123');
    }
    
    await connection.end();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Routes
app.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const connection = await mysql.createConnection(dbConfig);
    await connection.changeUser({ database: dbConfig.database });
    
    const [users] = await connection.query(
      'SELECT * FROM user_account WHERE username = ? AND password = ?',
      [username, password]
    );
    
    await connection.end();
    
    if (users.length > 0) {
      const user = users[0];
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
      res.status(401).json({
        message: 'Invalid username or password'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
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
    
    const connection = await mysql.createConnection(dbConfig);
    await connection.changeUser({ database: dbConfig.database });
    
    const [appliances] = await connection.query(
      'SELECT * FROM appliance WHERE user_id = ?',
      [userId]
    );
    
    await connection.end();
    res.json(appliances);
  } catch (error) {
    console.error('Get appliances error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/simulation/appliances', async (req, res) => {
  try {
    const { userId, name, watts } = req.body;
    
    const connection = await mysql.createConnection(dbConfig);
    await connection.changeUser({ database: dbConfig.database });
    
    const [result] = await connection.query(
      'INSERT INTO appliance (user_id, name, watts) VALUES (?, ?, ?)',
      [userId, name, watts]
    );
    
    await connection.end();
    
    res.json({
      id: result.insertId,
      userId,
      name,
      watts,
      status: true
    });
  } catch (error) {
    console.error('Add appliance error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start server
app.listen(port, async () => {
  console.log(`Simple auth service running on port ${port}`);
  await initDatabase();
});
