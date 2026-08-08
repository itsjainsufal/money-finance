import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Family, FamilyMember, Profile } from '@/types/database';

interface FamilyContextValue {
  profile: Profile | null;
  family: Family | null;
  members: FamilyMember[];
  loading: boolean;
  error: string | null;
  refreshFamily: () => Promise<void>;
  createFamily: (name: string) => Promise<Family>;
  joinFamilyByCode: (code: string) => Promise<Family>;
}

const FamilyContext = createContext<FamilyContextValue | undefined>(undefined);

function createProfileFallback(userId: string, email?: string, fullName?: string): Profile {
  const timestamp = new Date().toISOString();
  return {
    id: userId,
    unique_id: (email ?? userId).split('@')[0],
    full_name: fullName ?? email ?? 'Family member',
    family_id: null,
    avatar_url: null,
    created_at: timestamp,
    updated_at: timestamp,
  };
}

function generateInviteCode() {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase();
}

function validateInvite(familyRecord: Family) {
  const expired =
    familyRecord.invite_expires_at !== null &&
    new Date(familyRecord.invite_expires_at).getTime() < Date.now();
  const maxedOut =
    familyRecord.invite_max_uses !== null && familyRecord.invite_uses >= familyRecord.invite_max_uses;

  if (expired) {
    throw new Error('This invite code has expired');
  }

  if (maxedOut) {
    throw new Error('This invite code has already reached its usage limit');
  }
}

export function FamilyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [family, setFamily] = useState<Family | null>(null);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshFamily = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setFamily(null);
      setMembers([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') throw profileError;

      const nextProfile =
        profileData ??
        createProfileFallback(
          user.id,
          user.email,
          typeof user.user_metadata.full_name === 'string' ? user.user_metadata.full_name : undefined,
        );

      setProfile(nextProfile);

      if (!nextProfile.family_id) {
        setFamily(null);
        setMembers([]);
        return;
      }

      const [{ data: familyData, error: familyError }, { data: memberData, error: memberError }] = await Promise.all([
        supabase.from('families').select('*').eq('id', nextProfile.family_id).maybeSingle(),
        supabase.from('family_members').select('*').eq('family_id', nextProfile.family_id),
      ]);

      if (familyError) throw familyError;
      if (memberError) throw memberError;

      setFamily(familyData ?? null);
      setMembers(memberData ?? []);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Unable to load family data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void refreshFamily();
  }, [refreshFamily]);

  const value = useMemo<FamilyContextValue>(
    () => ({
      profile,
      family,
      members,
      loading,
      error,
      refreshFamily,
      createFamily: async (name: string) => {
        if (!user) throw new Error('You must be signed in to create a family');

        const familyPayload = {
          name,
          admin_id: user.id,
          invite_code: generateInviteCode(),
          invite_expires_at: null,
          invite_max_uses: 10,
          invite_uses: 0,
          created_at: new Date().toISOString(),
        };

        const { data: createdFamilyData, error: familyError } = await supabase
          .from('families')
          .insert(familyPayload)
          .select()
          .single();

        if (familyError) throw familyError;
        const createdFamily = createdFamilyData as unknown as Family;

        const updatedProfile: Profile = {
          ...(profile ??
            createProfileFallback(
              user.id,
              user.email,
              typeof user.user_metadata.full_name === 'string' ? user.user_metadata.full_name : undefined,
            )),
          family_id: createdFamily.id,
          updated_at: new Date().toISOString(),
        };

        const memberId = crypto.randomUUID();

        const { error: profileUpsertError } = await supabase.from('profiles').upsert(updatedProfile);
        if (profileUpsertError) throw profileUpsertError;

        const { error: memberUpsertError } = await supabase.from('family_members').upsert({
          id: memberId,
          family_id: createdFamily.id,
          user_id: user.id,
          role: 'admin',
          joined_at: new Date().toISOString(),
        });
        if (memberUpsertError) throw memberUpsertError;

        setProfile(updatedProfile);
        setFamily(createdFamily);
        setMembers([
          {
            id: memberId,
            family_id: createdFamily.id,
            user_id: user.id,
            role: 'admin',
            joined_at: new Date().toISOString(),
          },
        ]);
        return createdFamily;
      },
      joinFamilyByCode: async (code: string) => {
        if (!user) throw new Error('You must be signed in to join a family');

        const { data: matchedFamilyData, error: familyError } = await supabase
          .from('families')
          .select('*')
          .eq('invite_code', code.toUpperCase())
          .maybeSingle();

        if (familyError) throw familyError;
        const matchedFamily = matchedFamilyData as unknown as Family | null;
        if (!matchedFamily) throw new Error('Invite code not found');
        validateInvite(matchedFamily);

        const nextProfile: Profile = {
          ...(profile ??
            createProfileFallback(
              user.id,
              user.email,
              typeof user.user_metadata.full_name === 'string' ? user.user_metadata.full_name : undefined,
            )),
          family_id: matchedFamily.id,
          updated_at: new Date().toISOString(),
        };

        const { error: profileUpsertError } = await supabase.from('profiles').upsert(nextProfile);
        if (profileUpsertError) throw profileUpsertError;

        const { error: memberUpsertError } = await supabase.from('family_members').upsert({
          id: crypto.randomUUID(),
          family_id: matchedFamily.id,
          user_id: user.id,
          role: 'member',
          joined_at: new Date().toISOString(),
        });
        if (memberUpsertError) throw memberUpsertError;

        const { error: inviteUsageError } = await supabase
          .from('families')
          .update({ invite_uses: matchedFamily.invite_uses + 1 })
          .eq('id', matchedFamily.id);
        if (inviteUsageError) throw inviteUsageError;

        // Let refreshFamily() update all local state from the database.
        await refreshFamily();
        return matchedFamily;
      },
    }),
    [error, family, loading, members, profile, refreshFamily, user],
  );

  return <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>;
}

export function useFamily() {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error('useFamily must be used within FamilyProvider');
  }
  return context;
}
