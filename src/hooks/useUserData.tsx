
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfile {
  id: string;
  username: string | null;
  email: string | null;
  wallet_address: string | null;
}

interface UserStats {
  score: number;
  balance: number;
  games_played: number;
  games_won: number;
  total_winnings: number;
}

export const useUserData = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setStats(null);
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        } else {
          setProfile(profileData);
        }

        // Fetch stats
        const { data: statsData, error: statsError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (statsError) {
          console.error('Error fetching stats:', statsError);
        } else {
          setStats({
            score: statsData.score || 0,
            balance: parseFloat(statsData.balance) || 100,
            games_played: statsData.games_played || 0,
            games_won: statsData.games_won || 0,
            total_winnings: parseFloat(statsData.total_winnings) || 0
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const updateStats = async (newStats: Partial<UserStats>) => {
    if (!user || !stats) return;

    const updatedStats = { ...stats, ...newStats };
    setStats(updatedStats);

    try {
      await supabase
        .from('user_stats')
        .update({
          score: updatedStats.score,
          balance: updatedStats.balance,
          games_played: updatedStats.games_played,
          games_won: updatedStats.games_won,
          total_winnings: updatedStats.total_winnings
        })
        .eq('user_id', user.id);
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  };

  return {
    profile,
    stats,
    loading,
    updateStats
  };
};
