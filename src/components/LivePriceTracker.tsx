
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { xrpOracle } from '@/services/xrpOracle';

interface LivePriceTrackerProps {
  onPriceUpdate: (price: number) => void;
}

export const LivePriceTracker = ({ onPriceUpdate }: LivePriceTrackerProps) => {
  const [currentPrice, setCurrentPrice] = useState(0);
  const [previousPrice, setPreviousPrice] = useState(0);
  const [change24h, setChange24h] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    setIsConnected(true);
    
    xrpOracle.startPriceUpdates((data) => {
      setPreviousPrice(currentPrice);
      setCurrentPrice(data.price);
      setChange24h(data.change24h || 0);
      setLastUpdate(new Date());
      onPriceUpdate(data.price);
    });

    // Initial price fetch
    xrpOracle.getCurrentPrice().then((data) => {
      setCurrentPrice(data.price);
      setChange24h(data.change24h || 0);
      setLastUpdate(new Date());
      onPriceUpdate(data.price);
    });

    return () => {
      xrpOracle.stopPriceUpdates();
      setIsConnected(false);
    };
  }, [onPriceUpdate, currentPrice]);

  const priceDirection = currentPrice > previousPrice ? 'up' : currentPrice < previousPrice ? 'down' : 'same';
  const isPositive = change24h >= 0;

  return (
    <Card className="bg-slate-900 border-2 border-yellow-500/30 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Activity className={`w-6 h-6 ${isConnected ? 'text-green-400 animate-pulse' : 'text-red-400'}`} />
          <h3 className="text-xl font-orbitron font-bold text-white">XRP/USDT LIVE</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
            isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="font-orbitron font-semibold">
              {isPositive ? '+' : ''}{change24h.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      <div className="text-center p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border-2 border-yellow-500/20">
        <div className={`text-5xl font-orbitron font-black transition-all duration-300 ${
          priceDirection === 'up' ? 'text-green-400 animate-pulse' : 
          priceDirection === 'down' ? 'text-red-400 animate-pulse' : 
          'text-yellow-400'
        }`}>
          <span className="inline-block transform transition-transform duration-200 hover:scale-105">
            ${currentPrice.toFixed(6)}
          </span>
        </div>
        
        <div className="flex items-center justify-center gap-2 mt-3">
          {priceDirection === 'up' && <TrendingUp className="w-5 h-5 text-green-400 animate-bounce" />}
          {priceDirection === 'down' && <TrendingDown className="w-5 h-5 text-red-400 animate-bounce" />}
          <span className={`text-sm font-orbitron font-semibold ${
            priceDirection === 'up' ? 'text-green-400' : 
            priceDirection === 'down' ? 'text-red-400' : 
            'text-slate-400'
          }`}>
            {priceDirection === 'up' ? 'RISING' : priceDirection === 'down' ? 'FALLING' : 'STABLE'}
          </span>
        </div>
        
        {lastUpdate && (
          <div className="text-xs text-slate-500 mt-2 font-inter">
            Last update: {lastUpdate.toLocaleTimeString()}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-slate-800/50 rounded-lg p-3 text-center">
          <div className="text-xs text-slate-400 font-inter mb-1">STATUS</div>
          <div className={`text-sm font-orbitron font-bold ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
            {isConnected ? 'LIVE' : 'DISCONNECTED'}
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3 text-center">
          <div className="text-xs text-slate-400 font-inter mb-1">PRECISION</div>
          <div className="text-sm font-orbitron font-bold text-yellow-400">FULL</div>
        </div>
      </div>
    </Card>
  );
};
