import React, { useEffect, useState } from 'react'
import OrderStatusChart from './Charts/OrderStatusChart';
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const lowStock = [
    { name: 'Amul Milk', amount: '500 ml', left: 3 },
    { name: 'Banana', amount: '1 kg', left: 4 },
    { name: 'Tomato', amount: '1 kg', left: 6 },
    { name: 'Aashirvaad Atta', amount: '5 kg', left: 2 },
]

const topProducts = [
    { name: 'Amul Toned Milk', amount: '500 ml', value: 450 },
    { name: 'Banana', amount: '1 kg', value: 380 },
    { name: 'Aashirvaad Atta', amount: '5 kg', value: 320 },
    { name: 'Fortune Sunflower Oil', amount: '1 L', value: 280 },
    { name: 'Apple Red', amount: '1 kg', value: 250 },
]

const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
    })
}


function VendorDashboard() {
    const [orders, setorders] = useState([])
    const [vendor, setvendor] = useState(null)
    const [customerNumber, setcustomerNumber] = useState(0)
    const [pendingOrders, setpendingOrders] = useState([])
    const [recentOrders, setrecentOrders] = useState([])  // ✅ empty array, no dummy object

    const stats = [
        { label: 'Total Revenue', value: '₹84,650', detail: '18.6% vs last week', accent: 'text-emerald-600' },
        { label: 'Total Orders', value: orders?.length ?? 0, detail: '12.4% vs last week', accent: 'text-emerald-600' },
        { label: 'Total Customers', value: customerNumber ?? 0, detail: '15.8% vs last week', accent: 'text-emerald-600' },
        { label: 'Pending Orders', value: pendingOrders?.length ?? 0, detail: 'View all orders', accent: 'text-violet-600', link: true },
        { label: 'Out of Stock', value: '7', detail: 'View products', accent: 'text-red-600', link: true },
    ]

    const statusStyles = {
        pending: 'bg-amber-100 text-amber-700',
        accepted: 'bg-emerald-100 text-emerald-700',
        packed: 'bg-violet-100 text-violet-700',
        'out for delivery': 'bg-sky-100 text-sky-700',
        delivered: 'bg-emerald-100 text-emerald-700',
        cancelled: 'bg-rose-100 text-rose-700',
    }

    const getOrderDetails = async () => {
        try {
            const res = await fetch(`${API_BASE}/vendor/all-orders`, {
                method: "GET",
                credentials: "include",
            });
            if (res.ok) {
                const data = await res.json();
                setorders(data.order)
                setvendor(data.vendor)
                setcustomerNumber(data.numberOfUsers)

                const pending = data.order?.filter(ord => ord.status === 'accepted') || []
                setpendingOrders(pending)

                // ✅ Build recentOrders here using data.order directly
                const recent = data.order?.map(v => ({
                    id: v._id,
                    customer: v.shippingAddress?.name,
                    items: v.items.length + " items",   // ✅ added space before "items"
                    amount: "₹" + v.pricing.total,      // ✅ added ₹ symbol
                    status: v.status,                   // ✅ fixed typo: was stats
                    time: formatTime(v.createdAt)       // ✅ actually calls the function now
                })) || []

                setrecentOrders(recent)
            }
        } catch (err) {
            console.error("Error fetching orders:", err);
        }
    };

    useEffect(() => {
        getOrderDetails()
    }, [])

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-3 sm:py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-screen-2xl space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
                            <p className="mt-2 text-sm text-slate-600">
                                Welcome back, {vendor?.name}. Here's what's happening with your store today.
                            </p>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                            <span>May 19 - May 25, 2024</span>
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-5">
                        {stats.map((stat) => (
                            <div key={stat.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                                        <p className="mt-3 text-3xl font-semibold text-slate-900">{stat.value}</p>
                                    </div>
                                    <div className={`rounded-2xl bg-white p-3 ${stat.accent}`}>■</div>
                                </div>
                                <p className={`mt-3 text-sm ${stat.accent}`}>{stat.detail}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-3">
                    <div className="xl:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Sales Overview</p>
                                <h2 className="mt-2 text-2xl font-semibold text-slate-900">This Week</h2>
                            </div>
                            <button className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">This Week</button>
                        </div>
                        <div className="mt-6 h-70 rounded-4xl bg-linear-to-b from-slate-50 to-white p-4 shadow-inner">
                            <div className="h-full rounded-3xl bg-slate-900/5 p-4">
                                <div className="flex h-full flex-col justify-between">
                                    <div className="space-y-3">
                                        {[28, 40, 32, 24, 36].map((w, i) => (
                                            <div key={i} className={`h-2 rounded-full bg-slate-200 w-${w}`} />
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-7 gap-2 text-center text-xs text-slate-500">
                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                            <span key={day}>{day}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4">

                        <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row sm:items-center">
                            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                                <p className="text-sm font-medium text-slate-500">Order Status</p>
                                <h2 className="mt-1 text-lg font-semibold text-slate-900">Breakdown</h2>

                                <OrderStatusChart orders={orders} />
                            </div>
                        </div>


                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Low Stock Alerts</p>
                                    <h2 className="mt-2 text-xl font-semibold text-slate-900">Running short</h2>
                                </div>
                            </div>
                            <div className="mt-6 space-y-4">
                                {lowStock.map(item => (
                                    <div key={item.name} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                                        <div>
                                            <p className="font-semibold text-slate-900">{item.name}</p>
                                            <p className="text-sm text-slate-600">{item.amount}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-rose-600">{item.left} left</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="mt-6 text-sm font-semibold text-red-600 hover:text-red-700">View all inventory</button>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                    <section className="xl:col-span-2 rounded-3xl border w-85 overflow-hidden sm:w-auto border-slate-200 bg-white sm:p-6 shadow-sm">
                        <div className="mb-6 ps-6 pt-6 sm:p-0 flex flex-col gap-2 w-40 sm:flex-row sm:w-auto sm:items-center sm:justify-between">
                            <div className='w-40 sm:w-auto'>
                                <p className="text-sm font-medium text-slate-500">Recent Orders</p>
                                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Latest activity</h2>
                            </div>
                        </div>

                        <div className="overflow-x-auto w-screen sm:w-auto">
                            <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
                                <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
                                    <tr>
                                        <th className="px-4 py-3">Order ID</th>
                                        <th className="px-4 py-3">Customer</th>
                                        <th className="px-4 py-3">Items</th>
                                        <th className="px-4 py-3">Amount</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {recentOrders.length === 0 ? (  // ✅ empty state row
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                                                No orders yet
                                            </td>
                                        </tr>
                                    ) : (
                                        recentOrders.map(order => (
                                            <tr key={order.id} className="hover:bg-slate-50">
                                                <td className="px-4 py-4 font-semibold text-slate-900">
                                                    #{order.id?.slice(-6).toUpperCase()}  {/* ✅ shortened ID */}
                                                </td>
                                                <td className="px-4 py-4">{order.customer}</td>
                                                <td className="px-4 py-4">{order.items}</td>
                                                <td className="px-4 py-4">{order.amount}</td>
                                                <td className="px-4 py-4">
                                                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                                                        order.status === 'out for delivery' ? 'bg-sky-100 text-sky-700' :
                                                            order.status === 'packed' ? 'bg-violet-100 text-violet-700' :
                                                                order.status == 'accepted' ? "bg-green-300 text-green-950" :
                                                                    'bg-amber-100 text-amber-700'
                                                        }`}>
                                                        {/* ✅ capitalize first letter for display */}
                                                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">{order.time}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Top Selling Products</p>
                                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Best performers</h2>
                            </div>
                            <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">View all</button>
                        </div>
                        <div className="mt-6 space-y-4">
                            {topProducts.map(product => (
                                <div key={product.name} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm text-slate-700">
                                        <div>
                                            <p className="font-semibold text-slate-900">{product.name}</p>
                                            <p className="text-xs text-slate-500">{product.amount}</p>
                                        </div>
                                        <span className="font-semibold">{product.value}</span>
                                    </div>
                                    <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                                        <div className="h-full rounded-full bg-emerald-600" style={{ width: `${product.value / 5}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default VendorDashboard