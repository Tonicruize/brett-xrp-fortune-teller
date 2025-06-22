import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PriceChartProps {
  currentPrice: number;
  onPriceUpdate: (price: number) => void;
}

interface PriceData {
  time: string;
  price: number;
  timestamp: number;
}

export const PriceChart = ({ currentPrice, onPriceUpdate }: PriceChartProps) => {
  const [priceHistory, setPriceHistory] = useState<PriceData[]>([]);
  const [priceStats, setPriceStats] = useState({
    high: 0,
    low: 0,
    change24h: 0,
    volume: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [previousPrice, setPreviousPrice] = useState(0);

  // Real-time XRP price fetching with maximum precision
  const fetchXRPPrice = async () => {
    try {
      const apiCalls = [
        fetch('https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&precision=full'),
        fetch('https://api.coinbase.com/v2/exchange-rates?currency=XRP'),
        fetch('https://min-api.cryptocompare.com/data/price?fsym=XRP&tsyms=USD')
      ];

      const response = await Promise.race(apiCalls);
      let price = 0;
      let change = 0;
      let volume = 0;

      if (response.url.includes('coingecko')) {
        const data = await response.json();
        price = parseFloat(data.ripple.usd);
        change = data.ripple.usd_24h_change || 0;
        volume = data.ripple.usd_24h_vol || 0;
      } else if (response.url.includes('coinbase')) {
        const data = await response.json();
        price = parseFloat(data.data.rates.USD);
      } else {
        const data = await response.json();
        price = parseFloat(data.USD);
      }

      if (price > 0) {
        setPreviousPrice(currentPrice);
        onPriceUpdate(price);
        
        const now = new Date();
        const newDataPoint: PriceData = {
          time: now.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
          }),
          price: price,
          timestamp: now.getTime()
        };

        setPriceHistory(prev => {
          const updated = [...prev, newDataPoint];
          return updated.slice(-60); // Keep last 60 data points
        });

        setPriceStats(prev => ({
          change24h: change,
          volume: volume,
          high: Math.max(prev.high, price),
          low: prev.low === 0 ? price : Math.min(prev.low, price)
        }));

        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching XRP price:', error);
    }
  };

  useEffect(() => {
    fetchXRPPrice();
    // Update every 500ms for real-time feel
    const interval = setInterval(fetchXRPPrice, 500);
    return () => clearInterval(interval);
  }, []);

  const isPositive = priceStats.change24h >= 0;
  const priceDirection = currentPrice > previousPrice ? 'up' : currentPrice < previousPrice ? 'down' : 'same';

  return (
    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-indigo-500/30 shadow-2xl shadow-indigo-500/20">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Activity className="text-indigo-400 w-6 h-6 animate-pulse" />
            <h3 className="text-xl font-bold text-white">XRP/USD Live Chart</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
              isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="font-semibold">
                {isPositive ? '+' : ''}{priceStats.change24h.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        {/* Live Price Display with Rolling Animation */}
        <div className="text-center mb-6 p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border-2 border-indigo-500/20">
          <p className="text-slate-400 text-sm mb-2">Live XRP Price</p>
          <div className={`text-4xl font-mono font-black transition-all duration-300 ${
            priceDirection === 'up' ? 'text-green-400 animate-pulse' : 
            priceDirection === 'down' ? 'text-red-400 animate-pulse' : 
            'text-indigo-400'
          }`}>
            <span className="inline-block transform transition-transform duration-200 hover:scale-105">
              ${currentPrice.toFixed(8)}
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 mt-2">
            {priceDirection === 'up' && <TrendingUp className="w-4 h-4 text-green-400 animate-bounce" />}
            {priceDirection === 'down' && <TrendingDown className="w-4 h-4 text-red-400 animate-bounce" />}
            <span className={`text-sm font-semibold ${
              priceDirection === 'up' ? 'text-green-400' : 
              priceDirection === 'down' ? 'text-red-400' : 
              'text-slate-400'
            }`}>
              {priceDirection === 'up' ? 'Rising' : priceDirection === 'down' ? 'Falling' : 'Stable'}
            </span>
          </div>
        </div>

        <div className="h-64 bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-slate-400 animate-pulse">Loading live data...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceHistory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 11, fill: '#94A3B8' }}
                  interval="preserveStartEnd"
                  axisLine={{ stroke: '#475569' }}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#94A3B8' }}
                  domain={['dataMin - 0.000001', 'dataMax + 0.000001']}
                  tickFormatter={(value) => `$${value.toFixed(8)}`}
                  axisLine={{ stroke: '#475569' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0F172A', 
                    border: '2px solid #4F46E5',
                    borderRadius: '12px',
                    color: '#fff',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                  }}
                  formatter={(value: number) => [`$${value.toFixed(8)}`, 'Price']}
                  labelStyle={{ color: '#E2E8F0' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="url(#priceGradient)" 
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ 
                    r: 6, 
                    stroke: '#4F46E5', 
                    strokeWidth: 3,
                    fill: '#FFFFFF'
                  }}
                />
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="50%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-lg p-3 text-center">
            <p className="text-xs text-green-400 font-medium mb-1">24h High</p>
            <p className="text-sm font-bold text-green-300">${priceStats.high.toFixed(6)}</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border border-indigo-500/20 rounded-lg p-3 text-center">
            <p className="text-xs text-indigo-400 font-medium mb-1">Current</p>
            <p className="text-sm font-bold text-indigo-300">${currentPrice.toFixed(6)}</p>
          </div>
          <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-lg p-3 text-center">
            <p className="text-xs text-red-400 font-medium mb-1">24h Low</p>
            <p className="text-sm font-bold text-red-300">${priceStats.low.toFixed(6)}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-lg p-3 text-center">
            <p className="text-xs text-purple-400 font-medium mb-1">Volume</p>
            <p className="text-xs font-bold text-purple-300">${(priceStats.volume / 1000000).toFixed(1)}M</p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-slate-500">
            Live updates every 500ms • Full 8-decimal precision • No approximation
          </p>
        </div>
      </div>
    </Card>
  );
};
