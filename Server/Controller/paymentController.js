const Razorpay = require('razorpay')
const crypto   = require('crypto')
const { User, Product, Order } = require("../MongoConnect/All Schema/Schema")


const razorpay = new Razorpay({
    key_id:     process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// ── Create Razorpay order + save pending DB order ────────────────
exports.createOrder = async (req, res) => {
    try {
        const { orderDetails } = req.body
        const userId = req.userId

        if (!orderDetails?.items?.length) {
            return res.status(400).json({ error: 'Invalid order details' })
        }

        const user = await User.findById(userId)
        if (!user) return res.status(404).json({ error: 'User not found' })

        // Amount in paise (multiply by 100)
        const amountInPaise = Math.round(orderDetails.pricing.total * 100)

        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount:   amountInPaise,
            currency: 'INR',
            receipt:  `receipt_${Date.now()}`,
        })

        // Save order to DB with pending payment status
        const newOrder = new Order({
            items: orderDetails.items,
            pricing: orderDetails.pricing,
            shippingAddress: {
                name:    user.name,
                email:   user.email,
                address: user.location,
            },
            status:          'pending',
            paymentStatus:   'pending',
            razorpayOrderId: razorpayOrder.id,
            userId,
        })
        await newOrder.save()

        res.json({
            razorpayOrderId: razorpayOrder.id,
            orderId:         newOrder._id,
            amount:          amountInPaise,
            key:             process.env.RAZORPAY_KEY_ID,
        })
    } catch (err) {
        console.error('Create order error:', err)
        res.status(500).json({ error: 'Failed to create payment order' })
    }
}

// ── Verify Razorpay signature + mark order paid ──────────────────
exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            orderId,
        } = req.body

        // Verify signature
        const body      = razorpay_order_id + '|' + razorpay_payment_id
        const expected  = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex')

        if (expected !== razorpay_signature) {
            return res.status(400).json({ error: 'Invalid payment signature' })
        }

        // Mark order as paid
        await Order.findByIdAndUpdate(orderId, {
            paymentStatus:     'paid',
            razorpayPaymentId: razorpay_payment_id,
            status:            'accepted',
        })

        res.json({ message: 'Payment verified successfully!', isOrderPlaced: true })
    } catch (err) {
        console.error('Verify payment error:', err)
        res.status(500).json({ error: 'Payment verification failed' })
    }
}