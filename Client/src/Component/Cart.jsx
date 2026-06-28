import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Loader from './Loader/Loader';
import { ShoppingCart, Location, Trash, ArrowLeft2, DiscountShape, ArrowRight2 } from 'iconsax-react';
import { useStore } from './utils/Zustand';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function Cart() {
    const navigate = useNavigate();
    const [address, setAddress] = useState("Home - 123, Green Street, Delhi 110001");
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [addressInput, setAddressInput] = useState("");
    const [loader, setloader] = useState(false);
    const [isOrderPlaced, setisOrderPlaced] = useState(false);
    const [resMsg, setresMsg] = useState("");
    const [items, setItems] = useState([]);

    const cartItemId = useStore((state) => state.cartItemId);
    const quantities = useStore((state) => state.quantities);
    const setCartItemId = useStore((state) => state.setCartItemId);
    const clearCartZustand = useStore((state) => state.clearCart); // ✅ from Zustand

    // Fetch live user location
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetch(`${API_BASE}/namelocation`, {
                    method: "GET",
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.isloggedin && data.location && data.location !== 'Add your location') {
                        setAddress(data.location);
                        setAddressInput(data.location);
                    }
                }
            } catch (err) {
                console.error("Error fetching user data for cart:", err);
            }
        };
        fetchUserData();
    }, []);

    // Fetch Cart Items
    useEffect(() => {
        const fetchCartItems = async () => {
            if (!cartItemId || cartItemId.length === 0) return  // ✅ proper guard

            try {
                const res = await fetch(`${API_BASE}/cartitem`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ cartItemId }),
                });
                const data = await res.json();

                if (res.ok && data.cartItems) {
                    const cartItems = data.cartItems.map(p => ({  // ✅ removed unnecessary await
                        ...p,
                        quantity: quantities[p.id] || quantities[p._id] || 1  // ✅ fallback for both id types
                    }))
                    setItems(cartItems);
                }
            } catch (err) {
                console.error("Error fetching cart items:", err);
            }
        };
        fetchCartItems();
    }, [cartItemId, quantities]);  // ✅ added quantities as dependency

    const updateQuantity = (id, delta) => {
        setItems(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = item.quantity + delta;
                return { ...item, quantity: newQty > 0 ? newQty : 1 };
            }
            return item;
        }));
    };

    const removeItem = (id) => {
        setItems(prev => prev.filter(item => item.id !== id));
        setCartItemId(cartItemId.filter(itemId => itemId !== id));  // ✅ also remove from Zustand
    };

    const clearCart = () => {
        setItems([]);
        setCartItemId([])
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePaymentSuccess = async (response, orderId) => {
        try {
            const res = await fetch(`${API_BASE}/payment/verify`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                    orderId,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Payment verification failed');
            }

            setresMsg(data.message || 'Payment verified successfully');
            setisOrderPlaced(true);
            clearCart();
        } catch (err) {
            console.error('Payment verification error:', err);
            setresMsg(err.message || 'Payment verification failed.');
        } finally {
            setloader(false);
        }
    };

    // Calculations
    const totalItems = items.reduce((acc, curr) => acc + curr.quantity, 0);
    const subtotal = items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
    const totalMRP = items.reduce((acc, curr) => acc + (curr.mrp * curr.quantity), 0);
    const totalSavings = totalMRP - subtotal;
    const deliveryFee = subtotal > 0 ? 40.00 : 0.00;
    const platformFee = subtotal > 0 ? 10.00 : 0.00;
    const grandTotal = subtotal + deliveryFee + platformFee;

    // Address Update
    const handleAddressUpdate = async () => {
        if (!addressInput.trim()) return;
        setAddress(addressInput);
        setIsEditingAddress(false);
        try {
            await fetch(`${API_BASE}/updatelocation`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ location: addressInput })
            });
        } catch (err) {
            console.error("Error saving address:", err);
        }
    };

    const doneOrder = async () => {
        if (!items.length) return;
        setloader(true);

        const orderDetails = {
            items: items.map(item => ({
                id: item._id || item.id,
                name: item.name,
                quantity: quantities[item._id || item.id] || item.quantity || 1,
                weight: item.weight,
                price: item.price,
                mrp: item.mrp,
                imgSrc: item.imgSrc,
                inStock: item.inStock ?? true
            })),
            pricing: {
                subtotal,
                savings: totalSavings,
                total: grandTotal
            }
        };

        try {
            const createResponse = await fetch(`${API_BASE}/payment/create-order`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderDetails }),
            });

            const createData = await createResponse.json();
            if (!createResponse.ok) {
                throw new Error(createData.error || 'Unable to create payment order');
            }

            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                throw new Error('Unable to load Razorpay checkout');
            }

            const options = {
                key: createData.key,
                amount: createData.amount,
                currency: 'INR',
                name: 'GoFresh',
                description: 'Complete your checkout',
                order_id: createData.razorpayOrderId,
                handler: async (response) => {
                    await handlePaymentSuccess(response, createData.orderId);
                },
                modal: {
                    ondismiss: () => {
                        setloader(false);
                    }
                },
                theme: {
                    color: '#10b981'
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (err) {
            console.error('Checkout error:', err);
            setresMsg(err.message || 'Checkout failed');
            setloader(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-slate-200 rounded-full transition cursor-pointer"
                            aria-label="Go back"
                        >
                            <ArrowLeft2 size={24} color="black" />
                        </button>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">My Cart</h1>
                            <p className="text-sm text-slate-500 font-medium">{totalItems} items</p>
                        </div>
                    </div>
                    {items.length > 0 && (
                        <button
                            onClick={clearCart}
                            className="flex items-center gap-2 px-4 py-2 border border-red-200 rounded-2xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition cursor-pointer"
                        >
                            <Trash size={16} color="currentColor" variant="Linear" />
                            <span>Clear Cart</span>
                        </button>
                    )}
                </div>

                {/* Order Placed Success Screen */}
                {isOrderPlaced ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-3xl border border-slate-200 shadow-sm px-6">
                        <div className="h-24 w-24 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-slate-950 mb-2">{resMsg}</h2>
                        <p className="text-slate-500 mb-6 max-w-sm">Your order has been placed successfully. We'll deliver it soon!</p>
                        <Link to="/" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl shadow-md transition">
                            Continue Shopping
                        </Link>
                    </div>

                ) : items.length === 0 ? (
                    // Empty Cart
                    <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-3xl border border-slate-200 shadow-sm px-6">
                        <div className="h-24 w-24 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                            <ShoppingCart size={48} className="text-emerald-500" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-950 mb-2">Your Cart is Empty</h2>
                        <p className="text-slate-500 mb-6 max-w-sm">Looks like you haven't added anything to your cart yet. Let's add some fresh groceries!</p>
                        <Link to="/" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl shadow-md transition">
                            Start Shopping
                        </Link>
                    </div>

                ) : (
                    // Cart Content
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">

                        {/* Left Side */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Deliver To Banner */}
                            <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3 w-full">
                                    <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center border border-emerald-100 shrink-0">
                                        <Location size={20} className="text-emerald-600" variant="Linear" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Deliver to</p>
                                        {isEditingAddress ? (
                                            <div className="flex items-center gap-2 mt-1 w-full max-w-lg">
                                                <input
                                                    type="text"
                                                    value={addressInput}
                                                    onChange={(e) => setAddressInput(e.target.value)}
                                                    className="w-full text-sm rounded-lg border border-slate-200 px-3 py-1.5 focus:outline-none focus:border-emerald-500"
                                                    placeholder="Enter delivery address..."
                                                    autoFocus
                                                />
                                                <button onClick={handleAddressUpdate} className="text-xs bg-emerald-600 text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition">Save</button>
                                                <button onClick={() => setIsEditingAddress(false)} className="text-xs text-slate-500 font-semibold px-2 py-1.5 hover:underline">Cancel</button>
                                            </div>
                                        ) : (
                                            <p className="text-sm font-semibold text-slate-800 wrap-break-words">{address}</p>
                                        )}
                                    </div>
                                </div>
                                {!isEditingAddress && (
                                    <button
                                        onClick={() => { setIsEditingAddress(true); setAddressInput(address); }}
                                        className="text-sm font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer whitespace-nowrap self-end sm:self-center"
                                    >
                                        Change
                                    </button>
                                )}
                            </div>

                            {/* Cart Items List */}
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50/55 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-500">
                                    <div className="col-span-6">Product</div>
                                    <div className="col-span-2 text-center">Price</div>
                                    <div className="col-span-2 text-center">Quantity</div>
                                    <div className="col-span-2 text-right">Total</div>
                                </div>

                                <div className="divide-y divide-slate-100">
                                    {items.map((item) => (
                                        <div key={item.id || item._id}>
                                            {/* Desktop */}
                                            <div className="hidden md:grid grid-cols-12 gap-4 items-center px-6 py-5">
                                                <div className="col-span-6 flex gap-4">
                                                    <div className="h-16 w-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center p-2 shrink-0">
                                                        <img src={item.imgSrc} alt={item.name} className="h-full w-full object-contain" />
                                                    </div>
                                                    <div className="flex flex-col justify-center">
                                                        <p className="font-semibold text-slate-900 capitalize text-base">{item.name}</p>
                                                        <span className="text-xs text-slate-500 font-medium">{item.weight}</span>
                                                        {item.inStock && (
                                                            <span className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 w-fit">
                                                                <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                                                In Stock
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="col-span-2 text-center font-semibold text-slate-700">
                                                    ₹{item.price.toFixed(2)}
                                                </div>
                                                <div className="col-span-2 flex justify-center">
                                                    <div className="flex items-center border border-slate-200 rounded-2xl bg-slate-50 px-2 py-1">
                                                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-slate-200 rounded-full transition font-bold text-slate-600 text-lg w-7 h-7 flex items-center justify-center cursor-pointer">-</button>
                                                        <span className="px-3 font-semibold text-slate-800 text-sm">{item.quantity}</span>
                                                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-slate-200 rounded-full transition font-bold text-slate-600 text-lg w-7 h-7 flex items-center justify-center cursor-pointer">+</button>
                                                    </div>
                                                </div>
                                                <div className="col-span-2 flex items-center justify-end gap-3">
                                                    <span className="font-bold text-slate-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                                                    <button onClick={() => removeItem(item.id)} className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded-full text-slate-400 transition cursor-pointer" aria-label="Remove item">
                                                        <Trash size={18} color="currentColor" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Mobile */}
                                            <div className="md:hidden p-4 flex gap-4 relative">
                                                <button onClick={() => removeItem(item.id)} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500" aria-label="Remove item">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                </button>
                                                <div className="h-20 w-20 bg-white border border-slate-100 rounded-2xl flex items-center justify-center p-2 shrink-0">
                                                    <img src={item.imgSrc} alt={item.name} className="h-full w-full object-contain" />
                                                </div>
                                                <div className="flex-1 flex flex-col justify-between">
                                                    <div>
                                                        <p className="font-semibold text-slate-900 capitalize text-sm pr-6 leading-tight">{item.name}</p>
                                                        <span className="text-xs text-slate-500 font-medium">{item.weight}</span>
                                                        {item.inStock && (
                                                            <div className="mt-1 flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 w-fit">
                                                                <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full" />
                                                                In Stock
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <span className="font-bold text-slate-900 text-base">₹{(item.price * item.quantity).toFixed(2)}</span>
                                                        <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 px-1 py-0.5">
                                                            <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-slate-200 rounded-full font-bold text-slate-600 text-base w-6 h-6 flex items-center justify-center">-</button>
                                                            <span className="px-2 font-semibold text-slate-800 text-xs">{item.quantity}</span>
                                                            <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-slate-200 rounded-full font-bold text-slate-600 text-base w-6 h-6 flex items-center justify-center">+</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Continue Shopping */}
                            <div className="flex justify-between items-center pt-2">
                                <Link to="/" className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-700 transition">
                                    <span>←</span>
                                    <span>Continue Shopping</span>
                                </Link>
                            </div>

                            {/* Badges */}
                            <div className="hidden sm:grid grid-cols-4 gap-4 pt-4 border-t border-slate-200">
                                {[
                                    { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", title: "Best Prices", desc: "We offer best prices on all products" },
                                    { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "Secure Payments", desc: "100% secure payment with trusted gateways" },
                                    { icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 15H19c0 .444-.072.87-.206 1.272M4 4h5M4 4v5H9m12-5v5h-.582m-15.356 2A8.001 8.001 0 102.79 15H5c0 .444.072.87.206 1.272M20 20h-5v-5", title: "Easy Returns", desc: "Not satisfied? Easy returns within 7 days" },
                                    { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: "Fast Delivery", desc: "Get your order delivered on time" },
                                ].map(({ icon, title, desc }) => (
                                    <div key={title} className="flex flex-col items-center text-center p-3">
                                        <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center mb-2">
                                            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon}></path></svg>
                                        </div>
                                        <p className="font-bold text-slate-800 text-xs">{title}</p>
                                        <p className="text-[10px] text-slate-500">{desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Side */}
                        <div className="space-y-6">

                            {/* Apply Coupon */}
                            <button className="w-full bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-5 flex items-center justify-between text-left hover:border-emerald-300 transition cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="h-11 w-11 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0">
                                        <DiscountShape size={24} className="text-emerald-600" variant="Bold" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">Apply Coupon</p>
                                        <p className="text-xs text-slate-500">Save extra with best offers</p>
                                    </div>
                                </div>
                                <ArrowRight2 size={16} color="currentColor" className="text-slate-400" />
                            </button>

                            {/* Order Summary */}
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-4">
                                <h2 className="text-lg font-bold text-slate-950">Order Summary</h2>
                                <div className="space-y-3 text-sm text-slate-600">
                                    <div className="flex justify-between">
                                        <span>Subtotal ({totalItems} items)</span>
                                        <span className="font-semibold text-slate-900">₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="flex items-center gap-1.5">
                                            Delivery Fee
                                            <span className="w-4 h-4 bg-slate-100 hover:bg-slate-200 rounded-full inline-flex items-center justify-center text-[10px] font-bold text-slate-500 cursor-help" title="Standard shipping rates apply">i</span>
                                        </span>
                                        <span className="font-semibold text-slate-900">₹{deliveryFee.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="flex items-center gap-1.5">
                                            Platform Fee
                                            <span className="w-4 h-4 bg-slate-100 hover:bg-slate-200 rounded-full inline-flex items-center justify-center text-[10px] font-bold text-slate-500 cursor-help" title="Small fee supporting infrastructure improvements">i</span>
                                        </span>
                                        <span className="font-semibold text-slate-900">₹{platformFee.toFixed(2)}</span>
                                    </div>
                                </div>
                                <hr className="border-slate-100" />
                                <div className="flex justify-between items-center">
                                    <span className="text-base font-bold text-slate-900">Total</span>
                                    <span className="text-2xl font-black text-emerald-600">₹{grandTotal.toFixed(2)}</span>
                                </div>
                                {totalSavings > 0 && (
                                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3 flex items-center gap-2 text-xs font-semibold text-emerald-800">
                                        <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path></svg>
                                        <span>You will save ₹{totalSavings.toFixed(2)} on this order</span>
                                    </div>
                                )}
                            </div>

                            {/* Delivery Slot */}
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-emerald-50 rounded-full flex items-center justify-center shrink-0">
                                        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Delivery by</p>
                                        <p className="font-bold text-slate-800 text-sm">Today, 2:00 PM - 4:00 PM</p>
                                    </div>
                                </div>
                                <button className="text-sm font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer">Change</button>
                            </div>

                            {/* Payment Methods */}
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-3">
                                <p className="font-bold text-slate-900 text-sm">Payment Methods</p>
                                <p className="text-xs text-slate-500">Choose a payment method on checkout</p>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    <div className="border border-slate-100 rounded-xl px-3 py-2 flex items-center justify-center h-10 w-16 bg-slate-50/50 shadow-sm">
                                        <span className="font-black text-xs text-indigo-700 tracking-tighter">UPI</span>
                                    </div>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <div className="space-y-3 lg:m-0 mb-25">
                                {loader ? (
                                    <button disabled className="w-full bg-emerald-600 cursor-not-allowed text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center justify-center">
                                        <Loader size={30} color="border-white" />  {/* ✅ fixed color prop */}
                                    </button>
                                ) : (
                                    <button onClick={doneOrder} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer text-base">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                        <span>Proceed to Checkout</span>
                                    </button>
                                )}
                                <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-semibold">
                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                    <span>Secure Checkout</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Cart;