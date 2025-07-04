
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TrendingUp, TrendingDown, Clock, X } from 'lucide-react';
import { realXrpOracle } from '@/services/realXrpOracle';

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
  user: any;
}

export const BettingRounds = ({ rounds, onPlaceBet, userBets, currentPrice, user }: BettingRoundsProps) => {
  const [bettingState, setBettingState] = useState<{
    roundId: string | null;
    direction: 'bull' | 'bear' | null;
    amount: string;
    token: 'xrp' | 'brett';
  }>({
    roundId: null,
    direction: null,
    amount: '10',
    token: 'xrp'
  });

  // Get real pool balance from oracle
  const poolBalance = realXrpOracle.getPoolBalance();

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

  const handleDirectionSelect = (roundId: string, direction: 'bull' | 'bear') => {
    if (!user) return;
    
    setBettingState({
      roundId,
      direction,
      amount: '10',
      token: 'xrp'
    });
  };

  const handleConfirmBet = () => {
    if (bettingState.roundId && bettingState.direction && bettingState.amount) {
      onPlaceBet(
        bettingState.roundId,
        bettingState.direction,
        parseFloat(bettingState.amount),
        bettingState.token
      );
      setBettingState({
        roundId: null,
        direction: null,
        amount: '10',
        token: 'xrp'
      });
    }
  };

  const handleCancel = () => {
    setBettingState({
      roundId: null,
      direction: null,
      amount: '10',
      token: 'xrp'
    });
  };

  const renderRound = (round: Round) => {
    const userBet = userBets[round.id];
    const movement = round.startPrice ? getPriceMovement(round.startPrice, currentPrice) : 'same';
    const priceChange = round.startPrice ? getPriceChange(round.startPrice, currentPrice) : '0.000';
    const isBetting = bettingState.roundId === round.id;
    // Only allow betting on 'next' rounds, not live ones
    const canBet = user && round.status === 'next' && !userBet;

    // Use pool balance for display instead of mock data
    const displayBullPool = poolBalance * 0.4 + (round.bullPool * 0.1);
    const displayBearPool = poolBalance * 0.35 + (round.bearPool * 0.1);
    const displayTotalPool = displayBullPool + displayBearPool;

    return (
      <Card key={round.id} className={`bg-slate-900 border-2 min-w-[300px] flex-shrink-0 transition-all duration-300 ${
        isBetting ? 'border-yellow-500 shadow-lg shadow-yellow-500/20' : 'border-slate-700'
      }`}>
        <div className="p-4">
          {/* Header with Clock and Round Number */}
          <div className="flex items-center justify-center gap-2 mb-4 bg-slate-800 rounded-lg p-3">
            <Clock className="w-5 h-5 text-yellow-400" />
            <span className="font-orbitron font-bold text-white">ROUND #{round.id}</span>
            <div className="ml-auto text-yellow-400 font-orbitron font-bold text-lg">
              {formatTime(round.timeLeft)}
            </div>
          </div>

          {/* Price Display */}
          <div className="text-center mb-4 bg-slate-800 rounded-lg p-4">
            <div className="text-xs text-slate-400 mb-1">LIVE PRICE</div>
            <div className="text-2xl font-orbitron font-bold text-white mb-2">
              ${currentPrice.toFixed(6)}
            </div>
            
            {round.startPrice && (
              <>
                <div className="text-xs text-slate-400 mb-1">START PRICE</div>
                <div className="text-lg font-orbitron font-semibold text-slate-300 mb-2">
                  ${round.startPrice.toFixed(6)}
                </div>
                
                {/* Movement Indicator */}
                <div className={`flex items-center justify-center gap-1 px-3 py-1 rounded-full text-sm font-orbitron font-bold ${
                  movement === 'up' ? 'bg-green-500/20 text-green-400' : 
                  movement === 'down' ? 'bg-red-500/20 text-red-400' : 
                  'bg-slate-500/20 text-slate-400'
                }`}>
                  {movement === 'up' && <TrendingUp className="w-4 h-4" />}
                  {movement === 'down' && <TrendingDown className="w-4 h-4" />}
                  <span>
                    {movement === 'up' ? '+' : movement === 'down' ? '' : ''}{priceChange}%
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Pool Display */}
          <div className="mb-4 p-3 bg-slate-800 rounded-lg">
            <div className="text-center mb-2">
              <div className="text-xs text-slate-400">TOTAL POOL</div>
              <div className="text-xl font-orbitron font-bold text-yellow-400">
                {displayTotalPool.toFixed(2)} XRP
              </div>
            </div>
          </div>

          {/* Betting Interface */}
          {isBetting ? (
            <div className="space-y-4">
              <div className={`p-3 rounded-lg border-2 ${
                bettingState.direction === 'bull' 
                  ? 'border-green-500 bg-green-900/20' 
                  : 'border-red-500 bg-red-900/20'
              }`}>
                <div className="flex items-center justify-center gap-2 mb-3">
                  {bettingState.direction === 'bull' ? (
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-400" />
                  )}
                  <span className={`font-orbitron font-bold ${
                    bettingState.direction === 'bull' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {bettingState.direction?.toUpperCase()} SELECTED
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">AMOUNT</label>
                    <Input
                      type="number"
                      value={bettingState.amount}
                      onChange={(e) => setBettingState(prev => ({ ...prev, amount: e.target.value }))}
                      className="bg-slate-800 border-slate-600 text-white"
                      placeholder="Enter amount"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-2">TOKEN</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => setBettingState(prev => ({ ...prev, token: 'xrp' }))}
                        variant={bettingState.token === 'xrp' ? 'default' : 'outline'}
                        className={bettingState.token === 'xrp' 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'bg-slate-800 border-slate-600 text-white hover:bg-slate-700'
                        }
                      >
                        XRP
                      </Button>
                      <Button
                        onClick={() => setBettingState(prev => ({ ...prev, token: 'brett' }))}
                        variant={bettingState.token === 'brett' ? 'default' : 'outline'}
                        className={bettingState.token === 'brett' 
                          ? 'bg-purple-600 hover:bg-purple-700' 
                          : 'bg-slate-800 border-slate-600 text-white hover:bg-slate-700'
                        }
                      >
                        BRETT
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
                    >
                      <X className="w-4 h-4 mr-1" />
                      CANCEL
                    </Button>
                    <Button
                      onClick={handleConfirmBet}
                      className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold"
                    >
                      CONFIRM
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Betting Buttons - Only show for next rounds */}
              {round.status === 'next' && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {/* UP Button */}
                  <div className="space-y-2">
                    <Button
                      onClick={() => handleDirectionSelect(round.id, 'bull')}
                      disabled={!canBet}
                      className="w-full h-12 bg-green-700 hover:bg-green-600 disabled:opacity-50 font-orbitron font-bold"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      UP
                    </Button>
                    <div className="text-center">
                      <div className="text-xs text-slate-400">Pool</div>
                      <div className="text-sm font-orbitron font-bold text-green-400">
                        {displayBullPool.toFixed(2)} XRP
                      </div>
                    </div>
                  </div>

                  {/* DOWN Button */}
                  <div className="space-y-2">
                    <Button
                      onClick={() => handleDirectionSelect(round.id, 'bear')}
                      disabled={!canBet}
                      className="w-full h-12 bg-red-700 hover:bg-red-600 disabled:opacity-50 font-orbitron font-bold"
                    >
                      <TrendingDown className="w-4 h-4 mr-2" />
                      DOWN
                    </Button>
                    <div className="text-center">
                      <div className="text-xs text-slate-400">Pool</div>
                      <div className="text-sm font-orbitron font-bold text-red-400">
                        {displayBearPool.toFixed(2)} XRP
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Live Round Display - No betting allowed */}
              {round.status === 'live' && (
                <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-center">
                  <div className="text-yellow-400 font-orbitron font-bold text-sm">
                    ROUND IN PROGRESS
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Betting closed - round is live
                  </div>
                </div>
              )}

              {/* User Bet Display - Only show if there's a bet */}
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
            </>
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
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Horizontal Scroll Container - Hidden scrollbar */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
          {rounds.map(renderRound)}
        </div>
      </div>
      
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};
