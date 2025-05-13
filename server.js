require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/dbConn');
const path = require('path');

// Initialize the Express app
const app = express();
// Port from env or default to 3000
const PORT = process.env.PORT || 3000;

// Establish database connection
connectDB();

// Enable CORS for cross-origin requests
app.use(cors());

// Middleware: parse incoming JSON bodies
app.use(express.json());

// Serve static assets: HTML, CSS, JS under /public
app.use(express.static(path.join(__dirname, 'public')));

// Root route: simple landing page or index.html
app.get('/', (req, res) => {
  // If serving a file:
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Mount the states API router at /states
const statesRouter = require('./routes/states');
app.use('/states', statesRouter);

// 404 handler: for any unmatched route
app.use((req, res) => {
  if (req.accepts('html')) {
    // HTML response
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
  } else if (req.accepts('json')) {
    // JSON error
    res.status(404).json({ error: '404 Not Found' });
  } else {
    // Plain text fallback
    res.status(404).type('txt').send('404 Not Found');
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
