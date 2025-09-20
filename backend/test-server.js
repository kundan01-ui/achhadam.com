const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Test server is running!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/auth/send-otp', (req, res) => {
  res.json({ 
    success: true, 
    message: 'OTP endpoint is working!',
    phone: req.body.phone || 'test'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 OTP endpoint: http://localhost:${PORT}/api/auth/send-otp`);
});











