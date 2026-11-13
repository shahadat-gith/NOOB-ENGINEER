import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForgotPassword } from '../api/hooks.js';
import { AuthShell, AuthLink } from '../components/auth/AuthShell.jsx';
import { Alert } from '../components/ui/Alert.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [devToken, setDevToken] = useState('');
  const forgotPassword = useForgotPassword();

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      // The backend answers the same way whether or not the email exists.
      // In development it also returns the token so the flow can be tested.
      const data = await forgotPassword.mutateAsync({ email });
      setDone(true);
      if (data.token) setDevToken(data.token);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <AuthShell
      title="Reset your password"
      footer={
        <>
          Remembered it? <AuthLink to="/login">Back to sign in</AuthLink>
        </>
      }
    >
      {error && <Alert>{error}</Alert>}
      {done ? (
        <>
          <Alert tone="success">
            If an account exists for that email, a password reset link is on its way. The link
            expires in 1 hour.
          </Alert>
          {devToken && (
            <Alert tone="info">
              Development only (no email service yet):{' '}
              <Link to={`/reset-password?token=${devToken}`} className="font-semibold underline">
                open the reset page
              </Link>
            </Alert>
          )}
        </>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <Button type="submit" disabled={forgotPassword.isPending} className="w-full">
            {forgotPassword.isPending ? 'Sending…' : 'Send reset link'}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
