// Database Configuration
const config = {
  postgresql: {
    uri: 'postgresql://neondb_owner:npg_Ozpa3sFKwS0d@ep-jolly-mode-a156f3rx-pooler.ap-southeast-1.aws.neon.tech/krishi1?sslmode=require&channel_binding=require',
    options: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  },
  mongodb: {
    uri: 'mongodb+srv://kamleshthink:Kamlesh%40%232005@cluster0.u1vgt.mongodb.net/krishi?retryWrites=true&w=majority&appName=Cluster0',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  server: {
    port: process.env.PORT || 3001,
    jwtSecret: 'achhadam_jwt_secret_key_2024_change_in_production',
    jwtExpiresIn: '7d',
    corsOrigin: 'http://localhost:5173'
  }
};

module.exports = config;
