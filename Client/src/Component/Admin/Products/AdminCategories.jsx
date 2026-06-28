import { Edit2, More, SearchNormal } from 'iconsax-react'
import React, { useState } from 'react'

const categoriesData = [
  { name: 'Dairy & Eggs', desc: 'Milk, butter, cheese, eggs and other dairy products', products: 245, status: 'Active', date: 'May 20, 2024', icon: '🥛' },
  { name: 'Fruits & Vegetables', desc: 'Fresh fruits and vegetables', products: 520, status: 'Active', date: 'May 18, 2024', icon: '🍎' },
  { name: 'Staples', desc: 'Rice, dal, flour, sugar, salt and more', products: 320, status: 'Active', date: 'May 15, 2024', icon: '🌾' },
  { name: 'Beverages', desc: 'Juices, soft drinks, tea, coffee and more', products: 210, status: 'Active', date: 'May 12, 2024', icon: '🥤' },
  { name: 'Snacks & Biscuits', desc: 'Chips, biscuits, namkeen and other snacks', products: 415, status: 'Active', date: 'May 10, 2024', icon: '🍪' },
  { name: 'Personal Care', desc: 'Soaps, shampoo, skincare and more', products: 180, status: 'Active', date: 'May 08, 2024', icon: '🧴' },
  { name: 'Cleaning Essentials', desc: 'Detergents, dishwashers, cleaners and more', products: 150, status: 'Inactive', date: 'May 05, 2024', icon: '🧼' },
  { name: 'Baby Care', desc: 'Baby food, diapers, wipes and more', products: 80, status: 'Inactive', date: 'May 02, 2024', icon: '👶' },
]

function AdminCategories() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filtered = categoriesData.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.desc.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'All Status' || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))
  const startIdx = (currentPage - 1) * itemsPerPage
  const pageItems = filtered.slice(startIdx, startIdx + itemsPerPage)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Dashboard</span>
            <span>›</span>
            <span>Products</span>
            <span>›</span>
            <span className="text-slate-900 font-medium">Categories</span>
          </div>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Categories</h1>
          <p className="mt-1 text-sm text-slate-600">Manage product categories and their statuses</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">↓ Export</button>
          <button className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">+ Add Category</button>
        </div>
      </div>

      {/* <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <input value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1) }} placeholder="Search category by name..." className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm text-slate-900 focus:border-emerald-400 focus:bg-white" />
          </div>
          <div className="flex items-center gap-3">
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1) }} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            <button className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">Filters</button>
          </div>
        </div>
      </div> */}

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Categories</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">18</p>
          <p className="mt-3 text-sm text-emerald-600">12.5% vs last month</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Active Categories</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">16</p>
          <p className="mt-3 text-sm text-emerald-600">14.3% vs last month</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Inactive Categories</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">2</p>
          <p className="mt-3 text-sm text-rose-600">33.3% vs last month</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Products</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">2,458</p>
          <p className="mt-3 text-sm text-emerald-600">10.8% vs last month</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <SearchNormal color='black' variant='Linear' className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search product by name, ID or vendor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 transition focus:border-emerald-400 focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-slate-900">Categories List</h2>
          <p className="mt-1 text-sm text-slate-600">Showing {startIdx + 1} to {Math.min(startIdx + itemsPerPage, filtered.length)} of {filtered.length} categories</p>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-230">
            <table className="w-full border-collapse">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr className="text-left text-sm font-semibold text-slate-700">
                  <th className="px-4 py-3">&nbsp;</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Products</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created On</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {pageItems.map((c) => (
                  <tr key={c.name} className="text-sm text-slate-600 hover:bg-slate-50">
                    <td className="px-4 py-4">☰</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{c.icon}</div>
                        <div>
                          <p className="font-semibold text-slate-900">{c.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{c.desc}</td>
                    <td className="px-4 py-4 font-semibold text-slate-900">{c.products}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${c.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">{c.date}</td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100">
                          <Edit2 color='black' variant='Linear' size={18} />
                        </button>
                        <button className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100">
                          <More className=' rotate-90' color='black' variant='Linear' size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">Showing {startIdx + 1} to {Math.min(startIdx + itemsPerPage, filtered.length)} of {filtered.length} categories</p>
          <div className="flex items-center gap-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50">← Prev</button>
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                const pageNum = i + 1
                return (
                  <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`min-w-10 rounded-lg px-3 py-2 text-sm font-medium ${currentPage === pageNum ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}>
                    {pageNum}
                  </button>
                )
              })}
              {totalPages > 5 && <span className="text-slate-600">...</span>}
            </div>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50">Next →</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminCategories
