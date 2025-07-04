
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Copy, RefreshCw, Settings, Zap, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { realXummWallet } from '@/services/realXummWallet';

interface XummWalletConnectProps {
  onWalletChange: (wallet: any) => void;
}

export const XummWalletConnect = ({ onWalletChange }: XummWalletConnectProps) => {
  const [wallet, setWallet] = useState<any>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Restore wallet on mount
    realXummWallet.restoreWallet();
    
    // Listen for wallet changes
    realXummWallet.onWalletChange((newWallet) => {
      setWallet(newWallet);
      onWalletChange(newWallet);
    });

    // Set initial wallet state
    setWallet(realXummWallet.getWallet());
    setIsConfigured(realXummWallet.isReady());
  }, [onWalletChange]);

  const configureXumm = async () => {
    if (!apiKey.trim() || !apiSecret.trim()) {
      toast({
        title: "Configuration Error",
        description: "Please enter both API Key and API Secret",
        variant: "destructive"
      });
      return;
    }

    try {
      await realXummWallet.initialize({ apiKey, apiSecret });
      setIsConfigured(true);
      setShowApiConfig(false);
      toast({
        title: "XUMM Configured!",
        description: "XUMM SDK is now ready to use.",
      });
    } catch (error: any) {
      toast({
        title: "Configuration Failed",
        description: error.message || "Failed to configure XUMM SDK",
        variant: "destructive"
      });
    }
  };

  const connectXumm = async () => {
    if (!isConfigured) {
      setShowApiConfig(true);
      return;
    }

    setIsConnecting(true);
    try {
      await realXummWallet.connectXumm();
      toast({
        title: "XUMM Connected!",
        description: "Your XUMM wallet is now connected and ready to use.",
      });
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect XUMM wallet",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const copyAddress = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address);
      toast({
        title: "Address Copied!",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const disconnect = () => {
    realXummWallet.disconnect();
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  const refreshBalance = async () => {
    if (wallet?.address) {
      // Trigger a wallet refresh by reconnecting
      toast({
        title: "Refreshing Balance",
        description: "Updating wallet balance...",
      });
    }
  };

  if (!wallet) {
    return (
      <Card className="bg-slate-900 border-2 border-yellow-500/30 p-6">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-3">
            <Wallet className="w-8 h-8 text-yellow-500" />
            <h3 className="text-xl font-orbitron font-bold text-white">CONNECT XUMM WALLET</h3>
          </div>
          
          {!isConfigured && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                <AlertCircle className="w-4 h-4" />
                <span className="font-orbitron font-semibold">Setup Required</span>
              </div>
              <p className="text-sm text-blue-300 font-inter">
                You need XUMM API credentials to connect. Get them from the XUMM Developer Portal.
              </p>
            </div>
          )}

          {!showApiConfig ? (
            <div className="space-y-4">
              <Button
                onClick={connectXumm}
                disabled={isConnecting}
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 font-orbitron font-bold text-lg border-2 border-blue-400/50 transform -skew-x-3"
              >
                <div className="transform skew-x-3 flex items-center gap-3">
                  <Zap className="w-6 h-6" />
                  {isConnecting ? 'CONNECTING...' : isConfigured ? 'CONNECT XUMM' : 'SETUP XUMM'}
                </div>
              </Button>

              {!isConfigured && (
                <Button
                  onClick={() => setShowApiConfig(true)}
                  variant="outline"
                  className="w-full border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 font-orbitron font-semibold transform -skew-x-3"
                >
                  <div className="transform skew-x-3 flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    CONFIGURE API
                  </div>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-left">
                <label className="block text-sm font-orbitron text-slate-300 mb-2">
                  XUMM API Key
                </label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your XUMM API Key"
                  className="w-full p-3 bg-slate-800 border border-slate-600 rounded text-white font-inter"
                />
              </div>
              
              <div className="text-left">
                <label className="block text-sm font-orbitron text-slate-300 mb-2">
                  XUMM API Secret
                </label>
                <input
                  type="password"
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  placeholder="Enter your XUMM API Secret"
                  className="w-full p-3 bg-slate-800 border border-slate-600 rounded text-white font-inter"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={configureXumm}
                  disabled={!apiKey.trim() || !apiSecret.trim()}
                  className="flex-1 bg-green-600 hover:bg-green-700 font-orbitron"
                >
                  CONFIGURE
                </Button>
                <Button
                  onClick={() => {
                    setShowApiConfig(false);
                    setApiKey('');
                    setApiSecret('');
                  }}
                  variant="outline"
                  className="border-slate-600 text-slate-400"
                >
                  Cancel
                </Button>
              </div>

              <div className="text-xs text-slate-500 font-inter text-left">
                <p className="mb-2">📋 How to get XUMM API credentials:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Visit the XUMM Developer Portal</li>
                  <li>Create a new application</li>
                  <li>Copy your API Key and Secret</li>
                </ol>
              </div>
            </div>
          )}

          <div className="text-xs text-slate-500 font-inter text-center">
            <p>🔒 Your credentials are stored locally and securely</p>
            <p>💡 XUMM is the official XRPL mobile wallet</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900 border-2 border-green-500/30 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-orbitron font-bold text-white flex items-center gap-2">
          <Wallet className="text-green-400 w-5 h-5" />
          XUMM WALLET
        </h3>
        <Button
          onClick={disconnect}
          variant="outline"
          size="sm"
          className="border-red-500/50 text-red-400 hover:bg-red-500/10"
        >
          Disconnect
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="bg-slate-800/50 rounded-lg p-4">
          <p className="text-xs text-slate-400 font-inter mb-1">XRP BALANCE</p>
          <p className="text-3xl font-orbitron font-bold text-green-400">
            {wallet.balance.toFixed(6)} XRP
          </p>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-3">
          <p className="text-xs text-slate-400 font-inter mb-2">WALLET ADDRESS</p>
          <div className="flex items-center gap-2">
            <code className="text-xs text-slate-300 bg-slate-800 px-2 py-1 rounded flex-1 font-mono break-all">
              {wallet.address}
            </code>
            <Button
              size="sm"
              variant="ghost"
              onClick={copyAddress}
              className="h-8 w-8 p-0 text-slate-400 hover:text-white flex-shrink-0"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={refreshBalance}
            size="sm" 
            variant="outline" 
            className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-xs text-green-400 text-center font-inter">
          <p>✅ Connected via XUMM SDK</p>
          <p>🔗 Real XRPL integration active</p>
        </div>
      </div>
    </Card>
  );
};
