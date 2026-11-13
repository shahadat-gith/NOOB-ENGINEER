import { Link } from 'react-router-dom';

// The brand mark: terminal prompt on the brand gradient, from Client/public.
export function Logo({ size = 28, alt = 'Noob Engineer' }) {
  return (
    <img className="logo" src="/logo.svg" width={size} height={size} alt={alt} />
  );
}

/**
 * Shared brand presentation.
 * - `showLogo` controls whether the logo mark is rendered.
 * - `showLink` renders a home link; set it false for inline text usage.
 * - `vertical` stacks the logo above the name (used on auth pages).
 */
export function Brand({
  showLogo = true,
  logoSize = 30,
  showLink = true,
  vertical = false,
  className = '',
  textClassName = 'text-[15px]',
}) {
  const content = (
    <>
      {showLogo && <Logo size={logoSize} />}
      <span
        className={`inline-flex items-baseline whitespace-nowrap gap-[0.35ch] font-extrabold leading-none tracking-[-0.035em] ${textClassName}`}
      >
        <span className="text-text">Noob</span>
        <span className="bg-gradient-to-r from-brand to-brand-hover bg-clip-text text-transparent">
          Engineer
        </span>
      </span>
    </>
  );

  const classes = vertical
    ? `flex flex-col items-center gap-2.5 ${className}`
    : `flex items-center gap-2.5 ${className}`;

  if (!showLink) {
    return (
      <span className={`inline-flex items-baseline whitespace-nowrap ${className}`}>
        {content}
      </span>
    );
  }

  return (
    <Link to="/" className={classes} aria-label="Noob Engineer home">
      {content}
    </Link>
  );
}
