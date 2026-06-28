import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeSlash } from 'iconsax-react'
import { GoogleLogin } from '@react-oauth/google'
import { useStore } from '../utils/Zustand'
import Signup from './Signup'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function Login() {
    const [showPassword, setShowPassword] = useState(false)
    const [showSignup, setShowSignup]     = useState(false)
    const [user, setUser]                 = useState({ email: '', password: '' })
    const [msg, setMsg]                   = useState('')
    const [loading, setLoading]           = useState(false)
    const navigate = useNavigate()

    const closeAuthModal  = useStore(s => s.closeAuthModal)
    const isUserDataModel = useStore(s => s.isUserDataModel)

    const handleNav = (role) => {
        if (role === 'admin')           navigate('/admin/dashboard')
        else if (role === 'vendor')     navigate('/vendor/dashboard')
        else if (role === 'deliverypartner') navigate('/delivery-partner/dashboard')
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        if (!user.email || !user.password) { setMsg('Please fill in all fields.'); return }
        setLoading(true)
        setMsg('')
        try {
            const res  = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(user),
            })
            const data = await res.json()
            if (!res.ok || !data?.user) { setMsg(data?.error || 'Login failed. Please try again.'); return }
            handleNav(data.user.role)
            await isUserDataModel()
            closeAuthModal()
        } catch {
            setMsg('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (showSignup) return <Signup setshowSignup={setShowSignup} />

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
            <div className="mb-7 text-center">
                <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl">🛒</div>
                <h1 className="text-2xl font-bold text-slate-900">Welcome back!</h1>
                <p className="mt-1 text-sm text-slate-500">Login to continue shopping</p>
            </div>

            <form onSubmit={submitHandler} className="space-y-4">
                {/* Error */}
                {msg && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-2xl text-center">
                        {msg}
                    </div>
                )}

                {/* Email */}
                <div>
                    <label className="block mb-1.5 text-sm font-medium text-slate-700">Email</label>
                    <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base">✉</span>
                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={e => setUser(p => ({ ...p, email: e.target.value }))}
                            placeholder="you@example.com"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-sm text-slate-900 transition focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
                        />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="text-sm font-medium text-slate-700">Password</label>
                        <button type="button" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
                            Forgot password?
                        </button>
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={user.password}
                            onChange={e => setUser(p => ({ ...p, password: e.target.value }))}
                            placeholder="Enter your password"
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
                        <><span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />Logging in...</>
                    ) : 'Login'}
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
                                if (!data?.user) return
                                handleNav(data.user.role)
                                await isUserDataModel()
                                closeAuthModal()
                            } catch (err) {
                                console.error('Google login error:', err)
                            }
                        }}
                        onError={() => setMsg('Google login failed. Please try again.')}
                    />
                </div>

                {/* Switch to signup */}
                <p className="text-center text-sm text-slate-500">
                    Don't have an account?{' '}
                    <button
                        type="button"
                        onClick={() => setShowSignup(true)}
                        className="font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                        Sign up free
                    </button>
                </p>
            </form>
        </div>
    )
}

export default Login