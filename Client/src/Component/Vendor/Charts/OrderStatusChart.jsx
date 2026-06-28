import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const STATUS_CONFIG = [
    { key: 'delivered',          label: 'Delivered',         color: '#10b981' },
    { key: 'out for delivery',   label: 'Out for Delivery',  color: '#0ea5e9' },
    { key: 'packed',             label: 'Packed',            color: '#8b5cf6' },
    { key: 'accepted',           label: 'Accepted',          color: '#6366f1' },
    { key: 'cancelled',          label: 'Cancelled',         color: '#f43f5e' },
    // removed 'pending' since orders go straight to 'accepted' after payment
]

function OrderStatusChart({ orders }) {
    const data = STATUS_CONFIG
        .map(s => ({
            name: s.label,
            value: orders.filter(o => o.status === s.key).length,
            color: s.color,
        }))
        .filter(s => s.value > 0)   // hide statuses with 0 orders

    if (!orders.length) {
        return (
            <div className="flex items-center justify-center h-48 text-sm text-slate-400">
                No orders yet
            </div>
        )
    }

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload?.length) {
            return (
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-md text-sm">
                    <p className="font-semibold text-slate-900">{payload[0].name}</p>
                    <p className="text-slate-500">{payload[0].value} orders</p>
                    <p className="text-slate-400">
                        {((payload[0].value / orders.length) * 100).toFixed(1)}%
                    </p>
                </div>
            )
        }
        return null
    }

    const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        if (percent < 0.05) return null   // hide label if slice too small
        const RADIAN = Math.PI / 180
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5
        const x = cx + radius * Math.cos(-midAngle * RADIAN)
        const y = cy + radius * Math.sin(-midAngle * RADIAN)
        return (
            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        )
    }

    return (
        <div className="mt-4">
            <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                        labelLine={false}
                        label={CustomLabel}
                    >
                        {data.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
                {data.map((entry, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                        <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: entry.color }} />
                        <span>{entry.name}</span>
                        <span className="ml-auto font-semibold text-slate-900">{entry.value}</span>
                    </div>
                ))}
            </div>

            {/* Center total */}
            <p className="mt-3 text-center text-xs text-slate-400">{orders.length} total orders</p>
        </div>
    )
}

export default OrderStatusChart