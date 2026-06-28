import { Category } from 'iconsax-react';
import React, { useState } from 'react'
import { NavLink } from 'react-router-dom';

function DeliverySidebar() {
    const [showUser, setshowUser] = useState(false);
    const [showProducts, setshowProducts] = useState(false);

    const getLinkClass = ({ isActive }) => `mb-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold transition duration-300 ${isActive
        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
        : 'bg-white text-slate-800 hover:bg-slate-100'
        }`

    return (
        <div className='hidden lg:block'>
            <div className='rounded-3xl border border-slate-200 bg-white p-4 shadow-sm'>
                <NavLink to="/delivery-partner/dashboard" className={getLinkClass}>
                    <Category color='currentColor' variant='Linear' size={24} />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/delivery-partner/orders" className={getLinkClass}>
                    Orders
                </NavLink>
                <NavLink to="/delivery-partner/current-order" className={getLinkClass}>
                    Current Order
                </NavLink>
                <NavLink to="/delivery-partner/earnings" className={getLinkClass}>
                    Earnings
                </NavLink>
                <NavLink to="/delivery-partner/history" className={getLinkClass}>
                    History
                </NavLink>
                <NavLink to="/delivery-partner/profile" className={getLinkClass}>
                    Profile
                </NavLink>
            </div>
        </div>
    )
}

export default DeliverySidebar
