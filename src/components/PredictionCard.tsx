
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
    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-indigo-500/30 shadow-2xl shadow-indigo-500/20">
      <div className="p-6">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Target className="text-yellow-400 w-6 h-6" />
            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Make Your Prediction
            </h3>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border-2 border-indigo-500/20">
            <p className="text-slate-400 text-sm mb-2">Current XRP Price</p>
            <p className="text-3xl font-bold text-indigo-400">${currentPrice.toFixed(6)}</p>
            {initialPrice > 0 && (
              <div className="mt-2">
                <p className="text-xs text-slate-500">Entry Price: ${initialPrice.toFixed(6)}</p>
                <p className={`text-sm font-semibold ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(4)}%
                </p>
              </div>
            )}
          </div>

          {gameActive && prediction ? (
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-3">
                <Clock className="text-orange-400 w-8 h-8 animate-pulse" />
                <span className="text-4xl font-mono font-bold text-white">
                  {formatTime(timeLeft)}
                </span>
              </div>
              
              <div className={`p-6 rounded-xl border-2 transition-all ${
                isWinning 
                  ? 'border-green-400 bg-green-500/10 shadow-lg shadow-green-500/20' 
                  : 'border-red-400 bg-red-500/10 shadow-lg shadow-red-500/20'
              }`}>
                <div className="flex items-center justify-center gap-3 mb-3">
                  {prediction === 'up' ? (
                    <>
                      <TrendingUp className="text-green-400 w-8 h-8" />
                      <span className="text-green-400 font-bold text-xl">Predicting UP</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="text-red-400 w-8 h-8" />
                      <span className="text-red-400 font-bold text-xl">Predicting DOWN</span>
                    </>
                  )}
                </div>
                <div className={`text-center p-3 rounded-lg ${
                  isWinning ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  <p className={`font-semibold ${isWinning ? 'text-green-300' : 'text-red-300'}`}>
                    {isWinning ? 'Currently Winning!' : 'Currently Losing'}
                  </p>
                </div>
              </div>
              
              <p className="text-slate-400 text-sm">
                Wait for the countdown to complete to see your result...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              <Button
                onClick={() => onPrediction('up')}
                className="h-20 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-green-500/25"
                disabled={gameActive}
              >
                <div className="flex flex-col items-center gap-2">
                  <TrendingUp className="w-8 h-8" />
                  <span>BULL</span>
                </div>
              </Button>
              
              <Button
                onClick={() => onPrediction('down')}
                className="h-20 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-red-500/25"
                disabled={gameActive}
              >
                <div className="flex flex-col items-center gap-2">
                  <TrendingDown className="w-8 h-8" />
                  <span>BEAR</span>
                </div>
              </Button>
            </div>
          )}

          <div className="text-xs text-slate-500 space-y-1 bg-slate-800/30 rounded-lg p-3">
            <p>Predict XRP price movement for the next 90 seconds</p>
            <p>Correct predictions earn $BRETT tokens</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
