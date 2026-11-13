import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext.js';
import { AuthShell, AuthLink } from '../components/auth/AuthShell.jsx';
import { Alert } from '../components/ui/Alert.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Divider } from '../components/ui/Divider.jsx';
import { Input } from '../components/ui/Input.jsx';
import { apiUrl } from '../lib/axios.js';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setBusy(true);
    try {
      await register({ fullname, email, password });
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      title="Create account"
      footer={
        <>
          Already have one? <AuthLink to="/login">Sign in</AuthLink>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        <Button as="a" href={apiUrl('/auth/google')} variant="secondary" className="w-full px-4">
          <i aria-hidden="true" className="bx bxl-google text-[20px] leading-none" /> Google
        </Button>
        <Button as="a" href={apiUrl('/auth/github')} variant="secondary" className="w-full px-4">
          <i aria-hidden="true" className="bx bxl-github text-[20px] leading-none" /> GitHub
        </Button>
      </div>
      <Divider label="or" className="my-1" />
      {error && <Alert>{error}</Alert>}
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Input
          label="Full name"
          type="text"
          autoComplete="name"
          required
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          placeholder="Your name"
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
        />
        <Button type="submit" disabled={busy} className="w-full">
          {busy ? 'Creating…' : 'Create account'}
        </Button>
      </form>
    </AuthShell>
  );
}
