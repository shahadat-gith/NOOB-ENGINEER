// Shared section header used on the landing page: heading, accent line, lead.
// `align="left"` is used by split sections that place the heading beside content.
export function SectionHeading({ title, lead, align = 'center', className = '' }) {
  const isLeft = align === 'left';

  return (
    <div className={`${isLeft ? 'max-w-md' : 'mx-auto max-w-2xl text-center'} ${className}`}>
      <h2 className="m-0 text-[28px] font-bold leading-[1.16] sm:text-[36px]">{title}</h2>
      <div
        aria-hidden="true"
        className={`mt-4 h-1 w-10 rounded-full bg-brand ${isLeft ? '' : 'mx-auto'}`}
      />
      {lead && (
        <p className="mt-4 text-[15.5px] leading-relaxed text-text-secondary sm:text-[16.5px]">
          {lead}
        </p>
      )}
    </div>
  );
}
