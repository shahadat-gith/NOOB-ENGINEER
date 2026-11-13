/** Horizontal rule, optionally split by a small centred label (e.g. "or"). */
export function Divider({ label, className = '' }) {
  if (!label) {
    return <hr className={`border-0 border-t border-border ${className}`} />;
  }

  return (
    <div
      aria-hidden="true"
      className={`flex items-center gap-3 text-[12px] font-medium uppercase tracking-wider text-text-tertiary ${className}`}
    >
      <span className="h-px flex-1 bg-border" />
      {label}
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
