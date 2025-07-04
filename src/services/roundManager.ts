
import { supabase } from '@/integrations/supabase/client';

export interface RoundData {
  id: string;
  round_number: number;
  status: 'live' | 'next' | 'completed';
  start_time: number;
  end_time: number;
  start_price?: number;
  end_price?: number;
  total_pool: number;
  result?: 'bull' | 'bear';
  percentage_change?: number;
  created_at?: string;
}

class RoundManager {
  private currentRoundNumber: number = 1;
  private roundDuration: number = 60000; // 1 minute

  async initializeRounds(): Promise<void> {
    try {
      // Get the latest round number from database
      const { data: latestRound } = await supabase
        .from('game_rounds')
        .select('round_number')
        .order('round_number', { ascending: false })
        .limit(1)
        .single();

      if (latestRound) {
        this.currentRoundNumber = latestRound.round_number + 1;
      }
    } catch (error) {
      console.log('No existing rounds found, starting from 1');
    }
  }

  async saveRound(roundData: RoundData): Promise<void> {
    try {
      const { error } = await supabase
        .from('game_rounds')
        .insert({
          round_number: roundData.round_number,
          status: roundData.status,
          start_time: new Date(roundData.start_time).toISOString(),
          end_time: new Date(roundData.end_time).toISOString(),
          start_price: roundData.start_price,
          end_price: roundData.end_price,
          total_pool: roundData.total_pool,
          result: roundData.result,
          percentage_change: roundData.percentage_change
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving round:', error);
    }
  }

  async getRecentRounds(): Promise<RoundData[]> {
    try {
      const { data, error } = await supabase
        .from('game_rounds')
        .select('*')
        .order('round_number', { ascending: false })
        .limit(10);

      if (error) throw error;

      return data?.map(round => ({
        id: round.round_number.toString(),
        round_number: round.round_number,
        status: round.status as 'live' | 'next' | 'completed',
        start_time: new Date(round.start_time).getTime(),
        end_time: new Date(round.end_time).getTime(),
        start_price: round.start_price,
        end_price: round.end_price,
        total_pool: round.total_pool,
        result: round.result as 'bull' | 'bear',
        percentage_change: round.percentage_change,
        created_at: round.created_at
      })) || [];
    } catch (error) {
      console.error('Error fetching rounds:', error);
      return [];
    }
  }

  async cleanupOldRounds(): Promise<void> {
    try {
      // Keep only last 3 completed rounds
      const { data: rounds } = await supabase
        .from('game_rounds')
        .select('round_number')
        .eq('status', 'completed')
        .order('round_number', { ascending: false })
        .limit(100);

      if (rounds && rounds.length > 3) {
        const roundsToDelete = rounds.slice(3);
        const roundNumbersToDelete = roundsToDelete.map(r => r.round_number);

        const { error } = await supabase
          .from('game_rounds')
          .delete()
          .in('round_number', roundNumbersToDelete);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error cleaning up old rounds:', error);
    }
  }

  getCurrentRoundNumber(): number {
    return this.currentRoundNumber;
  }

  incrementRoundNumber(): number {
    return ++this.currentRoundNumber;
  }

  generateRounds(currentPrice: number, poolBalance: number): RoundData[] {
    const now = Date.now();
    const rounds: RoundData[] = [];

    // Generate last 3 completed rounds
    for (let i = 3; i >= 1; i--) {
      const roundNumber = this.currentRoundNumber - i;
      const startTime = now - (i * this.roundDuration) - this.roundDuration;
      const endTime = startTime + this.roundDuration;
      
      const startPrice = currentPrice + (Math.random() - 0.5) * 0.01;
      const endPrice = currentPrice + (Math.random() - 0.5) * 0.01;
      const percentageChange = ((endPrice - startPrice) / startPrice) * 100;

      rounds.push({
        id: roundNumber.toString(),
        round_number: roundNumber,
        status: 'completed',
        start_time: startTime,
        end_time: endTime,
        start_price: startPrice,
        end_price: endPrice,
        total_pool: poolBalance,
        result: endPrice > startPrice ? 'bull' : 'bear',
        percentage_change: percentageChange
      });
    }

    // Generate current live round
    const liveRoundStart = now - (now % this.roundDuration);
    rounds.push({
      id: this.currentRoundNumber.toString(),
      round_number: this.currentRoundNumber,
      status: 'live',
      start_time: liveRoundStart,
      end_time: liveRoundStart + this.roundDuration,
      start_price: currentPrice,
      total_pool: poolBalance
    });

    // Generate next rounds available for betting
    for (let i = 1; i <= 6; i++) {
      const nextRoundStart = liveRoundStart + (i * this.roundDuration);
      rounds.push({
        id: (this.currentRoundNumber + i).toString(),
        round_number: this.currentRoundNumber + i,
        status: 'next',
        start_time: nextRoundStart,
        end_time: nextRoundStart + this.roundDuration,
        total_pool: poolBalance
      });
    }

    return rounds;
  }
}

export const roundManager = new RoundManager();
