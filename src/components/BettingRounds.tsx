
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Clock, Target } from 'lucide-react';

interface Round {
  id: string;
  status: 'live' | 'next' | 'completed';
  timeLeft: number;
  startPrice?: number;
  endPrice?: number;
  bullPool: number;
  bearPool: number;
  totalPool: number;
  result?: 'bull' | 'bear';
}

interface BettingRoundsProps {
  rounds: Round[];
  onPlaceBet: (roundId: string, direction: 'bull' | 'bear', amount: number) => void;
  userBets: { [roundId: string]: { direction: 'bull' | 'bear', amount: number } };
}

export const BettingRounds = ({ rounds, onPlaceBet, userBets }: BettingRoundsProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRoundStatus = (round: Round) => {
    if (round.status === 'live') return 'LIVE';
    if (round.status === 'next') return 'NEXT';
    return 'ENDED';
  };

  const getStatusColor = (status: string) => {
    if (status === 'LIVE') return 'text-green-400 border-green-400';
    if (status === 'NEXT') return 'text-yellow-400 border-yellow-400';
    return 'text-slate-400 border-slate-600';
  };

  return (
    <div className="space-y-4">
      {rounds.map((round) => {
        const userBet = userBets[round.id];
        const bullPercentage = round.totalPool > 0 ? (round.bullPool / round.totalPool) * 100 : 50;
        const bearPercentage = round.totalPool > 0 ? (round.bearPool / round.totalPool) * 100 : 50;
        const status = getRoundStatus(round);

        return (
          <Card key={round.id} className="bg-slate-900 border border-slate-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1 border text-xs font-orbitron font-bold transform -skew-x-12 ${getStatusColor(status)}`}>
                  <div className="transform skew-x-12">{status}</div>
                </div>
                <span className="text-slate-400 font-orbitron text-sm">#{round.id}</span>
              </div>
              
              {round.status !== 'completed' && (
                <div className="flex items-center gap-2 text-white font-orbitron">
                  <Clock className="w-4 h-4" />
                  <span className="font-bold">{formatTime(round.timeLeft)}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Bull Side */}
              <div className="bg-slate-800 border-l-4 border-green-500 p-4 transform -skew-x-3">
                <div className="transform skew-x-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      <span className="font-orbitron font-bold text-green-400">BULL</span>
                    </div>
                    <span className="text-green-400 font-orbitron font-bold">
                      {bullPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-white font-orbitron font-bold text-lg">
                    ${round.bullPool.toFixed(2)}
                  </div>
                  <div className="w-full bg-slate-700 h-2 mt-2">
                    <div 
                      className="bg-green-500 h-full transition-all duration-300"
                      style={{ width: `${bullPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Bear Side */}
              <div className="bg-slate-800 border-l-4 border-red-500 p-4 transform -skew-x-3">
                <div className="transform skew-x-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-5 h-5 text-red-400" />
                      <span className="font-orbitron font-bold text-red-400">BEAR</span>
                    </div>
                    <span className="text-red-400 font-orbitron font-bold">
                      {bearPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-white font-orbitron font-bold text-lg">
                    ${round.bearPool.toFixed(2)}
                  </div>
                  <div className="w-full bg-slate-700 h-2 mt-2">
                    <div 
                      className="bg-red-500 h-full transition-all duration-300"
                      style={{ width: `${bearPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Price Information */}
            {round.status === 'completed' && (
              <div className="bg-slate-800 p-3 mb-4 transform -skew-x-6">
                <div className="transform skew-x-6 grid grid-cols-3 gap-4 text-center font-orbitron text-sm">
                  <div>
                    <div className="text-slate-400">START PRICE</div>
                    <div className="text-white font-bold">${round.startPrice?.toFixed(6)}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">END PRICE</div>
                    <div className="text-white font-bold">${round.endPrice?.toFixed(6)}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">RESULT</div>
                    <div className={`font-bold ${round.result === 'bull' ? 'text-green-400' : 'text-red-400'}`}>
                      {round.result?.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Betting Actions */}
            {round.status === 'next' && !userBet && (
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => onPlaceBet(round.id, 'bull', 10)}
                  className="h-12 bg-green-700 hover:bg-green-600 font-orbitron font-bold transform -skew-x-12"
                >
                  <div className="transform skew-x-12 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    BET BULL
                  </div>
                </Button>
                <Button
                  onClick={() => onPlaceBet(round.id, 'bear', 10)}
                  className="h-12 bg-red-700 hover:bg-red-600 font-orbitron font-bold transform -skew-x-12"
                >
                  <div className="transform skew-x-12 flex items-center gap-2">
                    <TrendingDown className="w-5 h-5" />
                    BET BEAR
                  </div>
                </Button>
              </div>
            )}

            {/* User Bet Display */}
            {userBet && (
              <div className={`p-3 border transform -skew-x-6 ${
                userBet.direction === 'bull' 
                  ? 'border-green-500 bg-green-900/20' 
                  : 'border-red-500 bg-red-900/20'
              }`}>
                <div className="transform skew-x-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {userBet.direction === 'bull' ? (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                    <span className={`font-orbitron font-bold ${
                      userBet.direction === 'bull' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      YOUR BET: {userBet.direction.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-white font-orbitron font-bold">
                    ${userBet.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};
