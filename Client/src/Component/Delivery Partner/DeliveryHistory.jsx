import React, { useState, useMemo } from 'react'

const overviewCards = [
  { title: 'Total Deliveries', value: '25', detail: 'This period', color: 'bg-emerald-50' },
  { title: 'Completed', value: '23', detail: '92% Success', color: 'bg-sky-50' },
  { title: 'Cancelled', value: '2', detail: '8% Cancelled', color: 'bg-orange-50' },
  { title: 'Total Earnings', value: '₹815.00', detail: 'This period', color: 'bg-violet-50' },
]

const orderHistory = [
  {
    id: '#GF12540',
    date: '25 May, 10:30 AM',
    status: 'Delivered',
    store: 'Fresh Mart Store',
    storeLocation: 'Connaught Place',
    customer: 'Aarav Sharma',
    distance: '3.2 km',
    reward: '₹50.00',
  },
  {
    id: '#GF12539',
    date: '25 May, 09:15 AM',
    status: 'Delivered',
    store: 'Green Basket',
    storeLocation: 'Karol Bagh',
    customer: 'Neha Singh',
    distance: '2.7 km',
    reward: '₹40.00',
  },
  {
    id: '#GF12538',
    date: '24 May, 07:45 PM',
    status: 'Delivered',
    store: 'Daily Needs Store',
    storeLocation: 'Rajendra Place',
    customer: 'Vikram Patel',
    distance: '4.1 km',
    reward: '₹50.00',
  },
  {
    id: '#GF12537',
    date: '24 May, 06:20 PM',
    status: 'Delivered',
    store: 'Fresh Mart Store',
    storeLocation: 'Connaught Place',
    customer: 'Pooja Mehta',
    distance: '2.3 km',
    reward: '₹36.00',
  },
  {
    id: '#GF12536',
    date: '24 May, 04:10 PM',
    status: 'Delivered',
    store: 'Green Basket',
    storeLocation: 'Karol Bagh',
    customer: 'Rohit Verma',
    distance: '3.6 km',
    reward: '₹47.00',
  },
]

const filters = ['All Status', 'Delivered', 'Cancelled', 'Pending']
const sorts = ['Latest', 'Oldest', 'Highest reward', 'Nearest']

function DeliveryHistory() {
  const [status, setStatus] = useState('All Status')
  const [sortBy, setSortBy] = useState('Latest')

  const sortedHistory = useMemo(() => {
    const data = [...orderHistory]
    if (sortBy === 'Oldest') return data.reverse()
    if (sortBy === 'Highest reward') return data.sort((a, b) => parseInt(b.reward.replace(/[^0-9]/g, '')) - parseInt(a.reward.replace(/[^0-9]/g, '')))
    if (sortBy === 'Nearest') return data.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
    return data
  }, [sortBy])

  const filteredHistory = useMemo(() => {
    return sortedHistory.filter((item) => status === 'All Status' ? true : item.status === status)
  }, [status, sortedHistory])

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-screen-2xl space-y-6">
        <section className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">Delivery History</h1>
              <p className="mt-2 text-sm text-slate-600">View all your past deliveries and details.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                Status
              </button>
              <button className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                Sort
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {overviewCards.map((card) => (
              <div key={card.title} className={`${card.color} rounded-3xl p-5 shadow-sm`}>
                <p className="text-sm font-medium text-slate-600">{card.title}</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{card.value}</p>
                <p className="mt-2 text-sm text-slate-500">{card.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-3">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="min-w-35 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              >
                {filters.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="min-w-35 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              >
                {sorts.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
            <button className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100">
              Reset filters
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {filteredHistory.map((order) => (
              <div key={order.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{order.id}</p>
                    <p className="mt-1 text-xs text-slate-500">{order.date}</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-700">{order.status}</span>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3 rounded-3xl bg-white p-3">
                    <span className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">🏬</span>
                    <div>
                      <p className="font-semibold text-slate-900">{order.store}</p>
                      <p className="text-sm text-slate-500">{order.storeLocation}</p>
                    </div>
                    <span className="ml-auto text-slate-400">›</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-3xl bg-white p-3">
                    <span className="rounded-2xl bg-rose-100 p-3 text-rose-700">📍</span>
                    <div>
                      <p className="font-semibold text-slate-900">{order.customer}</p>
                      <p className="text-sm text-slate-500">{order.distance}</p>
                    </div>
                    <p className="ml-auto text-lg font-semibold text-emerald-700">{order.reward}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

export default DeliveryHistory