import { useId } from 'react';

const fieldClass =
  'w-full min-h-[44px] rounded-field border bg-surface px-4 text-[15px] text-text placeholder:text-text-tertiary outline-none transition-shadow focus:border-border-focus focus:ring-4 focus:ring-brand-soft disabled:cursor-not-allowed disabled:opacity-55';

/**
 * Labelled text input. `error` swaps the field to the error tone and replaces
 * the hint with the message, wiring up `aria-invalid` and `aria-describedby`.
 */
export function Input({ label, hint, error, id, className = '', ...props }) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = `${inputId}-description`;
  const hasDescription = Boolean(error || hint);

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={inputId} className="text-[13.5px] font-medium text-text-secondary">
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={hasDescription ? descriptionId : undefined}
        className={`${fieldClass} ${error ? 'border-error' : 'border-border'} ${className}`}
        {...props}
      />
      {hasDescription && (
        <p
          id={descriptionId}
          className={`m-0 text-[12.5px] leading-relaxed ${error ? 'text-error' : 'text-text-tertiary'}`}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}
