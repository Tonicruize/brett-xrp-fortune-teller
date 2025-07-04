
import { useState, useEffect } from 'react';
import { CandleChart } from './CandleChart';
import { BettingRounds } from './BettingRounds';
import { LivePriceTracker } from './LivePriceTracker';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Users, DollarSign, BarChart3, EyeOff } from 'lucide-react';
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
  startTime: number;
}

interface GenieGameInterfaceProps {
  currentPrice: number;
  user: any;
}

export const GenieGameInterface = ({ currentPrice, user }: GenieGameInterfaceProps) => {
  const [showChart, setShowChart] = useState(false);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [userBets, setUserBets] = useState<{ [roundId: string]: { direction: 'bull' | 'bear', amount: number, token: 'xrp' | 'brett' } }>({});
  const [realCurrentPrice, setRealCurrentPrice] = useState(currentPrice);
  const [poolBalance, setPoolBalance] = useState(0);
  
  // Get persistent game start time using epoch-based calculation
  const getGameStartTime = () => {
    const epochStart = new Date('2025-01-01T00:00:00Z').getTime();
    const roundDuration = 60000; // 1 minute
    const now = Date.now();
    const timeSinceEpoch = now - epochStart;
    const currentRoundIndex = Math.floor(timeSinceEpoch / roundDuration);
    return epochStart + (currentRoundIndex * roundDuration);
  };

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
    const updateRounds = () => {
      const now = Date.now();
      const roundDuration = 60000; // 1 minute  
      const gameStartTime = getGameStartTime();
      const timeSinceStart = now - gameStartTime;
      const currentRoundIndex = Math.floor(timeSinceStart / roundDuration);
      
      const newRounds: Round[] = [];
      
      // Create current live round and more upcoming rounds
      for (let i = currentRoundIndex - 2; i < currentRoundIndex + 8; i++) {
        const roundStartTime = gameStartTime + (i * roundDuration);
        const roundEndTime = roundStartTime + roundDuration;
        const timeLeft = Math.max(0, Math.ceil((roundEndTime - now) / 1000));
        
        let status: 'live' | 'next' | 'completed' = 'next';
        if (i === currentRoundIndex) {
          status = 'live';
        } else if (i < currentRoundIndex) {
          status = 'completed';
        }
        
        const round: Round = {
          id: String(i + 1).padStart(3, '0'),
          status,
          timeLeft: status === 'completed' ? 0 : timeLeft,
          bullPool: Math.random() * 1000 + 500 + (poolBalance * 0.1),
          bearPool: Math.random() * 1000 + 500 + (poolBalance * 0.1),
          totalPool: 0,
          startTime: roundStartTime
        };

        // Set startPrice for live rounds using real price
        if (status === 'live') {
          round.startPrice = realCurrentPrice;
        } else if (status === 'completed') {
          round.startPrice = realCurrentPrice + (Math.random() - 0.5) * 0.01;
          round.endPrice = realCurrentPrice + (Math.random() - 0.5) * 0.01;
          round.result = round.endPrice! > round.startPrice! ? 'bull' : 'bear';
        }
        
        round.totalPool = round.bullPool + round.bearPool;
        newRounds.push(round);
      }
      
      setRounds(newRounds);
    };

    // Initial update
    updateRounds();
    
    // Update every second
    const interval = setInterval(updateRounds, 1000);
    return () => clearInterval(interval);
  }, [realCurrentPrice, poolBalance]);

  const handlePlaceBet = (roundId: string, direction: 'bull' | 'bear', amount: number, token: 'xrp' | 'brett') => {
    if (!user) return;

    setUserBets(prev => ({
      ...prev,
      [roundId]: { direction, amount, token }
    }));

    setRounds(prev => 
      prev.map(round => {
        if (round.id === roundId) {
          const newRound = { ...round };
          if (direction === 'bull') {
            newRound.bullPool += amount;
          } else {
            newRound.bearPool += amount;
          }
          newRound.totalPool = newRound.bullPool + newRound.bearPool;
          return newRound;
        }
        return round;
      })
    );
  };

  const liveRound = rounds.find(r => r.status === 'live');
  const priceMovement = liveRound?.startPrice && liveRound.startPrice !== realCurrentPrice 
    ? (realCurrentPrice > liveRound.startPrice ? 'up' : 'down') 
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
            timeLeft={rounds.find(r => r.status === 'live')?.timeLeft || 0}
            onRoundEnd={() => {}}
          />
        </div>
      )}
    </div>
  );
};
