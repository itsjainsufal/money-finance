export function ProgressBar({ value, color = '#3b82f6', className = '' }) {
  const clamped = Math.min(Math.max(value, 0), 1.25);
  return (
    <div className={`h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800 ${className}`}>
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${Math.min(clamped * 100, 100)}%`, backgroundColor: color }}
      />
    </div>
  );
}
