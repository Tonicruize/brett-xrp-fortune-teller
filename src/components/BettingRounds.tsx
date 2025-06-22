
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
  onPlaceBet: (roundId: string, direction: 'bull' | 'bear', amount: number, token: 'xrp' | 'brett') => void;
  userBets: { [roundId: string]: { direction: 'bull' | 'bear', amount: number, token: 'xrp' | 'brett' } };
  currentPrice: number;
}

export const BettingRounds = ({ rounds, onPlaceBet, userBets, currentPrice }: BettingRoundsProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPriceMovement = (startPrice: number, currentPrice: number) => {
    if (startPrice === currentPrice) return 'same';
    return currentPrice > startPrice ? 'up' : 'down';
  };

  const getPriceChange = (startPrice: number, currentPrice: number) => {
    return ((currentPrice - startPrice) / startPrice * 100).toFixed(3);
  };

  const renderRound = (round: Round) => {
    const userBet = userBets[round.id];
    const movement = round.startPrice ? getPriceMovement(round.startPrice, currentPrice) : 'same';
    const priceChange = round.startPrice ? getPriceChange(round.startPrice, currentPrice) : '0.000';

    return (
      <Card key={round.id} className="bg-slate-900 border border-yellow-500/30 p-4 min-w-[300px] flex-shrink-0">
        {/* Header with Clock and Round Number */}
        <div className="flex items-center justify-center gap-2 mb-4 bg-slate-800 rounded-lg p-2">
          <Clock className="w-4 h-4 text-yellow-400" />
          <span className="font-orbitron font-bold text-white">ROUND #{round.id}</span>
          <div className="ml-auto text-yellow-400 font-orbitron font-bold">
            {formatTime(round.timeLeft)}
          </div>
        </div>

        {/* Price Display */}
        <div className="text-center mb-4 bg-slate-800 rounded-lg p-3">
          <div className="text-xs text-slate-400 font-inter mb-1">LIVE PRICE</div>
          <div className="text-2xl font-orbitron font-bold text-white mb-1">
            ${currentPrice.toFixed(6)}
          </div>
          
          {round.startPrice && (
            <>
              <div className="text-xs text-slate-400 font-inter mb-1">START PRICE</div>
              <div className="text-lg font-orbitron font-semibold text-slate-300">
                ${round.startPrice.toFixed(6)}
              </div>
              
              {/* Movement Indicator */}
              <div className={`flex items-center justify-center gap-1 mt-2 px-2 py-1 rounded-full text-xs font-orbitron font-bold ${
                movement === 'up' ? 'bg-green-500/20 text-green-400' : 
                movement === 'down' ? 'bg-red-500/20 text-red-400' : 
                'bg-slate-500/20 text-slate-400'
              }`}>
                {movement === 'up' && <TrendingUp className="w-3 h-3" />}
                {movement === 'down' && <TrendingDown className="w-3 h-3" />}
                <span>
                  {movement === 'up' ? '+' : movement === 'down' ? '' : ''}{priceChange}%
                </span>
              </div>
            </>
          )}
        </div>

        {/* Betting Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* UP Button */}
          <div className="space-y-2">
            <Button
              onClick={() => onPlaceBet(round.id, 'bull', 10, 'xrp')}
              disabled={round.status !== 'next' || !!userBet}
              className="w-full h-12 bg-green-700 hover:bg-green-600 disabled:opacity-50 font-orbitron font-bold"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              UP
            </Button>
            <div className="text-center">
              <div className="text-xs text-slate-400 font-inter">Pool</div>
              <div className="text-sm font-orbitron font-bold text-green-400">
                ${round.bullPool.toFixed(2)}
              </div>
            </div>
          </div>

          {/* DOWN Button */}
          <div className="space-y-2">
            <Button
              onClick={() => onPlaceBet(round.id, 'bear', 10, 'xrp')}
              disabled={round.status !== 'next' || !!userBet}
              className="w-full h-12 bg-red-700 hover:bg-red-600 disabled:opacity-50 font-orbitron font-bold"
            >
              <TrendingDown className="w-4 h-4 mr-2" />
              DOWN
            </Button>
            <div className="text-center">
              <div className="text-xs text-slate-400 font-inter">Pool</div>
              <div className="text-sm font-orbitron font-bold text-red-400">
                ${round.bearPool.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Token Selection for Next Rounds */}
        {round.status === 'next' && !userBet && (
          <div className="mb-4">
            <div className="text-xs text-slate-400 font-inter mb-2 text-center">STAKE WITH</div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => onPlaceBet(round.id, 'bull', 10, 'xrp')}
                variant="outline"
                className="text-xs bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
              >
                XRP
              </Button>
              <Button
                onClick={() => onPlaceBet(round.id, 'bull', 10, 'brett')}
                variant="outline"
                className="text-xs bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
              >
                BRETT
              </Button>
            </div>
          </div>
        )}

        {/* User Bet Display */}
        {userBet && (
          <div className={`p-3 rounded-lg border ${
            userBet.direction === 'bull' 
              ? 'border-green-500 bg-green-900/20' 
              : 'border-red-500 bg-red-900/20'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {userBet.direction === 'bull' ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
                <span className={`font-orbitron font-bold text-xs ${
                  userBet.direction === 'bull' ? 'text-green-400' : 'text-red-400'
                }`}>
                  YOUR BET: {userBet.direction.toUpperCase()}
                </span>
              </div>
              <div className="text-right">
                <div className="text-white font-orbitron font-bold text-sm">
                  {userBet.amount} {userBet.token.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Round Status */}
        <div className="mt-3 text-center">
          <span className={`px-3 py-1 rounded-full text-xs font-orbitron font-bold ${
            round.status === 'live' ? 'bg-green-500/20 text-green-400' :
            round.status === 'next' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-slate-500/20 text-slate-400'
          }`}>
            {round.status === 'live' ? 'LIVE' : 
             round.status === 'next' ? 'NEXT' : 
             'ENDED'}
          </span>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* All Rounds in a Horizontal Scroll */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {rounds.map(renderRound)}
      </div>
    </div>
  );
};
