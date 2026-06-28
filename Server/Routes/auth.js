const express = require('express');
const router = express.Router();
const authController = require('../Controller/authController');
const adminController = require('../Controller/adminController');
const vendorController = require('../Controller/vendorController');
const deliveryController = require('../Controller/deliveryController');
const paymentController = require('../Controller/paymentController');
const { googleLogin } = require('../Controller/Google/googleLogin');
const varifyToken = require('../Middleware/tokenMiddleware');
const { authorize } = require('../Middleware/authorization');
const upload = require('../Middleware/multer');
const verifyToken = require('../Middleware/tokenMiddleware');

const handleUpload = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ msg: err.message || 'Upload failed' })
    }
    next()
  })
}

router.post('/auth/signup', authController.userRegister);
router.post('/auth/login', authController.userLogin);
router.post('/google-login', googleLogin);
router.post('/updatelocation', varifyToken, authController.updateLocation);
router.get('/namelocation', varifyToken, authController.getNameAndLocation);
router.get('/logout', varifyToken, authController.userLogout);
router.get('/api/products', authController.getAllProducts);
router.post('/cartitem', varifyToken, authController.getCartItem);
router.post('/placeOrder', varifyToken, authController.getOrderDetails);

router.get('/admin', varifyToken, authorize("admin"), adminController.adminAccess);
router.get('/admin/stats', verifyToken, authorize("admin"), adminController.getStats)
router.get('/admin/recent-orders', verifyToken, authorize("admin"), adminController.getRecentOrders)
router.get('/admin/users', verifyToken, authorize("admin"), adminController.getUsersByRole)
router.get('/admin/products', verifyToken, authorize("admin"), adminController.getAllProducts)

router.get('/vendor', varifyToken, authorize("vendor"), vendorController.vendorAccess);
router.get('/vendor/all-orders', varifyToken, authorize("vendor"), vendorController.allOrders);
router.post('/vendor/add_product', verifyToken, handleUpload, authorize("vendor"), vendorController.vendorAddProduct);
router.post('/vendor/update-order-status', verifyToken, authorize("vendor"), vendorController.updateOrderStatus)

router.post('/payment/create-order', verifyToken, paymentController.createOrder);
router.post('/payment/verify', verifyToken, paymentController.verifyPayment);

router.get('/delivery-partner', varifyToken, authorize("deliverypartner"), deliveryController.deliveryPartnerAccess);

module.exports = router;
