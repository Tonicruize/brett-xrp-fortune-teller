
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Clock, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface PredictionCardProps {
  currentPrice: number;
  gameActive: boolean;
  timeLeft: number;
  prediction: 'up' | 'down' | null;
  onPrediction: (direction: 'up' | 'down') => void;
  initialPrice?: number;
}

export const PredictionCard = ({ 
  currentPrice, 
  gameActive, 
  timeLeft, 
  prediction, 
  onPrediction,
  initialPrice = 0
}: PredictionCardProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const priceChange = initialPrice ? ((currentPrice - initialPrice) / initialPrice) * 100 : 0;
  const isWinning = prediction === 'up' ? priceChange > 0 : priceChange < 0;

  return (
    <Card className="bg-slate-900 border border-slate-700 relative overflow-hidden">      
      <div className="p-8">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-4">
            <Target className="w-8 h-8 text-yellow-500" />
            <h2 className="text-3xl font-orbitron font-black text-white">GENIE PREDICTION</h2>
            <Target className="w-8 h-8 text-yellow-500" />
          </div>

          {gameActive && prediction ? (
            <div className="space-y-6">
              <div className="bg-slate-800 border border-slate-600 p-4 transform -skew-x-6">
                <div className="transform skew-x-6 flex items-center justify-center gap-3">
                  <Clock className="text-yellow-500 w-6 h-6" />
                  <span className="text-3xl font-orbitron font-black text-white">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
              
              <div className={`border-2 p-6 transform -skew-x-6 ${
                isWinning 
                  ? 'border-green-500 bg-green-900/20' 
                  : 'border-red-500 bg-red-900/20'
              }`}>
                <div className="transform skew-x-6">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    {prediction === 'up' ? (
                      <>
                        <TrendingUp className="text-green-400 w-8 h-8" />
                        <span className="text-green-400 font-orbitron font-bold text-xl">BULL POSITION</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="text-red-400 w-8 h-8" />
                        <span className="text-red-400 font-orbitron font-bold text-xl">BEAR POSITION</span>
                      </>
                    )}
                  </div>
                  
                  <div className="text-center">
                    <p className={`font-orbitron font-bold text-lg ${isWinning ? 'text-green-300' : 'text-red-300'}`}>
                      {isWinning ? 'WINNING' : 'LOSING'}
                    </p>
                    <p className="text-slate-400 font-orbitron text-sm mt-1">
                      Change: {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(4)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-slate-800 border border-slate-600 p-6 transform -skew-x-6">
                <div className="transform skew-x-6">
                  <p className="text-yellow-500 font-orbitron font-semibold mb-2">CURRENT PRICE</p>
                  <div className="text-4xl font-orbitron font-black text-white">
                    ${currentPrice.toFixed(6)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <Button
                  onClick={() => onPrediction('up')}
                  className="h-24 bg-green-700 hover:bg-green-600 text-white font-orbitron font-bold text-xl border-2 border-green-500 transform -skew-x-12"
                  disabled={gameActive}
                >
                  <div className="transform skew-x-12 flex flex-col items-center gap-2">
                    <TrendingUp className="w-8 h-8" />
                    <span>BULL</span>
                  </div>
                </Button>
                
                <Button
                  onClick={() => onPrediction('down')}
                  className="h-24 bg-red-700 hover:bg-red-600 text-white font-orbitron font-bold text-xl border-2 border-red-500 transform -skew-x-12"
                  disabled={gameActive}
                >
                  <div className="transform skew-x-12 flex flex-col items-center gap-2">
                    <TrendingDown className="w-8 h-8" />
                    <span>BEAR</span>
                  </div>
                </Button>
              </div>

              <div className="bg-slate-800 border border-slate-600 p-4 transform -skew-x-6">
                <div className="transform skew-x-6 grid grid-cols-3 gap-4 text-center text-sm font-orbitron">
                  <div>
                    <div className="text-yellow-500 font-bold">90s</div>
                    <div className="text-slate-400">DURATION</div>
                  </div>
                  <div>
                    <div className="text-green-400 font-bold">2x</div>
                    <div className="text-slate-400">PAYOUT</div>
                  </div>
                  <div>
                    <div className="text-blue-400 font-bold">LIVE</div>
                    <div className="text-slate-400">REAL TIME</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
