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
    change24h: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real XRP price data
  const fetchXRPPrice = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=usd&include_24hr_change=true');
      const data = await response.json();
      const price = data.ripple.usd;
      const change = data.ripple.usd_24h_change || 0;
      
      onPriceUpdate(price);
      
      const now = new Date();
      const newDataPoint: PriceData = {
        time: now.toLocaleTimeString(),
        price: price,
        timestamp: now.getTime()
      };

      setPriceHistory(prev => {
        const updated = [...prev, newDataPoint];
        // Keep only last 20 data points
        return updated.slice(-20);
      });

      // Update 24h stats
      setPriceStats(prev => ({
        ...prev,
        change24h: change
      }));

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching XRP price:', error);
      setIsLoading(false);
    }
  };

  // Fetch historical data for chart initialization
  const fetchHistoricalData = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/ripple/market_chart?vs_currency=usd&days=1&interval=hourly');
      const data = await response.json();
      
      if (data.prices) {
        const prices = data.prices.slice(-20); // Last 20 hours
        const formattedData: PriceData[] = prices.map(([timestamp, price]: [number, number]) => ({
          time: new Date(timestamp).toLocaleTimeString(),
          price: price,
          timestamp: timestamp
        }));
        
        setPriceHistory(formattedData);
        
        // Calculate high/low from historical data
        const priceValues = formattedData.map(d => d.price);
        setPriceStats({
          high: Math.max(...priceValues),
          low: Math.min(...priceValues),
          change24h: 0
        });
      }
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
  };

  useEffect(() => {
    // Initial data fetch
    fetchHistoricalData();
    fetchXRPPrice();

    // Update price every 10 seconds
    const interval = setInterval(fetchXRPPrice, 10000);
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
            <span>{isPositive ? '+' : ''}{priceStats.change24h.toFixed(2)}%</span>
          </div>
        </div>
      </div>

      {/* Real-time chart */}
      <div className="h-48 bg-slate-900/50 rounded-lg p-4 mb-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400">Loading chart data...</div>
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
                domain={['dataMin - 0.01', 'dataMax + 0.01']}
                tickFormatter={(value) => `$${value.toFixed(4)}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1E293B', 
                  border: '1px solid #6366F1',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value: number) => [`$${value.toFixed(4)}`, 'Price']}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#06B6D4" 
                strokeWidth={2}
                dot={{ fill: '#06B6D4', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, stroke: '#06B6D4', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-slate-900/30 rounded p-2">
          <p className="text-xs text-gray-400">24h High</p>
          <p className="text-sm font-semibold text-green-400">${priceStats.high.toFixed(4)}</p>
        </div>
        <div className="bg-slate-900/30 rounded p-2">
          <p className="text-xs text-gray-400">Current</p>
          <p className="text-sm font-semibold text-cyan-400">${currentPrice.toFixed(4)}</p>
        </div>
        <div className="bg-slate-900/30 rounded p-2">
          <p className="text-xs text-gray-400">24h Low</p>
          <p className="text-sm font-semibold text-red-400">${priceStats.low.toFixed(4)}</p>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          📊 Live XRP data from CoinGecko API • Updates every 10 seconds
        </p>
      </div>
    </Card>
  );
};
