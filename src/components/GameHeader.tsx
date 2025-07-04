
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { User, LogOut, Wallet } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { realXrpOracle } from '@/services/realXrpOracle';

interface GameHeaderProps {
  user: any;
  profile: any;
  onShowAuth: () => void;
  onShowWalletConnect?: () => void;
}

export const GameHeader = ({ user, profile, onShowAuth, onShowWalletConnect }: GameHeaderProps) => {
  const [brettPrice, setBrettPrice] = useState(0.0001234);
  const [xrpPrice, setXrpPrice] = useState(0.62567890);
  const [poolBalance, setPoolBalance] = useState(0);
  const { signOut } = useAuth();

  // Use real XRP prices from oracle and simulate Brett price
  useEffect(() => {
    // Start real XRP price updates
    const handleXrpPriceUpdate = (data: any) => {
      setXrpPrice(data.price);
      setPoolBalance(realXrpOracle.getPoolBalance());
    };

    realXrpOracle.startPriceUpdates(handleXrpPriceUpdate);

    // Simulate Brett price updates
    const brettInterval = setInterval(() => {
      setBrettPrice(prev => {
        const volatility = 0.00000002;
        const change = (Math.random() - 0.5) * volatility;
        return Math.max(0, prev + change);
      });
    }, 3000);

    return () => {
      realXrpOracle.stopPriceUpdates();
      clearInterval(brettInterval);
    };
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
            <p className="text-slate-400 text-sm font-outfit">Professional Gaming Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Market Indicators */}
          <div className="flex items-center gap-4 bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <div className="text-xs">
                <div className="text-slate-400 font-outfit">XRP</div>
                <div className="text-green-400 font-orbitron font-bold">
                  ${xrpPrice.toFixed(6)}
                </div>
              </div>
            </div>
            <div className="w-px h-8 bg-slate-700"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="text-xs">
                <div className="text-slate-400 font-outfit">BRETT</div>
                <div className="text-purple-400 font-orbitron font-bold">
                  ${brettPrice.toFixed(8)}
                </div>
              </div>
            </div>
            <div className="w-px h-8 bg-slate-700"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <div className="text-xs">
                <div className="text-slate-400 font-outfit">POOL</div>
                <div className="text-yellow-400 font-orbitron font-bold">
                  {poolBalance.toFixed(2)} XRP
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
                  <div className="text-yellow-500 text-sm font-outfit">Online</div>
                </div>
              </div>
              
              {onShowWalletConnect && (
                <Button 
                  onClick={onShowWalletConnect}
                  variant="outline" 
                  className="border-slate-600 text-slate-300 hover:bg-slate-800 font-outfit transform -skew-x-12"
                >
                  <div className="transform skew-x-12 flex items-center">
                    <Wallet className="w-4 h-4 mr-2" />
                    CONNECT WALLET
                  </div>
                </Button>
              )}
              
              <Button 
                onClick={handleLogout}
                variant="outline" 
                className="border-slate-600 text-slate-300 hover:bg-slate-800 font-outfit transform -skew-x-12"
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
              className="bg-yellow-600 hover:bg-yellow-700 text-black font-outfit font-bold px-6 transform -skew-x-12"
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
