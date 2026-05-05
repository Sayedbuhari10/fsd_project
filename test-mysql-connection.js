const mysql = require('mysql2/promise');

async function testConnection() {
  const possibleConfigs = [
    { host: 'localhost', port: 3306, user: 'root', password: '' },
    { host: 'localhost', port: 3306, user: 'root', password: 'root' },
    { host: 'localhost', port: 3306, user: 'root', password: 'laragon' },
    { host: 'localhost', port: 3306, user: 'root', password: 'password' },
    { host: '127.0.0.1', port: 3306, user: 'root', password: '' },
    { host: '127.0.0.1', port: 3306, user: 'root', password: 'root' },
  ];

  for (const config of possibleConfigs) {
    try {
      console.log(`Testing connection with: ${JSON.stringify(config)}`);
      const connection = await mysql.createConnection(config);
      await connection.ping();
      console.log(`✅ SUCCESS: Connected with config: ${JSON.stringify(config)}`);
      
      // Test creating database
      await connection.query('CREATE DATABASE IF NOT EXISTS smart_energy_demo');
      console.log('✅ Database created/exists');
      
      await connection.end();
      return config;
    } catch (error) {
      console.log(`❌ FAILED: ${error.message}`);
    }
  }
  
  throw new Error('Could not connect to MySQL with any configuration');
}

testConnection().then(config => {
  console.log('\n🎉 Working configuration found:', config);
  process.exit(0);
}).catch(error => {
  console.error('\n💥 No working configuration found:', error.message);
  process.exit(1);
});
