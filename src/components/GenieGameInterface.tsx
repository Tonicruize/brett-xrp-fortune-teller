
import { useState, useEffect } from 'react';
import { CandleChart } from './CandleChart';
import { BettingRounds } from './BettingRounds';
import { LivePriceTracker } from './LivePriceTracker';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Users, DollarSign, BarChart3, EyeOff } from 'lucide-react';
import { realXrpOracle } from '@/services/realXrpOracle';
import { roundManager, RoundData } from '@/services/roundManager';

interface GenieGameInterfaceProps {
  currentPrice: number;
  user: any;
}

export const GenieGameInterface = ({ currentPrice, user }: GenieGameInterfaceProps) => {
  const [showChart, setShowChart] = useState(false);
  const [rounds, setRounds] = useState<RoundData[]>([]);
  const [userBets, setUserBets] = useState<{ [roundId: string]: { direction: 'bull' | 'bear', amount: number, token: 'xrp' | 'brett' } }>({});
  const [realCurrentPrice, setRealCurrentPrice] = useState(currentPrice);
  const [poolBalance, setPoolBalance] = useState(0);
  
  const [stats] = useState({
    totalPlayers: 1247,
    totalPool: 45670.80,
    winRate: 68.5
  });

  // Handle real price updates from LivePriceTracker
  const handlePriceUpdate = (price: number) => {
    setRealCurrentPrice(price);
    setPoolBalance(realXrpOracle.getPoolBalance());
  };

  // Initialize and update rounds
  useEffect(() => {
    const initializeRounds = async () => {
      await roundManager.initializeRounds();
    };
    initializeRounds();

    const updateRounds = () => {
      const newRounds = roundManager.generateRounds(realCurrentPrice, poolBalance);
      setRounds(newRounds);
    };

    // Initial update
    updateRounds();
    
    // Update every second
    const interval = setInterval(updateRounds, 1000);
    
    // Cleanup old rounds every 5 minutes
    const cleanupInterval = setInterval(() => {
      roundManager.cleanupOldRounds();
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
      clearInterval(cleanupInterval);
    };
  }, [realCurrentPrice, poolBalance]);

  const handlePlaceBet = (roundId: string, direction: 'bull' | 'bear', amount: number, token: 'xrp' | 'brett') => {
    if (!user) return;

    setUserBets(prev => ({
      ...prev,
      [roundId]: { direction, amount, token }
    }));

    // Update round pool (simplified for now)
    setRounds(prev => 
      prev.map(round => {
        if (round.id === roundId) {
          return { ...round, total_pool: round.total_pool + amount };
        }
        return round;
      })
    );
  };

  const liveRound = rounds.find(r => r.status === 'live');
  const priceMovement = liveRound?.start_price && liveRound.start_price !== realCurrentPrice 
    ? (realCurrentPrice > liveRound.start_price ? 'up' : 'down') 
    : null;

  return (
    <div className="space-y-6 font-outfit" style={{
      backgroundColor: priceMovement === 'up' ? 'rgba(34, 197, 94, 0.05)' : 
                     priceMovement === 'down' ? 'rgba(239, 68, 68, 0.05)' : 
                     'transparent',
      transition: 'background-color 0.5s ease'
    }}>
      {/* Live Price Tracker */}
      <LivePriceTracker onPriceUpdate={handlePriceUpdate} />

      {/* Trading Pair Header */}
      <div className="text-center">
        <h2 className="text-3xl font-orbitron font-bold text-white mb-2">XRP/USDT</h2>
        <p className="text-slate-400 font-outfit">Predict the price movement and win rewards</p>
      </div>

      {/* Compact Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Card className="bg-slate-900 border border-slate-700 p-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-yellow-500" />
            <div>
              <div className="text-lg font-orbitron font-bold text-white">
                {stats.totalPlayers.toLocaleString()}
              </div>
              <div className="text-slate-400 font-outfit text-xs">ACTIVE PLAYERS</div>
            </div>
          </div>
        </Card>

        <Card className="bg-slate-900 border border-slate-700 p-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <div>
              <div className="text-lg font-orbitron font-bold text-white">
                ${stats.totalPool.toLocaleString()}
              </div>
              <div className="text-slate-400 font-outfit text-xs">TOTAL POOL</div>
            </div>
          </div>
        </Card>

        <Card className="bg-slate-900 border border-slate-700 p-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <div>
              <div className="text-lg font-orbitron font-bold text-white">
                {stats.winRate}%
              </div>
              <div className="text-slate-400 font-outfit text-xs">WIN RATE</div>
            </div>
          </div>
        </Card>

        <Card className="bg-slate-900 border border-slate-700 p-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-yellow-500 rounded-full"></div>
            <div>
              <div className="text-lg font-orbitron font-bold text-white">
                {poolBalance.toFixed(2)}
              </div>
              <div className="text-slate-400 font-outfit text-xs">POOL XRP</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Betting Rounds */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-orbitron font-bold text-white">BETTING ROUNDS</h3>
          <Button
            onClick={() => setShowChart(!showChart)}
            variant="outline"
            className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700 font-outfit"
          >
            {showChart ? <EyeOff className="w-4 h-4 mr-2" /> : <BarChart3 className="w-4 h-4 mr-2" />}
            {showChart ? 'HIDE CHART' : 'SHOW CHART'}
          </Button>
        </div>
        
        <BettingRounds
          rounds={rounds}
          onPlaceBet={handlePlaceBet}
          userBets={userBets}
          currentPrice={realCurrentPrice}
          user={user}
        />
      </div>

      {/* Conditional Chart Display */}
      {showChart && (
        <div className="space-y-4">
          <h3 className="text-xl font-orbitron font-bold text-white">LIVE CHART</h3>
          <CandleChart 
            currentPrice={realCurrentPrice}
            gameActive={rounds.some(r => r.status === 'live')}
            timeLeft={rounds.find(r => r.status === 'live')?.end_time ? 
              Math.max(0, Math.ceil((rounds.find(r => r.status === 'live')!.end_time - Date.now()) / 1000)) : 0}
            onRoundEnd={() => {}}
          />
        </div>
      )}
    </div>
  );
};
