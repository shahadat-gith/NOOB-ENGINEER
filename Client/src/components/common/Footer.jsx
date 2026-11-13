import { Brand } from './Brand.jsx';

const LINKS = [
  { label: 'Report a problem', href: '#' },
  { label: 'Developer', href: '#' },
  { label: 'Contact us', href: '#' },
];

export function Footer() {
  return (
    <footer className="border-t border-border-secondary">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-5 text-center sm:flex-row sm:text-left">
        <p className="m-0 text-[13px] text-text-tertiary">
          © {new Date().getFullYear()} <Brand showLink={false} showLogo={false} textClassName="text-[13px]" />. All rights reserved.
        </p>

        <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-5">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[13.5px] font-medium text-text-secondary transition hover:text-text"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
