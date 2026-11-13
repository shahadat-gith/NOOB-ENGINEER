import { useState } from 'react';

const SIZES = {
  sm: 'h-8 w-8 text-[12px]',
  md: 'h-9 w-9 text-[13px]',
  lg: 'h-11 w-11 text-[15px]',
};

function getInitials(name) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return initials || '?';
}

/**
 * User avatar with an initials fallback.
 * Pass `alt=""` (the default) when the avatar sits inside an already-labelled
 * control such as the profile button.
 */
export function Avatar({ src, name = '', size = 'md', alt = '', className = '' }) {
  const [failedSrc, setFailedSrc] = useState(null);
  const sizeClass = SIZES[size] ?? SIZES.md;

  if (src && failedSrc !== src) {
    return (
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setFailedSrc(src)}
        className={`shrink-0 rounded-full object-cover ${sizeClass} ${className}`}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-brand-soft font-bold text-brand ${sizeClass} ${className}`}
    >
      {getInitials(name)}
    </span>
  );
}
