import React, { useState } from 'react'
import { ArrowDown, ArrowDown2, HambergerMenu, Location, User } from 'iconsax-react';
import { useNavigate, Link } from 'react-router-dom';
const API_BASE = 'http://localhost:3000'

function DeliveryNav() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [showUser, setshowUser] = useState(false);
    // const [user, setuser] = useState(initialState)
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

    // useEffect(() => {
    //     const fetchUserData = async () => {
    //         try {
    //             const res = await fetch(`${API_BASE}/namelocation`, {
    //                 method: "GET",
    //                 credentials: "include",
    //             });

    //             if (!res.ok) {
    //                 throw new Error(`HTTP error! status: ${res.status}`);
    //             }

    //             const data = await res.json();
    //             setUserData(data);
    //             console.log(data)
    //         } catch (err) {
    //             console.error('Error fetching user data:', err);
    //             setUserData(null);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchUserData();
    // }, [showAuthModal]);

    return (
        <header className="sticky top-0 z-20 bg-white/95 border-b border-slate-200 backdrop-blur-md">
            <div className="container mx-auto flex items-center sm:justify-between gap-y-1 gap-x-5 sm:gap-4 sm:p-4 p-2 lg:px-6">
                <div className='flex sm:hidden'>
                    <button onClick={() => { setIsDrawerOpen(true) }} aria-label="Open menu">
                        <HambergerMenu variant='Linear' color='black' size={32} />
                    </button>
                </div>
                <div href="/" className="flex items-center gap-3 cursor-auto sm:h-auto sm:w-auto w-fit h-20">
                    <img src="/GoFresh_logo.png" alt="GoFresh Logo" className="sm:h-15 sm:w-12 h-12 w-10" />
                    <div>
                        <h1 className="text-2xl sm:text-2xl lg:text-2xl font-bold tracking-tight text-slate-900">
                            Go<span className="text-emerald-600">Fresh</span>
                        </h1>
                        <p className="text-sm font-medium text-emerald-700">Vendor Panel</p>
                    </div>
                    <div className="group cursor-pointer inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 sm:px-4 sm:py-3 text-left text-sm font-medium text-slate-700 shadow-sm transition duration-300 ease-out hover:-translate-y-0.5 hover:border-emerald-600 hover:bg-emerald-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 motion-safe:focus:ring-offset-2">
                        <div className="group flex items-center gap-2 relative">
                            <Location className="transition duration-300 group-hover:text-white" size="24" color="currentColor" variant="Linear" />
                            <div>
                                <p className="font-semibold overflow-hidden whitespace-nowrap text-ellipsis text-slate-900 group-hover:text-white">Aadil Shop</p>
                            </div>
                            <ArrowDown2 className="transition duration-300 group-hover:text-white" size={18} color="currentColor" variant="Linear" />
                        </div>
                    </div>
                </div>

                <div className="sm:flex hidden flex-wrap items-center gap-3 justify-end">
                    <div className="group cursor-pointer inline-flex min-w-42.5 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-800 shadow-sm transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:border-emerald-200 hover:bg-emerald-50">
                        <User className="transition duration-300 group-hover:scale-110" size={30} color="currentColor" variant="Linear" />
                        <div>
                            <p className="font-semibold">Aadil</p>
                            <p className="text-xs text-slate-500">My account</p>
                        </div>
                        <div className='hidden group-hover:block absolute top-15 bg-white border-2 rounded-2xl border-slate-200 p-3'>
                            <button onClick={logoutUser} className='bg-red-500 cursor-pointer py-2 px-3 rounded-lg text-white'>Logout</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`relative inset-0 z-30 sm:hidden ${isDrawerOpen ? 'visible' : 'invisible'} transition-opacity duration-300`}>
                <button
                    className={`absolute inset-0 bg-slate-900/50 transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100' : 'opacity-0'}`}
                    aria-label="Close menu"
                    onClick={() => { setIsDrawerOpen(false) }}
                />
                <aside className={`fixed left-0 top-0 bottom-0 z-40 w-72 max-w-[80vw] bg-white h-screen shadow-2xl border-r border-slate-200 transition-transform duration-300 ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <button onClick={() => setIsDrawerOpen(false)} className='absolute right-2 text-2xl font-bold'>X</button>
                    <div className="flex h-full flex-col justify-between p-5">
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-slate-900">Menu</h2>
                            <nav className="space-y-2">
                                <Link to="/delivery-partner/dashboard" className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-3 text-left text-sm font-medium text-slate-800 transition hover:bg-emerald-50" onClick={() => setIsDrawerOpen(false)}>
                                    Dashboard
                                </Link>
                                <Link to="/delivery-partner/orders" className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-3 text-left text-sm font-medium text-slate-800 transition hover:bg-emerald-50" onClick={() => setIsDrawerOpen(false)}>
                                    Available Orders
                                </Link>
                                <Link to="/delivery-partner/current-order" className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-3 text-left text-sm font-medium text-slate-800 transition hover:bg-emerald-50" onClick={() => setIsDrawerOpen(false)}>
                                    Current Order
                                </Link>
                                <Link to="/delivery-partner/earnings" className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-3 text-left text-sm font-medium text-slate-800 transition hover:bg-emerald-50" onClick={() => setIsDrawerOpen(false)}>
                                    Earnings
                                </Link>
                                <Link to="/delivery-partner/history" className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-3 text-left text-sm font-medium text-slate-800 transition hover:bg-emerald-50" onClick={() => setIsDrawerOpen(false)}>
                                    Delivery History
                                </Link>
                                <Link to="/delivery-partner/profile" className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-3 text-left text-sm font-medium text-slate-800 transition hover:bg-emerald-50" onClick={() => setIsDrawerOpen(false)}>
                                    Profile
                                </Link>
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

export default DeliveryNav
