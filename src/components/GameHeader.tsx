
import { Button } from '@/components/ui/button';
import { Wallet, User, LogOut } from 'lucide-react';

interface GameHeaderProps {
  user: any;
  onShowAuth: () => void;
}

export const GameHeader = ({ user, onShowAuth }: GameHeaderProps) => {
  return (
    <header className="border-b border-purple-500/20 bg-slate-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">₿</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">$BRETT Fortune</h2>
            <p className="text-xs text-gray-400">Powered by XRP</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-2 rounded-lg">
                <User className="w-4 h-4 text-purple-400" />
                <span className="text-white text-sm">{user.username}</span>
              </div>
              <Button variant="outline" size="sm" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <Button 
              onClick={onShowAuth}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <User className="w-4 h-4 mr-2" />
              Login / Sign Up
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
