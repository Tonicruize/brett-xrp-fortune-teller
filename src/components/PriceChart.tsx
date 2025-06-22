
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface PriceChartProps {
  currentPrice: number;
}

export const PriceChart = ({ currentPrice }: PriceChartProps) => {
  // Mock chart data - in real implementation, this would come from API
  const mockCandles = Array.from({ length: 20 }, (_, i) => ({
    time: i,
    price: 0.5 + (Math.random() - 0.5) * 0.1,
    isGreen: Math.random() > 0.5
  }));

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/20 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Activity className="text-cyan-400 w-5 h-5" />
          XRP/USD Chart
        </h3>
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded"></div>
            <span className="text-gray-400">Bullish</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded"></div>
            <span className="text-gray-400">Bearish</span>
          </div>
        </div>
      </div>

      {/* Mock candlestick chart */}
      <div className="h-32 bg-slate-900/50 rounded-lg p-4 mb-4">
        <div className="flex items-end justify-between h-full gap-1">
          {mockCandles.map((candle, index) => (
            <div 
              key={index}
              className={`w-2 rounded-sm transition-all ${
                candle.isGreen ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ 
                height: `${(candle.price - 0.45) * 400}%`,
                opacity: index === mockCandles.length - 1 ? 1 : 0.7
              }}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-slate-900/30 rounded p-2">
          <p className="text-xs text-gray-400">High</p>
          <p className="text-sm font-semibold text-green-400">$0.5420</p>
        </div>
        <div className="bg-slate-900/30 rounded p-2">
          <p className="text-xs text-gray-400">Current</p>
          <p className="text-sm font-semibold text-cyan-400">${currentPrice.toFixed(4)}</p>
        </div>
        <div className="bg-slate-900/30 rounded p-2">
          <p className="text-xs text-gray-400">Low</p>
          <p className="text-sm font-semibold text-red-400">$0.5089</p>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          📊 Live XRP price updates every 2 seconds
        </p>
      </div>
    </Card>
  );
};
