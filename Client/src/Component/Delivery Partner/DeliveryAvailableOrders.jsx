import React, { useMemo, useState } from 'react'

const availableOrders = [
  {
    id: '#DLV-8101',
    customer: 'Nisha Patel',
    address: 'Golf Course Road, Gurugram',
    items: 5,
    amount: '₹420',
    payment: 'COD',
    distance: '2.4 km',
    pickup: '10 min away',
  },
  {
    id: '#DLV-8102',
    customer: 'Aman Sharma',
    address: 'Hauz Khas, Delhi',
    items: 3,
    amount: '₹520',
    payment: 'Online',
    distance: '4.1 km',
    pickup: '12 min away',
  },
  {
    id: '#DLV-8103',
    customer: 'Priya Singh',
    address: 'Sector 37, Noida',
    items: 2,
    amount: '₹280',
    payment: 'COD',
    distance: '3.0 km',
    pickup: '8 min away',
  },
  {
    id: '#DLV-8104',
    customer: 'Rahul Verma',
    address: 'Pitam Pura, Delhi',
    items: 4,
    amount: '₹690',
    payment: 'Online',
    distance: '5.2 km',
    pickup: '15 min away',
  },
]

const filterOptions = [
  'All Orders',
  'COD',
  'Online',
]

function DeliveryAvailableOrders() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('All Orders')

  const filteredOrders = useMemo(() => {
    return availableOrders.filter((order) => {
      const matchesSearch = `${order.id} ${order.customer} ${order.address}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      const matchesFilter = filter === 'All Orders' ? true : order.payment === filter
      return matchesSearch && matchesFilter
    })
  }, [searchTerm, filter])

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-screen-2xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">Available Orders</h1>
              <p className="mt-2 text-sm text-slate-600">Pick the best nearby deliveries and keep your route efficient.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-3xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              <span>New orders</span>
              <span className="rounded-full bg-emerald-600 px-3 py-1 text-white">{availableOrders.length}</span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Nearby pickups</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">8</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Best payout</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">₹690</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Payment mix</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">COD / Online</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <label className="sr-only" htmlFor="search">Search orders</label>
              <input
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                placeholder="Search by order id, customer or area"
              />
            </div>
            <div className="flex gap-3 flex-wrap sm:flex-nowrap">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              >
                {filterOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <button className="rounded-3xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
                Refresh list
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Order queue</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Tap to accept a job</h2>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">{filteredOrders.length} results</span>
          </div>

          <div className="mt-6 space-y-4">
            {filteredOrders.length ? (
              filteredOrders.map((order) => (
                <div key={order.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <span className="rounded-full bg-white px-3 py-1 text-slate-700 shadow-sm">{order.payment}</span>
                        <span className="rounded-full bg-white px-3 py-1 text-slate-700 shadow-sm">{order.distance}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">{order.id}</p>
                        <p className="mt-1 text-xl font-semibold text-slate-900">{order.customer}</p>
                        <p className="mt-1 text-sm text-slate-600">{order.address}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-start gap-3 sm:items-end sm:w-auto">
                      <p className="text-sm text-slate-500">Order total</p>
                      <p className="text-2xl font-semibold text-slate-900">{order.amount}</p>
                      <button className="rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
                        Accept
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-3xl bg-white p-4 text-sm text-slate-600">
                      <p className="font-semibold text-slate-900">Items</p>
                      <p className="mt-1">{order.items}</p>
                    </div>
                    <div className="rounded-3xl bg-white p-4 text-sm text-slate-600">
                      <p className="font-semibold text-slate-900">Pickup ETA</p>
                      <p className="mt-1">{order.pickup}</p>
                    </div>
                    <div className="rounded-3xl bg-white p-4 text-sm text-slate-600">
                      <p className="font-semibold text-slate-900">Route</p>
                      <p className="mt-1">{order.address.split(',')[0]}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
                No orders match your search or filters.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

export default DeliveryAvailableOrders