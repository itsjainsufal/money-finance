import { useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { LockKeyhole, Mail, UserRound } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type AuthMode = 'login' | 'signup' | 'forgot';

export default function Auth() {
  const { signIn, signUp, resetPassword, user } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      if (mode === 'login') {
        await signIn(email, password);
        setMessage('Welcome back. Redirecting to your dashboard.');
        return;
      }

      if (mode === 'signup') {
        await signUp(fullName, email, password);
        setMessage('Account created. Check your inbox for confirmation if email verification is enabled.');
        return;
      }

      await resetPassword(email);
      setMessage('Password reset instructions sent to your email.');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="section-shell flex min-h-screen items-center justify-center py-12">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <Badge className="w-fit">Secure sign in</Badge>
          <CardTitle className="text-3xl">Access your family finance workspace</CardTitle>
          <CardDescription>
            Use Supabase authentication to sign in, create an account, or recover access.
          </CardDescription>
          <div className="mt-4 flex flex-wrap gap-2">
            {(['login', 'signup', 'forgot'] as const).map((value) => (
              <Button
                key={value}
                type="button"
                variant={mode === value ? 'default' : 'outline'}
                onClick={() => setMode(value)}
              >
                {value === 'forgot' ? 'Forgot password' : value === 'signup' ? 'Create account' : 'Login'}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === 'signup' ? (
              <label className="block space-y-2 text-sm font-medium">
                Full name
                <div className="relative">
                  <UserRound className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-11" value={fullName} onChange={(event) => setFullName(event.target.value)} required />
                </div>
              </label>
            ) : null}
            <label className="block space-y-2 text-sm font-medium">
              Email
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-11"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@family.com"
                  required
                />
              </div>
            </label>
            {mode !== 'forgot' ? (
              <label className="block space-y-2 text-sm font-medium">
                Password
                <div className="relative">
                  <LockKeyhole className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-11"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </label>
            ) : null}
            {error ? <p className="text-sm text-danger">{error}</p> : null}
            {message ? <p className="text-sm text-success">{message}</p> : null}
            <Button className="w-full" disabled={loading} type="submit">
              {loading ? 'Please wait…' : mode === 'forgot' ? 'Send reset email' : mode === 'signup' ? 'Create account' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
