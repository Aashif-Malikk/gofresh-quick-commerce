import React, { useMemo, useState } from 'react'

const earningsData = [
  { id: '#GF12540', date: '25 May, 10:30 AM', distance: '3.2 km', earning: '₹35.00', incentive: '₹5.00', tips: '₹10.00', total: '₹50.00' },
  { id: '#GF12539', date: '25 May, 09:15 AM', distance: '2.7 km', earning: '₹30.00', incentive: '₹5.00', tips: '₹5.00', total: '₹40.00' },
  { id: '#GF12538', date: '24 May, 07:45 PM', distance: '4.1 km', earning: '₹40.00', incentive: '₹10.00', tips: '₹0.00', total: '₹50.00' },
  { id: '#GF12537', date: '24 May, 06:20 PM', distance: '2.3 km', earning: '₹28.00', incentive: '₹0.00', tips: '₹8.00', total: '₹36.00' },
  { id: '#GF12536', date: '24 May, 04:10 PM', distance: '3.6 km', earning: '₹35.00', incentive: '₹5.00', tips: '₹7.00', total: '₹47.00' },
]

const stats = [
  { label: "Today's Earnings", value: '₹450.00', trend: '12.5%', trendLabel: 'vs yesterday' },
  { label: 'This Week', value: '₹3,250.00', trend: '8.7%', trendLabel: 'vs last week' },
  { label: 'This Month', value: '₹12,450.00', trend: '15.3%', trendLabel: 'vs last month' },
  { label: 'Total Earnings', value: '₹28,980.00', trend: 'All time earnings', trendLabel: '' },
]

function DeliveryEarnings() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRange, setSelectedRange] = useState('May 19 - May 25, 2024')

  const filteredData = useMemo(() => {
    return earningsData.filter((item) =>
      `${item.id} ${item.date}`.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-screen-2xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">My Earnings</h1>
              <p className="mt-2 text-sm text-slate-600">Track your earnings and performance.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button className="inline-flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                <span>{selectedRange}</span>
                <span className="ml-3 rounded-full bg-white px-2 py-1 text-xs font-semibold text-slate-700 shadow-sm">Change</span>
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
              <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-500">{item.label}</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{item.value}</p>
                <p className="mt-3 text-sm text-emerald-600">{item.trend} {item.trendLabel}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.9fr,1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Earnings Overview</h2>
                <p className="mt-2 text-sm text-slate-600">A look at your weekly delivery performance.</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                This Week
              </div>
            </div>

            <div className="mt-6 h-72 rounded-3xl bg-linear-to-b from-emerald-50 to-white p-4 sm:h-80">
              <div className="h-full rounded-3xl bg-white p-4 shadow-sm">
                <div className="h-full">
                  <div className="grid h-full gap-3">
                    <div className="mt-2 h-2 rounded-full bg-slate-200 w-24" />
                    <div className="h-2 rounded-full bg-slate-200 w-32" />
                    <div className="h-2 rounded-full bg-slate-200 w-20" />
                    <div className="h-2 rounded-full bg-slate-200 w-28" />
                    <div className="h-2 rounded-full bg-slate-200 w-36" />
                    <div className="h-2 rounded-full bg-slate-200 w-24" />
                    <div className="h-2 rounded-full bg-slate-200 w-32" />
                    <div className="mt-auto grid grid-cols-7 text-xs text-slate-500">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                        <span key={day} className="text-center">{day}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-xl font-semibold text-slate-900">Earnings Breakdown</h2>
              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between rounded-3xl bg-slate-50 px-4 py-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Delivery Earnings</p>
                    <p className="text-sm text-slate-500">Base delivery pay</p>
                  </div>
                  <p className="font-semibold text-slate-900">₹2,950.00</p>
                </div>
                <div className="flex items-center justify-between rounded-3xl bg-slate-50 px-4 py-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Incentives</p>
                    <p className="text-sm text-slate-500">Bonus and rewards</p>
                  </div>
                  <p className="font-semibold text-slate-900">₹250.00</p>
                </div>
                <div className="flex items-center justify-between rounded-3xl bg-slate-50 px-4 py-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Tips</p>
                    <p className="text-sm text-slate-500">Customer gratuity</p>
                  </div>
                  <p className="font-semibold text-slate-900">₹50.00</p>
                </div>
              </div>
              <div className="mt-6 rounded-3xl bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-700">
                Total Earnings
                <div className="mt-2 text-2xl text-slate-900">₹3,250.00</div>
              </div>
            </div>
          </aside>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Recent Earnings</h2>
              <p className="mt-2 text-sm text-slate-600">Review your latest completed delivery payouts.</p>
            </div>
            <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              View all
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
              <thead className="rounded-3xl border border-slate-200 bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Date & Time</th>
                  <th className="px-4 py-3">Distance</th>
                  <th className="px-4 py-3">Earning</th>
                  <th className="px-4 py-3">Incentive</th>
                  <th className="px-4 py-3">Tips</th>
                  <th className="px-4 py-3">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4 font-semibold text-slate-900">{item.id}</td>
                    <td className="px-4 py-4">{item.date}</td>
                    <td className="px-4 py-4">{item.distance}</td>
                    <td className="px-4 py-4">{item.earning}</td>
                    <td className="px-4 py-4">{item.incentive}</td>
                    <td className="px-4 py-4">{item.tips}</td>
                    <td className="px-4 py-4 font-semibold text-slate-900">{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}

export default DeliveryEarnings
