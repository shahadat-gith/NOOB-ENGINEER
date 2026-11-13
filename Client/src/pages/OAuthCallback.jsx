import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setSession } from '../lib/tokens.js';
import { useAuth } from '../context/authContext.js';
import { AuthShell, AuthLink } from '../components/auth/AuthShell.jsx';
import { Alert } from '../components/ui/Alert.jsx';

// Where the backend redirects after Google/GitHub consent:
//   /auth/callback?token=...&refreshToken=...   on success
//   /auth/callback?error=...                    on failure
export default function OAuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { syncUser } = useAuth();
  const handled = useRef(false);
  const [failed, setFailed] = useState('');

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const token = params.get('token');
    const refreshToken = params.get('refreshToken');
    if (!token) return;

    setSession({ token, refreshToken });
    syncUser()
      .then(() => navigate('/', { replace: true }))
      .catch(() => setFailed('We could not finish signing you in.'));
  }, [params, navigate, syncUser]);

  const error = params.get('error') || failed;

  if (!error) {
    return (
      <div className="flex min-h-[calc(100svh-68px)] items-center justify-center">
        <p className="text-text-secondary">Signing you in…</p>
      </div>
    );
  }

  return (
    <AuthShell
      title="Sign-in failed"
      footer={<AuthLink to="/login">Back to sign in</AuthLink>}
    >
      <Alert>{error}</Alert>
    </AuthShell>
  );
}
