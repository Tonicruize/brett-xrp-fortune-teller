
import { useState, useEffect } from 'react';
import { GameHeader } from '@/components/GameHeader';
import { PredictionCard } from '@/components/PredictionCard';
import { GameCard } from '@/components/GameCard';
import { Footer } from '@/components/Footer';
import { UserStats } from '@/components/UserStats';
import { WalletInfo } from '@/components/WalletInfo';
import { AuthModal } from '@/components/AuthModal';
import { SocialSidebar } from '@/components/SocialSidebar';
import { CandleChart } from '@/components/CandleChart';

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

  // Simulate price changes (more realistic candlestick pattern)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrice(prev => {
        const volatility = 0.00002;
        const trend = Math.sin(Date.now() / 10000) * 0.00001;
        const change = (Math.random() - 0.5) * volatility + trend;
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

  const handleRoundEnd = (finalPrice) => {
    console.log('Round ended with price:', finalPrice);
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
              <p className="text-slate-400 text-xl font-orbitron">Choose your game and start winning</p>
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

            <div className="bg-slate-900 border border-slate-700 p-8 text-center transform -skew-x-3">
              <div className="transform skew-x-3">
                <h2 className="text-2xl font-orbitron font-bold text-white mb-4">WHY CHOOSE BRETT CASINO?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-yellow-500 font-orbitron font-semibold mb-2">FAIR & TRANSPARENT</h3>
                    <p className="text-slate-400 text-sm font-orbitron">Provably fair algorithms ensure honest gameplay</p>
                  </div>
                  <div>
                    <h3 className="text-yellow-500 font-orbitron font-semibold mb-2">INSTANT PAYOUTS</h3>
                    <p className="text-slate-400 text-sm font-orbitron">Withdraw your winnings immediately</p>
                  </div>
                  <div>
                    <h3 className="text-yellow-500 font-orbitron font-semibold mb-2">24/7 SUPPORT</h3>
                    <p className="text-slate-400 text-sm font-orbitron">Round-the-clock customer assistance</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center gap-4 mb-8">
              <button 
                onClick={() => setActiveGame(null)}
                className="bg-slate-800 border border-slate-600 text-white px-4 py-2 hover:bg-slate-700 font-orbitron transform -skew-x-12"
              >
                <div className="transform skew-x-12">← BACK TO HUB</div>
              </button>
              <h2 className="text-2xl font-orbitron font-bold text-white">GENIE PREDICTION GAME</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="space-y-6">
                <UserStats score={score} balance={balance} user={user} />
                <WalletInfo user={user} balance={balance} />
              </div>

              <div className="lg:col-span-2 space-y-6">
                <CandleChart 
                  currentPrice={currentPrice}
                  gameActive={gameActive}
                  timeLeft={timeLeft}
                  onRoundEnd={handleRoundEnd}
                />
                <PredictionCard 
                  currentPrice={currentPrice}
                  gameActive={gameActive}
                  timeLeft={timeLeft}
                  prediction={prediction}
                  onPrediction={handlePrediction}
                  initialPrice={initialPrice}
                />
              </div>

              <div className="bg-slate-900 border border-slate-700 p-6">
                <h3 className="text-xl font-orbitron font-bold text-white mb-4">RECENT WINNERS</h3>
                <div className="space-y-3">
                  {[
                    { name: "Player1", amount: "+$124.50" },
                    { name: "Player2", amount: "+$89.20" },
                    { name: "Player3", amount: "+$156.80" },
                    { name: "Player4", amount: "+$67.40" },
                  ].map((winner, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-slate-800 transform -skew-x-6">
                      <div className="transform skew-x-6 flex justify-between w-full">
                        <span className="text-white font-orbitron">{winner.name}</span>
                        <span className="text-green-400 font-orbitron font-semibold">{winner.amount}</span>
                      </div>
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
