import React from 'react'

const stats = [
  { label: 'Available Orders', value: '12', detail: 'New requests waiting', accent: 'bg-emerald-100 text-emerald-700' },
  { label: 'In Transit', value: '4', detail: 'Orders currently out', accent: 'bg-sky-100 text-sky-700' },
  { label: 'Delivered Today', value: '18', detail: 'Completed deliveries', accent: 'bg-violet-100 text-violet-700' },
  { label: 'Earnings Today', value: '₹3,220', detail: 'Paid out after tips', accent: 'bg-amber-100 text-amber-700' },
]

const activeDeliveries = [
  { id: '#DLV-7123', customer: 'Riya Singh', address: 'Sector 14, Noida', amount: '₹420', eta: '12 min', status: 'Pickup' },
  { id: '#DLV-7124', customer: 'Pranav Mehta', address: 'MG Road, Gurugram', amount: '₹360', eta: '18 min', status: 'Drop-off' },
]

const activity = [
  { label: 'Order picked up', detail: '#DLV-7118 • 09:15 AM', color: 'bg-emerald-100 text-emerald-700' },
  { label: 'Payment collected', detail: '#DLV-7115 • 08:50 AM', color: 'bg-slate-100 text-slate-700' },
  { label: 'Customer rated 5★', detail: '#DLV-7113 • 08:20 AM', color: 'bg-violet-100 text-violet-700' },
]

function DeliveryDashboard() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-screen-2xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">Delivery Dashboard</h1>
              <p className="mt-2 text-sm text-slate-600">A quick overview of your active deliveries, earnings, and nearby orders.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-3xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              <span>Today</span>
              <span className="rounded-full bg-emerald-600 px-3 py-1 text-white">Live</span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
              <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-500">{item.label}</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{item.value}</p>
                <p className={`mt-3 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${item.accent}`}>{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-4 xl:grid-cols-[1.5fr,0.8fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Current Shift</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Ready for pickup</h2>
              </div>
              <button className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
                Start new route
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Shift earnings</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">₹3,220</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Deliveries completed</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">18</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Active deliveries</p>
                  <h3 className="mt-1 text-xl font-semibold text-slate-900">In progress</h3>
                </div>
                <span className="text-sm text-slate-500">Closest first</span>
              </div>

              <div className="space-y-3">
                {activeDeliveries.map((order) => (
                  <div key={order.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-500">{order.id}</p>
                        <p className="mt-1 text-lg font-semibold text-slate-900">{order.customer}</p>
                        <p className="mt-1 text-sm text-slate-600">{order.address}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900">{order.amount}</p>
                        <p className="mt-1 text-xs text-slate-500">ETA {order.eta}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                      <span className="rounded-full bg-white px-3 py-1 text-slate-700 shadow-sm">{order.status}</span>
                      <button className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700">
                        Navigate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Performance</p>
              <div className="mt-4 space-y-4">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Rating</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">4.9 ★</p>
                  <p className="mt-1 text-sm text-slate-600">Based on 72 deliveries</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Average time</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">22 min</p>
                  <p className="mt-1 text-sm text-slate-600">Per completed delivery</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Delivery location</p>
              <div className="mt-4 rounded-3xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Sector 45, Gurgaon</p>
                <p className="mt-1 text-sm text-slate-600">You are operating in the city zone today.</p>
              </div>
            </div>
          </aside>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Recent activity</h2>
              <p className="mt-2 text-sm text-slate-600">Track the latest completed and updated deliveries.</p>
            </div>
            <button className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100">
              View all history
            </button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {activity.map((item) => (
              <div key={item.label} className={`rounded-3xl border border-slate-200 bg-slate-50 p-4 ${item.color}`}>
                <p className="text-sm font-medium text-slate-700">{item.label}</p>
                <p className="mt-2 text-sm text-slate-700">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

export default DeliveryDashboard