// AdminRoute.jsx

import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AdminNav from "../AdminNav";
import AdminSidebar from "../Side Bar/AdminSidebar";
const API_BASE = 'http://localhost:3000'

function AdminRoute() {
    const [res, setres] = useState({ status: null });

    useEffect(() => {
        const submitHandler = async () => {
            try {
                let res = await fetch(`${API_BASE}/admin`, {
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
                <AdminNav />
                <div className="flex flex-col lg:flex-row">
                    <aside className="w-full lg:w-80 shrink-0 border-r border-slate-200 bg-transparent p-4">
                        <AdminSidebar />
                    </aside>
                    <main className="flex-1 p-4 lg:p-6">
                        <Outlet />
                    </main>
                </div>
            </div>
        );
}

export default AdminRoute;