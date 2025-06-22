
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Clock, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface PredictionCardProps {
  currentPrice: number;
  gameActive: boolean;
  timeLeft: number;
  prediction: 'up' | 'down' | null;
  onPrediction: (direction: 'up' | 'down') => void;
}

export const PredictionCard = ({ 
  currentPrice, 
  gameActive, 
  timeLeft, 
  prediction, 
  onPrediction 
}: PredictionCardProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/20 p-6">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="text-yellow-400 w-5 h-5" />
          <h3 className="text-2xl font-bold text-white">Make Your Prediction</h3>
          <Sparkles className="text-yellow-400 w-5 h-5" />
        </div>

        <div className="bg-slate-900/50 rounded-lg p-4 border border-cyan-500/30">
          <p className="text-gray-400 text-sm mb-1">Current XRP Price</p>
          <p className="text-3xl font-bold text-cyan-400">${currentPrice.toFixed(4)}</p>
        </div>

        {gameActive && prediction ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-2xl">
              <Clock className="text-orange-400 w-6 h-6" />
              <span className="text-white font-mono">{formatTime(timeLeft)}</span>
            </div>
            
            <div className={`p-4 rounded-lg border-2 ${
              prediction === 'up' 
                ? 'border-green-500 bg-green-500/10' 
                : 'border-red-500 bg-red-500/10'
            }`}>
              <div className="flex items-center justify-center gap-2">
                {prediction === 'up' ? (
                  <>
                    <TrendingUp className="text-green-400 w-6 h-6" />
                    <span className="text-green-400 font-bold text-lg">Predicting UP! 📈</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="text-red-400 w-6 h-6" />
                    <span className="text-red-400 font-bold text-lg">Predicting DOWN! 📉</span>
                  </>
                )}
              </div>
            </div>
            
            <p className="text-gray-400 text-sm">
              Waiting for the round to complete...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => onPrediction('up')}
              className="h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-lg transition-all transform hover:scale-105"
              disabled={gameActive}
            >
              <TrendingUp className="w-6 h-6 mr-2" />
              UP 📈
            </Button>
            
            <Button
              onClick={() => onPrediction('down')}
              className="h-16 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold text-lg transition-all transform hover:scale-105"
              disabled={gameActive}
            >
              <TrendingDown className="w-6 h-6 mr-2" />
              DOWN 📉
            </Button>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>🔮 The genie will reveal the outcome in 60 seconds</p>
          <p>💰 Correct predictions earn $BRETT tokens</p>
        </div>
      </div>
    </Card>
  );
};
