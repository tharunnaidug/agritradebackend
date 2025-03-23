import Razorpay from 'razorpay'
import Payment from "../models/payment.model.js";


var instance = new Razorpay({ key_id: process.env.KEYID, key_secret: process.env.SECRET })

export const checkout = async (req, res) => {
    try {
        const { amount, shippingAddress, userId, items } = req.body;
        var options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };
        const order = await instance.orders.create(options);

        res.json({
            orderId: order.id,
            amount,
            shippingAddress,
            userId,
            items,
            paymentStatus: "created"
        });

    } catch (error) {
        console.error("Error in Razorpay Checkout:", error);
        res.status(500).json({ message: "Payment initialization failed", error });
    }
};


export const verifyPayment = async (req, res) => {
    const { orderId, paymentId, userId, shippingAddress, amount, items, signature } = req.body;

    let confirm = await Payment.create({
        orderId, paymentId, signature, amount, shippingAddress, userId, items, paymnetStatus: "paid"
    })

    res.json({ message: "success", confirm })
} 