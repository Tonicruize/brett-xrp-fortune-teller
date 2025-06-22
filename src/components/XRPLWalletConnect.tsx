
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Copy, RefreshCw, Plus, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { xrplWallet } from '@/services/xrplWallet';

interface XRPLWalletConnectProps {
  onWalletChange: (wallet: any) => void;
}

export const XRPLWalletConnect = ({ onWalletChange }: XRPLWalletConnectProps) => {
  const [wallet, setWallet] = useState<any>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showSeedInput, setShowSeedInput] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Restore wallet on mount
    xrplWallet.restoreWallet();
    
    // Listen for wallet changes
    xrplWallet.onWalletChange((newWallet) => {
      setWallet(newWallet);
      onWalletChange(newWallet);
    });

    // Set initial wallet state
    setWallet(xrplWallet.getWallet());
  }, [onWalletChange]);

  const connectXUMM = async () => {
    setIsConnecting(true);
    try {
      await xrplWallet.connectXUMM();
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

  const connectCustomWallet = async () => {
    if (!seedPhrase.trim()) {
      toast({
        title: "Invalid Seed",
        description: "Please enter your wallet seed phrase",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);
    try {
      await xrplWallet.connectCustomWallet(seedPhrase);
      setSeedPhrase('');
      setShowSeedInput(false);
      toast({
        title: "Wallet Connected!",
        description: "Your XRPL wallet is now connected and ready to use.",
      });
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect custom wallet",
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
    xrplWallet.disconnect();
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  if (!wallet) {
    return (
      <Card className="bg-slate-900 border-2 border-yellow-500/30 p-6">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-3">
            <Wallet className="w-8 h-8 text-yellow-500" />
            <h3 className="text-xl font-orbitron font-bold text-white">CONNECT XRPL WALLET</h3>
          </div>
          
          <div className="space-y-4">
            <Button
              onClick={connectXUMM}
              disabled={isConnecting}
              className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 font-orbitron font-bold text-lg border-2 border-blue-400/50 transform -skew-x-3"
            >
              <div className="transform skew-x-3 flex items-center gap-3">
                <Zap className="w-6 h-6" />
                {isConnecting ? 'CONNECTING...' : 'CONNECT XUMM'}
              </div>
            </Button>

            {!showSeedInput ? (
              <Button
                onClick={() => setShowSeedInput(true)}
                variant="outline"
                className="w-full h-12 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 font-orbitron font-semibold transform -skew-x-3"
              >
                <div className="transform skew-x-3">
                  CUSTOM WALLET
                </div>
              </Button>
            ) : (
              <div className="space-y-3">
                <input
                  type="password"
                  placeholder="Enter your wallet seed phrase..."
                  value={seedPhrase}
                  onChange={(e) => setSeedPhrase(e.target.value)}
                  className="w-full p-3 bg-slate-800 border border-slate-600 rounded text-white font-inter"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={connectCustomWallet}
                    disabled={isConnecting || !seedPhrase.trim()}
                    className="flex-1 bg-green-600 hover:bg-green-700 font-orbitron"
                  >
                    {isConnecting ? 'CONNECTING...' : 'CONNECT'}
                  </Button>
                  <Button
                    onClick={() => {
                      setShowSeedInput(false);
                      setSeedPhrase('');
                    }}
                    variant="outline"
                    className="border-slate-600 text-slate-400"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="text-xs text-slate-500 font-inter text-center">
            <p>🔒 Your wallet data stays secure and private</p>
            <p>💡 XUMM recommended for mobile users</p>
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
          XRPL WALLET
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
            {wallet.balance.toFixed(2)} XRP
          </p>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-3">
          <p className="text-xs text-slate-400 font-inter mb-2">WALLET ADDRESS</p>
          <div className="flex items-center gap-2">
            <code className="text-xs text-slate-300 bg-slate-800 px-2 py-1 rounded flex-1 font-mono">
              {wallet.address.slice(0, 8)}...{wallet.address.slice(-8)}
            </code>
            <Button
              size="sm"
              variant="ghost"
              onClick={copyAddress}
              className="h-8 w-8 p-0 text-slate-400 hover:text-white"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 font-orbitron"
          >
            <Plus className="w-4 h-4 mr-1" />
            FUND
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-xs text-green-400 text-center font-inter">
          <p>✅ Connected and ready for predictions</p>
        </div>
      </div>
    </Card>
  );
};
