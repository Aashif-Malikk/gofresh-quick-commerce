<div align="center">

<img src="https://img.shields.io/badge/GoFresh-Quick%20Commerce-10b981?style=for-the-badge&logo=leaflet&logoColor=white" alt="GoFresh" height="40"/>

# 🛒 GoFresh — Quick Commerce Platform

### *Groceries delivered in 15 minutes*

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payments-0C71C3?style=flat-square&logo=razorpay&logoColor=white)](https://razorpay.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

<br/>

> GoFresh is a full-stack **Q-Commerce platform** inspired by Blinkit and Zepto —
> built with React, Node.js, MongoDB, Razorpay, and Cloudinary.

<br/>

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Screenshots](#-project-structure) • [Roadmap](#-upcoming-features)

</div>

---

## 🌟 What is GoFresh?

GoFresh is a **production-ready quick commerce platform** that brings together everything needed for modern instant grocery delivery — a clean storefront for customers, powerful dashboards for vendors and admins, and a streamlined flow for delivery partners.

```
Customer shops → Vendor packs → Delivery partner delivers → Done in 15 mins
```

---

## ✨ Features

### 👤 Customer
| Feature | Status |
|---|---|
| JWT Authentication | ✅ |
| Google OAuth Login | ✅ |
| Browse Products & Categories | ✅ |
| Search Products | ✅ |
| Smart Shopping Cart (Zustand) | ✅ |
| Razorpay Payment Integration | ✅ |
| Order Placement & History | ✅ |
| Location Management | ✅ |
| Responsive Mobile UI | ✅ |

### 🛍️ Vendor
| Feature | Status |
|---|---|
| Product Management | ✅ |
| Image Upload via Cloudinary | ✅ |
| Inventory Management | ✅ |
| Order Processing & Status Updates | ✅ |
| Sales Dashboard with Charts | ✅ |

### 🛠️ Admin
| Feature | Status |
|---|---|
| Manage Users / Vendors / Delivery Partners | ✅ |
| Manage Products & Categories | ✅ |
| Manage All Orders | ✅ |
| Platform Analytics Dashboard | ✅ |
| Role-based Access Control | ✅ |

### 🚚 Delivery Partner
| Feature | Status |
|---|---|
| View Assigned Orders | ✅ |
| Delivery Status Updates | ✅ |
| Earnings Dashboard | ✅ |
| Delivery History | ✅ |

---

## 🛠️ Tech Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                        GoFresh Architecture                      │
├─────────────────┬───────────────────────────────────────────────┤
│   FRONTEND      │   React 18 + Vite                             │
│                 │   React Router v6  (client-side routing)       │
│                 │   Zustand          (global state)              │
│                 │   Tailwind CSS     (styling)                   │
│                 │   Recharts         (data visualization)        │
│                 │   Iconsax React    (icons)                     │
├─────────────────┼───────────────────────────────────────────────┤
│   BACKEND       │   Node.js + Express.js                        │
│                 │   JWT              (authentication)            │
│                 │   Google OAuth 2.0 (social login)              │
│                 │   Multer           (file handling)             │
├─────────────────┼───────────────────────────────────────────────┤
│   DATABASE      │   MongoDB + Mongoose                          │
├─────────────────┼───────────────────────────────────────────────┤
│   PAYMENTS      │   Razorpay (test + production ready)          │
├─────────────────┼───────────────────────────────────────────────┤
│   MEDIA         │   Cloudinary (image upload + optimization)    │
└─────────────────┴───────────────────────────────────────────────┘
```

---

## 🔄 How It Works

```
                        ┌──────────────┐
                        │   Customer   │
                        └──────┬───────┘
                               │ Browse & Add to Cart
                               ▼
                        ┌──────────────┐
                        │  GoFresh App │
                        └──────┬───────┘
                               │ Checkout
                               ▼
                        ┌──────────────┐
                        │   Razorpay   │  ◄── Secure Payment
                        └──────┬───────┘
                               │ Payment Verified
                               ▼
                        ┌──────────────┐
                        │    Vendor    │  ◄── Gets notified
                        └──────┬───────┘
                               │ Packs order
                               ▼
                        ┌──────────────┐
                        │   Delivery   │  ◄── Picks up
                        │   Partner    │
                        └──────┬───────┘
                               │ Delivered ✅
                               ▼
                        ┌──────────────┐
                        │   Customer   │  ◄── Order received
                        └──────────────┘
```

---

## 📊 Platform At a Glance

```
Roles in GoFresh
─────────────────────────────────────────
  👤 Customer          🛍️ Vendor
  ├── Shop             ├── Add Products
  ├── Cart             ├── Manage Stock
  ├── Pay              ├── Process Orders
  └── Track            └── View Analytics

  🛠️ Admin             🚚 Delivery Partner
  ├── All Users         ├── View Assignments
  ├── All Orders        ├── Update Status
  ├── Products          └── Track Earnings
  └── Analytics
```

---

## 📂 Project Structure

```
gofresh/
│
├── client/                        # React Frontend
│   ├── public/
│   └── src/
│       ├── components/            # Reusable UI components
│       │   ├── Loader/
│       │   ├── Nav/
│       │   └── AdminUsersTable/
│       ├── pages/
│       │   ├── user/              # Customer pages
│       │   │   ├── Home.jsx
│       │   │   ├── Cart.jsx
│       │   │   └── Orders.jsx
│       │   ├── vendor/            # Vendor dashboard
│       │   │   ├── VendorDashboard.jsx
│       │   │   ├── VendorOrders.jsx
│       │   │   └── VendorAddProducts.jsx
│       │   ├── admin/             # Admin dashboard
│       │   │   ├── AdminDashboard.jsx
│       │   │   ├── AdminCustomers.jsx
│       │   │   ├── AdminVendors.jsx
│       │   │   ├── AdminOrders.jsx
│       │   │   └── AdminAllProducts.jsx
│       │   └── delivery/          # Delivery partner
│       ├── utils/
│       │   ├── Zustand.js         # Global state
│       │   └── useAdminUsers.js   # Custom hook
│       └── auth/
│           ├── Login.jsx
│           └── Signup.jsx
│
└── server/                        # Node.js Backend
    ├── config/
    │   └── cloudinary.js
    ├── Controller/
    │   ├── authController.js
    │   ├── adminController.js
    │   ├── vendorController.js
    │   ├── deliveryController.js
    │   ├── paymentController.js
    │   └── Google/
    │       └── googleLogin.js
    ├── Middleware/
    │   ├── tokenMiddleware.js
    │   ├── authorization.js
    │   └── multer.js
    ├── MongoConnect/
    │   └── All Schema/
    │       └── Schema.js
    └── routes/
        └── auth.js
```

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have these installed:

- [Node.js](https://nodejs.org) v18+
- [MongoDB](https://mongodb.com) (local or Atlas)
- [Git](https://git-scm.com)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/gofresh-quick-commerce.git
cd gofresh-quick-commerce
```

### 2. Install Dependencies

```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `server/` folder:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/gofresh
# or MongoDB Atlas:
# MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/gofresh

# Authentication
JWT_SECRET=your_super_secret_key_here

# Razorpay (get from https://dashboard.razorpay.com)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx

# Cloudinary (get from https://cloudinary.com/console)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google OAuth (get from https://console.cloud.google.com)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Create a `.env` file inside the `client/` folder:

```env
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 4. Run the Project

```bash
# Start backend (from server/)
npm run dev

# Start frontend (from client/) — in a new terminal
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔐 Role-Based Access

| Role | Default Route | Access |
|---|---|---|
| `user` | `/` | Shop, cart, orders |
| `vendor` | `/vendor/dashboard` | Products, orders, analytics |
| `admin` | `/admin/dashboard` | Full platform control |
| `deliverypartner` | `/delivery-partner/dashboard` | Assigned deliveries |

> Roles are assigned at signup and enforced via JWT middleware on every protected route.

---

## 💳 Payment Flow

```
1. Customer clicks "Proceed to Checkout"
         │
         ▼
2. Backend creates Razorpay order + saves DB order (status: pending)
         │
         ▼
3. Razorpay checkout modal opens in browser
         │
         ▼
4. Customer pays (UPI / Card / Netbanking)
         │
         ▼
5. Backend verifies Razorpay signature (HMAC SHA256)
         │
         ▼
6. Order status updated → "accepted"
         │
         ▼
7. Vendor sees new order on dashboard ✅
```

---

## 🗺️ Upcoming Features

- [ ] 💝 Wishlist / Saved Items
- [ ] 🎟️ Coupons & Discount Codes
- [ ] 🔔 Push Notifications
- [ ] 🧾 Invoice PDF Generation
- [ ] ⭐ Reviews & Ratings
- [ ] 📍 Live Order Tracking (WebSocket)
- [ ] 📧 Email Notifications (Nodemailer)
- [ ] 📊 Advanced Admin Analytics
- [ ] 📈 Vendor Revenue Reports
- [ ] 🌙 Dark Mode

---

## 🤝 Contributing

Contributions are welcome! Here's how:

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/amazing-feature

# 3. Commit your changes
git commit -m "Add some amazing feature"

# 4. Push to the branch
git push origin feature/amazing-feature

# 5. Open a Pull Request
```

Please make sure to:
- Follow existing code style
- Test your changes before submitting
- Update documentation if needed

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ using React, Node.js, and MongoDB**

⭐ **If you found GoFresh helpful, please give it a star!** ⭐

[![GitHub stars](https://img.shields.io/github/stars/your-username/gofresh-quick-commerce?style=social)](https://github.com/your-username/gofresh-quick-commerce)

</div>
