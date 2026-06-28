const { User, Product, Order } = require("../MongoConnect/All Schema/Schema")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretkey = process.env.SECRET_KEY;

exports.userLogin = async (req, res) => {
    try {
        let { email, password } = req.body
        let userfound = await User.findOne({ email })

        if (userfound) {
            try {
                const passwordMatch = await bcrypt.compare(password, userfound.password);
                if (!passwordMatch) {
                    return res.status(401).json({ error: 'Wrong Password' });
                }

                const token = jwt.sign({ userId: userfound._id, name: userfound.name, role: userfound.role }, secretkey, {
                    expiresIn: '7d',
                });

                res.cookie('token', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });

                userfound.isloggedin = true;
                await userfound.save();

                return res.status(200).json({ token, message: 'Login successful', user: userfound });
            } catch (error) {
                return res.status(500).json({ error: 'Login failed' });
            }
        } else {
            return res.status(401).json({ error: 'Authentication failed' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({
            msg: "Validation Error",
            error: error.message
        });
    }
}

exports.userRegister = async (req, res) => {
    const { name, email, password, role } = req.body
    let userfound = await User.findOne({ email })
    if (userfound) {
        res.send({ message: "User already exists!" })
    } else {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const newuser = new User({ name: name, email, password: hashedPassword, role: role || 'user', isloggedin: false, location: 'Add your location' });
            await newuser.save();
            res.send({ message: "User registered successfully!" })
        } catch (error) {
            console.error(error);
            res.send({ message: "Registration failed!" });
        }
    }
}


exports.getNameAndLocation = async (req, res) => {
    try {
        const userId = req.userId
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ name: user.name, location: user.location, isloggedin: user.isloggedin });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.userLogout = async (req, res) => {
    try {
        const userId = req.userId
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.isloggedin = false;
        await user.save();
        res.clearCookie('token');
        res.json({ message: 'Logout successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.updateLocation = async (req, res) => {
    try {
        const userId = req.userId
        const { location } = req.body
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.location = location;
        await user.save();
        res.json({ message: 'Location updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
        res.json({ products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.getCartItem = async (req, res) => {
    try {
        const { cartItemId } = req.body;

        if (!cartItemId || !Array.isArray(cartItemId) || cartItemId.length === 0) {
            return res.status(200).json({ cartItems: [] });
        }

        const cartItems = await Product.find({ _id: { $in: cartItemId } });

        const formatted = cartItems.map(product => ({
            id: product._id,
            name: product.name,
            weight: product.weight,
            price: product.price,
            mrp: product.mrp || (product.price * 1.1),
            quantity: 1,
            imgSrc: product.imgSrc,
            inStock: product.stock > 0
        }))

        return res.status(200).json({ cartItems: formatted })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.getOrderDetails = async (req, res) => {
    try {
        const { orderDetails } = req.body;
        const userId = req.userId
        const user = await User.findById(userId)

        if (!orderDetails) {
            return res.status(400).json({ error: 'Invalid order details' });
        }

        const placeOrder = new Order({
            items: orderDetails.items,
            pricing: orderDetails.pricing,
            shippingAddress: {
                name: user.name,
                email: user.email,
                address: user.location
            },
            status: 'pending',
            userId: req.userId
        });

        await placeOrder.save();
        res.json({ message: 'Order placed successfully', isPlacedOrder: true });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
