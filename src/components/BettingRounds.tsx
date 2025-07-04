
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TrendingUp, TrendingDown, Clock, X } from 'lucide-react';
import { realXrpOracle } from '@/services/realXrpOracle';
import { roundManager, RoundData } from '@/services/roundManager';

interface BettingRoundsProps {
  rounds: RoundData[];
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

  const poolBalance = realXrpOracle.getPoolBalance();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeLeft = (endTime: number) => {
    const now = Date.now();
    return Math.max(0, Math.ceil((endTime - now) / 1000));
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

  const renderCompletedRound = (round: RoundData) => {
    const isWinning = round.result === 'bull' ? round.percentage_change! > 0 : round.percentage_change! < 0;
    
    return (
      <Card key={round.id} className="bg-slate-900 border border-slate-700 min-w-[280px] flex-shrink-0">
        <div className="p-4 font-outfit">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 bg-slate-800 rounded-lg p-3">
            <span className="font-orbitron font-bold text-white">#{round.round_number}</span>
            <span className="text-slate-400 text-sm font-outfit">ENDED</span>
          </div>

          {/* Price Info */}
          <div className="text-center mb-4 space-y-2">
            <div className="text-2xl font-orbitron font-bold text-white">
              ${round.end_price?.toFixed(6)}
            </div>
            <div className="text-sm text-slate-400 font-outfit">
              Start: ${round.start_price?.toFixed(6)}
            </div>
            <div className={`text-lg font-orbitron font-bold ${
              (round.percentage_change || 0) >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {(round.percentage_change || 0) >= 0 ? '+' : ''}{round.percentage_change?.toFixed(3)}%
            </div>
          </div>

          {/* Pool Info */}
          <div className="text-center mb-4 bg-slate-800 rounded-lg p-3">
            <div className="text-xs text-slate-400 font-outfit mb-1">TOTAL POOL</div>
            <div className="text-lg font-orbitron font-bold text-yellow-400">
              {round.total_pool.toFixed(2)} XRP
            </div>
          </div>

          {/* Result */}
          <div className="text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
              round.result === 'bull' 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {round.result === 'bull' ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="font-orbitron font-bold text-sm">
                {round.result?.toUpperCase()} WON
              </span>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const renderLiveRound = (round: RoundData) => {
    const timeLeft = getTimeLeft(round.end_time);
    const percentageChange = round.start_price 
      ? ((currentPrice - round.start_price) / round.start_price) * 100 
      : 0;

    return (
      <Card key={round.id} className="bg-slate-900 border-2 border-yellow-500 min-w-[280px] flex-shrink-0">
        <div className="p-4 font-outfit">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 bg-yellow-500/20 rounded-lg p-3">
            <span className="font-orbitron font-bold text-white">#{round.round_number}</span>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 font-orbitron font-bold">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* Price Info */}
          <div className="text-center mb-4 space-y-2">
            <div className="text-2xl font-orbitron font-bold text-white">
              ${currentPrice.toFixed(6)}
            </div>
            <div className="text-sm text-slate-400 font-outfit">
              Start: ${round.start_price?.toFixed(6)}
            </div>
            <div className={`text-lg font-orbitron font-bold ${
              percentageChange >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {percentageChange >= 0 ? '+' : ''}{percentageChange.toFixed(3)}%
            </div>
          </div>

          {/* Pool Info */}
          <div className="text-center mb-4 bg-slate-800 rounded-lg p-3">
            <div className="text-xs text-slate-400 font-outfit mb-1">TOTAL POOL</div>
            <div className="text-lg font-orbitron font-bold text-yellow-400">
              {round.total_pool.toFixed(2)} XRP
            </div>
          </div>

          {/* Live Indicator */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-orbitron font-bold text-sm">LIVE</span>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const renderNextRound = (round: RoundData) => {
    const timeLeft = getTimeLeft(round.start_time);
    const userBet = userBets[round.id];
    const isBetting = bettingState.roundId === round.id;
    const canBet = user && !userBet;

    return (
      <Card key={round.id} className={`bg-slate-900 border-2 min-w-[280px] flex-shrink-0 transition-all duration-300 ${
        isBetting ? 'border-yellow-500 shadow-lg shadow-yellow-500/20' : 'border-slate-700'
      }`}>
        <div className="p-4 font-outfit">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 bg-slate-800 rounded-lg p-3">
            <span className="font-orbitron font-bold text-white">#{round.round_number}</span>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-orbitron font-bold">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* Current Price (no start price yet) */}
          <div className="text-center mb-4 space-y-2">
            <div className="text-2xl font-orbitron font-bold text-white">
              ${currentPrice.toFixed(6)}
            </div>
            <div className="text-sm text-slate-400 font-outfit">
              Current Price
            </div>
          </div>

          {/* Pool Info */}
          <div className="text-center mb-4 bg-slate-800 rounded-lg p-3">
            <div className="text-xs text-slate-400 font-outfit mb-1">TOTAL POOL</div>
            <div className="text-lg font-orbitron font-bold text-yellow-400">
              {round.total_pool.toFixed(2)} XRP
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
                    <label className="text-xs text-slate-400 block mb-1 font-outfit">AMOUNT</label>
                    <Input
                      type="number"
                      value={bettingState.amount}
                      onChange={(e) => setBettingState(prev => ({ ...prev, amount: e.target.value }))}
                      className="bg-slate-800 border-slate-600 text-white font-outfit"
                      placeholder="Enter amount"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-2 font-outfit">TOKEN</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => setBettingState(prev => ({ ...prev, token: 'xrp' }))}
                        variant={bettingState.token === 'xrp' ? 'default' : 'outline'}
                        className={`font-outfit ${bettingState.token === 'xrp' 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'bg-slate-800 border-slate-600 text-white hover:bg-slate-700'
                        }`}
                      >
                        XRP
                      </Button>
                      <Button
                        onClick={() => setBettingState(prev => ({ ...prev, token: 'brett' }))}
                        variant={bettingState.token === 'brett' ? 'default' : 'outline'}
                        className={`font-outfit ${bettingState.token === 'brett' 
                          ? 'bg-purple-600 hover:bg-purple-700' 
                          : 'bg-slate-800 border-slate-600 text-white hover:bg-slate-700'
                        }`}
                      >
                        BRETT
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700 font-outfit"
                    >
                      <X className="w-4 h-4 mr-1" />
                      CANCEL
                    </Button>
                    <Button
                      onClick={handleConfirmBet}
                      className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold font-outfit"
                    >
                      CONFIRM
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : userBet ? (
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
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => handleDirectionSelect(round.id, 'bull')}
                disabled={!canBet}
                className="w-full h-12 bg-green-700 hover:bg-green-600 disabled:opacity-50 font-orbitron font-bold"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                UP
              </Button>
              <Button
                onClick={() => handleDirectionSelect(round.id, 'bear')}
                disabled={!canBet}
                className="w-full h-12 bg-red-700 hover:bg-red-600 disabled:opacity-50 font-orbitron font-bold"
              >
                <TrendingDown className="w-4 h-4 mr-2" />
                DOWN
              </Button>
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
          {rounds.map((round) => {
            if (round.status === 'completed') {
              return renderCompletedRound(round);
            } else if (round.status === 'live') {
              return renderLiveRound(round);
            } else {
              return renderNextRound(round);
            }
          })}
        </div>
      </div>
    </div>
  );
};
