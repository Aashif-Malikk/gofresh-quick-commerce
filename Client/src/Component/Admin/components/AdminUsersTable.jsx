// components/AdminUsersTable.jsx
import React, { useState } from 'react'
import { useAdminUsers } from '../utils/useAdminUsers'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
}) : '—'

// Config per role — defines title, columns, button label
const ROLE_CONFIG = {
    user: {
        title:       'Customers',
        description: 'View and manage your customer accounts.',
        columns:     ['Name', 'Email', 'Location', 'Status', 'Joined'],
        renderRow:   (user) => ([
            user.name,
            user.email,
            user.location || '—',
            user.isActive,
            formatDate(user.createdAt),
        ]),
    },
    vendor: {
        title:       'Vendors',
        description: 'View and manage vendor accounts.',
        columns:     ['Name', 'Email', 'Location', 'Status', 'Joined'],
        renderRow:   (user) => ([
            user.name,
            user.email,
            user.location || '—',
            user.isActive,
            formatDate(user.createdAt),
        ]),
    },
    deliverypartner: {
        title:       'Delivery Partners',
        description: 'View and manage delivery partner accounts.',
        columns:     ['Name', 'Email', 'Location', 'Status', 'Joined'],
        renderRow:   (user) => ([
            user.name,
            user.email,
            user.location || '—',
            user.isActive,
            formatDate(user.createdAt),
        ]),
    },
}

function StatusBadge({ isActive }) {
    return (
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
        }`}>
            {isActive ? 'Active' : 'Inactive'}
        </span>
    )
}

function AdminUsersTable({ role }) {
    const { users, loading, error, refetch } = useAdminUsers(role)
    const [search, setSearch] = useState('')
    const config = ROLE_CONFIG[role]

    const filtered = users.filter(u =>
        `${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-4 sm:py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-screen-2xl">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                    {/* Header */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-slate-900">{config.title}</h1>
                            <p className="mt-1 text-sm text-slate-500">{config.description}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={refetch}
                                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
                            >
                                Refresh
                            </button>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="mb-4">
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder={`Search ${config.title.toLowerCase()} by name or email...`}
                            className="w-full sm:w-80 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                        />
                    </div>

                    {/* Count */}
                    <p className="mb-3 text-xs text-slate-400">
                        Showing {filtered.length} of {users.length} {config.title.toLowerCase()}
                    </p>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
                            <thead className="bg-slate-50 text-slate-600">
                                <tr>
                                    <th className="px-4 py-3 font-medium">#</th>
                                    {config.columns.map(col => (
                                        <th key={col} className="px-4 py-3 font-medium">{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {loading ? (
                                    <tr>
                                        <td colSpan={config.columns.length + 1} className="px-4 py-10 text-center text-slate-400 text-sm">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan={config.columns.length + 1} className="px-4 py-10 text-center text-red-400 text-sm">
                                            {error}
                                        </td>
                                    </tr>
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={config.columns.length + 1} className="px-4 py-10 text-center text-slate-400 text-sm">
                                            No {config.title.toLowerCase()} found.
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((user, i) => {
                                        const cells = config.renderRow(user)
                                        return (
                                            <tr key={user._id} className="hover:bg-slate-50 transition">
                                                <td className="px-4 py-4 text-slate-400 text-xs">{i + 1}</td>
                                                {cells.map((cell, j) => (
                                                    <td key={j} className="px-4 py-4">
                                                        {/* Status column renders a badge */}
                                                        {config.columns[j] === 'Status'
                                                            ? <StatusBadge isActive={cell} />
                                                            : <span className={j === 0 ? 'font-semibold text-slate-900' : 'text-slate-600'}>{cell}</span>
                                                        }
                                                    </td>
                                                ))}
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminUsersTable