import { HambergerMenu, User } from 'iconsax-react';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
const API_BASE = 'http://localhost:3000'

function AdminNav() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [showUser, setshowUser] = useState(false);
    const [showProducts, setshowProducts] = useState(false);
    const navigate = useNavigate()

    const logoutUser = async (e) => {
        try {
            const res = await fetch(`${API_BASE}/logout`, {
                method: "GET",
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            navigate("/")
        } catch (err) {
            console.error('Error in logout:', err);
        }
    }

    return (
        <header className="sticky top-0 z-20 bg-white/95 border-b border-slate-200 backdrop-blur-md">
            <div className="container mx-auto flex flex-wrap items-center sm:justify-between justify-evenly gap-y-1 gap-x-5 sm:gap-4 sm:p-4 p-2 lg:px-6">
                <div className='flex sm:hidden'>
                    <button onClick={() => { setIsDrawerOpen(true) }} aria-label="Open menu">
                        <HambergerMenu variant='Linear' color='black' size={32} />
                    </button>
                </div>
                <a href="/" className="flex items-center sm:gap-3 gap-1 cursor-auto sm:h-auto sm:w-auto w-fit h-20">
                    <img src="/GoFresh_logo.png" alt="GoFresh Logo" className="sm:h-15 sm:w-12 h-12 w-10" />
                    <div>
                        <h1 className="text-2xl sm:text-2xl lg:text-2xl font-bold tracking-tight text-slate-900">
                            Go<span className="text-emerald-600">Fresh</span>
                        </h1>
                        <p className="text-sm font-medium text-emerald-700">Admin Panel</p>
                    </div>
                </a>
                <div className="group cursor-pointer inline-flex min-w-42.5 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-800 shadow-sm transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:border-emerald-200 hover:bg-emerald-50">
                    <User className="transition duration-300 group-hover:scale-110" size={30} color="currentColor" variant="Linear" />
                    <div>
                        <p className="font-semibold">Malik</p>
                        <p className="text-xs text-slate-500">My account</p>
                    </div>
                    <div className='hidden group-hover:block absolute top-15 bg-white border-2 rounded-2xl border-slate-200 p-3'>
                        <button onClick={logoutUser} className='bg-red-500 cursor-pointer py-2 px-3 rounded-lg text-white'>Logout</button>
                    </div>
                </div>
            </div>

            {/* ---------side bar----------------- */}
            <div className={`relative inset-0 z-30 sm:hidden ${isDrawerOpen ? 'visible' : 'invisible'} transition-opacity duration-300`}>
                <button
                    className={`absolute inset-0 bg-slate-900/50 transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100' : 'opacity-0'}`}
                    aria-label="Close menu"
                    onClick={() => { setIsDrawerOpen(false); setIsLocationInput(false); }}
                />
                <aside className={`fixed left-0 top-0 bottom-0 z-40 w-72 max-w-[80vw] bg-white h-screen shadow-2xl border-r border-slate-200 transition-transform duration-300 ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <button onClick={() => setIsDrawerOpen(false)} className='absolute right-2 text-2xl font-bold'>X</button>
                    <div className="flex h-full flex-col justify-between p-5">
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-slate-900">Menu</h2>
                            <nav className="space-y-2">
                                <Link to="/admin/dashboard" className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-3 text-left text-sm font-medium text-slate-800 transition hover:bg-emerald-50" onClick={() => setIsDrawerOpen(false)}>
                                    Deshboard
                                </Link>
                                <button onClick={() => setshowUser((prev) => !prev)} className='flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-3 text-left text-sm font-medium text-slate-800 transition hover:bg-emerald-50'>
                                    <span>Users</span>
                                    <span>{showUser ? '−' : '+'}</span>
                                </button>
                                {showUser ? (
                                    <div className='space-y-2 rounded-2xl bg-slate-50 p-3'>
                                        <Link onClick={() => setIsDrawerOpen(false)} to="/admin/customers" className='block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100'>Customers</Link>
                                        <Link onClick={() => setIsDrawerOpen(false)} to="/admin/vendors" className='block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100'>Vendors</Link>
                                        <Link onClick={() => setIsDrawerOpen(false)} to="/admin/delivery-partners" className='block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100'>Delivery Partners</Link>
                                    </div>
                                ) : null}

                                <button onClick={() => setshowProducts((prev) => !prev)} className='flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-3 text-left text-sm font-medium text-slate-800 transition hover:bg-emerald-50'>
                                    <span>Products</span>
                                    <span>{showProducts ? '−' : '+'}</span>
                                </button>
                                {showProducts ? (
                                    <div className='space-y-2 rounded-2xl bg-slate-50 p-3'>
                                        <Link onClick={() => setIsDrawerOpen(false)} to="/admin/products" className='block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100'>All Products</Link>
                                        <Link onClick={() => setIsDrawerOpen(false)} to="/admin/categories" className='block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100'>Categories</Link>
                                    </div>
                                ) : null}
                            </nav>
                        </div>
                        <div>
                            <div>
                                <div className="mb-4 flex items-center gap-3">
                                    <User size={30} color="currentColor" variant="Linear" />
                                    <span className="text-lg font-semibold text-slate-900">Malik</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsDrawerOpen(false);
                                        logoutUser();
                                    }}
                                    className="w-full rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                                >
                                    Logout
                                </button>
                            </div>

                        </div>
                    </div>
                </aside>
            </div>
        </header>
    )
}

export default AdminNav
