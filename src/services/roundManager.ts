
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type GameRound = Database['public']['Tables']['game_rounds']['Row'];
type GameRoundInsert = Database['public']['Tables']['game_rounds']['Insert'];

interface RoundData {
  id: string;
  status: 'live' | 'next' | 'completed';
  timeLeft: number;
  startPrice?: number;
  endPrice?: number;
  bullPool: number;
  bearPool: number;
  totalPool: number;
  result?: 'bull' | 'bear';
  startTime: number;
  roundNumber: number;
}

class RoundManager {
  private listeners: ((rounds: RoundData[]) => void)[] = [];
  private intervalId: NodeJS.Timeout | null = null;
  private currentPrice: number = 0;

  async initializeRounds(currentPrice: number): Promise<void> {
    this.currentPrice = currentPrice;
    
    // Get existing rounds from database
    const { data: existingRounds } = await supabase
      .from('game_rounds')
      .select('*')
      .order('round_number', { ascending: true });

    const now = Date.now();
    const roundDuration = 60000; // 1 minute
    const gameStartTime = this.getGameStartTime();
    const timeSinceStart = now - gameStartTime;
    const currentRoundIndex = Math.floor(timeSinceStart / roundDuration);

    // Create missing rounds
    const roundsToCreate: GameRoundInsert[] = [];
    
    for (let i = Math.max(0, currentRoundIndex - 2); i < currentRoundIndex + 10; i++) {
      const roundStartTime = gameStartTime + (i * roundDuration);
      const roundEndTime = roundStartTime + roundDuration;
      const roundNumber = i + 1;
      
      // Check if round already exists
      const existingRound = existingRounds?.find(r => r.round_number === roundNumber);
      
      if (!existingRound) {
        let status: 'live' | 'next' | 'completed' = 'next';
        if (i === currentRoundIndex) {
          status = 'live';
        } else if (i < currentRoundIndex) {
          status = 'completed';
        }

        roundsToCreate.push({
          round_number: roundNumber,
          status,
          start_time: new Date(roundStartTime).toISOString(),
          end_time: new Date(roundEndTime).toISOString(),
          start_price: status === 'live' ? currentPrice : (status === 'completed' ? currentPrice + (Math.random() - 0.5) * 0.01 : null),
          end_price: status === 'completed' ? currentPrice + (Math.random() - 0.5) * 0.01 : null,
          total_pool: Math.random() * 2000 + 1000,
          result: status === 'completed' ? (Math.random() > 0.5 ? 'bull' : 'bear') : null,
          percentage_change: status === 'completed' ? ((Math.random() - 0.5) * 10) : null
        });
      }
    }

    // Insert new rounds
    if (roundsToCreate.length > 0) {
      await supabase.from('game_rounds').insert(roundsToCreate);
    }
  }

  async getRounds(): Promise<RoundData[]> {
    const { data: dbRounds, error } = await supabase
      .from('game_rounds')
      .select('*')
      .order('round_number', { ascending: true })
      .limit(20);

    if (error) {
      console.error('Error fetching rounds:', error);
      return [];
    }

    const now = Date.now();
    const roundDuration = 60000;
    
    return (dbRounds || []).map(round => {
      const endTime = new Date(round.end_time).getTime();
      const timeLeft = Math.max(0, Math.ceil((endTime - now) / 1000));
      
      return {
        id: round.id,
        status: round.status as 'live' | 'next' | 'completed',
        timeLeft,
        startPrice: round.start_price ? Number(round.start_price) : undefined,
        endPrice: round.end_price ? Number(round.end_price) : undefined,
        bullPool: Number(round.total_pool) * 0.55,
        bearPool: Number(round.total_pool) * 0.45,
        totalPool: Number(round.total_pool),
        result: round.result as 'bull' | 'bear' | undefined,
        startTime: new Date(round.start_time).getTime(),
        roundNumber: round.round_number
      };
    });
  }

  async updateRoundStatus(currentPrice: number): Promise<void> {
    this.currentPrice = currentPrice;
    const now = Date.now();
    const roundDuration = 60000;
    const gameStartTime = this.getGameStartTime();
    const timeSinceStart = now - gameStartTime;
    const currentRoundIndex = Math.floor(timeSinceStart / roundDuration);

    // Update live rounds to completed and set end price
    await supabase
      .from('game_rounds')
      .update({
        status: 'completed',
        end_price: currentPrice,
        result: Math.random() > 0.5 ? 'bull' : 'bear',
        percentage_change: ((Math.random() - 0.5) * 10)
      })
      .eq('status', 'live')
      .lt('round_number', currentRoundIndex + 1);

    // Update next round to live
    await supabase
      .from('game_rounds')
      .update({
        status: 'live',
        start_price: currentPrice
      })
      .eq('round_number', currentRoundIndex + 1)
      .eq('status', 'next');

    // Notify listeners
    const rounds = await this.getRounds();
    this.listeners.forEach(listener => listener(rounds));
  }

  private getGameStartTime(): number {
    const epochStart = new Date('2025-01-01T00:00:00Z').getTime();
    const roundDuration = 60000;
    const now = Date.now();
    const timeSinceEpoch = now - epochStart;
    const currentRoundIndex = Math.floor(timeSinceEpoch / roundDuration);
    return epochStart + (currentRoundIndex * roundDuration);
  }

  startUpdates(callback: (rounds: RoundData[]) => void): void {
    this.listeners.push(callback);
    
    if (!this.intervalId) {
      this.intervalId = setInterval(async () => {
        await this.updateRoundStatus(this.currentPrice);
      }, 1000);
    }
  }

  stopUpdates(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.listeners = [];
  }

  updatePrice(price: number): void {
    this.currentPrice = price;
  }
}

export const roundManager = new RoundManager();
