const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
require('dotenv').config();

const connectDB = require('./db');

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

require('./passport-setup'); // Passport strategies setup

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS allowing frontend origin (adjust as needed)
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

app.use(express.json());

// If you choose to use sessions for Passport (optional for JWT)
// app.use(session({
//   secret: process.env.SESSION_SECRET || 'secret',
//   resave: false,
//   saveUninitialized: false,
// }));

app.use(passport.initialize());
// app.use(passport.session()); // If using sessions

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

app.use(errorMiddleware);

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });
