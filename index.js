const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./src/config/db');
const session = require('express-session');
const { authRouter, googleAuthRouter } = require('./src/routes/auth.route');
const passport = require('./src/config/passport');

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['VERSION', 'SECRET_KEY', 'PORT', 'MONGO_URI', 'CLIENT_URL'];
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
});

const app = express();

const version = process.env.VERSION;

connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'strict'
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());


app.use(`/api/${version}/auth`, authRouter);
app.use(`/auth`, googleAuthRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { app };