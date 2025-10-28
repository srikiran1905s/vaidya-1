const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('🔍 Testing MongoDB Connection...\n');
console.log('📍 Connection String:', process.env.MONGODB_URI ? 'Found ✓' : 'Missing ✗');
console.log('🔗 Database URL:', process.env.MONGODB_URI?.replace(/:[^:@]+@/, ':****@') || 'N/A');
console.log('\n⏳ Attempting to connect...\n');

const testConnection = async () => {
  try {
    // Set a timeout for the connection attempt
    const connectionPromise = mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
    });

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout after 10 seconds')), 10000)
    );

    await Promise.race([connectionPromise, timeoutPromise]);

    console.log('✅ MongoDB Connection SUCCESSFUL!\n');
    console.log('📊 Database Details:');
    console.log('   - Name:', mongoose.connection.name);
    console.log('   - Host:', mongoose.connection.host);
    console.log('   - Port:', mongoose.connection.port || 'N/A (Atlas)');
    console.log('   - Ready State:', mongoose.connection.readyState, '(1 = Connected)');
    
    // Test a simple operation
    console.log('\n🧪 Testing database operations...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('   - Collections found:', collections.length);
    collections.forEach(col => console.log('     •', col.name));

    console.log('\n🎉 All tests passed! MongoDB is working correctly.\n');
    
  } catch (error) {
    console.error('❌ MongoDB Connection FAILED!\n');
    console.error('💥 Error Details:');
    console.error('   - Type:', error.name);
    console.error('   - Message:', error.message);
    
    if (error.message.includes('Authentication failed')) {
      console.error('\n🔐 Authentication Issue:');
      console.error('   - Check username and password in connection string');
      console.error('   - Verify database user exists in MongoDB Atlas');
    } else if (error.message.includes('Network') || error.message.includes('timeout')) {
      console.error('\n🌐 Network Issue:');
      console.error('   - Check your internet connection');
      console.error('   - Verify IP whitelist in MongoDB Atlas (allow 0.0.0.0/0 for testing)');
      console.error('   - Check if cluster is paused in MongoDB Atlas');
    } else if (error.message.includes('Invalid connection string')) {
      console.error('\n⚠️  Connection String Issue:');
      console.error('   - Verify MONGODB_URI format in .env file');
      console.error('   - Should be: mongodb+srv://user:pass@cluster.mongodb.net/dbname');
    }
    
    console.error('\n');
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Connection closed.');
    process.exit(0);
  }
};

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Error:', error.message);
  process.exit(1);
});

// Run the test
testConnection();
