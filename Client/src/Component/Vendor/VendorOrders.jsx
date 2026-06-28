import React, { useEffect, useMemo, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const tabs = [
    { key: 'all', label: 'All Orders' },
    { key: 'accepted', label: 'Accepted' },
    { key: 'packed', label: 'Packed' },
    { key: 'out for delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'cancelled', label: 'Cancelled' },
]

const statusStyles = {
    pending: 'bg-amber-100 text-amber-700',
    accepted: 'bg-emerald-100 text-emerald-700',
    packed: 'bg-violet-100 text-violet-700',
    'out for delivery': 'bg-sky-100 text-sky-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-rose-100 text-rose-700',
}

const nextStatusMap = {
    accepted: { label: 'Mark as Packed', next: 'packed' },
    packed: { label: 'Out for Delivery', next: 'out for delivery' },
    'out for delivery': { label: 'Mark Delivered', next: 'delivered' },
}

const formatTime = (isoString) => {
    if (!isoString) return '—'
    return new Date(isoString).toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit',
        hour12: true, timeZone: 'Asia/Kolkata'
    })
}

const formatDate = (isoString) => {
    if (!isoString) return '—'
    return new Date(isoString).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        timeZone: 'Asia/Kolkata'
    })
}

function VendorOrders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('All Status')
    const [paymentFilter, setPaymentFilter] = useState('All Payment Methods')
    const [selectedOrder, setSelectedOrder] = useState(null)   // for modal
    const [updatingId, setUpdatingId] = useState(null)     // loading state for status update

    // ─── Fetch Orders ────────────────────────────────────────────
    const fetchOrders = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE}/vendor/all-orders`, {
                method: 'GET',
                credentials: 'include',
            })
            if (res.ok) {
                const data = await res.json()
                setOrders(data.order || [])
            }
        } catch (err) {
            console.error('Error fetching orders:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchOrders() }, [])

    // ─── Update Order Status ──────────────────────────────────────
    const updateStatus = async (orderId, newStatus) => {
        setUpdatingId(orderId)
        try {
            const res = await fetch(`${API_BASE}/vendor/update-order-status`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, status: newStatus }),
            })
            if (res.ok) {
                // Update locally without refetching
                setOrders(prev => prev.map(o =>
                    o._id === orderId ? { ...o, status: newStatus } : o
                ))
                // Also update modal if open
                if (selectedOrder?._id === orderId) {
                    setSelectedOrder(prev => ({ ...prev, status: newStatus }))
                }
            }
        } catch (err) {
            console.error('Error updating status:', err)
        } finally {
            setUpdatingId(null)
        }
    }

    // ─── Filter + Search ─────────────────────────────────────────
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesTab = activeTab === 'all' || order.status === activeTab
            const matchesSearch = `${order._id} ${order.shippingAddress?.name}`.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesStatus = statusFilter === 'All Status' || order.status === statusFilter.toLowerCase()
            const matchesPayment = paymentFilter === 'All Payment Methods' || order.payment === paymentFilter
            return matchesTab && matchesSearch && matchesStatus && matchesPayment
        })
    }, [orders, activeTab, searchTerm, statusFilter, paymentFilter])

    // ─── Summary counts ──────────────────────────────────────────
    const summary = useMemo(() => ({
        all: orders.length,
        accepted: orders.filter(o => o.status === 'accepted').length,
        packed: orders.filter(o => o.status === 'packed').length,
        'out for delivery': orders.filter(o => o.status === 'out for delivery').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
    }), [orders])

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-4 sm:py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-screen-2xl space-y-6">

                {/* ── Header + Summary ── */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-semibold text-slate-900">Orders</h1>
                            <p className="mt-2 text-sm text-slate-600">Manage and track all orders placed with your store.</p>
                        </div>
                        <button
                            onClick={fetchOrders}
                            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 hover:bg-slate-100 transition"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 15H19" />
                            </svg>
                            Refresh
                        </button>
                    </div>

                    <div className="mt-6 grid gap-4 grid-cols-2 sm:grid-cols-4 xl:grid-cols-6">
                        {[
                            { label: 'Total Orders', value: summary.all, color: 'text-emerald-600' },
                            { label: 'Pending', value: summary.pending, color: 'text-amber-600' },
                            { label: 'Accepted', value: summary.accepted, color: 'text-emerald-600' },
                            { label: 'Packed', value: summary.packed, color: 'text-violet-600' },
                            { label: 'Out for Delivery', value: summary['out for delivery'], color: 'text-sky-600' },
                            { label: 'Delivered', value: summary.delivered, color: 'text-emerald-600' },
                        ].map(stat => (
                            <div key={stat.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                                <p className={`mt-3 text-3xl font-semibold ${stat.color}`}>{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Filters + Table ── */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4">

                        {/* Tabs */}
                        <div className="flex gap-3 flex-wrap">
                            {tabs.map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === tab.key
                                        ? 'bg-emerald-600 text-white shadow-sm'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        }`}
                                >
                                    {tab.label}
                                    {tab.key !== 'all' ? ` (${summary[tab.key] ?? 0})` : ''}
                                </button>
                            ))}
                        </div>

                        {/* Search + Filters */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <input
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full sm:w-72 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                                placeholder="Search Order ID or Customer..."
                            />
                            <select
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-400"
                            >
                                <option>All Status</option>
                                <option>Pending</option>
                                <option>Accepted</option>
                                <option>Packed</option>
                                <option>Out for Delivery</option>
                                <option>Delivered</option>
                                <option>Cancelled</option>
                            </select>
                            <select
                                value={paymentFilter}
                                onChange={e => setPaymentFilter(e.target.value)}
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-400"
                            >
                                <option>All Payment Methods</option>
                                <option>Online</option>
                                <option>COD</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="mt-6 overflow-x-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-16 text-slate-400 text-sm">
                                Loading orders...
                            </div>
                        ) : (
                            <table className="min-w-full w-full border-collapse text-left text-sm text-slate-600">
                                <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
                                    <tr>
                                        <th className="px-4 py-3">Order ID</th>
                                        <th className="px-4 py-3">Customer</th>
                                        <th className="px-4 py-3">Items</th>
                                        <th className="px-4 py-3">Amount</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Time</th>
                                        <th className="px-4 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {filteredOrders.map(order => {
                                        const action = nextStatusMap[order.status]
                                        const isUpdating = updatingId === order._id
                                        return (
                                            <tr key={order._id} className="hover:bg-slate-50">
                                                <td className="px-4 py-4">
                                                    <div className="font-semibold text-slate-900">
                                                        #{order._id?.slice(-6).toUpperCase()}
                                                    </div>
                                                    <div className="text-xs text-slate-500">{formatDate(order.createdAt)}</div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="font-semibold text-slate-900">{order.shippingAddress?.name}</div>
                                                    <div className="text-xs text-slate-500">{order.shippingAddress?.email}</div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="text-sm text-slate-700">{order.items?.length} items</div>
                                                    <div className="text-xs text-slate-500 line-clamp-1">
                                                        {order.items?.map(i => i.name).join(', ')}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="font-semibold text-slate-900">₹{order.pricing?.total}</div>
                                                    <div className="text-xs text-slate-500">subtotal ₹{order.pricing?.subtotal}</div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[order.status] || 'bg-slate-100 text-slate-700'}`}>
                                                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-slate-700">
                                                    {formatTime(order.createdAt)}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-2">
                                                        {/* View Details */}
                                                        <button
                                                            onClick={() => setSelectedOrder(order)}
                                                            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                                                        >
                                                            View
                                                        </button>

                                                        {/* Status Action */}
                                                        {action && (
                                                            <button
                                                                onClick={() => updateStatus(order._id, action.next)}
                                                                disabled={isUpdating}
                                                                className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                {isUpdating ? '...' : action.label}
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    {filteredOrders.length === 0 && !loading && (
                                        <tr>
                                            <td colSpan="7" className="px-4 py-10 text-center text-sm text-slate-500">
                                                No orders match this filter.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <div className="mt-6 text-sm text-slate-500">
                        Showing {filteredOrders.length} of {orders.length} orders
                    </div>
                </div>
            </div>

            {/* ── Order Details Modal ── */}
            {selectedOrder && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                    onClick={() => setSelectedOrder(null)}
                >
                    <div
                        className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-6 space-y-5 max-h-[90vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    Order #{selectedOrder._id?.slice(-6).toUpperCase()}
                                </h2>
                                <p className="text-xs text-slate-500 mt-1">{formatDate(selectedOrder.createdAt)} · {formatTime(selectedOrder.createdAt)}</p>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-3">
                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[selectedOrder.status] || 'bg-slate-100 text-slate-700'}`}>
                                {selectedOrder.status?.charAt(0).toUpperCase() + selectedOrder.status?.slice(1)}
                            </span>
                            {nextStatusMap[selectedOrder.status] && (
                                <button
                                    onClick={() => updateStatus(selectedOrder._id, nextStatusMap[selectedOrder.status].next)}
                                    disabled={updatingId === selectedOrder._id}
                                    className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition disabled:opacity-50"
                                >
                                    {updatingId === selectedOrder._id ? 'Updating...' : nextStatusMap[selectedOrder.status].label}
                                </button>
                            )}
                        </div>

                        {/* Customer Info */}
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-1">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Customer</p>
                            <p className="font-semibold text-slate-900">{selectedOrder.shippingAddress?.name}</p>
                            <p className="text-sm text-slate-600">{selectedOrder.shippingAddress?.email}</p>
                            <p className="text-sm text-slate-600">{selectedOrder.shippingAddress?.address}</p>
                        </div>

                        {/* Items */}
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Items ({selectedOrder.items?.length})</p>
                            {selectedOrder.items?.map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {item.imgSrc && (
                                            <img src={item.imgSrc} alt={item.name} className="h-10 w-10 rounded-xl object-cover border border-slate-200 bg-white" />
                                        )}
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900 capitalize">{item.name}</p>
                                            <p className="text-xs text-slate-500">{item.weight} · qty {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-semibold text-slate-900">₹{item.price * item.quantity}</p>
                                </div>
                            ))}
                        </div>

                        {/* Pricing */}
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-sm">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Pricing</p>
                            <div className="flex justify-between text-slate-600">
                                <span>Subtotal</span>
                                <span>₹{selectedOrder.pricing?.subtotal}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Savings</span>
                                <span className="text-emerald-600">-₹{selectedOrder.pricing?.savings}</span>
                            </div>
                            <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-900">
                                <span>Total</span>
                                <span>₹{selectedOrder.pricing?.total}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}

export default VendorOrders