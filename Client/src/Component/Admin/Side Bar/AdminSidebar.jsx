import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Category } from 'iconsax-react'

function AdminSidebar() {
    const [showUser, setshowUser] = useState(false);
    const [showProducts, setshowProducts] = useState(false);

    return (
        <div className='hidden lg:block'>
            <div className='rounded-3xl border border-slate-200 bg-white p-4 shadow-sm'>
                <Link to="/admin/dashboard" className='mb-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-emerald-700'>
                    <Category color='white' variant='Linear' size={24} />
                    <span>Dashboard</span>
                </Link>
                <div className='space-y-3'>
                    <button onClick={() => setshowUser((prev) => !prev)} className='flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-3 text-left text-sm font-medium text-slate-800 transition hover:bg-emerald-50'>
                        <span>Users</span>
                        <span>{showUser ? '−' : '+'}</span>
                    </button>
                    {showUser ? (
                        <div className='space-y-2 rounded-2xl bg-slate-50 p-3'>
                            <Link to="/admin/customers" className='block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100'>Customers</Link>
                            <Link to="/admin/vendors" className='block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100'>Vendors</Link>
                            <Link to="/admin/delivery-partners" className='block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100'>Delivery Partners</Link>
                        </div>
                    ) : null}

                    <button onClick={() => setshowProducts((prev) => !prev)} className='flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-3 text-left text-sm font-medium text-slate-800 transition hover:bg-emerald-50'>
                        <span>Products</span>
                        <span>{showProducts ? '−' : '+'}</span>
                    </button>
                    {showProducts ? (
                        <div className='space-y-2 rounded-2xl bg-slate-50 p-3'>
                            <Link to="/admin/products" className='block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100'>All Products</Link>
                            <Link to="/admin/categories" className='block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100'>Categories</Link>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    )
}

export default AdminSidebar
