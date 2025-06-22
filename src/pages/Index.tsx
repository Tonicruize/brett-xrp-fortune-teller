
import { useState, useEffect } from 'react';
import { GameHeader } from '@/components/GameHeader';
import { GameCard } from '@/components/GameCard';
import { Footer } from '@/components/Footer';
import { UserStats } from '@/components/UserStats';
import { WalletInfo } from '@/components/WalletInfo';
import { AuthModal } from '@/components/AuthModal';
import { SocialSidebar } from '@/components/SocialSidebar';
import { GenieGameInterface } from '@/components/GenieGameInterface';

const Index = () => {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(0.62567890);
  const [score, setScore] = useState(0);
  const [balance, setBalance] = useState(100);
  const [activeGame, setActiveGame] = useState(null);

  // Simulate XRP/USDT price changes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrice(prev =>  {
        const volatility = 0.00002;
        const trend = Math.sin(Date.now() / 10000) * 0.00001;
        const change = (Math.random() - 0.5) * volatility + trend;
        return Math.max(0, prev + change);
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAuth = (userData) => {
    setUser(userData);
    setShowAuthModal(false);
  };

  const handlePlayGame = (gameName) => {
    if (gameName === 'genie') {
      setActiveGame('genie');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-orbitron">
      <GameHeader user={user} onShowAuth={() => setShowAuthModal(true)} />
      <SocialSidebar />
      
      <div className="container mx-auto px-6 py-8">
        {!activeGame ? (
          <>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-8 h-8 bg-yellow-500 transform rotate-45"></div>
                <h1 className="text-5xl font-orbitron font-black text-white">GAME HUB</h1>
                <div className="w-8 h-8 bg-yellow-500 transform rotate-45"></div>
              </div>
              <p className="text-slate-400 text-xl font-inter">Choose your game and start winning</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <GameCard
                title="Genie Prediction"
                status="active"
                description="Predict XRP/USDT price movements"
                image="/lovable-uploads/71a7ed5b-cbac-4c1d-8ccd-dbb95f5d9ef7.png"
                onPlay={() => handlePlayGame('genie')}
              />
              
              <GameCard
                title="Dice Roll"
                status="coming-soon"
                description="Classic dice betting game"
                image="/lovable-uploads/71a7ed5b-cbac-4c1d-8ccd-dbb95f5d9ef7.png"
              />
              
              <GameCard
                title="Roulette"
                status="coming-soon"
                description="European roulette table"
                image="/lovable-uploads/71a7ed5b-cbac-4c1d-8ccd-dbb95f5d9ef7.png"
              />
              
              <GameCard
                title="Blackjack"
                status="coming-soon"
                description="Beat the dealer at 21"
                image="/lovable-uploads/71a7ed5b-cbac-4c1d-8ccd-dbb95f5d9ef7.png"
              />
              
              <GameCard
                title="Slots"
                status="coming-soon"
                description="Spin to win jackpots"
                image="/lovable-uploads/71a7ed5b-cbac-4c1d-8ccd-dbb95f5d9ef7.png"
              />
              
              <GameCard
                title="Poker"
                status="coming-soon"
                description="Texas Hold'em tables"
                image="/lovable-uploads/71a7ed5b-cbac-4c1d-8ccd-dbb95f5d9ef7.png"
              />
            </div>

            <div className="bg-slate-900 border border-slate-700 p-8 text-center transform -skew-x-3">
              <div className="transform skew-x-3">
                <h2 className="text-2xl font-orbitron font-bold text-white mb-4">WHY CHOOSE BRETT CASINO?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-yellow-500 font-orbitron font-semibold mb-2">FAIR & TRANSPARENT</h3>
                    <p className="text-slate-400 text-sm font-inter">Provably fair algorithms ensure honest gameplay</p>
                  </div>
                  <div>
                    <h3 className="text-yellow-500 font-orbitron font-semibold mb-2">INSTANT PAYOUTS</h3>
                    <p className="text-slate-400 text-sm font-inter">Withdraw your winnings immediately</p>
                  </div>
                  <div>
                    <h3 className="text-yellow-500 font-orbitron font-semibold mb-2">24/7 SUPPORT</h3>
                    <p className="text-slate-400 text-sm font-inter">Round-the-clock customer assistance</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setActiveGame(null)}
                  className="bg-slate-800 border border-slate-600 text-white px-4 py-2 hover:bg-slate-700 font-orbitron transform -skew-x-12 transition-colors"
                >
                  <div className="transform skew-x-12">← BACK TO HUB</div>
                </button>
                <h2 className="text-2xl font-orbitron font-bold text-white">GENIE PREDICTION GAME</h2>
              </div>

              {user && (
                <div className="flex items-center gap-4">
                  <UserStats score={score} balance={balance} user={user} />
                  <WalletInfo user={user} balance={balance} />
                </div>
              )}
            </div>

            <GenieGameInterface currentPrice={currentPrice} user={user} />
          </div>
        )}
      </div>

      <Footer />

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onAuth={handleAuth}
      />
    </div>
  );
};

export default Index;
