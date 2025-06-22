
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';

interface GameHeaderProps {
  user: any;
  onShowAuth: () => void;
}

export const GameHeader = ({ user, onShowAuth }: GameHeaderProps) => {
  return (
    <header className="bg-slate-950 border-b-2 border-slate-800">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img 
            src="/lovable-uploads/71a7ed5b-cbac-4c1d-8ccd-dbb95f5d9ef7.png" 
            alt="BRETT Casino" 
            className="w-12 h-12 rounded"
          />
          <div>
            <h1 className="text-2xl font-bold text-white">BRETT CASINO</h1>
            <p className="text-slate-400 text-sm">Professional Gaming Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="bg-slate-800 border border-slate-700 px-4 py-2 rounded">
                <span className="text-white font-semibold">{user.username}</span>
                <div className="text-yellow-500 text-sm">Balance: $1,250</div>
              </div>
              <Button 
                variant="outline" 
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <Button 
              onClick={onShowAuth}
              className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold px-6"
            >
              <User className="w-4 h-4 mr-2" />
              LOGIN
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
