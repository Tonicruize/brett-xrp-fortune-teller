
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
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <img 
              src="/lovable-uploads/71a7ed5b-cbac-4c1d-8ccd-dbb95f5d9ef7.png" 
              alt="BRETT Casino" 
              className="w-12 h-12"
            />
            <div>
              <h1 className="text-2xl font-orbitron font-black text-white">BRETT CASINO</h1>
              <p className="text-slate-400 text-sm">Professional Gaming Platform</p>
            </div>
          </div>

          {/* Center - Market Indicators */}
          <div className="flex items-center gap-4 bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <div className="text-xs">
                <div className="text-slate-400">XRP</div>
                <div className="text-green-400 font-orbitron font-bold">
                  ${xrpPrice.toFixed(6)}
                </div>
              </div>
            </div>
            <div className="w-px h-8 bg-slate-700"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="text-xs">
                <div className="text-slate-400">BRETT</div>
                <div className="text-purple-400 font-orbitron font-bold">
                  ${brettPrice.toFixed(8)}
                </div>
              </div>
            </div>
            <div className="w-px h-8 bg-slate-700"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <div className="text-xs">
                <div className="text-slate-400">POOL</div>
                <div className="text-yellow-400 font-orbitron font-bold">
                  {poolBalance.toFixed(2)} XRP
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - User Actions */}
          {user ? (
            <div className="flex items-center gap-3">
              {/* User Info */}
              <div className="bg-slate-800 border border-slate-700 px-3 py-2 rounded-lg">
                <div className="text-white font-bold text-sm">
                  {profile?.username || user.email?.split('@')[0] || 'Player'}
                </div>
                <div className="text-yellow-500 text-xs">Online</div>
              </div>
              
              {/* Connect Wallet Button */}
              {onShowWalletConnect && (
                <Button 
                  onClick={onShowWalletConnect}
                  variant="outline" 
                  size="sm"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  CONNECT
                </Button>
              )}
              
              {/* Logout Button */}
              <Button 
                onClick={handleLogout}
                variant="outline" 
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                <LogOut className="w-4 h-4 mr-2" />
                LOGOUT
              </Button>
            </div>
          ) : (
            <Button 
              onClick={onShowAuth}
              className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold px-6"
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
