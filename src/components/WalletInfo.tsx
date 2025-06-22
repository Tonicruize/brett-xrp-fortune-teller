
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Copy, RefreshCw, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WalletInfoProps {
  user: any;
  balance: number;
}

export const WalletInfo = ({ user, balance }: WalletInfoProps) => {
  const { toast } = useToast();

  const mockWalletAddress = user ? "rN7n7oTpk...9x2QvZs" : null;

  const copyAddress = () => {
    if (mockWalletAddress) {
      navigator.clipboard.writeText("rN7n7oTpkQd9JUoRhkGELdaraJBoMSTn9x2QvZs");
      toast({
        title: "Address Copied!",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  if (!user) {
    return (
      <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/20 p-6">
        <div className="text-center space-y-4">
          <Wallet className="w-12 h-12 text-gray-400 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">No Wallet Connected</h3>
            <p className="text-gray-400 text-sm">Sign up to get your game wallet and start earning!</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/20 p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Wallet className="text-cyan-400 w-5 h-5" />
        Game Wallet
      </h3>
      
      <div className="space-y-4">
        <div className="bg-slate-900/50 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">XRP Balance</p>
          <p className="text-2xl font-bold text-cyan-400">0.0000 XRP</p>
        </div>

        <div className="bg-slate-900/50 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-2">Wallet Address</p>
          <div className="flex items-center gap-2">
            <code className="text-xs text-gray-300 bg-slate-800 px-2 py-1 rounded flex-1">
              {mockWalletAddress}
            </code>
            <Button
              size="sm"
              variant="ghost"
              onClick={copyAddress}
              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
          >
            <Plus className="w-4 h-4 mr-1" />
            Fund
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-xs text-gray-500 text-center">
          <p>🔄 Auto-updates when XRP is received</p>
          <p>💡 Send XRP to play with real stakes</p>
        </div>
      </div>
    </Card>
  );
};
