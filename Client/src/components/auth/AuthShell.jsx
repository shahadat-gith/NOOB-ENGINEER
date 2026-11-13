import { Link } from 'react-router-dom';
import { Brand } from '../common/Brand.jsx';
import { Card } from '../ui/Card.jsx';

// Compact centred shell for all auth pages: logo, title, one card.
// Shared by login, register and the reset pages so their layout cannot drift.
export function AuthShell({ title, children, footer }) {
  return (
    <div className="flex min-h-[calc(100svh-68px)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-[360px]">
        <Brand showLogo logoSize={44} vertical textClassName="text-[18px]" className="mb-6" />

        <Card className="px-6 py-8">
          <h1 className="mb-5 text-center text-[22px] font-semibold">{title}</h1>
          {children}
        </Card>

        {footer && (
          <p className="mt-5 text-center text-[13.5px] text-text-secondary">{footer}</p>
        )}
      </div>
    </div>
  );
}

export function AuthLink({ to, children }) {
  return (
    <Link to={to} className="font-medium text-brand hover:text-brand-hover">
      {children}
    </Link>
  );
}
