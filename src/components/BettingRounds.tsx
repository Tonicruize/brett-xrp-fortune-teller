
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';

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
    if (status === 'LIVE') return 'text-green-400 border-green-400 bg-green-400/10';
    if (status === 'NEXT') return 'text-yellow-400 border-yellow-400 bg-yellow-400/10';
    return 'text-slate-400 border-slate-600 bg-slate-600/10';
  };

  // Group rounds by status for better layout
  const liveRounds = rounds.filter(r => r.status === 'live');
  const nextRounds = rounds.filter(r => r.status === 'next');
  const completedRounds = rounds.filter(r => r.status === 'completed').slice(0, 3);

  const renderRound = (round: Round) => {
    const userBet = userBets[round.id];
    const bullPercentage = round.totalPool > 0 ? (round.bullPool / round.totalPool) * 100 : 50;
    const bearPercentage = round.totalPool > 0 ? (round.bearPool / round.totalPool) * 100 : 50;
    const status = getRoundStatus(round);

    return (
      <Card key={round.id} className="bg-slate-900 border border-slate-700 p-3 min-w-[280px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`px-2 py-1 border text-xs font-inter font-medium ${getStatusColor(status)}`}>
              {status}
            </div>
            <span className="text-slate-400 font-inter text-xs">#{round.id}</span>
          </div>
          
          {round.status !== 'completed' && (
            <div className="flex items-center gap-1 text-white font-inter text-sm">
              <Clock className="w-3 h-3" />
              <span className="font-medium">{formatTime(round.timeLeft)}</span>
            </div>
          )}
        </div>

        {/* Betting Pools */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-slate-800 border-l-2 border-green-500 p-2">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="font-inter font-medium text-green-400 text-xs">BULL</span>
              </div>
              <span className="text-green-400 font-inter font-medium text-xs">
                {bullPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="text-white font-inter font-semibold text-sm">
              ${round.bullPool.toFixed(2)}
            </div>
            <div className="w-full bg-slate-700 h-1 mt-1">
              <div 
                className="bg-green-500 h-full transition-all duration-300"
                style={{ width: `${bullPercentage}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-800 border-l-2 border-red-500 p-2">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <TrendingDown className="w-3 h-3 text-red-400" />
                <span className="font-inter font-medium text-red-400 text-xs">BEAR</span>
              </div>
              <span className="text-red-400 font-inter font-medium text-xs">
                {bearPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="text-white font-inter font-semibold text-sm">
              ${round.bearPool.toFixed(2)}
            </div>
            <div className="w-full bg-slate-700 h-1 mt-1">
              <div 
                className="bg-red-500 h-full transition-all duration-300"
                style={{ width: `${bearPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Price Information for completed rounds */}
        {round.status === 'completed' && (
          <div className="bg-slate-800 p-2 mb-3">
            <div className="grid grid-cols-3 gap-2 text-center font-inter text-xs">
              <div>
                <div className="text-slate-400 mb-1">START</div>
                <div className="text-white font-medium">${round.startPrice?.toFixed(5)}</div>
              </div>
              <div>
                <div className="text-slate-400 mb-1">END</div>
                <div className="text-white font-medium">${round.endPrice?.toFixed(5)}</div>
              </div>
              <div>
                <div className="text-slate-400 mb-1">RESULT</div>
                <div className={`font-medium text-xs ${round.result === 'bull' ? 'text-green-400' : 'text-red-400'}`}>
                  {round.result?.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Betting Actions */}
        {round.status === 'next' && !userBet && (
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => onPlaceBet(round.id, 'bull', 10)}
              className="h-8 bg-green-700 hover:bg-green-600 font-inter font-medium text-xs"
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              BET BULL
            </Button>
            <Button
              onClick={() => onPlaceBet(round.id, 'bear', 10)}
              className="h-8 bg-red-700 hover:bg-red-600 font-inter font-medium text-xs"
            >
              <TrendingDown className="w-3 h-3 mr-1" />
              BET BEAR
            </Button>
          </div>
        )}

        {/* User Bet Display */}
        {userBet && (
          <div className={`p-2 border ${
            userBet.direction === 'bull' 
              ? 'border-green-500 bg-green-900/20' 
              : 'border-red-500 bg-red-900/20'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {userBet.direction === 'bull' ? (
                  <TrendingUp className="w-3 h-3 text-green-400" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-400" />
                )}
                <span className={`font-inter font-medium text-xs ${
                  userBet.direction === 'bull' ? 'text-green-400' : 'text-red-400'
                }`}>
                  YOUR BET: {userBet.direction.toUpperCase()}
                </span>
              </div>
              <span className="text-white font-inter font-medium text-xs">
                ${userBet.amount.toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Live and Next Rounds - Side by Side */}
      <div className="space-y-4">
        {liveRounds.length > 0 && (
          <div>
            <h4 className="text-lg font-orbitron font-bold text-green-400 mb-3">LIVE ROUNDS</h4>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {liveRounds.map(renderRound)}
            </div>
          </div>
        )}

        {nextRounds.length > 0 && (
          <div>
            <h4 className="text-lg font-orbitron font-bold text-yellow-400 mb-3">UPCOMING ROUNDS</h4>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {nextRounds.map(renderRound)}
            </div>
          </div>
        )}

        {completedRounds.length > 0 && (
          <div>
            <h4 className="text-lg font-orbitron font-bold text-slate-400 mb-3">RECENT RESULTS</h4>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {completedRounds.map(renderRound)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
