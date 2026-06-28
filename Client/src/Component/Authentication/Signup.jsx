import React, { useState } from 'react'
import { Call, Eye, EyeSlash } from 'iconsax-react'
import { GoogleLogin } from '@react-oauth/google'
import { useStore } from '../utils/Zustand'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const ROLES = [
    { value: 'user',            label: '🛒 Customer',         desc: 'Shop groceries'    },
    { value: 'vendor',          label: '🏪 Vendor',           desc: 'Sell products'     },
    { value: 'deliverypartner', label: '🛵 Delivery Partner', desc: 'Deliver orders'    },
]

function Signup({ setshowSignup }) {
    const [showPassword, setShowPassword] = useState(false)
    const [user, setUser]                 = useState({ role: 'user' })
    const [msg, setMsg]                   = useState({ text: '', type: '' })
    const [loading, setLoading]           = useState(false)

    const closeAuthModal = useStore(s => s.closeAuthModal)

    const inpHandler = (e) => setUser(p => ({ ...p, [e.target.name]: e.target.value }))

    const submitHandler = async (e) => {
        e.preventDefault()
        if (!user.name || !user.email || !user.password) {
            setMsg({ text: 'Please fill in all required fields.', type: 'error' })
            return
        }
        if (user.password.length < 6) {
            setMsg({ text: 'Password must be at least 6 characters.', type: 'error' })
            return
        }
        setLoading(true)
        setMsg({ text: '', type: '' })
        try {
            const res  = await fetch(`${API_BASE}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user),
            })
            const data = await res.json()
            if (!res.ok) { setMsg({ text: data?.error || 'Signup failed.', type: 'error' }); return }
            setMsg({ text: 'Account created! You can now login.', type: 'success' })
            setTimeout(() => setshowSignup(false), 1500)
        } catch {
            setMsg({ text: 'Something went wrong. Please try again.', type: 'error' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md bg-white border border-slate-200 relative rounded-3xl shadow-xl p-8">
            {/* Close */}
            <button
                onClick={closeAuthModal}
                className="absolute right-4 top-4 h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition font-bold"
            >
                ✕
            </button>

            {/* Header */}
            <div className="mb-6 text-center">
                <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl">🌿</div>
                <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
                <p className="mt-1 text-sm text-slate-500">Join GoFresh and start shopping</p>
            </div>

            <form onSubmit={submitHandler} className="space-y-4">
                {/* Message */}
                {msg.text && (
                    <div className={`p-3 text-sm rounded-2xl text-center border ${
                        msg.type === 'success'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : 'bg-red-50 text-red-600 border-red-100'
                    }`}>
                        {msg.text}
                    </div>
                )}

                {/* Role selector */}
                <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">I want to</label>
                    <div className="grid grid-cols-3 gap-2">
                        {ROLES.map(r => (
                            <button
                                key={r.value}
                                type="button"
                                onClick={() => setUser(p => ({ ...p, role: r.value }))}
                                className={`rounded-2xl border p-3 text-center transition ${
                                    user.role === r.value
                                        ? 'border-emerald-500 bg-emerald-50'
                                        : 'border-slate-200 bg-slate-50 hover:border-emerald-200'
                                }`}
                            >
                                <p className="text-base">{r.label.split(' ')[0]}</p>
                                <p className="text-xs font-semibold text-slate-800 mt-0.5">{r.label.split(' ').slice(1).join(' ')}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">{r.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Name */}
                <div>
                    <label className="block mb-1.5 text-sm font-medium text-slate-700">Full Name <span className="text-red-400">*</span></label>
                    <input
                        onChange={inpHandler}
                        name="name"
                        type="text"
                        placeholder="Your full name"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    />
                </div>

                {/* Phone — optional */}
                <div>
                    <label className="block mb-1.5 text-sm font-medium text-slate-700">
                        Phone <span className="text-slate-400 text-xs font-normal">(optional)</span>
                    </label>
                    <div className="relative">
                        <Call className="absolute left-3 top-1/2 -translate-y-1/2" variant="Linear" color="#94a3b8" size={18} />
                        <input
                            onChange={inpHandler}
                            name="number"
                            type="tel"
                            maxLength={10}
                            placeholder="10-digit mobile number"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-sm text-slate-900 transition focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
                        />
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label className="block mb-1.5 text-sm font-medium text-slate-700">Email <span className="text-red-400">*</span></label>
                    <input
                        onChange={inpHandler}
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="block mb-1.5 text-sm font-medium text-slate-700">Password <span className="text-red-400">*</span></label>
                    <div className="relative">
                        <input
                            onChange={inpHandler}
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Min 6 characters"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-900 transition focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(p => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                        >
                            {showPassword
                                ? <EyeSlash size={20} color="currentColor" variant="Linear" />
                                : <Eye      size={20} color="currentColor" variant="Linear" />
                            }
                        </button>
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-2xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <><span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />Creating account...</>
                    ) : 'Create account'}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3">
                    <span className="h-px flex-1 bg-slate-200" />
                    <span className="text-xs uppercase tracking-widest text-slate-400">or</span>
                    <span className="h-px flex-1 bg-slate-200" />
                </div>

                {/* Google */}
                <div className="w-full flex justify-center">
                    <GoogleLogin
                        onSuccess={async (response) => {
                            try {
                                const res  = await fetch(`${API_BASE}/google-login`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    credentials: 'include',
                                    body: JSON.stringify({ credential: response.credential }),
                                })
                                const data = await res.json()
                                if (data?.user) closeAuthModal()
                            } catch (err) {
                                console.error('Google signup error:', err)
                            }
                        }}
                        onError={() => setMsg({ text: 'Google signup failed.', type: 'error' })}
                    />
                </div>

                <p className="text-center text-sm text-slate-500">
                    Already have an account?{' '}
                    <button
                        type="button"
                        onClick={() => setshowSignup(false)}
                        className="font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                        Login
                    </button>
                </p>
            </form>
        </div>
    )
}

export default Signup