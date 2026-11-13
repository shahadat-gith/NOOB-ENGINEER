const SIZES = {
  sm: 'h-7 w-7 text-[16px]',
  md: 'h-10 w-10 text-[20px]',
};

const SHAPES = {
  square: 'rounded-button',
  round: 'rounded-full',
};

const VARIANTS = {
  default: 'text-text-secondary hover:bg-surface-secondary hover:text-text',
  plain: 'text-text-tertiary hover:bg-surface-secondary hover:text-text',
  bare: 'text-text hover:bg-surface-secondary',
};

/**
 * Icon-only control. `label` is required: it is the accessible name, so the
 * icon itself can stay `aria-hidden`.
 */
export function IconButton({
  as: Tag = 'button',
  label,
  variant = 'default',
  size = 'md',
  shape = 'square',
  className = '',
  ...props
}) {
  const classes = [
    'inline-flex shrink-0 items-center justify-center transition active:scale-[0.97] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-soft disabled:cursor-not-allowed disabled:opacity-55',
    SIZES[size],
    SHAPES[shape],
    VARIANTS[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag
      type={Tag === 'button' ? 'button' : undefined}
      aria-label={label}
      className={classes}
      {...props}
    />
  );
}
