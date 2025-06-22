
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Clock, Target, Flame, Zap } from 'lucide-react';
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
  const priceDifference = currentPrice - initialPrice;

  return (
    <Card className="bg-gradient-to-br from-red-900 via-purple-900 to-orange-900 border-4 border-yellow-400 shadow-2xl shadow-yellow-400/30 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4 w-16 h-16 border-4 border-yellow-400 rounded-full animate-spin"></div>
        <div className="absolute top-8 right-8 w-12 h-12 border-4 border-red-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-8 left-8 w-20 h-20 border-4 border-green-400 rounded-full animate-pulse"></div>
      </div>

      <div className="p-8 relative z-10">
        <div className="text-center space-y-8">
          {/* Header */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <Flame className="text-red-400 w-10 h-10 animate-bounce" />
            <h3 className="text-4xl font-black bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
              PLACE YOUR BET
            </h3>
            <Zap className="text-yellow-400 w-10 h-10 animate-pulse" />
          </div>

          {/* Price Display */}
          <div className="bg-gradient-to-br from-black/80 to-purple-900/80 rounded-2xl p-6 border-4 border-yellow-400/30 shadow-inner">
            <p className="text-yellow-400 text-lg font-bold mb-3">LIVE PRICE ACTION</p>
            <div className="text-5xl font-black text-white mb-4 font-mono tracking-wider">
              ${currentPrice.toFixed(8)}
            </div>
            {initialPrice > 0 && (
              <div className="space-y-3">
                <p className="text-yellow-300 text-sm">Entry: ${initialPrice.toFixed(8)}</p>
                <div className="flex items-center justify-center gap-6">
                  <div className={`text-3xl font-black transition-all duration-300 ${
                    priceChange >= 0 ? 'text-green-400 animate-pulse' : 'text-red-400 animate-pulse'
                  }`}>
                    {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(6)}%
                  </div>
                  <div className={`text-xl font-bold ${
                    priceDifference >= 0 ? 'text-green-300' : 'text-red-300'
                  }`}>
                    ({priceDifference >= 0 ? '+' : ''}${priceDifference.toFixed(8)})
                  </div>
                </div>
              </div>
            )}
          </div>

          {gameActive && prediction ? (
            <div className="space-y-8">
              {/* Timer */}
              <div className="bg-gradient-to-r from-red-600 to-purple-600 rounded-2xl p-6 border-4 border-yellow-400 shadow-lg">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <Clock className="text-yellow-400 w-12 h-12 animate-spin" />
                  <span className="text-6xl font-black text-white font-mono animate-pulse">
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <p className="text-yellow-300 text-lg font-bold">TIME TO WIN!</p>
              </div>
              
              {/* Current Bet Status */}
              <div className={`p-8 rounded-2xl border-4 transition-all duration-500 ${
                isWinning 
                  ? 'border-green-400 bg-gradient-to-br from-green-900/50 to-green-700/30 shadow-lg shadow-green-500/30' 
                  : 'border-red-400 bg-gradient-to-br from-red-900/50 to-red-700/30 shadow-lg shadow-red-500/30'
              }`}>
                <div className="flex items-center justify-center gap-4 mb-6">
                  {prediction === 'up' ? (
                    <>
                      <TrendingUp className="text-green-400 w-12 h-12 animate-bounce" />
                      <span className="text-green-400 font-black text-3xl">BETTING BULL</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="text-red-400 w-12 h-12 animate-bounce" />
                      <span className="text-red-400 font-black text-3xl">BETTING BEAR</span>
                    </>
                  )}
                </div>
                
                <div className={`text-center p-6 rounded-xl transition-all duration-300 ${
                  isWinning ? 'bg-green-500/30' : 'bg-red-500/30'
                }`}>
                  <p className={`font-black text-2xl mb-2 ${isWinning ? 'text-green-300' : 'text-red-300'}`}>
                    {isWinning ? '🔥 YOU\'RE WINNING! 🔥' : '💥 LOSING STREAK 💥'}
                  </p>
                  <p className={`text-xl font-bold ${isWinning ? 'text-green-400' : 'text-red-400'}`}>
                    Price moved {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(6)}%
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-800/50 to-red-800/50 rounded-xl p-4 border-2 border-yellow-400/50">
                <p className="text-yellow-300 text-lg font-bold animate-pulse">
                  ⏰ Hold tight! Results coming in {formatTime(timeLeft)}...
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Betting Buttons */}
              <div className="grid grid-cols-2 gap-8">
                <Button
                  onClick={() => onPrediction('up')}
                  className="h-32 bg-gradient-to-br from-green-500 via-green-600 to-green-700 hover:from-green-400 hover:via-green-500 hover:to-green-600 text-white font-black text-2xl transition-all transform hover:scale-110 active:scale-95 shadow-2xl shadow-green-500/40 hover:shadow-green-400/60 border-4 border-green-300 relative overflow-hidden"
                  disabled={gameActive}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  <div className="flex flex-col items-center gap-3 relative z-10">
                    <TrendingUp className="w-12 h-12" />
                    <div>
                      <div className="text-3xl font-black">BULL</div>
                      <div className="text-lg">🚀 TO THE MOON</div>
                    </div>
                  </div>
                </Button>
                
                <Button
                  onClick={() => onPrediction('down')}
                  className="h-32 bg-gradient-to-br from-red-500 via-red-600 to-red-700 hover:from-red-400 hover:via-red-500 hover:to-red-600 text-white font-black text-2xl transition-all transform hover:scale-110 active:scale-95 shadow-2xl shadow-red-500/40 hover:shadow-red-400/60 border-4 border-red-300 relative overflow-hidden"
                  disabled={gameActive}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  <div className="flex flex-col items-center gap-3 relative z-10">
                    <TrendingDown className="w-12 h-12" />
                    <div>
                      <div className="text-3xl font-black">BEAR</div>
                      <div className="text-lg">📉 CRASH INCOMING</div>
                    </div>
                  </div>
                </Button>
              </div>

              {/* Game Info */}
              <div className="bg-gradient-to-r from-purple-900/60 to-red-900/60 rounded-xl p-6 border-2 border-yellow-400/50">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-yellow-400 text-2xl font-bold">90s</div>
                    <div className="text-white text-sm">Game Duration</div>
                  </div>
                  <div>
                    <div className="text-green-400 text-2xl font-bold">$BRETT</div>
                    <div className="text-white text-sm">Win Tokens</div>
                  </div>
                  <div>
                    <div className="text-red-400 text-2xl font-bold">LIVE</div>
                    <div className="text-white text-sm">Real Prices</div>
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
