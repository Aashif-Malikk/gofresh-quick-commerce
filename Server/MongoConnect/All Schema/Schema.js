const { default: mongoose } = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, default: '' },
        imgSrc: { type: String, required: true },
        price: { type: Number, default: 1 },
        category: { type: String, default: 'Other' },
        stock: { type: Number, default: 0 },
        weight: { type: String, default: '' },
        status: { type: String, default: 'active' },
        brand: { type: String, default: '' },
        mrp: { type: Number, default: 0 },
        minimumOrderQuantity: { type: Number, default: 1 },
        vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
)

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, },
        email: { type: String, unique: true, required: true, lowercase: true },
        password: { type: String, required: true },
        role: { type: String, default: 'user' },
        isloggedin: { type: Boolean, default: false },
        location: { type: String, default: 'Add your location' },
    },
    { timestamps: true }
);

const orderSchema = new mongoose.Schema(
    {
        items: [
            {
                id: { type: String, required: true },
                name: { type: String, required: true },
                quantity: { type: Number, required: true },
                weight: { type: String, required: true },
                price: { type: Number, required: true },
                mrp: { type: Number, required: true },
                imgSrc: { type: String, required: true },
                inStock: { type: Boolean, required: true }
            }
        ],
        pricing: {
            subtotal: { type: Number, required: true },
            savings: { type: Number, required: true },
            total: { type: Number, required: true },
        },

        shippingAddress: {
            name: { type: String, required: true },
            email: { type: String, required: true },
            address: { type: String, required: true }
        },
        status: { type: String, default: 'pending' },
        paymentStatus: { type: String, default: 'pending', enum: ['pending', 'paid', 'failed'] },
        razorpayOrderId: { type: String },
        razorpayPaymentId: { type: String },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

module.exports = {
    User: mongoose.model("User", userSchema),
    Product: mongoose.model("Product", productSchema),
    Order: mongoose.model("Order", orderSchema)
}
// module.exports = mongoose.model('User', userSchema);
