const express = require('express');
// const userRoutes = require('./routes/userRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const aiRoutes = require('./routes/aiRoutes');
const testRoutes = require('./routes/testRoutes');

const app = express();

app.use(express.json());

// Routes
// app.use('/api/users', userRoutes); // example base route

// Root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/protected', protectedRoutes);
app.use('/api/openai', aiRoutes); 
app.use('/api/test', testRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global Error Handler (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;