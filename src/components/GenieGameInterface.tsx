
import { useState, useEffect } from 'react';
import { CandleChart } from './CandleChart';
import { BettingRounds } from './BettingRounds';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Users, DollarSign, BarChart3, EyeOff } from 'lucide-react';

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
  const [gameStartTime] = useState(() => {
    // Check if there's a saved game start time
    const saved = localStorage.getItem('genie_game_start');
    if (saved) {
      return parseInt(saved);
    }
    // Start a new game cycle
    const now = Date.now();
    localStorage.setItem('genie_game_start', now.toString());
    return now;
  });

  const [stats] = useState({
    totalPlayers: 1247,
    totalPool: 45670.80,
    winRate: 68.5
  });

  // Initialize rounds based on game start time
  useEffect(() => {
    const initializeRounds = () => {
      const now = Date.now();
      const timeSinceStart = now - gameStartTime;
      const roundDuration = 60000; // 1 minute in milliseconds
      
      // Calculate which round we should be on
      const currentRoundIndex = Math.floor(timeSinceStart / roundDuration);
      const timeInCurrentRound = timeSinceStart % roundDuration;
      
      const newRounds: Round[] = [];
      
      // Create 4 rounds: completed (if any), live, next, future
      for (let i = Math.max(0, currentRoundIndex - 1); i < currentRoundIndex + 3; i++) {
        const roundStartTime = gameStartTime + (i * roundDuration);
        const roundEndTime = roundStartTime + roundDuration;
        const timeLeft = Math.max(0, Math.ceil((roundEndTime - now) / 1000));
        
        let status: 'live' | 'next' | 'completed' = 'next';
        if (i === currentRoundIndex) {
          status = 'live';
        } else if (i < currentRoundIndex) {
          status = 'completed';
        }
        
        newRounds.push({
          id: String(i + 1).padStart(3, '0'),
          status,
          timeLeft,
          startPrice: status === 'live' || status === 'completed' ? currentPrice : undefined,
          bullPool: Math.random() * 1000 + 500,
          bearPool: Math.random() * 1000 + 500,
          totalPool: 0,
          startTime: roundStartTime,
          result: status === 'completed' ? (Math.random() > 0.5 ? 'bull' : 'bear') : undefined
        });
      }
      
      // Update total pools
      newRounds.forEach(round => {
        round.totalPool = round.bullPool + round.bearPool;
      });
      
      setRounds(newRounds);
    };

    initializeRounds();
  }, [gameStartTime, currentPrice]);

  // Update timers every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const roundDuration = 60000;
      const timeSinceStart = now - gameStartTime;
      const currentRoundIndex = Math.floor(timeSinceStart / roundDuration);
      
      setRounds(prevRounds => {
        const newRounds = prevRounds.map(round => {
          const roundIndex = parseInt(round.id) - 1;
          const roundStartTime = gameStartTime + (roundIndex * roundDuration);
          const roundEndTime = roundStartTime + roundDuration;
          const timeLeft = Math.max(0, Math.ceil((roundEndTime - now) / 1000));
          
          let status: 'live' | 'next' | 'completed' = 'next';
          if (roundIndex === currentRoundIndex) {
            status = 'live';
          } else if (roundIndex < currentRoundIndex) {
            status = 'completed';
          }
          
          return {
            ...round,
            status,
            timeLeft,
            startPrice: (status === 'live' && !round.startPrice) ? currentPrice : round.startPrice
          };
        });
        
        // Remove old completed rounds and add new future rounds
        const filteredRounds = newRounds.filter(round => 
          round.status !== 'completed' || parseInt(round.id) >= currentRoundIndex
        );
        
        // Add new rounds if needed
        while (filteredRounds.length < 3) {
          const lastRound = filteredRounds[filteredRounds.length - 1];
          const newRoundIndex = lastRound ? parseInt(lastRound.id) : currentRoundIndex + 2;
          const newRoundStartTime = gameStartTime + (newRoundIndex * roundDuration);
          const newRoundEndTime = newRoundStartTime + roundDuration;
          const newTimeLeft = Math.max(0, Math.ceil((newRoundEndTime - now) / 1000));
          
          filteredRounds.push({
            id: String(newRoundIndex + 1).padStart(3, '0'),
            status: 'next',
            timeLeft: newTimeLeft,
            bullPool: Math.random() * 500 + 200,
            bearPool: Math.random() * 500 + 200,
            totalPool: 0,
            startTime: newRoundStartTime
          });
        }
        
        return filteredRounds;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStartTime, currentPrice]);

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
  const priceMovement = liveRound?.startPrice && liveRound.startPrice !== currentPrice 
    ? (currentPrice > liveRound.startPrice ? 'up' : 'down') 
    : null;

  return (
    <div className="space-y-6" style={{
      backgroundColor: priceMovement === 'up' ? 'rgba(34, 197, 94, 0.05)' : 
                     priceMovement === 'down' ? 'rgba(239, 68, 68, 0.05)' : 
                     'transparent',
      transition: 'background-color 0.5s ease'
    }}>
      {/* Trading Pair Header */}
      <div className="text-center">
        <h2 className="text-3xl font-orbitron font-bold text-white mb-2">XRP/USDT</h2>
        <p className="text-slate-400 font-inter">Predict the price movement and win rewards</p>
      </div>

      {/* Compact Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="bg-slate-900 border border-slate-700 p-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-yellow-500" />
            <div>
              <div className="text-lg font-orbitron font-bold text-white">
                {stats.totalPlayers.toLocaleString()}
              </div>
              <div className="text-slate-400 font-inter text-xs">ACTIVE PLAYERS</div>
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
              <div className="text-slate-400 font-inter text-xs">TOTAL POOL</div>
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
              <div className="text-slate-400 font-inter text-xs">WIN RATE</div>
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
            className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
          >
            {showChart ? <EyeOff className="w-4 h-4 mr-2" /> : <BarChart3 className="w-4 h-4 mr-2" />}
            {showChart ? 'HIDE CHART' : 'SHOW CHART'}
          </Button>
        </div>
        
        <BettingRounds
          rounds={rounds}
          onPlaceBet={handlePlaceBet}
          userBets={userBets}
          currentPrice={currentPrice}
          user={user}
        />
      </div>

      {/* Conditional Chart Display */}
      {showChart && (
        <div className="space-y-4">
          <h3 className="text-xl font-orbitron font-bold text-white">LIVE CHART</h3>
          <CandleChart 
            currentPrice={currentPrice}
            gameActive={rounds.some(r => r.status === 'live')}
            timeLeft={rounds.find(r => r.status === 'live')?.timeLeft || 0}
            onRoundEnd={() => {}}
          />
        </div>
      )}
    </div>
  );
};
