
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface CandleChartProps {
  currentPrice: number;
  gameActive: boolean;
  timeLeft: number;
  onRoundEnd: (finalPrice: number) => void;
}

export const CandleChart = ({ currentPrice, gameActive, timeLeft, onRoundEnd }: CandleChartProps) => {
  const [candles, setCandles] = useState<CandleData[]>([]);
  const [currentCandle, setCurrentCandle] = useState<CandleData | null>(null);
  const [roundStartPrice, setRoundStartPrice] = useState(0);

  useEffect(() => {
    if (gameActive && timeLeft === 90) {
      setRoundStartPrice(currentPrice);
      setCurrentCandle({
        time: new Date().toLocaleTimeString(),
        open: currentPrice,
        high: currentPrice,
        low: currentPrice,
        close: currentPrice,
        volume: Math.random() * 1000000
      });
    }

    if (currentCandle && gameActive) {
      setCurrentCandle(prev => prev ? {
        ...prev,
        high: Math.max(prev.high, currentPrice),
        low: Math.min(prev.low, currentPrice),
        close: currentPrice,
        volume: prev.volume + Math.random() * 10000
      } : null);
    }

    if (timeLeft === 0 && currentCandle) {
      setCandles(prev => [...prev.slice(-19), currentCandle]);
      onRoundEnd(currentPrice);
      setCurrentCandle(null);
    }
  }, [gameActive, timeLeft, currentPrice, currentCandle, onRoundEnd]);

  const renderCandle = (candle: CandleData, index: number) => {
    const isGreen = candle.close >= candle.open;
    const bodyHeight = Math.abs(candle.close - candle.open) * 1000;
    const wickTop = Math.max(candle.high - Math.max(candle.open, candle.close)) * 1000;
    const wickBottom = Math.max(Math.min(candle.open, candle.close) - candle.low) * 1000;

    return (
      <div key={index} className="flex flex-col items-center justify-end h-32 relative">
        {/* Upper wick */}
        <div 
          className={`w-0.5 ${isGreen ? 'bg-green-400' : 'bg-red-400'}`}
          style={{ height: `${Math.min(wickTop, 20)}px` }}
        />
        {/* Body */}
        <div 
          className={`w-3 ${isGreen ? 'bg-green-400' : 'bg-red-400'} border ${isGreen ? 'border-green-300' : 'border-red-300'}`}
          style={{ height: `${Math.max(Math.min(bodyHeight, 30), 2)}px` }}
        />
        {/* Lower wick */}
        <div 
          className={`w-0.5 ${isGreen ? 'bg-green-400' : 'bg-red-400'}`}
          style={{ height: `${Math.min(wickBottom, 20)}px` }}
        />
      </div>
    );
  };

  return (
    <Card className="bg-slate-900 border-2 border-slate-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-orbitron font-bold text-white">LIVE CHART</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400"></div>
            <span className="text-xs text-slate-400 font-orbitron">BULL</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-400"></div>
            <span className="text-xs text-slate-400 font-orbitron">BEAR</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded p-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-orbitron font-bold text-white mb-1">
            ${currentPrice.toFixed(6)}
          </div>
          <div className="flex items-center justify-center gap-2">
            {currentPrice > roundStartPrice ? (
              <>
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-orbitron text-sm">
                  +{((currentPrice - roundStartPrice) / roundStartPrice * 100).toFixed(3)}%
                </span>
              </>
            ) : (
              <>
                <TrendingDown className="w-4 h-4 text-red-400" />
                <span className="text-red-400 font-orbitron text-sm">
                  {((currentPrice - roundStartPrice) / roundStartPrice * 100).toFixed(3)}%
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded p-4 h-40">
        <div className="flex items-end justify-between h-full gap-1 overflow-hidden">
          {candles.slice(-20).map((candle, index) => renderCandle(candle, index))}
          {currentCandle && renderCandle(currentCandle, candles.length)}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mt-4 text-xs font-orbitron">
        <div className="text-center text-slate-400">
          <div className="text-white font-semibold">${currentPrice.toFixed(6)}</div>
          <div>CURRENT</div>
        </div>
        <div className="text-center text-slate-400">
          <div className="text-green-400 font-semibold">${Math.max(...candles.map(c => c.high), currentPrice).toFixed(6)}</div>
          <div>HIGH</div>
        </div>
        <div className="text-center text-slate-400">
          <div className="text-red-400 font-semibold">${Math.min(...candles.map(c => c.low), currentPrice).toFixed(6)}</div>
          <div>LOW</div>
        </div>
        <div className="text-center text-slate-400">
          <div className="text-yellow-500 font-semibold">{candles.length > 0 ? (candles[candles.length - 1].volume / 1000).toFixed(0) : '0'}K</div>
          <div>VOLUME</div>
        </div>
      </div>
    </Card>
  );
};
