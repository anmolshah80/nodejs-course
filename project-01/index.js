const express = require('express');

const { connectMongoDB } = require('./connection');

const { logRequestDetails } = require('./middlewares');

const userRouter = require('./routes/user');

const app = express();

const PORT = process.env.PORT || 8000;

// Connection
connectMongoDB('mongodb://127.0.0.1:27017/youtube-app-1')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('Mongo error: ', err));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(logRequestDetails('log.txt'));

app.get('/', (req, res) => {
  res.send('Welcome to the Home Page!');
});

// Routes
app.use(['/api/users', '/users'], userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
