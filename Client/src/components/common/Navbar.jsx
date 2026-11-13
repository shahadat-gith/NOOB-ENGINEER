import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext.js';
import { useTheme } from '../../context/themeContext.js';
import { Avatar } from '../ui/Avatar.jsx';
import { Button } from '../ui/Button.jsx';
import { IconButton } from '../ui/IconButton.jsx';
import { Switch } from '../ui/Switch.jsx';
import { Brand } from './Brand.jsx';

function ProfileMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const dark = theme === 'dark';
  const ref = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <IconButton
        label="Profile"
        variant="bare"
        shape="round"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Avatar src={user.avatar?.url} name={user.fullname} />
      </IconButton>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] w-64 overflow-hidden rounded-card bg-surface shadow-dropdown"
        >
          <div className="border-b border-border-secondary px-5 py-4">
            <p className="m-0 truncate text-[14.5px] font-semibold">{user.fullname}</p>
            <p className="m-0 mt-0.5 truncate text-[13px] text-text-secondary">{user.email}</p>
          </div>
          <div className="flex items-center justify-between border-t border-border-secondary px-5 py-3">
            <span className="flex items-center gap-2 text-[14px] font-medium text-text">
              <i aria-hidden="true" className={`bx ${dark ? 'bx-sun' : 'bx-moon'} text-[18px] leading-none`} />
              Dark mode
            </span>
            <Switch checked={dark} onChange={toggleTheme} label="Dark mode" />
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={onLogout}
            className="flex w-full items-center px-5 py-3 text-left text-[14px] font-medium text-text transition hover:bg-surface-secondary"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function onLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border-secondary/70 bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-6">
        <Brand />

        <div className="flex items-center gap-2">
          {user ? (
            <ProfileMenu user={user} onLogout={onLogout} />
          ) : (
            <>
              <Button as={Link} to="/login" variant="ghost" size="sm">
                Sign in
              </Button>
              <Button as={Link} to="/register" size="sm">
                Get started
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
