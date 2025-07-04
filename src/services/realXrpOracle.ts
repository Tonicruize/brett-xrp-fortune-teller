
interface XRPPriceData {
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  timestamp: number;
}

class RealXRPOracle {
  private listeners: ((data: XRPPriceData) => void)[] = [];
  private intervalId: NodeJS.Timeout | null = null;
  private lastPrice: number = 0;
  private isRunning: boolean = false;
  private poolWalletAddress: string = 'rPfino2rPWQJXvacvS2bct4bdXfAcWuYcw';
  private poolBalance: number = 0;

  async fetchFromCoinGecko(): Promise<XRPPriceData | null> {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&precision=full'
      );
      
      if (!response.ok) throw new Error('CoinGecko API error');
      
      const data = await response.json();
      const rippleData = data.ripple;
      
      return {
        price: rippleData.usd,
        change24h: rippleData.usd_24h_change || 0,
        volume24h: rippleData.usd_24h_vol || 0,
        high24h: 0, // CoinGecko simple price doesn't include high/low
        low24h: 0,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('CoinGecko API error:', error);
      return null;
    }
  }

  async fetchFromBinance(): Promise<XRPPriceData | null> {
    try {
      const [tickerResponse, statsResponse] = await Promise.all([
        fetch('https://api.binance.com/api/v3/ticker/price?symbol=XRPUSDT'),
        fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=XRPUSDT')
      ]);

      if (!tickerResponse.ok || !statsResponse.ok) {
        throw new Error('Binance API error');
      }

      const tickerData = await tickerResponse.json();
      const statsData = await statsResponse.json();

      return {
        price: parseFloat(tickerData.price),
        change24h: parseFloat(statsData.priceChangePercent),
        volume24h: parseFloat(statsData.volume),
        high24h: parseFloat(statsData.highPrice),
        low24h: parseFloat(statsData.lowPrice),
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Binance API error:', error);
      return null;
    }
  }

  async fetchWalletBalance(): Promise<number> {
    try {
      const response = await fetch('https://s1.ripple.com:51234/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: 'account_info',
          params: [{
            account: this.poolWalletAddress,
            ledger_index: 'validated'
          }]
        })
      });

      const data = await response.json();
      
      if (data.result && data.result.account_data) {
        // Convert drops to XRP (1 XRP = 1,000,000 drops)
        return parseFloat(data.result.account_data.Balance) / 1000000;
      }
      
      return 0;
    } catch (error) {
      console.error('Failed to fetch wallet balance:', error);
      return 0;
    }
  }

  async getCurrentPrice(): Promise<XRPPriceData> {
    // Try Binance first (more comprehensive data), fallback to CoinGecko
    let priceData = await this.fetchFromBinance();
    
    if (!priceData) {
      priceData = await this.fetchFromCoinGecko();
    }

    // Fetch wallet balance
    this.poolBalance = await this.fetchWalletBalance();

    // If both fail, return mock data with last known price
    if (!priceData) {
      return {
        price: this.lastPrice || 0.5,
        change24h: 0,
        volume24h: 0,
        high24h: 0,
        low24h: 0,
        timestamp: Date.now()
      };
    }

    this.lastPrice = priceData.price;
    return priceData;
  }

  getPoolBalance(): number {
    return this.poolBalance;
  }

  startPriceUpdates(callback: (data: XRPPriceData) => void): void {
    if (this.isRunning) return;

    this.listeners.push(callback);
    this.isRunning = true;

    // Initial fetch
    this.getCurrentPrice().then(callback);

    // Update every 1 second for real-time feel
    this.intervalId = setInterval(async () => {
      const data = await this.getCurrentPrice();
      this.listeners.forEach(listener => listener(data));
    }, 1000);
  }

  stopPriceUpdates(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.listeners = [];
    this.isRunning = false;
  }

  addListener(callback: (data: XRPPriceData) => void): void {
    this.listeners.push(callback);
  }

  removeListener(callback: (data: XRPPriceData) => void): void {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }
}

export const realXrpOracle = new RealXRPOracle();
