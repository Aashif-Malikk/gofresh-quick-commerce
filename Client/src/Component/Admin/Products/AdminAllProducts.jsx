import { Edit2, More, SearchNormal } from 'iconsax-react'
import React, { useCallback, useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50]

const statusStyle = {
    'Active':       'bg-emerald-100 text-emerald-700',
    'Low Stock':    'bg-orange-100 text-orange-700',
    'Out of Stock': 'bg-rose-100 text-rose-700',
}

const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
}) : '—'

function AdminAllProducts() {
    // ── Data state ─────────────────────────────────────────────
    const [products, setProducts]   = useState([])
    const [total, setTotal]         = useState(0)
    const [loading, setLoading]     = useState(true)
    const [error, setError]         = useState(null)

    // ── Filter state ───────────────────────────────────────────
    const [searchTerm, setSearchTerm]           = useState('')
    const [searchInput, setSearchInput]         = useState('')  // debounced
    const [selectedCategory, setSelectedCategory] = useState('All Categories')
    const [selectedStatus, setSelectedStatus]   = useState('All Status')

    // ── Pagination state ───────────────────────────────────────
    const [currentPage, setCurrentPage]         = useState(1)
    const [itemsPerPage, setItemsPerPage]       = useState(10)

    // ── Stats ──────────────────────────────────────────────────
    const [stats, setStats] = useState({
        total: 0, active: 0, outOfStock: 0, lowStock: 0
    })

    // ── Debounce search input ──────────────────────────────────
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(searchInput)
            setCurrentPage(1)
        }, 400)
        return () => clearTimeout(timer)
    }, [searchInput])

    // ── Fetch products ─────────────────────────────────────────
    const fetchProducts = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const params = new URLSearchParams({
                page:     currentPage,
                limit:    itemsPerPage,
                ...(searchTerm      && { search:   searchTerm }),
                ...(selectedCategory !== 'All Categories' && { category: selectedCategory }),
                ...(selectedStatus   !== 'All Status'     && { status:   selectedStatus }),
            })

            const res = await fetch(`${API_BASE}/admin/products?${params}`, {
                credentials: 'include'
            })
            if (!res.ok) throw new Error('Failed to fetch')
            const data = await res.json()

            setProducts(data.products || [])
            setTotal(data.total || 0)

            // derive stats from full unfiltered count if backend returns them
            // otherwise calculate from current page data as approximation
            setStats({
                total:      data.total || 0,
                active:     data.products.filter(p => p.status === 'Active').length,
                outOfStock: data.products.filter(p => p.status === 'Out of Stock').length,
                lowStock:   data.products.filter(p => p.status === 'Low Stock').length,
            })
        } catch (err) {
            console.error(err)
            setError('Failed to load products.')
        } finally {
            setLoading(false)
        }
    }, [currentPage, itemsPerPage, searchTerm, selectedCategory, selectedStatus])

    useEffect(() => { fetchProducts() }, [fetchProducts])

    // ── Pagination ─────────────────────────────────────────────
    const totalPages = Math.ceil(total / itemsPerPage)
    const startIdx   = (currentPage - 1) * itemsPerPage

    const getPageNumbers = () => {
        const pages = []
        const range = 2  // pages around current
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - range && i <= currentPage + range)) {
                pages.push(i)
            } else if (pages[pages.length - 1] !== '...') {
                pages.push('...')
            }
        }
        return pages
    }

    const statCards = [
        { label: 'Total Products',    value: total,            color: 'text-emerald-600', icon: '📦' },
        { label: 'Active Products',   value: stats.active,     color: 'text-emerald-600', icon: '✓'  },
        { label: 'Out of Stock',      value: stats.outOfStock, color: 'text-rose-600',    icon: '⊘'  },
        { label: 'Low Stock',         value: stats.lowStock,   color: 'text-orange-600',  icon: '⚠'  },
    ]

    return (
        <div className="space-y-6">

            {/* ── Header ── */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span>Dashboard</span><span>›</span>
                        <span>Products</span><span>›</span>
                        <span className="font-medium text-slate-900">All Products</span>
                    </div>
                    <h1 className="mt-2 text-3xl font-semibold text-slate-900">All Products</h1>
                    <p className="mt-1 text-sm text-slate-600">Manage and monitor all products in your inventory</p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                        onClick={fetchProducts}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        ↻ Refresh
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
                        + Add Product
                    </button>
                </div>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                {statCards.map(stat => (
                    <div key={stat.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                                <p className="mt-2 text-3xl font-semibold text-slate-900">
                                    {loading ? <span className="text-slate-300">...</span> : stat.value}
                                </p>
                            </div>
                            <span className="text-3xl">{stat.icon}</span>
                        </div>
                        <p className={`mt-3 text-sm ${stat.color}`}>vs last month</p>
                    </div>
                ))}
            </div>

            {/* ── Filters ── */}
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                    <div className="relative flex-1">
                        <SearchNormal color="black" variant="Linear" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name or category..."
                            value={searchInput}
                            onChange={e => { setSearchInput(e.target.value); setCurrentPage(1) }}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 transition focus:border-emerald-400 focus:bg-white focus:outline-none"
                        />
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <select
                            value={selectedCategory}
                            onChange={e => { setSelectedCategory(e.target.value); setCurrentPage(1) }}
                            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-emerald-200 outline-none"
                        >
                            <option>All Categories</option>
                            <option>Dairy & Eggs</option>
                            <option>Fruits & Vegetables</option>
                            <option>Staples</option>
                            <option>Beverages</option>
                            <option>Snacks & Biscuits</option>
                            <option>Personal Care</option>
                        </select>
                        <select
                            value={selectedStatus}
                            onChange={e => { setSelectedStatus(e.target.value); setCurrentPage(1) }}
                            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-emerald-200 outline-none"
                        >
                            <option>All Status</option>
                            <option>Active</option>
                            <option>Out of Stock</option>
                            <option>Low Stock</option>
                        </select>
                        {/* Reset filters */}
                        {(searchInput || selectedCategory !== 'All Categories' || selectedStatus !== 'All Status') && (
                            <button
                                onClick={() => {
                                    setSearchInput('')
                                    setSearchTerm('')
                                    setSelectedCategory('All Categories')
                                    setSelectedStatus('All Status')
                                    setCurrentPage(1)
                                }}
                                className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600 transition hover:bg-rose-100"
                            >
                                ✕ Clear
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Table ── */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-slate-900">Products List</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            {loading ? 'Loading...' : `Showing ${startIdx + 1}–${Math.min(startIdx + itemsPerPage, total)} of ${total} products`}
                        </p>
                    </div>
                    <select
                        value={itemsPerPage}
                        onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1) }}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 outline-none"
                    >
                        {ITEMS_PER_PAGE_OPTIONS.map(n => (
                            <option key={n} value={n}>{n} per page</option>
                        ))}
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-max border-collapse">
                        <thead className="border-b border-slate-200 bg-slate-50">
                            <tr className="text-left text-sm font-semibold text-slate-700">
                                <th className="px-4 py-3">#</th>
                                <th className="px-4 py-3">Product</th>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3">Vendor</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">Stock</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Added On</th>
                                <th className="px-4 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={9} className="px-4 py-16 text-center text-slate-400 text-sm">
                                        Loading products...
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={9} className="px-4 py-16 text-center text-red-400 text-sm">
                                        {error}
                                        <button onClick={fetchProducts} className="ml-3 text-emerald-600 underline">Retry</button>
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-4 py-16 text-center text-slate-400 text-sm">
                                        No products found.
                                    </td>
                                </tr>
                            ) : products.map((product, i) => (
                                <tr key={product._id} className="text-sm text-slate-600 hover:bg-slate-50 transition">
                                    <td className="px-4 py-4 text-slate-400 text-xs">{startIdx + i + 1}</td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            {product.imgSrc ? (
                                                <img
                                                    src={product.imgSrc}
                                                    alt={product.name}
                                                    className="h-10 w-10 rounded-xl object-cover border border-slate-200 bg-slate-50"
                                                />
                                            ) : (
                                                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg">📦</div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-slate-900 capitalize">{product.name}</p>
                                                <p className="text-xs text-slate-400">{product.weight}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">{product.category}</td>
                                    <td className="px-4 py-4">{product.vendor}</td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-slate-900">₹{product.price}</span>
                                            {product.mrp && (
                                                <span className="text-xs text-slate-400 line-through">₹{product.mrp}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`font-semibold ${product.stock === 0 ? 'text-rose-600' : product.stock <= 10 ? 'text-orange-600' : 'text-slate-900'}`}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[product.status] || 'bg-slate-100 text-slate-700'}`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-slate-500">{formatDate(product.createdAt)}</td>
                                    <td className="px-4 py-4">
                                        <div className="flex justify-center gap-1">
                                            <button className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
                                                <Edit2 color="currentColor" variant="Linear" size={16} />
                                            </button>
                                            <button className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
                                                <More className="rotate-90" color="currentColor" variant="Linear" size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ── Pagination ── */}
                {totalPages > 1 && (
                    <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-slate-500">
                            Page {currentPage} of {totalPages}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => p - 1)}
                                className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                ← Prev
                            </button>

                            {getPageNumbers().map((page, i) =>
                                page === '...' ? (
                                    <span key={`dots-${i}`} className="px-2 text-slate-400">...</span>
                                ) : (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`min-w-9 rounded-xl px-3 py-2 text-sm font-medium transition ${
                                            currentPage === page
                                                ? 'bg-emerald-600 text-white'
                                                : 'text-slate-700 hover:bg-slate-100'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                )
                            )}

                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(p => p + 1)}
                                className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminAllProducts