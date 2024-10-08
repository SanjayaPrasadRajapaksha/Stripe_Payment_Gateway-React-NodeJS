import express from 'express';
import { checkout } from '../Controllers/checkout.controller.js';

const router = express.Router();

router.post('/checkout', checkout);

export default router;
