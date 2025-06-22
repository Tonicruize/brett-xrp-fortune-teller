
import { useState, useEffect } from 'react';
import { GameHeader } from '@/components/GameHeader';
import { PredictionCard } from '@/components/PredictionCard';
import { GameCard } from '@/components/GameCard';
import { Footer } from '@/components/Footer';
import { UserStats } from '@/components/UserStats';
import { WalletInfo } from '@/components/WalletInfo';
import { AuthModal } from '@/components/AuthModal';

const Index = () => {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(1.24567890);
  const [gameActive, setGameActive] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [timeLeft, setTimeLeft] = useState(90);
  const [initialPrice, setInitialPrice] = useState(0);
  const [score, setScore] = useState(0);
  const [balance, setBalance] = useState(100);
  const [activeGame, setActiveGame] = useState(null);

  // Simulate price changes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrice(prev => {
        const change = (Math.random() - 0.5) * 0.00001;
        return Math.max(0, prev + change);
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Game timer
  useEffect(() => {
    let interval;
    if (gameActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && prediction) {
      const priceChange = ((currentPrice - initialPrice) / initialPrice) * 100;
      const isWin = prediction === 'up' ? priceChange > 0 : priceChange < 0;
      
      if (isWin) {
        setScore(prev => prev + 100);
        setBalance(prev => prev + 10);
      }
      
      setGameActive(false);
      setTimeLeft(90);
      setPrediction(null);
      setInitialPrice(0);
    }

    return () => clearInterval(interval);
  }, [gameActive, timeLeft, prediction, currentPrice, initialPrice]);

  const handlePrediction = (direction) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setPrediction(direction);
    setGameActive(true);
    setTimeLeft(90);
    setInitialPrice(currentPrice);
  };

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
    <div className="min-h-screen bg-slate-950">
      <GameHeader user={user} onShowAuth={() => setShowAuthModal(true)} />
      
      <div className="container mx-auto px-6 py-8">
        {!activeGame ? (
          <>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-12 h-12 bg-yellow-500 transform rotate-45"></div>
                <h1 className="text-5xl font-bold text-white">GAME HUB</h1>
                <div className="w-12 h-12 bg-yellow-500 transform rotate-45"></div>
              </div>
              <p className="text-slate-400 text-xl">Choose your game and start winning</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <GameCard
                title="Genie Prediction"
                status="active"
                description="Predict price movements and win"
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

            <div className="bg-slate-900 border-2 border-slate-700 rounded p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Why Choose BRETT Casino?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-yellow-500 font-semibold mb-2">Fair & Transparent</h3>
                  <p className="text-slate-400 text-sm">Provably fair algorithms ensure honest gameplay</p>
                </div>
                <div>
                  <h3 className="text-yellow-500 font-semibold mb-2">Instant Payouts</h3>
                  <p className="text-slate-400 text-sm">Withdraw your winnings immediately</p>
                </div>
                <div>
                  <h3 className="text-yellow-500 font-semibold mb-2">24/7 Support</h3>
                  <p className="text-slate-400 text-sm">Round-the-clock customer assistance</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center gap-4 mb-8">
              <button 
                onClick={() => setActiveGame(null)}
                className="bg-slate-800 border border-slate-600 text-white px-4 py-2 rounded hover:bg-slate-700"
              >
                ← Back to Hub
              </button>
              <h2 className="text-2xl font-bold text-white">Genie Prediction Game</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-6">
                <UserStats score={score} balance={balance} user={user} />
                <WalletInfo user={user} balance={balance} />
              </div>

              <div>
                <PredictionCard 
                  currentPrice={currentPrice}
                  gameActive={gameActive}
                  timeLeft={timeLeft}
                  prediction={prediction}
                  onPrediction={handlePrediction}
                  initialPrice={initialPrice}
                />
              </div>

              <div className="bg-slate-900 border-2 border-slate-700 rounded p-6">
                <h3 className="text-xl font-bold text-white mb-4">Recent Winners</h3>
                <div className="space-y-3">
                  {[
                    { name: "Player1", amount: "+$124.50" },
                    { name: "Player2", amount: "+$89.20" },
                    { name: "Player3", amount: "+$156.80" },
                    { name: "Player4", amount: "+$67.40" },
                  ].map((winner, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-slate-800 rounded">
                      <span className="text-white">{winner.name}</span>
                      <span className="text-green-400 font-semibold">{winner.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
