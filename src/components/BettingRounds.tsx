
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
    amount: '0.1',
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
      amount: '0.1',
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
        amount: '0.1',
        token: 'xrp'
      });
    }
  };

  const handleCancel = () => {
    setBettingState({
      roundId: null,
      direction: null,
      amount: '0.1',
      token: 'xrp'
    });
  };

  const renderCompletedRound = (round: RoundData) => {
    const isWinning = round.result === 'bull' ? round.percentage_change! > 0 : round.percentage_change! < 0;
    
    return (
      <div key={round.id} className="bg-gray-800 rounded-lg border border-gray-700 min-w-[200px] flex-shrink-0">
        {/* Header with round number and ENDED status */}
        <div className="bg-gray-700 rounded-t-lg px-4 py-2 flex justify-between items-center">
          <span className="text-white font-outfit text-sm font-semibold">#{round.round_number}</span>
          <span className="text-gray-400 text-xs font-outfit">ENDED</span>
        </div>

        <div className="p-4 text-center">
          {/* Current price */}
          <div className="mb-2">
            <div className="text-white text-lg font-outfit font-bold">
              ${round.end_price?.toFixed(6)}
            </div>
          </div>

          {/* Start price */}
          <div className="mb-2">
            <div className="text-gray-400 text-sm font-outfit">
              Start: ${round.start_price?.toFixed(6)}
            </div>
          </div>

          {/* Percentage change */}
          <div className="mb-3">
            <div className={`text-sm font-outfit ${
              (round.percentage_change || 0) >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {(round.percentage_change || 0) >= 0 ? '+' : ''}{round.percentage_change?.toFixed(2)}%
            </div>
          </div>

          {/* Pool info */}
          <div className="bg-gray-700 rounded px-3 py-2 mb-3">
            <div className="text-xs text-gray-400 font-outfit mb-1">TOTAL POOL</div>
            <div className="text-sm font-outfit text-white font-semibold">
              {poolBalance.toFixed(2)} XRP
            </div>
          </div>

          {/* Result indicator */}
          <div className={`inline-flex items-center gap-1 px-3 py-1 rounded text-xs font-outfit ${
            round.result === 'bull' 
              ? 'bg-green-900/30 text-green-400' 
              : 'bg-red-900/30 text-red-400'
          }`}>
            {round.result === 'bull' ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span className="font-semibold">{round.result?.toUpperCase()}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderLiveRound = (round: RoundData) => {
    const timeLeft = getTimeLeft(round.end_time);
    const percentageChange = round.start_price 
      ? ((currentPrice - round.start_price) / round.start_price) * 100 
      : 0;

    return (
      <div key={round.id} className="bg-yellow-900/20 border-2 border-yellow-500 rounded-lg min-w-[200px] flex-shrink-0">
        {/* Header with round number and timer */}
        <div className="bg-yellow-500/20 rounded-t-lg px-4 py-2 flex justify-between items-center">
          <span className="text-white font-outfit text-sm font-semibold">#{round.round_number}</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-yellow-400" />
            <span className="text-yellow-400 font-outfit text-xs font-semibold">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div className="p-4 text-center">
          {/* Current price */}
          <div className="mb-2">
            <div className="text-white text-lg font-outfit font-bold">
              ${currentPrice.toFixed(6)}
            </div>
          </div>

          {/* Start price */}
          <div className="mb-2">
            <div className="text-gray-400 text-sm font-outfit">
              Start: ${round.start_price?.toFixed(6)}
            </div>
          </div>

          {/* Percentage change */}
          <div className="mb-3">
            <div className={`text-sm font-outfit ${
              percentageChange >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {percentageChange >= 0 ? '+' : ''}{percentageChange.toFixed(2)}%
            </div>
          </div>

          {/* Pool info */}
          <div className="bg-gray-700 rounded px-3 py-2 mb-3">
            <div className="text-xs text-gray-400 font-outfit mb-1">TOTAL POOL</div>
            <div className="text-sm font-outfit text-white font-semibold">
              {poolBalance.toFixed(2)} XRP
            </div>
          </div>

          {/* Live indicator */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-green-900/30 text-green-400 text-xs font-outfit">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-semibold">LIVE</span>
          </div>
        </div>
      </div>
    );
  };

  const renderNextRound = (round: RoundData) => {
    const timeLeft = getTimeLeft(round.start_time);
    const userBet = userBets[round.id];
    const isBetting = bettingState.roundId === round.id;
    const canBet = user && !userBet;

    return (
      <div key={round.id} className={`bg-gray-800 rounded-lg border min-w-[200px] flex-shrink-0 transition-all duration-300 ${
        isBetting ? 'border-yellow-500 shadow-lg shadow-yellow-500/20' : 'border-gray-700'
      }`}>
        {/* Header with round number and timer */}
        <div className="bg-gray-700 rounded-t-lg px-4 py-2 flex justify-between items-center">
          <span className="text-white font-outfit text-sm font-semibold">#{round.round_number}</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-blue-400" />
            <span className="text-blue-400 font-outfit text-xs font-semibold">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div className="p-4 text-center">
          {/* Current price (no start price yet) */}
          <div className="mb-2">
            <div className="text-white text-lg font-outfit font-bold">
              ${currentPrice.toFixed(6)}
            </div>
          </div>

          {/* Pool info */}
          <div className="bg-gray-700 rounded px-3 py-2 mb-4">
            <div className="text-xs text-gray-400 font-outfit mb-1">TOTAL POOL</div>
            <div className="text-sm font-outfit text-white font-semibold">
              {poolBalance.toFixed(2)} XRP
            </div>
          </div>

          {/* Betting Interface */}
          {isBetting ? (
            <div className="space-y-3">
              <div className={`p-3 rounded border-2 ${
                bettingState.direction === 'bull' 
                  ? 'border-green-500 bg-green-900/20' 
                  : 'border-red-500 bg-red-900/20'
              }`}>
                <div className="flex items-center justify-center gap-2 mb-3">
                  {bettingState.direction === 'bull' ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  <span className={`font-outfit font-semibold text-xs ${
                    bettingState.direction === 'bull' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {bettingState.direction?.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-2">
                  <Input
                    type="number"
                    value={bettingState.amount}
                    onChange={(e) => setBettingState(prev => ({ ...prev, amount: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white font-outfit text-sm h-8"
                    placeholder="0.1"
                    step="0.1"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600 font-outfit text-xs h-7"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleConfirmBet}
                      className="bg-yellow-600 hover:bg-yellow-700 text-black font-outfit text-xs h-7 font-semibold"
                    >
                      Confirm
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : userBet ? (
            <div className={`p-3 rounded border ${
              userBet.direction === 'bull' 
                ? 'border-green-500 bg-green-900/20' 
                : 'border-red-500 bg-red-900/20'
            }`}>
              <div className="flex items-center justify-center gap-2 mb-1">
                {userBet.direction === 'bull' ? (
                  <TrendingUp className="w-3 h-3 text-green-400" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-400" />
                )}
                <span className={`font-outfit font-semibold text-xs ${
                  userBet.direction === 'bull' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {userBet.direction.toUpperCase()}
                </span>
              </div>
              <div className="text-white font-outfit text-xs">
                {userBet.amount} {userBet.token.toUpperCase()}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => handleDirectionSelect(round.id, 'bull')}
                disabled={!canBet}
                className="w-full h-8 bg-green-700 hover:bg-green-600 disabled:opacity-50 font-outfit text-xs font-semibold"
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                UP
              </Button>
              <Button
                onClick={() => handleDirectionSelect(round.id, 'bear')}
                disabled={!canBet}
                className="w-full h-8 bg-red-700 hover:bg-red-600 disabled:opacity-50 font-outfit text-xs font-semibold"
              >
                <TrendingDown className="w-3 h-3 mr-1" />
                DOWN
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 pb-4" style={{ width: 'max-content' }}>
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
