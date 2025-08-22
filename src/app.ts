import { middleware } from '#middlewares/middlewares.js';
import express from 'express';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', middleware, (req, res) => {
  res.json({ message: 'Hello World!' });
});

export default app;
