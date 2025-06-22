
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';
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
    <Card className="bg-slate-900 border-2 border-slate-700 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
      
      <div className="p-8">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-4">
            <div className="w-8 h-8 bg-yellow-500 transform rotate-45"></div>
            <h2 className="text-3xl font-bold text-white">GENIE PREDICTION</h2>
            <div className="w-8 h-8 bg-yellow-500 transform rotate-45"></div>
          </div>

          <div className="bg-slate-800 border border-slate-600 rounded p-6">
            <p className="text-yellow-500 font-semibold mb-2">LIVE PRICE</p>
            <div className="text-4xl font-mono font-bold text-white mb-2">
              ${currentPrice.toFixed(8)}
            </div>
            {initialPrice > 0 && (
              <div className="flex items-center justify-center gap-4 text-lg">
                <span className={`font-bold ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(4)}%
                </span>
              </div>
            )}
          </div>

          {gameActive && prediction ? (
            <div className="space-y-6">
              <div className="bg-slate-800 border border-slate-600 rounded p-4">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Clock className="text-yellow-500 w-6 h-6" />
                  <span className="text-3xl font-mono font-bold text-white">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
              
              <div className={`border-2 rounded p-6 ${
                isWinning 
                  ? 'border-green-500 bg-green-900/20' 
                  : 'border-red-500 bg-red-900/20'
              }`}>
                <div className="flex items-center justify-center gap-3 mb-4">
                  {prediction === 'up' ? (
                    <>
                      <TrendingUp className="text-green-400 w-8 h-8" />
                      <span className="text-green-400 font-bold text-xl">BETTING UP</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="text-red-400 w-8 h-8" />
                      <span className="text-red-400 font-bold text-xl">BETTING DOWN</span>
                    </>
                  )}
                </div>
                
                <div className="text-center">
                  <p className={`font-bold text-lg ${isWinning ? 'text-green-300' : 'text-red-300'}`}>
                    {isWinning ? 'WINNING' : 'LOSING'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <Button
                  onClick={() => onPrediction('up')}
                  className="h-24 bg-green-700 hover:bg-green-600 text-white font-bold text-xl border-2 border-green-500"
                  disabled={gameActive}
                >
                  <div className="flex flex-col items-center gap-2">
                    <TrendingUp className="w-8 h-8" />
                    <span>UP</span>
                  </div>
                </Button>
                
                <Button
                  onClick={() => onPrediction('down')}
                  className="h-24 bg-red-700 hover:bg-red-600 text-white font-bold text-xl border-2 border-red-500"
                  disabled={gameActive}
                >
                  <div className="flex flex-col items-center gap-2">
                    <TrendingDown className="w-8 h-8" />
                    <span>DOWN</span>
                  </div>
                </Button>
              </div>

              <div className="bg-slate-800 border border-slate-600 rounded p-4">
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <div className="text-yellow-500 font-bold">90s</div>
                    <div className="text-slate-400">Duration</div>
                  </div>
                  <div>
                    <div className="text-green-400 font-bold">2x</div>
                    <div className="text-slate-400">Payout</div>
                  </div>
                  <div>
                    <div className="text-blue-400 font-bold">LIVE</div>
                    <div className="text-slate-400">Real Time</div>
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
