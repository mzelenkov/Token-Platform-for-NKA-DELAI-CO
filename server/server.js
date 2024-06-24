const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const redis = require('redis');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const SESSION_SECRET = process.env.SESSION_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;
const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(helmet());
app.use(morgan('combined'));
app.use(compression());

// Session store setup
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});

store.on('error', (error) => {
  console.error('Session store error:', error);
});

// Session middleware
app.use(session({
  secret: SESSION_SECRET,
  store: store,
  resave: false,
  saveUninitialized: false,
}));

// Redis client setup
const redisClient = redis.createClient({
  host: REDIS_HOST,
  port: REDIS_PORT,
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (error) => {
  console.error('Redis connection error:', error);
});

// Routes
const authRoutes = require('./routes/authRoutes');
const tokenRoutes = require('./routes/tokenRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/token', tokenRoutes);

// HTTPS setup (optional)
const httpsOptions = {
  key: fs.readFileSync(path.resolve(__dirname, 'certificates', 'key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, 'certificates', 'cert.pem')),
};

https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`Server is running on https://localhost:${PORT}`);
});

// MongoDB connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;