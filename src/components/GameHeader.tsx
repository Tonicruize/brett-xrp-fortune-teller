
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface GameHeaderProps {
  user: any;
  profile: any;
  onShowAuth: () => void;
}

export const GameHeader = ({ user, profile, onShowAuth }: GameHeaderProps) => {
  const [brettPrice, setBrettPrice] = useState(0.0001234);
  const [xrpPrice, setXrpPrice] = useState(0.62567890);
  const { signOut } = useAuth();

  // Simulate price updates for Brett and XRP
  useEffect(() => {
    const interval = setInterval(() => {
      setBrettPrice(prev => {
        const volatility = 0.00000002;
        const change = (Math.random() - 0.5) * volatility;
        return Math.max(0, prev + change);
      });
      
      setXrpPrice(prev => {
        const volatility = 0.00002;
        const change = (Math.random() - 0.5) * volatility;
        return Math.max(0, prev + change);
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="bg-slate-950 border-b border-slate-800">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img 
            src="/lovable-uploads/71a7ed5b-cbac-4c1d-8ccd-dbb95f5d9ef7.png" 
            alt="BRETT Casino" 
            className="w-12 h-12"
          />
          <div>
            <h1 className="text-2xl font-orbitron font-black text-white">BRETT CASINO</h1>
            <p className="text-slate-400 text-sm font-orbitron">Professional Gaming Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Market Indicators */}
          <div className="flex items-center gap-4 bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <div className="text-xs">
                <div className="text-slate-400 font-inter">XRP</div>
                <div className="text-green-400 font-orbitron font-bold">
                  ${xrpPrice.toFixed(6)}
                </div>
              </div>
            </div>
            <div className="w-px h-8 bg-slate-700"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="text-xs">
                <div className="text-slate-400 font-inter">BRETT</div>
                <div className="text-purple-400 font-orbitron font-bold">
                  ${brettPrice.toFixed(8)}
                </div>
              </div>
            </div>
          </div>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="bg-slate-800 border border-slate-700 px-4 py-2 transform -skew-x-12">
                <div className="transform skew-x-12">
                  <span className="text-white font-orbitron font-semibold">
                    {profile?.username || user.email?.split('@')[0] || 'Player'}
                  </span>
                  <div className="text-yellow-500 text-sm font-orbitron">Online</div>
                </div>
              </div>
              <Button 
                onClick={handleLogout}
                variant="outline" 
                className="border-slate-600 text-slate-300 hover:bg-slate-800 font-orbitron transform -skew-x-12"
              >
                <div className="transform skew-x-12 flex items-center">
                  <LogOut className="w-4 h-4 mr-2" />
                  LOGOUT
                </div>
              </Button>
            </div>
          ) : (
            <Button 
              onClick={onShowAuth}
              className="bg-yellow-600 hover:bg-yellow-700 text-black font-orbitron font-bold px-6 transform -skew-x-12"
            >
              <div className="transform skew-x-12 flex items-center">
                <User className="w-4 h-4 mr-2" />
                LOGIN
              </div>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
