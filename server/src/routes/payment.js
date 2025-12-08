import express from "express";

import {midtransWebhook} from "../api/payment/webhook.js";

const paymentRouter = express.Router();

paymentRouter.post('/notification', midtransWebhook);

export default paymentRouter;
