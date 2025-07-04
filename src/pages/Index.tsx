
import { useState, useEffect } from 'react';
import { GameHeader } from '@/components/GameHeader';
import { GameCard } from '@/components/GameCard';
import { Footer } from '@/components/Footer';
import { CompactUserStats } from '@/components/CompactUserStats';
import { AuthModal } from '@/components/AuthModal';
import { SocialSidebar } from '@/components/SocialSidebar';
import { GenieGameInterface } from '@/components/GenieGameInterface';
import { useAuth } from '@/contexts/AuthContext';
import { useUserData } from '@/hooks/useUserData';
import { realXrpOracle } from '@/services/realXrpOracle';

const Index = () => {
  const { user, loading } = useAuth();
  const { profile, stats } = useUserData();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(0.62567890);
  const [activeGame, setActiveGame] = useState(null);

  // Use real XRP price from oracle
  useEffect(() => {
    const handlePriceUpdate = (data: any) => {
      setCurrentPrice(data.price);
    };

    realXrpOracle.startPriceUpdates(handlePriceUpdate);

    return () => {
      realXrpOracle.stopPriceUpdates();
    };
  }, []);

  const handlePlayGame = (gameName) => {
    if (gameName === 'genie') {
      setActiveGame('genie');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-xl font-orbitron">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 font-orbitron">
      <GameHeader user={user} profile={profile} onShowAuth={() => setShowAuthModal(true)} />
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
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setActiveGame(null)}
                  className="bg-slate-800 border border-slate-600 text-white px-4 py-2 hover:bg-slate-700 font-orbitron transform -skew-x-12 transition-colors"
                >
                  <div className="transform skew-x-12">← BACK TO HUB</div>
                </button>
                <h2 className="text-2xl font-orbitron font-bold text-white">GENIE PREDICTION GAME</h2>
              </div>
            </div>

            {/* Compact User Stats - Only show when logged in */}
            {user && stats && (
              <div className="mb-6">
                <CompactUserStats 
                  score={stats.score} 
                  balance={stats.balance} 
                  user={user} 
                />
              </div>
            )}

            <GenieGameInterface currentPrice={currentPrice} user={user} />
          </div>
        )}
      </div>

      <Footer />

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default Index;
