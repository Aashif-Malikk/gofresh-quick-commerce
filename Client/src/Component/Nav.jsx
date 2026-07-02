import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowDown2, DiscountShape, HambergerMenu, Location, SearchNormal1, ShoppingCart, User, Category } from 'iconsax-react'
import { useStore } from "./utils/Zustand"

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function Nav() {
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [updateLocation, setupdateLocation] = useState("")
    const [isLocationInput, setIsLocationInput] = useState(false)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    // const [searchTerm, setSearchTerm] = useState('')

    const locationRef = useRef(null)
    const userMenuRef = useRef(null)
    const navigate = useNavigate()

    const openAuthModal = useStore(s => s.openAuthModal)
    const isUserData = useStore(s => s.isUserData)
    const cartItemId = useStore(s => s.cartItemId)
    const searchTerm = useStore(s => s.searchTerm)
    const setSearchTerm = useStore(s => s.setSearchTerm)
    
    // ── Fetch user data ─────────────────────────────────────────
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetch(`${API_BASE}/namelocation`, {
                    method: 'GET', credentials: 'include'
                })
                if (!res.ok) throw new Error()
                const data = await res.json()
                setUserData(data)
            } catch {
                setUserData(null)
            } finally {
                setLoading(false)
            }
        }
        fetchUserData()
    }, [isUserData])

    // ── Close on outside click ──────────────────────────────────
    useEffect(() => {
        const handleOutside = (e) => {
            if (locationRef.current && !locationRef.current.contains(e.target)) setIsLocationInput(false)
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setIsUserMenuOpen(false)
        }
        const handleKey = (e) => {
            if (e.key === 'Escape') { setIsLocationInput(false); setIsUserMenuOpen(false) }
        }
        document.addEventListener('mousedown', handleOutside)
        document.addEventListener('touchstart', handleOutside)
        document.addEventListener('keydown', handleKey)
        return () => {
            document.removeEventListener('mousedown', handleOutside)
            document.removeEventListener('touchstart', handleOutside)
            document.removeEventListener('keydown', handleKey)
        }
    }, [])

    const logoutUser = async () => {
        try {
            await fetch(`${API_BASE}/logout`, { method: 'GET', credentials: 'include' })
            window.location.reload()
        } catch (err) {
            console.error('Logout error:', err)
        }
    }

    const updateLocFunc = async () => {
        if (!updateLocation.trim()) return
        try {
            await fetch(`${API_BASE}/updatelocation`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ location: updateLocation })
            })
            window.location.reload()
        } catch (err) {
            console.error('Location update error:', err)
        }
    }

    const isLoggedIn = userData?.isloggedin

    return (
        <>
            {/* ── Desktop / Tablet Header ── */}
            <header className="sticky top-0 z-20 bg-white/95 border-b border-slate-200 backdrop-blur-md">
                <div className="container mx-auto flex items-center gap-3 p-3 sm:p-4 lg:px-6">

                    {/* Hamburger — mobile only */}
                    <button
                        className="sm:hidden p-1.5"
                        onClick={() => setIsDrawerOpen(true)}
                        aria-label="Open menu"
                    >
                        <HambergerMenu variant="Linear" color="black" size={28} />
                    </button>

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 shrink-0">
                        <img src="./GoFresh_logo.png" alt="GoFresh Logo" className="h-10 w-8 sm:h-12 sm:w-10" />
                        <div className="hidden sm:block">
                            <h1 className="text-xl font-bold text-slate-900">Go<span className="text-emerald-600">Fresh</span></h1>
                            <p className="text-xs font-medium text-emerald-700">Groceries in 15 minutes</p>
                        </div>
                    </Link>

                    {/* Location picker */}
                    <div ref={locationRef} className="hidden sm:block relative">
                        <button
                            onClick={() => setIsLocationInput(v => !v)}
                            className="group flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-emerald-400 hover:bg-emerald-50"
                        >
                            <Location size={20} color="currentColor" variant="Linear" className="text-emerald-600 shrink-0" />
                            <div className="text-left">
                                <p className="text-[10px] uppercase tracking-widest text-slate-400">Deliver to</p>
                                <p className="max-w-35 overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-slate-900">
                                    {isLoggedIn ? userData.location : 'Add location'}
                                </p>
                            </div>
                            <ArrowDown2 size={14} color="currentColor" variant="Linear" />
                        </button>

                        {/* Location dropdown */}
                        {isLocationInput && (
                            <div className="absolute top-14 left-0 z-50 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
                                <p className="mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Update delivery location</p>
                                <div className="flex gap-2">
                                    <input
                                        defaultValue={isLoggedIn ? userData.location : ''}
                                        onChange={e => setupdateLocation(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && updateLocFunc()}
                                        placeholder="Enter your address..."
                                        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-400"
                                    />
                                    <button
                                        onClick={updateLocFunc}
                                        className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Search bar */}
                    <div className="relative flex-1 min-w-0">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 sm:py-3 sm:pl-5 sm:pr-12 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                            placeholder="Search for milk, eggs, fruits..."
                        />
                        <SearchNormal1 className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} color="currentColor" variant="Linear" />
                    </div>

                    {/* Desktop right buttons */}
                    <div className="hidden sm:flex items-center gap-2 shrink-0">
                        {/* Offers */}
                        <button className="group flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50">
                            <DiscountShape size={22} color="currentColor" variant="Bold" className="text-emerald-600" />
                            <span className="font-semibold">Offers</span>
                        </button>

                        {/* User menu */}
                        <div ref={userMenuRef} className="relative">
                            {isLoggedIn ? (
                                <button
                                    onClick={() => setIsUserMenuOpen(v => !v)}
                                    className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50"
                                >
                                    <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                                        {userData.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold text-slate-900 max-w-25 truncate">{userData.name}</p>
                                        <p className="text-xs text-slate-500">My account</p>
                                    </div>
                                </button>
                            ) : (
                                <button
                                    onClick={openAuthModal}
                                    className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50"
                                >
                                    <User size={22} color="currentColor" variant="Linear" />
                                    <div className="text-left">
                                        <p className="font-semibold">Login / Sign up</p>
                                        <p className="text-xs text-slate-500">My account</p>
                                    </div>
                                </button>
                            )}

                            {/* User dropdown */}
                            {isUserMenuOpen && isLoggedIn && (
                                <div className="absolute right-0 top-14 z-50 w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                                        <p className="font-semibold text-slate-900 text-sm truncate">{userData.name}</p>
                                        <p className="text-xs text-slate-400 truncate">{userData.email}</p>
                                    </div>
                                    <Link to="/orders" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2 w-full rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition">
                                        📦 My Orders
                                    </Link>
                                    <button
                                        onClick={logoutUser}
                                        className="flex items-center gap-2 w-full rounded-xl px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                                    >
                                        🚪 Logout
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Cart */}
                        <Link
                            to="/cart"
                            className="group relative flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700"
                        >
                            {cartItemId.length > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                    {cartItemId.length}
                                </span>
                            )}
                            <ShoppingCart size={22} color="currentColor" variant="TwoTone" />
                            <span>Cart</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* ── Mobile Bottom Navigation Bar ── */}
            <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 px-2 py-2 flex items-center justify-around">
                {/* Home / Category */}
                <Link to="/" className="flex flex-col items-center gap-1 p-2 rounded-2xl text-slate-500 hover:text-emerald-600 transition">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <Category size={22} color="currentColor" variant="Linear" />
                    </div>
                    <span className="text-[10px] font-medium">Categories</span>
                </Link>

                {/* Location */}
                <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="flex flex-col items-center gap-1 p-2 rounded-2xl text-slate-500 hover:text-emerald-600 transition"
                >
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <Location size={22} color="currentColor" variant="Linear" />
                    </div>
                    <span className="text-[10px] font-medium">Location</span>
                </button>

                {/* Cart */}
                <Link to="/cart" className="flex flex-col items-center gap-1 p-2 rounded-2xl transition">
                    <div className="relative h-12 w-12 rounded-full bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/40">
                        {cartItemId.length > 0 && (
                            <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                {cartItemId.length}
                            </span>
                        )}
                        <ShoppingCart size={24} color="white" variant="TwoTone" />
                    </div>
                    <span className="text-[10px] font-medium text-emerald-600">Cart</span>
                </Link>

                {/* Offers */}
                <button className="flex flex-col items-center gap-1 p-2 rounded-2xl text-slate-500 hover:text-emerald-600 transition">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <DiscountShape size={22} color="currentColor" variant="Bold" />
                    </div>
                    <span className="text-[10px] font-medium">Offers</span>
                </button>

                {/* Profile */}
                <button
                    onClick={isLoggedIn ? () => setIsUserMenuOpen(v => !v) : openAuthModal}
                    className="flex flex-col items-center gap-1 p-2 rounded-2xl text-slate-500 hover:text-emerald-600 transition"
                >
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                        {isLoggedIn ? (
                            <span className="text-base font-bold text-emerald-700">
                                {userData.name?.charAt(0).toUpperCase()}
                            </span>
                        ) : (
                            <User size={22} color="currentColor" variant="Linear" />
                        )}
                    </div>
                    <span className="text-[10px] font-medium">{isLoggedIn ? 'Profile' : 'Login'}</span>
                </button>

                {/* Mobile user menu popup */}
                {isUserMenuOpen && isLoggedIn && (
                    <div className="absolute bottom-20 right-2 z-50 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">
                        <div className="px-3 py-2 border-b border-slate-100 mb-1">
                            <p className="font-semibold text-slate-900 text-sm">{userData.name}</p>
                            <p className="text-xs text-slate-400 truncate">{userData.email}</p>
                        </div>
                        <Link to="/orders" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2 w-full rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                            📦 My Orders
                        </Link>
                        <button onClick={logoutUser} className="flex items-center gap-2 w-full rounded-xl px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                            🚪 Logout
                        </button>
                    </div>
                )}
            </nav>

            {/* ── Mobile Sidebar Drawer ── */}
            {isDrawerOpen && (
                <div className="fixed inset-0 z-40 sm:hidden">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setIsDrawerOpen(false)}
                    />
                    <aside className="absolute left-0 top-0 bottom-0 w-72 max-w-[80vw] bg-white shadow-2xl flex flex-col">
                        <div className="flex items-center justify-between p-5 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <img src="./GoFresh_logo.png" alt="GoFresh" className="h-9 w-7" />
                                <h1 className="text-lg font-bold text-slate-900">Go<span className="text-emerald-600">Fresh</span></h1>
                            </div>
                            <button
                                onClick={() => setIsDrawerOpen(false)}
                                className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold hover:bg-slate-200"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Location inside drawer */}
                        <div className="p-4 border-b border-slate-100">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Delivery Location</p>
                            <div className="flex gap-2">
                                <input
                                    defaultValue={isLoggedIn ? userData?.location : ''}
                                    onChange={e => setupdateLocation(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && updateLocFunc()}
                                    placeholder="Enter your address..."
                                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-400"
                                />
                                <button
                                    onClick={updateLocFunc}
                                    className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white"
                                >
                                    Save
                                </button>
                            </div>
                        </div>

                        {/* Nav links */}
                        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                            {[
                                { icon: '🏠', label: 'Home', to: '/' },
                                { icon: '📦', label: 'My Orders', to: '/orders' },
                                { icon: '🏷', label: 'Offers', to: '/offers' },
                                { icon: '⚙️', label: 'Settings', to: '/settings' },
                            ].map(item => (
                                <Link
                                    key={item.label}
                                    to={item.to}
                                    onClick={() => setIsDrawerOpen(false)}
                                    className="flex items-center gap-3 w-full rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                                >
                                    <span className="text-lg">{item.icon}</span>
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Bottom auth */}
                        <div className="p-4 border-t border-slate-100">
                            {isLoggedIn ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 px-2">
                                        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                                            {userData.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 text-sm">{userData.name}</p>
                                            <p className="text-xs text-slate-400">{userData.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setIsDrawerOpen(false);
                                            logoutUser()
                                        }}
                                        className="w-full rounded-2xl bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700 transition"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => { setIsDrawerOpen(false); openAuthModal() }}
                                    className="w-full rounded-2xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition"
                                >
                                    Login / Sign up
                                </button>
                            )}
                        </div>
                    </aside>
                </div>
            )}

            {/* Spacer so content isn't hidden behind mobile bottom nav */}
            <div className="sm:hidden h-20" />
        </>
    )
}

export default Nav