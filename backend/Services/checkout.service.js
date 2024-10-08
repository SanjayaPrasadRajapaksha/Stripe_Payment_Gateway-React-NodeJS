// checkout.service.js
import stripeLib from 'stripe';
import dotenv from 'dotenv';
import { createOrder, updateOrderStatus } from '../Repositories/order.repository.js';

dotenv.config();
const stripe = stripeLib(process.env.STRIPE_SECRET_KEY);

export const createStripeSession = async (items) => {
  const lineItems = items.map(item => ({
    price_data: {
      currency: item.currency,
      product_data: { name: item.name },
      unit_amount: item.amount * 100,
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.BASE_URL}/complete?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.BASE_URL}/cancel`,
  });

  const orderPromises = items.map(async (item) => {
    const orderData = {
      product_name: item.name,
      amount: item.amount * item.quantity,
      currency: item.currency,
      quantity: item.quantity,
      status: 'pending',
      stripe_session_id: session.id,
    };
    return createOrder(orderData); // Use repository to create orders
  });

  await Promise.all(orderPromises);

  return session.url;
};

export const updateOrderPaymentStatus = async (session_id) => {
  const session = await stripe.checkout.sessions.retrieve(session_id);

  if (session.payment_status === 'paid') {
    await updateOrderStatus(session_id, 'paid'); // Use repository to update order status
  }
};
