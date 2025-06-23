
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Target, Coins, User, Wallet, Copy, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CompactUserStatsProps {
  score: number;
  balance: number;
  user: any;
}

export const CompactUserStats = ({ score, balance, user }: CompactUserStatsProps) => {
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
      <Card className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-purple-500/30 p-4">
        <div className="flex items-center gap-3">
          <User className="w-8 h-8 text-gray-400" />
          <div>
            <h3 className="text-sm font-semibold text-white">Join the Game!</h3>
            <p className="text-gray-400 text-xs">Create account to start earning</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {/* Stats Card */}
      <Card className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-purple-500/30 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Trophy className="text-yellow-400 w-4 h-4" />
            Stats
          </h3>
          <div className="text-xs text-gray-400">Rank: Beginner</div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="text-purple-400 w-3 h-3" />
              <span className="text-xs text-gray-300">Score</span>
            </div>
            <span className="text-white font-bold text-sm">{score}</span>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Coins className="text-yellow-400 w-3 h-3" />
              <span className="text-xs text-gray-300">$BRETT</span>
            </div>
            <span className="text-yellow-400 font-bold text-sm">{balance}</span>
          </div>
        </div>

        <div className="text-center pt-2 border-t border-purple-500/20 mt-3">
          <p className="text-xs text-gray-400">Streak: 0 🔥</p>
        </div>
      </Card>

      {/* Wallet Card */}
      <Card className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-cyan-500/30 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Wallet className="text-cyan-400 w-4 h-4" />
            Wallet
          </h3>
          <Button 
            size="sm" 
            className="h-6 px-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            Fund
          </Button>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">XRP Balance</span>
            <span className="text-cyan-400 font-bold text-sm">0.0000</span>
          </div>

          <div className="flex items-center gap-2">
            <code className="text-xs text-gray-300 bg-slate-800/50 px-2 py-1 rounded flex-1 truncate">
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

        <div className="text-xs text-gray-500 text-center mt-2">
          🔄 Auto-updates • 💡 Send XRP to play
        </div>
      </Card>
    </div>
  );
};
