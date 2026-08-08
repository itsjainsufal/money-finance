import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useFamily } from '@/contexts/FamilyContext';
import { supabase } from '@/lib/supabase';
import type { Family } from '@/types/database';

export default function Join() {
  const { code = '' } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { joinFamilyByCode } = useFamily();
  const [family, setFamily] = useState<Family | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvite = async () => {
      try {
        setLoading(true);
        const { data, error: queryError } = await supabase
          .from('families')
          .select('*')
          .eq('invite_code', code.toUpperCase())
          .maybeSingle();

        if (queryError) throw queryError;
        setFamily(data ?? null);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : 'Unable to validate invite');
      } finally {
        setLoading(false);
      }
    };

    void fetchInvite();
  }, [code]);

  const inviteExpired =
    family?.invite_expires_at !== null && family?.invite_expires_at !== undefined
      ? new Date(family.invite_expires_at).getTime() < Date.now()
      : false;
  const inviteFull =
    family?.invite_max_uses !== null && family?.invite_max_uses !== undefined
      ? family.invite_uses >= family.invite_max_uses
      : false;
  const inviteValid = Boolean(family) && !inviteExpired && !inviteFull;

  async function handleJoin() {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      await joinFamilyByCode(code);
      navigate('/dashboard');
    } catch (joinError) {
      setError(joinError instanceof Error ? joinError.message : 'Unable to join family');
    }
  }

  return (
    <div className="section-shell flex min-h-screen items-center justify-center py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl">Join family invite</CardTitle>
          <CardDescription>Accept a secure invite and step into the shared household finance workspace.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-3xl border border-border/70 p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Invite code</p>
            <p className="mt-2 text-3xl font-bold">{code.toUpperCase()}</p>
            <p className="mt-4 text-sm text-muted-foreground">
              {loading
                ? 'Checking this family invite…'
                : inviteExpired
                  ? 'This invite has expired. Ask your family admin for a fresh code.'
                  : inviteFull
                    ? 'This invite has already reached its usage limit.'
                    : family
                  ? `You're about to join ${family.name}.`
                  : 'No active family was found for this invite code yet.'}
            </p>
          </div>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button className="w-full" disabled={loading || !inviteValid} onClick={() => void handleJoin()}>
            <UserPlus className="h-4 w-4" />
            {user ? 'Join this family' : 'Login to accept invite'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
