import React, { useState } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_your_stripe_public_key');

const CheckoutForm = () => {
  const [items] = useState([
    { name: 'Node.js and Express book', currency: 'usd', amount: 50, quantity: 1 },
    { name: 'JavaScript T-Shirt', currency: 'usd', amount: 20, quantity: 2 },
  ]);

  const handleCheckout = async (e) => {
    e.preventDefault();
    const stripe = await stripePromise;

    try {
      const response = await axios.post('http://localhost:5000/api/checkout', { items });
    
      const { sessionUrl } = response.data;
  
      // Redirect to Stripe checkout
      window.location.href = sessionUrl;
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  return (
    <form onSubmit={handleCheckout}>
      <h1>Shopping Cart</h1>
      {items.map((item, index) => (
        <div key={index}>
          <h3>{item.name}</h3>
          <p>Price: ${item.amount}.00</p>
          <p>Quantity: {item.quantity}</p>
        </div>
      ))}
      <button type="submit">Proceed to Checkout</button>
    </form>
  );
};

export default CheckoutForm;
