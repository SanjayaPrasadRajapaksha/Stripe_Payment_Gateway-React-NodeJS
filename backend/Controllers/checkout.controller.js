import { createStripeSession } from '../Services/checkout.service.js';

export const checkout = async (req, res) => {
  try {
    const { items } = req.body;
    const sessionUrl = await createStripeSession(items);

    res.status(200).json({ sessionUrl });
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({ error: "Failed to create session" });
  }
};
