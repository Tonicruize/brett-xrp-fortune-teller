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

  // Fetch real XRP price data with higher precision
  const fetchXRPPrice = async () => {
    try {
      // Use multiple APIs for better precision and reliability
      const [coinGeckoResponse, alternativeResponse] = await Promise.allSettled([
        fetch('https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&precision=8'),
        fetch('https://api.coinbase.com/v2/exchange-rates?currency=XRP')
      ]);

      let price = 0;
      let change = 0;
      let volume = 0;

      // Primary source: CoinGecko with high precision
      if (coinGeckoResponse.status === 'fulfilled' && coinGeckoResponse.value.ok) {
        const data = await coinGeckoResponse.value.json();
        price = data.ripple.usd;
        change = data.ripple.usd_24h_change || 0;
        volume = data.ripple.usd_24h_vol || 0;
      } 
      // Fallback: Coinbase API
      else if (alternativeResponse.status === 'fulfilled' && alternativeResponse.value.ok) {
        const data = await alternativeResponse.value.json();
        price = parseFloat(data.data.rates.USD);
        console.log('Using Coinbase API fallback, price:', price);
      }

      if (price > 0) {
        onPriceUpdate(price);
        
        const now = new Date();
        const newDataPoint: PriceData = {
          time: now.toLocaleTimeString(),
          price: price,
          timestamp: now.getTime()
        };

        setPriceHistory(prev => {
          const updated = [...prev, newDataPoint];
          // Keep only last 60 data points (1 hour of minute data)
          return updated.slice(-60);
        });

        // Update stats
        setPriceStats(prev => {
          const newStats = {
            change24h: change,
            volume: volume,
            high: Math.max(prev.high, price),
            low: prev.low === 0 ? price : Math.min(prev.low, price)
          };
          return newStats;
        });

        setIsLoading(false);
        console.log('XRP Price updated:', price, 'Change:', change + '%');
      }
    } catch (error) {
      console.error('Error fetching XRP price:', error);
      setIsLoading(false);
    }
  };

  // Fetch minute-level historical data for more precision
  const fetchHistoricalData = async () => {
    try {
      // Get hourly data for the last day (more granular than daily)
      const response = await fetch('https://api.coingecko.com/api/v3/coins/ripple/market_chart?vs_currency=usd&days=1');
      const data = await response.json();
      
      if (data.prices) {
        const prices = data.prices.slice(-60); // Last 60 data points
        const formattedData: PriceData[] = prices.map(([timestamp, price]: [number, number]) => ({
          time: new Date(timestamp).toLocaleTimeString(),
          price: price,
          timestamp: timestamp
        }));
        
        setPriceHistory(formattedData);
        
        // Calculate high/low from historical data
        const priceValues = formattedData.map(d => d.price);
        setPriceStats(prev => ({
          ...prev,
          high: Math.max(...priceValues),
          low: Math.min(...priceValues)
        }));
      }
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
  };

  useEffect(() => {
    // Initial data fetch
    fetchHistoricalData();
    fetchXRPPrice();

    // Update price every 5 seconds for more frequent updates
    const interval = setInterval(fetchXRPPrice, 5000);
    return () => clearInterval(interval);
  }, []);

  const isPositive = priceStats.change24h >= 0;

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/20 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Activity className="text-cyan-400 w-5 h-5" />
          XRP/USD Live Chart
        </h3>
        <div className="flex items-center gap-2 text-sm">
          <div className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{isPositive ? '+' : ''}{priceStats.change24h.toFixed(3)}%</span>
          </div>
        </div>
      </div>

      {/* Real-time chart */}
      <div className="h-48 bg-slate-900/50 rounded-lg p-4 mb-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400">Loading precise chart data...</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                domain={['dataMin - 0.001', 'dataMax + 0.001']}
                tickFormatter={(value) => `$${value.toFixed(6)}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1E293B', 
                  border: '1px solid #6366F1',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value: number) => [`$${value.toFixed(6)}`, 'Price']}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#06B6D4" 
                strokeWidth={2}
                dot={{ fill: '#06B6D4', strokeWidth: 2, r: 2 }}
                activeDot={{ r: 4, stroke: '#06B6D4', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-4 gap-3 text-center">
        <div className="bg-slate-900/30 rounded p-2">
          <p className="text-xs text-gray-400">24h High</p>
          <p className="text-sm font-semibold text-green-400">${priceStats.high.toFixed(6)}</p>
        </div>
        <div className="bg-slate-900/30 rounded p-2">
          <p className="text-xs text-gray-400">Current</p>
          <p className="text-sm font-semibold text-cyan-400">${currentPrice.toFixed(6)}</p>
        </div>
        <div className="bg-slate-900/30 rounded p-2">
          <p className="text-xs text-gray-400">24h Low</p>
          <p className="text-sm font-semibold text-red-400">${priceStats.low.toFixed(6)}</p>
        </div>
        <div className="bg-slate-900/30 rounded p-2">
          <p className="text-xs text-gray-400">Volume</p>
          <p className="text-xs font-semibold text-purple-400">${(priceStats.volume / 1000000).toFixed(1)}M</p>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          🔥 High-precision XRP data • Updates every 5 seconds • 6 decimal precision
        </p>
      </div>
    </Card>
  );
};
