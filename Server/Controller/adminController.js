const { User, Product, Order } = require("../MongoConnect/All Schema/Schema")


exports.adminAccess = (req, res) => {
    res.json({ message: 'hello admin' })
}


exports.getStats = async (req, res) => {
    try {
        const [
            totalOrders,
            totalCustomers,
            totalVendors,
            allOrders,
        ] = await Promise.all([
            Order.countDocuments(),
            User.countDocuments({ role: 'user' }),
            User.countDocuments({ role: 'vendor' }),
            Order.find().select('pricing.total status'),
        ])

        const totalRevenue = allOrders.reduce((acc, o) => acc + (o.pricing?.total || 0), 0)

        const ordersByStatus = {
            pending: allOrders.filter(o => o.status === 'pending').length,
            accepted: allOrders.filter(o => o.status === 'accepted').length,
            packed: allOrders.filter(o => o.status === 'packed').length,
            outForDelivery: allOrders.filter(o => o.status === 'out for delivery').length,
            delivered: allOrders.filter(o => o.status === 'delivered').length,
            cancelled: allOrders.filter(o => o.status === 'cancelled').length,
        }

        res.json({
            totalRevenue,
            totalOrders,
            totalCustomers,
            totalVendors,
            ordersByStatus,
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal server error' })
    }
}

exports.getRecentOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })   // newest first
            .limit(10)
            .populate('userId', 'name email')  // get customer name from User

        res.json({ orders })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal server error' })
    }
}

exports.getUsersByRole = async (req, res) => {
    try {
        const { role } = req.query  // ?role=user OR ?role=vendor OR ?role=deliverypartner

        const validRoles = ['user', 'vendor', 'deliverypartner']
        if (!role || !validRoles.includes(role)) {
            return res.status(400).json({ error: 'Invalid or missing role' })
        }

        const users = await User.find({ role })
            .select('name email location createdAt isActive')
            .sort({ createdAt: -1 })

        res.json({ users })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal server error' })
    }
}

exports.getAllProducts = async (req, res) => {
    try {
        const { search, category, status, page = 1, limit = 10 } = req.query

        const query = {}

        if (search) {
            query.$or = [
                { name:     { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
            ]
        }

        if (category && category !== 'All Categories') {
            query.category = category
        }

        if (status && status !== 'All Status') {
            if (status === 'Active')       query.stock = { $gt: 10 }
            if (status === 'Low Stock')    query.stock = { $gt: 0, $lte: 10 }
            if (status === 'Out of Stock') query.stock = 0
        }

        const skip  = (parseInt(page) - 1) * parseInt(limit)
        const total = await Product.countDocuments(query)

        const products = await Product.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('vendor', 'name')  // get vendor name — adjust field name if different

        // derive status from stock
        const formatted = products.map(p => ({
            _id:           p._id,
            name:          p.name,
            category:      p.category,
            vendor:        p.vendor?.name || 'Unknown',
            price:         p.price,
            mrp:           p.mrp,
            stock:         p.stock ?? 0,
            imgSrc:        p.imgSrc,
            weight:        p.weight,
            createdAt:     p.createdAt,
            status: p.stock === 0 ? 'Out of Stock'
                  : p.stock <= 10 ? 'Low Stock'
                  : 'Active',
        }))

        res.json({ products: formatted, total, page: parseInt(page), limit: parseInt(limit) })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal server error' })
    }
}