import React, { useState } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_your_stripe_public_key');

const CheckoutForm = () => {
  const [items, setItems] = useState([
    { name: '', currency: 'usd', amount: 0, quantity: 0 },  // Set default values to 0
  ]);

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...items];
    updatedItems[index][name] = value;
    setItems(updatedItems);
  };

  const handleAddItem = () => {
    setItems([...items, { name: '', currency: 'usd', amount: 0, quantity: 0 }]);  // New items also start from 0
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    const stripe = await stripePromise;

    try {
      const response = await axios.post('http://localhost:5000/api/checkout', { items });
      const { sessionUrl } = response.data;
      window.location.href = sessionUrl; // Redirect to Stripe checkout
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Checkout Form</h2>
      <form onSubmit={handleCheckout}>
        {items.map((item, index) => (
          <div key={index} className="mb-3">
            <h5>Item {index + 1}</h5>
            <div className="mb-3">
              <label htmlFor={`name-${index}`} className="form-label">Product Name</label>
              <input
                type="text"
                className="form-control"
                id={`name-${index}`}
                name="name"
                value={item.name}
                onChange={(e) => handleInputChange(index, e)}
                placeholder="Enter product name"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor={`amount-${index}`} className="form-label">Amount (in USD)</label>
              <input
                type="number"
                className="form-control"
                id={`amount-${index}`}
                name="amount"
                value={item.amount}
                onChange={(e) => handleInputChange(index, e)}
                placeholder="Enter amount"
                min="0"  // Set minimum value to 0
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor={`quantity-${index}`} className="form-label">Quantity</label>
              <input
                type="number"
                className="form-control"
                id={`quantity-${index}`}
                name="quantity"
                value={item.quantity}
                onChange={(e) => handleInputChange(index, e)}
                placeholder="Enter quantity"
                min="0"  // Set minimum value to 0
                required
              />
            </div>
            <hr />
          </div>
        ))}
        <button type="button" className="btn btn-secondary mb-3" onClick={handleAddItem}>
          Add Another Item
        </button>
        <button type="submit" className="btn btn-primary">Proceed to Checkout</button>
      </form>
    </div>
  );
};

export default CheckoutForm;
