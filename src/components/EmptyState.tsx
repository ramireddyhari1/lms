interface EmptyStateProps {
  icon: string
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export default function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center text-center py-20 px-8" style={{ background: 'rgba(255,255,255,0.75)', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5 text-4xl" style={{ backgroundColor: '#f1f5f9', color: '#94a3b8' }}>
        <i className={`fas ${icon}`}></i>
      </div>
      <h3 className="text-xl font-bold mb-2" style={{ color: '#1e293b' }}>{title}</h3>
      <p className="max-w-sm mb-6 font-medium" style={{ color: '#64748b' }}>{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn-primary-gradient px-6 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:-translate-y-0.5 transition-transform"
        >
          <i className="fas fa-plus-circle mr-2"></i>{actionLabel}
        </button>
      )}
    </div>
  )
}
