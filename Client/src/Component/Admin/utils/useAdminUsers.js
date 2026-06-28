// utils/useAdminUsers.js
import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export function useAdminUsers(role) {
    const [users, setUsers]     = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError]     = useState(null)

    const fetchUsers = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch(`${API_BASE}/admin/users?role=${role}`, {
                credentials: 'include',
            })
            if (!res.ok) throw new Error('Failed to fetch')
            const data = await res.json()
            setUsers(data.users || [])
        } catch (err) {
            console.error(err)
            setError('Failed to load data.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchUsers() }, [role])

    return { users, loading, error, refetch: fetchUsers }
}