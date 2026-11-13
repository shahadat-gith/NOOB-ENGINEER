/**
 * Accessible on/off switch. `label` becomes the control's accessible name, so
 * pair it with the visible label text that sits beside it.
 */
export function Switch({ checked = false, onChange, label, disabled = false, className = '' }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-soft disabled:cursor-not-allowed disabled:opacity-55 ${
        checked ? 'bg-brand' : 'bg-surface-tertiary'
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className={`absolute top-1 h-4 w-4 rounded-full bg-surface shadow transition-all ${
          checked ? 'left-6' : 'left-1'
        }`}
      />
    </button>
  );
}
