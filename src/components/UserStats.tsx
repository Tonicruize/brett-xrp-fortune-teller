
import { Card } from '@/components/ui/card';
import { Trophy, Target, Coins, User } from 'lucide-react';

interface UserStatsProps {
  score: number;
  balance: number;
  user: any;
}

export const UserStats = ({ score, balance, user }: UserStatsProps) => {
  if (!user) {
    return (
      <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/20 p-6">
        <div className="text-center space-y-4">
          <User className="w-12 h-12 text-gray-400 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Join the Game!</h3>
            <p className="text-gray-400 text-sm">Create an account to start predicting and earning $BRETT tokens.</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/20 p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Trophy className="text-yellow-400 w-5 h-5" />
        Your Stats
      </h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Target className="text-purple-400 w-4 h-4" />
            <span className="text-gray-300">Score</span>
          </div>
          <span className="text-white font-bold">{score}</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Coins className="text-yellow-400 w-4 h-4" />
            <span className="text-gray-300">$BRETT Balance</span>
          </div>
          <span className="text-yellow-400 font-bold">{balance}</span>
        </div>

        <div className="text-center pt-4 border-t border-purple-500/20">
          <p className="text-xs text-gray-400">Streak: 0 🔥</p>
          <p className="text-xs text-gray-400 mt-1">Rank: Beginner Fortune Teller</p>
        </div>
      </div>
    </Card>
  );
};
