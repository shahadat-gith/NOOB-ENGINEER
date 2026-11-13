
export function Card({ as: Tag = 'div', interactive = false, className = '', ...props }) {
  return (
    <Tag
      className={`rounded-card bg-surface shadow-card ${interactive ? 'card-hover' : ''} ${className}`}
      {...props}
    />
  );
}
