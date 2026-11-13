import { IconButton } from './IconButton.jsx';

const VARIANTS = {
  success: { icon: 'bx-check-circle', tone: 'text-success' },
  error: { icon: 'bx-error-circle', tone: 'text-error' },
  warning: { icon: 'bx-error', tone: 'text-warning' },
  info: { icon: 'bx-info-circle', tone: 'text-info' },
};

/** Single toast card. Rendering and dismissal are handled by ToastProvider. */
export function Toast({ title, description, variant = 'info', onDismiss }) {
  const config = VARIANTS[variant] ?? VARIANTS.info;

  return (
    <div
      role="status"
      className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-card bg-surface p-4 shadow-dropdown"
    >
      <i
        aria-hidden="true"
        className={`bx ${config.icon} mt-0.5 shrink-0 text-[20px] leading-none ${config.tone}`}
      />
      <div className="min-w-0 flex-1">
        <p className="m-0 text-[14px] font-semibold text-text">{title}</p>
        {description && (
          <p className="m-0 mt-1 text-[13px] leading-relaxed text-text-secondary">{description}</p>
        )}
      </div>
      <IconButton label="Dismiss notification" variant="plain" size="sm" onClick={onDismiss}>
        <i aria-hidden="true" className="bx bx-x text-[18px] leading-none" />
      </IconButton>
    </div>
  );
}
