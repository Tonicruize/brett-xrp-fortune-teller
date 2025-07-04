
import { Xumm } from 'xumm';

interface XummWallet {
  address: string;
  balance: number;
  connected: boolean;
  publicKey?: string;
}

interface XummConfig {
  apiKey: string;
  apiSecret: string;
}

// Add proper type definitions for XUMM API responses
interface XummPayloadResponse {
  signed: boolean;
  response?: {
    account?: string;
    publickey?: string;
  };
  txid?: string;
}

class RealXummWalletService {
  private xumm: Xumm | null = null;
  private wallet: XummWallet | null = null;
  private listeners: ((wallet: XummWallet | null) => void)[] = [];
  private isInitialized: boolean = false;

  async initialize(config: XummConfig): Promise<void> {
    try {
      this.xumm = new Xumm(config.apiKey, config.apiSecret);
      this.isInitialized = true;
      console.log('XUMM SDK initialized successfully');
    } catch (error) {
      console.error('Failed to initialize XUMM SDK:', error);
      throw new Error('XUMM initialization failed');
    }
  }

  async connectXumm(): Promise<XummWallet> {
    if (!this.xumm || !this.isInitialized) {
      throw new Error('XUMM SDK not initialized. Please provide API credentials.');
    }

    try {
      console.log('Creating XUMM sign-in request...');
      
      // Create a sign-in request
      const request = await this.xumm.payload.createAndSubscribe({
        txjson: {
          TransactionType: 'SignIn'
        },
        options: {
          submit: false,
          expire: 5 // 5 minutes
        }
      }, (event) => {
        console.log('XUMM Event:', event);
        
        if (event.data && typeof event.data === 'object' && 'signed' in event.data && event.data.signed === true) {
          console.log('User signed the request');
        }
      });

      console.log('XUMM Sign-in URL:', request.created.next.always);
      console.log('XUMM QR Code:', request.created.refs.qr_png);

      // Wait for the user to sign
      const result = await request.resolved as XummPayloadResponse;
      
      if (result.signed && result.response?.account) {
        // Fetch account balance
        const balance = await this.fetchAccountBalance(result.response.account);
        
        const wallet: XummWallet = {
          address: result.response.account,
          balance: balance,
          connected: true,
          publicKey: result.response.publickey
        };

        this.wallet = wallet;
        this.notifyListeners(wallet);
        this.saveWalletToStorage(wallet);
        
        return wallet;
      } else {
        throw new Error('User rejected the sign-in request');
      }
    } catch (error) {
      console.error('XUMM connection failed:', error);
      throw new Error(`Failed to connect XUMM wallet: ${error}`);
    }
  }

  private async fetchAccountBalance(address: string): Promise<number> {
    try {
      // Using a public XRPL WebSocket endpoint
      const response = await fetch('https://s1.ripple.com:51234/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: 'account_info',
          params: [{
            account: address,
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
      console.error('Failed to fetch account balance:', error);
      return 0;
    }
  }

  async submitTransaction(txJson: any): Promise<string> {
    if (!this.xumm || !this.wallet) {
      throw new Error('XUMM not connected');
    }

    try {
      const request = await this.xumm.payload.createAndSubscribe({
        txjson: txJson,
        options: {
          submit: true,
          expire: 5
        }
      });

      const result = await request.resolved as XummPayloadResponse;
      
      if (result.signed && result.txid) {
        return result.txid;
      } else {
        throw new Error('Transaction was not signed');
      }
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  }

  getWallet(): XummWallet | null {
    return this.wallet;
  }

  disconnect(): void {
    this.wallet = null;
    this.notifyListeners(null);
    this.clearWalletFromStorage();
  }

  onWalletChange(callback: (wallet: XummWallet | null) => void): void {
    this.listeners.push(callback);
  }

  private notifyListeners(wallet: XummWallet | null): void {
    this.listeners.forEach(callback => callback(wallet));
  }

  private saveWalletToStorage(wallet: XummWallet): void {
    try {
      localStorage.setItem('xumm_wallet', JSON.stringify({
        address: wallet.address,
        balance: wallet.balance,
        connected: wallet.connected,
        publicKey: wallet.publicKey
      }));
    } catch (error) {
      console.error('Failed to save wallet to storage:', error);
    }
  }

  private clearWalletFromStorage(): void {
    localStorage.removeItem('xumm_wallet');
  }

  restoreWallet(): void {
    try {
      const stored = localStorage.getItem('xumm_wallet');
      if (stored) {
        const walletData = JSON.parse(stored);
        this.wallet = walletData;
        this.notifyListeners(this.wallet);
      }
    } catch (error) {
      console.error('Failed to restore wallet:', error);
      this.clearWalletFromStorage();
    }
  }

  // Check if XUMM SDK is initialized
  isReady(): boolean {
    return this.isInitialized && this.xumm !== null;
  }
}

export const realXummWallet = new RealXummWalletService();
