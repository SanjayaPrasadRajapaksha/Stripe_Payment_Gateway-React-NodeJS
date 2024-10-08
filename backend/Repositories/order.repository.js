// order.repository.js
import Order from '../Models/order.model.js';

export const createOrder = async (orderData) => {
  try {
    const order = await Order.create(orderData);
    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const updateOrderStatus = async (session_id, status) => {
  try {
    const result = await Order.update(
      { status: status },
      { where: { stripe_session_id: session_id } }
    );
    return result;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};
