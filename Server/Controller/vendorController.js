const { Product, Order, User } = require("../MongoConnect/All Schema/Schema")

exports.vendorAccess = (req, res) => {
    res.json({ message: 'hello vendor' })
}

exports.vendorAddProduct = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({ msg: 'Image file is required' })
        }

        // console.log(req.body)
        // console.log(req.file);

        const { productName, category, brand, unit, sellingPrice, mrp, stockQuantity, minOrderQuantity, description, status } = req.body;

        if (!productName?.trim()) return res.status(400).json({ msg: 'Product name is required' });
        if (!category) return res.status(400).json({ msg: 'Category is required' });
        if (!sellingPrice) return res.status(400).json({ msg: 'Price is required' });

        const product = new Product({
            name: productName.trim(),
            brand: brand || '',
            description: description || '',
            imgSrc: req.file.path,
            price: Number(sellingPrice),
            mrp: Number(mrp) || Number(sellingPrice),
            category,
            stock: Number(stockQuantity),
            minOrderQuantity: Number(minOrderQuantity) || 1,
            weight: unit,
            status: status || 'active',
            vendor: req.userId,
        });

        await product.save()

        return res.json({ msg: 'Image Uploaded Successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            msg: 'Server error',
            error: err.message,
        })
    }
}

exports.allOrders = async (req, res) => {
    try {
        const userId = req.userId;
        const vendor = await User.findById(userId);
        const numberOfUsers = await User.countDocuments({ role: 'user' });
        const order = await Order.find();
        res.json({ order: order, vendor: vendor, numberOfUsers: numberOfUsers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body

        const validStatuses = ['accepted', 'packed', 'out for delivery', 'delivered', 'cancelled']
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' })
        }

        const order = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        )

        if (!order) return res.status(404).json({ error: 'Order not found' })

        res.json({ message: 'Status updated', order })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }
}