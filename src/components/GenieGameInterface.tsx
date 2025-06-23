
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
}

interface GenieGameInterfaceProps {
  currentPrice: number;
  user: any;
}

export const GenieGameInterface = ({ currentPrice, user }: GenieGameInterfaceProps) => {
  const [showChart, setShowChart] = useState(false);
  const [rounds, setRounds] = useState<Round[]>([
    {
      id: '001',
      status: 'live',
      timeLeft: 60,
      startPrice: 0.62450000,
      bullPool: 1250.50,
      bearPool: 890.30,
      totalPool: 2140.80
    },
    {
      id: '002',
      status: 'next',
      timeLeft: 120,
      bullPool: 850.20,
      bearPool: 1100.40,
      totalPool: 1950.60
    },
    {
      id: '003',
      status: 'next',
      timeLeft: 180,
      bullPool: 450.80,
      bearPool: 680.20,
      totalPool: 1131.00
    }
  ]);

  const [userBets, setUserBets] = useState<{ [roundId: string]: { direction: 'bull' | 'bear', amount: number, token: 'xrp' | 'brett' } }>({});

  const [stats] = useState({
    totalPlayers: 1247,
    totalPool: 45670.80,
    winRate: 68.5
  });

  // Fixed timer to count down normally (every 1000ms = 1 second)
  useEffect(() => {
    const interval = setInterval(() => {
      setRounds(prevRounds => {
        let newRounds = prevRounds.map(round => {
          if (round.timeLeft > 0) {
            const newTimeLeft = round.timeLeft - 1;
            
            if (newTimeLeft === 0) {
              if (round.status === 'live') {
                return {
                  ...round,
                  status: 'completed' as const,
                  timeLeft: 0,
                  endPrice: currentPrice,
                  result: Math.random() > 0.5 ? 'bull' as const : 'bear' as const
                };
              } else if (round.status === 'next') {
                return {
                  ...round,
                  status: 'live' as const,
                  timeLeft: 60,
                  startPrice: currentPrice
                };
              }
            }
            
            return { ...round, timeLeft: newTimeLeft };
          }
          return round;
        });

        // Remove completed rounds and add new ones
        newRounds = newRounds.filter(round => round.status !== 'completed');
        
        // Add new rounds if we have less than 3
        while (newRounds.length < 3) {
          const lastRound = newRounds[newRounds.length - 1];
          const newId = String(parseInt(lastRound.id) + 1).padStart(3, '0');
          newRounds.push({
            id: newId,
            status: 'next',
            timeLeft: (newRounds.length + 1) * 60,
            bullPool: 0,
            bearPool: 0,
            totalPool: 0
          });
        }

        return newRounds;
      });
    }, 1000); // Fixed to exactly 1 second

    return () => clearInterval(interval);
  }, [currentPrice]);

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
