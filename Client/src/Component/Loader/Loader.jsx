// components/Loader.jsx

const Loader = ({
  size = 40,
  color = 'border-blue-500',
  variant = 'spinner',
}) => {
  const s = { width: size, height: size }

  if (variant === 'spinner') {
    return (
      <div
        style={s}
        className={`rounded-full border-4 border-t-transparent ${color} animate-spin`}
      />
    )
  }

  if (variant === 'dots') {
    const dot = Math.max(6, Math.round(size * 0.18))
    return (
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: dot,
              height: dot,
              animationDelay: `${i * 0.15}s`,
              animationDuration: '1s',
            }}
            className={`rounded-full ${color.replace('border-', 'bg-')} animate-bounce`}
          />
        ))}
      </div>
    )
  }

  if (variant === 'pulse') {
    return (
      <div
        style={s}
        className={`rounded-full ${color.replace('border-', 'bg-')} animate-pulse`}
      />
    )
  }

  if (variant === 'bars') {
    const bw = Math.max(6, Math.round(size * 0.18))
    return (
      <div className="flex items-end gap-1" style={{ height: size }}>
        {[0.6, 1, 0.7].map((h, i) => (
          <div
            key={i}
            style={{
              width: bw,
              height: size * h,
              animationDelay: `${i * 0.15}s`,
            }}
            className={`rounded-t ${color.replace('border-', 'bg-')} animate-pulse`}
          />
        ))}
      </div>
    )
  }
}

export default Loader