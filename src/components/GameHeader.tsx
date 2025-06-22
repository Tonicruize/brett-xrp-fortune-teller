
import { Button } from '@/components/ui/button';
import { User, LogOut, Crown, Coins } from 'lucide-react';

interface GameHeaderProps {
  user: any;
  onShowAuth: () => void;
}

export const GameHeader = ({ user, onShowAuth }: GameHeaderProps) => {
  return (
    <header className="border-b-4 border-yellow-400 bg-gradient-to-r from-purple-900 via-red-900 to-orange-900 shadow-2xl shadow-yellow-400/20">
      <div className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img 
              src="/lovable-uploads/71a7ed5b-cbac-4c1d-8ccd-dbb95f5d9ef7.png" 
              alt="BRETT Casino" 
              className="w-16 h-16 rounded-full border-2 border-yellow-400 shadow-lg animate-pulse"
            />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
              <Crown className="w-3 h-3 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent">
              BRETT CASINO
            </h2>
            <p className="text-yellow-300 text-sm font-bold">🎰 The Ultimate Crypto Experience</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-gradient-to-r from-purple-800/80 to-red-800/80 px-6 py-3 rounded-full border-2 border-yellow-400/50 shadow-lg">
                <Crown className="w-6 h-6 text-yellow-400" />
                <span className="text-white text-lg font-bold">{user.username}</span>
                <div className="flex items-center gap-1 ml-3">
                  <Coins className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-400 font-bold">1,250</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-red-500 text-red-400 hover:bg-red-500/20 font-bold px-6 py-3"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Cash Out
              </Button>
            </div>
          ) : (
            <Button 
              onClick={onShowAuth}
              className="bg-gradient-to-r from-yellow-500 to-red-500 hover:from-yellow-400 hover:to-red-400 text-white font-black text-lg px-8 py-4 rounded-full border-2 border-white shadow-2xl transform hover:scale-105 transition-all"
            >
              <User className="w-6 h-6 mr-3" />
              JOIN THE ACTION
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
