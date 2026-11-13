const TONES = {
  error: { icon: 'bx-error-circle', tone: 'border-error/30 bg-error/10 text-error' },
  success: { icon: 'bx-check-circle', tone: 'border-success/30 bg-success/10 text-success' },
  warning: { icon: 'bx-error', tone: 'border-warning/30 bg-warning/10 text-warning' },
  info: { icon: 'bx-info-circle', tone: 'border-info/30 bg-info/10 text-info' },
};

/** Inline message for form errors, confirmations and notices. */
export function Alert({ tone = 'error', title, children, className = '' }) {
  const config = TONES[tone] ?? TONES.error;

  return (
    <div
      role="alert"
      className={`flex gap-3 rounded-field border px-4 py-3 text-[13.5px] leading-relaxed ${config.tone} ${className}`}
    >
      <i
        aria-hidden="true"
        className={`bx ${config.icon} mt-0.5 shrink-0 text-[18px] leading-none`}
      />
      <div className="min-w-0">
        {title && <p className="m-0 font-semibold">{title}</p>}
        <div className={title ? 'mt-1' : undefined}>{children}</div>
      </div>
    </div>
  );
}
