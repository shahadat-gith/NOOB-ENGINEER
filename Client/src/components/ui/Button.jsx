const VARIANTS = {
  primary: 'bg-brand text-on-brand shadow-button hover:bg-brand-hover active:bg-brand-active',
  secondary: 'border border-border bg-surface text-text hover:bg-surface-hover',
  ghost: 'text-text hover:bg-surface-secondary',
};

const SIZES = {
  sm: 'min-h-[38px] px-4 text-[14px]',
  md: 'min-h-[44px] px-5 text-[15px]',
};

/**
 * Shared rectangular button with a slight radius.
 * Render as another element with `as`, e.g. `<Button as={Link} to="/register">`.
 */
export function Button({
  as: Tag = 'button',
  variant = 'primary',
  size = 'md',
  type,
  className = '',
  ...props
}) {
  const classes = [
    'inline-flex items-center justify-center gap-2 rounded-button font-medium transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-soft disabled:cursor-not-allowed disabled:opacity-55',
    SIZES[size],
    VARIANTS[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag type={type ?? (Tag === 'button' ? 'button' : undefined)} className={classes} {...props} />
  );
}
