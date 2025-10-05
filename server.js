const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ Middleware
app.use(
  cors({
    origin: "https://growtech.vercel.app", // Your Vercel frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// ✅ Routes
app.use('/api/applications', require('./routes/applicationRoutes'));

// ✅ Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running!' });
});

// ✅ MongoDB connection
const mongoURI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/course_applications';

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((error) =>
    console.error('❌ MongoDB connection error:', error.message)
  );

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
