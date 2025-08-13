import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import checkoutRoutes from './routes/checkout.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import statementRoutes from './routes/statements.js';
import settingsRoutes from './routes/settings.js';

dotenv.config();

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/checkout', checkoutRoutes);
app.use('/orders', orderRoutes);
app.use('/statements', statementRoutes);
app.use('/settings', settingsRoutes);
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/shop';

if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(MONGO_URL)
    .then(() => {
      app.listen(PORT, () => console.log(`API running on ${PORT}`));
    })
    .catch((err) => console.error(err));
}

export default app;
