import React, { useEffect, useMemo, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// ── Static display data ──────────────────────────────────────────
const topCategories = [
    { label: 'Fruits & Vegetables', percent: 28 },
    { label: 'Dairy & Eggs', percent: 22 },
    { label: 'Staples', percent: 18 },
    { label: 'Beverages', percent: 15 },
    { label: 'Snacks & Biscuits', percent: 12 },
]

const STATUS_CONFIG = [
    { key: 'delivered', label: 'Delivered', color: '#10b981' },
    { key: 'outForDelivery', label: 'Out for Delivery', color: '#0ea5e9' },
    { key: 'packed', label: 'Packed', color: '#8b5cf6' },
    { key: 'accepted', label: 'Accepted', color: '#6366f1' },
    { key: 'pending', label: 'Pending', color: '#f59e0b' },
    { key: 'cancelled', label: 'Cancelled', color: '#f43f5e' },
]

const statusStyles = {
    pending: 'bg-amber-100 text-amber-700',
    accepted: 'bg-emerald-100 text-emerald-700',
    packed: 'bg-violet-100 text-violet-700',
    'out for delivery': 'bg-sky-100 text-sky-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-rose-100 text-rose-700',
}

const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata'
}) : '—'

// ── Pie Chart Component ──────────────────────────────────────────
function OrderStatusPie({ ordersByStatus }) {
    const data = STATUS_CONFIG
        .map(s => ({ name: s.label, value: ordersByStatus[s.key] || 0, color: s.color }))
        .filter(s => s.value > 0)

    const total = data.reduce((acc, d) => acc + d.value, 0)

    if (!total) return (
        <div className="flex items-center justify-center h-48 text-sm text-slate-400">No orders yet</div>
    )

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload?.length) return (
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-md text-sm">
                <p className="font-semibold text-slate-900">{payload[0].name}</p>
                <p className="text-slate-500">{payload[0].value} orders · {((payload[0].value / total) * 100).toFixed(1)}%</p>
            </div>
        )
        return null
    }

    const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        if (percent < 0.05) return null
        const R = Math.PI / 180
        const r = innerRadius + (outerRadius - innerRadius) * 0.5
        return (
            <text
                x={cx + r * Math.cos(-midAngle * R)}
                y={cy + r * Math.sin(-midAngle * R)}
                fill="white" textAnchor="middle" dominantBaseline="central"
                fontSize={11} fontWeight={600}
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        )
    }

    return (
        <div className="mt-4">
            <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                    <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={85}
                        paddingAngle={3} dataKey="value" labelLine={false} label={CustomLabel}>
                        {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
                {data.map((entry, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                        <span className="h-2 w-2 rounded-full shrink-0" style={{ background: entry.color }} />
                        <span>{entry.name}</span>
                        <span className="ml-auto font-semibold text-slate-900">{entry.value}</span>
                    </div>
                ))}
            </div>
            <p className="mt-2 text-center text-xs text-slate-400">{total} total orders</p>
        </div>
    )
}

// ── Sales Channel Bar Chart ───────────────────────────────────────
function SalesChannelChart() {
    const data = [
        { name: 'Website', value: 45 },
        { name: 'Mobile', value: 35 },
        { name: 'Android', value: 15 },
        { name: 'iOS', value: 5 },
    ]
    return (
        <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip
                    formatter={(v) => [`${v}%`, 'Share']}
                    contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {data.map((_, i) => (
                        <Cell key={i} fill={['#10b981', '#f97316', '#0ea5e9', '#8b5cf6'][i]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    )
}

// ── Main Component ────────────────────────────────────────────────
function AdminDashboard() {
    const [stats, setStats] = useState(null)
    const [recentOrders, setRecentOrders] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        setLoading(true)
        try {
            const [statsRes, ordersRes] = await Promise.all([
                fetch(`${API_BASE}/admin/stats`, { credentials: 'include' }),
                fetch(`${API_BASE}/admin/recent-orders`, { credentials: 'include' }),
            ])
            if (statsRes.ok) { const d = await statsRes.json(); setStats(d) }
            if (ordersRes.ok) { const d = await ordersRes.json(); setRecentOrders(d.orders || []) }
        } catch (err) {
            console.error('Error fetching admin data:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchData() }, [])
    console.log(stats ? stats : "")

    const statCards = [
        { label: 'Total Revenue', value: stats ? `₹${stats.totalRevenue.toLocaleString('en-IN')}` : '—' },
        { label: 'Total Orders', value: stats?.totalOrders ?? '—' },
        { label: 'Total Customers', value: stats?.totalCustomers ?? '—' },
        { label: 'Total Vendors', value: stats?.totalVendors ?? '—' },
    ]

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-3 sm:py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-screen-2xl space-y-6">

                {/* ── Header ── */}
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Admin Dashboard</h1>
                        <p className="mt-2 max-w-2xl text-sm text-slate-600">
                            Monitor orders, revenue, approvals, and category performance.
                        </p>
                    </div>
                    <button
                        onClick={fetchData}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 15H19" />
                        </svg>
                        Refresh
                    </button>
                </div>

                {/* ── Stat Cards ── */}
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                    {statCards.map(stat => (
                        <div key={stat.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                            <p className="mt-3 text-3xl font-semibold text-slate-900">
                                {loading ? <span className="text-slate-300">...</span> : stat.value}
                            </p>
                            <p className="mt-2 text-sm text-emerald-600">vs last week</p>
                        </div>
                    ))}
                </div>

                {/* ── Highlight Cards ── */}
                <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                    {[
                        { title: 'Pending Vendor Approvals', value: '12', color: 'bg-emerald-50', border: 'border-emerald-200' },
                        { title: 'Pending Delivery Approvals', value: '7', color: 'bg-orange-50', border: 'border-orange-200' },
                        { title: 'Low Stock Products', value: '23', color: 'bg-rose-50', border: 'border-rose-200' },
                        { title: 'Reported Products', value: '5', color: 'bg-sky-50', border: 'border-sky-200' },
                    ].map(card => (
                        <div key={card.title} className={`rounded-3xl border ${card.border} ${card.color} p-5 shadow-sm`}>
                            <p className="text-sm font-semibold text-slate-700">{card.title}</p>
                            <p className="mt-4 text-3xl font-bold text-slate-900">{card.value}</p>
                            <button className="mt-5 inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition">
                                View All
                            </button>
                        </div>
                    ))}
                </div>

                {/* ── Revenue + Order Status ── */}
                <div className="grid gap-4 xl:grid-cols-3">
                    <section className="xl:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Revenue Overview</p>
                                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Weekly revenue summary</h2>
                            </div>
                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                                Live
                            </span>
                        </div>
                        <div className="mt-6 grid gap-4 sm:grid-cols-3">
                            {[
                                { label: 'Revenue', value: stats ? `₹${stats.totalRevenue.toLocaleString('en-IN')}` : '—', sub: 'Total revenue' },
                                { label: 'Total Orders', value: stats?.totalOrders ?? '—', sub: 'All time' },
                                { label: 'Avg Order', value: stats && stats.totalOrders ? `₹${Math.round(stats.totalRevenue / stats.totalOrders).toLocaleString('en-IN')}` : '—', sub: 'Per order' },
                            ].map(item => (
                                <div key={item.label} className="rounded-3xl bg-slate-50 p-4">
                                    <p className="text-sm text-slate-500">{item.label}</p>
                                    <p className="mt-2 text-2xl font-semibold text-slate-900">
                                        {loading ? '...' : item.value}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">{item.sub}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-3xl bg-white p-5 border border-slate-200">
                                <p className="text-sm font-semibold text-slate-700">Returning customers</p>
                                <p className="mt-4 text-3xl font-semibold text-slate-900">62%</p>
                                <p className="mt-2 text-sm text-slate-500">Percentage of all orders this week.</p>
                            </div>
                            <div className="rounded-3xl bg-white p-5 border border-slate-200">
                                <p className="text-sm font-semibold text-slate-700">Conversion rate</p>
                                <p className="mt-4 text-3xl font-semibold text-slate-900">4.8%</p>
                                <p className="mt-2 text-sm text-slate-500">Visitors who placed an order.</p>
                            </div>
                        </div>
                    </section>

                    {/* Order Status Pie */}
                    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">Orders Overview</p>
                        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Status breakdown</h2>
                        {loading
                            ? <div className="flex items-center justify-center h-48 text-slate-400 text-sm">Loading...</div>
                            : <OrderStatusPie ordersByStatus={stats?.ordersByStatus || {}} />
                        }
                    </section>
                </div>

                {/* ── Recent Orders + Categories + Sales ── */}
                <div className="grid gap-4 xl:grid-cols-3 overflow-hidden sm:w-auto w-82">

                    {/* Recent Orders Table */}
                    <section className="xl:col-span-2 rounded-3xl border sm:w-auto w-82 border-slate-200 bg-white shadow-sm">
                        <div className="p-6 pb-0">
                            <p className="text-sm font-medium text-slate-500">Recent Orders</p>
                            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Latest activity</h2>
                        </div>
                        <div className="overflow-x-auto sm:w-auto w-96 mt-4">
                            <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
                                <thead className="bg-slate-50 text-slate-600">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Order ID</th>
                                        <th className="px-4 py-3 font-medium">Customer</th>
                                        <th className="px-4 py-3 font-medium">Amount</th>
                                        <th className="px-4 py-3 font-medium">Status</th>
                                        <th className="px-4 py-3 font-medium">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-10 text-center text-slate-400 text-sm">Loading...</td>
                                        </tr>
                                    ) : recentOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-10 text-center text-slate-400 text-sm">No orders yet</td>
                                        </tr>
                                    ) : recentOrders.map(order => (
                                        <tr key={order._id} className="hover:bg-slate-50">
                                            <td className="px-4 py-4 font-semibold text-slate-900">
                                                #{order._id?.slice(-6).toUpperCase()}
                                            </td>
                                            <td className="px-4 py-4 text-slate-600">
                                                {order.userId?.name || order.shippingAddress?.name || '—'}
                                            </td>
                                            <td className="px-4 py-4 text-slate-600">₹{order.pricing?.total}</td>
                                            <td className="px-4 py-4">
                                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[order.status] || 'bg-slate-100 text-slate-700'}`}>
                                                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-slate-600">{formatDate(order.createdAt)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <div className="grid gap-4">
                        {/* Top Categories */}
                        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <p className="text-sm font-medium text-slate-500">Top Selling Categories</p>
                            <h2 className="mt-2 text-xl font-semibold text-slate-900">Category share</h2>
                            <div className="mt-6 space-y-4">
                                {topCategories.map(cat => (
                                    <div key={cat.label}>
                                        <div className="flex justify-between text-sm text-slate-700">
                                            <span>{cat.label}</span>
                                            <span className="font-semibold">{cat.percent}%</span>
                                        </div>
                                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                                            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${cat.percent}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Sales by Channel */}
                        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <p className="text-sm font-medium text-slate-500">Sales by Channel</p>
                            <h2 className="mt-2 text-xl font-semibold text-slate-900">Order sources</h2>
                            <div className="mt-4">
                                <SalesChannelChart />
                            </div>
                        </section>
                    </div>
                </div>

            </div>
        </main>
    )
}

export default AdminDashboard