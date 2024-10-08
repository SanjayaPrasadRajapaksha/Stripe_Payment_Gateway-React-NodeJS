import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import sequelize from './Config/db.config.js';
import checkoutRoutes from './Routes/checkout.routes.js';
import { updateOrderPaymentStatus } from './Services/checkout.service.js'; // Import the service to update payment

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api', checkoutRoutes);

// Handle Stripe success and cancel
app.get('/complete', async (req, res) => {
  const session_id = req.query.session_id;

  try {
    // Call the service to update the order payment status
    await updateOrderPaymentStatus(session_id);

    res.send('Payment complete. Thank you for your purchase!');
  } catch (error) {
    console.error('Error completing payment:', error);
    res.status(500).send('Error completing payment.');
  }
});

app.get('/cancel', (req, res) => {
  res.send('Payment canceled. Please try again.');
});
sequelize.sync({ force: false }) // This will drop and recreate the table
  .then(() => {
    console.log('Database connected and synced.');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Error connecting to the database:', err));

// Sync Sequelize and start server
// sequelize.sync({ alter: true })
//   .then(() => {
//     console.log('Database connected and synced.');
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   })
//   .catch(err => console.error('Error connecting to the database:', err));
