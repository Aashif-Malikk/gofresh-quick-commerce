import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import VendorSidebar from '../Side bar/VendorSidebar'
import VendorNav from '../VendorNav';
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'


function VendorRoute() {
    const [res, setres] = useState({ status: null });

    useEffect(() => {
        const submitHandler = async () => {
            try {
                let res = await fetch(`${API_BASE}/vendor`, {
                    method: "GET",
                    credentials: 'include',
                })
                setres(res)
                let data = await res.json()
                console.log(data)
            }
            catch (error) {
                console.error(error)
            }
        }
        submitHandler()
    }, [])

    return (res.status) === 403
        ? <Navigate to="/" />
        : (
            <div className="min-h-screen bg-slate-50">
                <VendorNav />
                <div className="flex flex-col lg:flex-row">
                    <aside className="w-full lg:w-80 shrink-0 border-r border-slate-200 bg-transparent p-4">
                        <VendorSidebar />
                    </aside>
                    <main className="flex-1 p-4 lg:p-6">
                        <Outlet />
                    </main>
                </div>
            </div>
        );
}

export default VendorRoute
