import express from "express";

import {MidtransWebhook} from "../api/payment/webhook.js";

const paymentRouter = express.Router();

paymentRouter.post('/notification', MidtransWebhook);

export default paymentRouter;
