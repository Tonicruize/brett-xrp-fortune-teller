import { useState, useEffect } from 'react';
import { GameHeader } from '@/components/GameHeader';
import { PredictionCard } from '@/components/PredictionCard';
import { UserStats } from '@/components/UserStats';
import { PriceChart } from '@/components/PriceChart';
import { WalletInfo } from '@/components/WalletInfo';
import { AuthModal } from '@/components/AuthModal';
import { Sparkles } from 'lucide-react';

const Index = () => {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [balance, setBalance] = useState(100);

  // Game timer
  useEffect(() => {
    let interval;
    if (gameActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && prediction) {
      // Game end logic would go here
      setGameActive(false);
      setTimeLeft(60);
      setPrediction(null);
    }

    return () => clearInterval(interval);
  }, [gameActive, timeLeft, prediction]);

  const handlePrediction = (direction) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setPrediction(direction);
    setGameActive(true);
    setTimeLeft(60);
  };

  const handleAuth = (userData) => {
    setUser(userData);
    setShowAuthModal(false);
  };

  const handlePriceUpdate = (newPrice: number) => {
    setCurrentPrice(newPrice);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-8 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        <GameHeader user={user} onShowAuth={() => setShowAuthModal(true)} />
        
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="text-yellow-400 w-8 h-8" />
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                $BRETT XRP Fortune Teller
              </h1>
              <Sparkles className="text-yellow-400 w-8 h-8" />
            </div>
            <p className="text-xl text-gray-300 mb-6">
              Predict XRP's next move and win $BRETT tokens!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - User Stats & Wallet */}
            <div className="space-y-6">
              <UserStats score={score} balance={balance} user={user} />
              <WalletInfo user={user} balance={balance} />
            </div>

            {/* Center Column - Game */}
            <div className="space-y-6">
              <PriceChart currentPrice={currentPrice} onPriceUpdate={handlePriceUpdate} />
              <PredictionCard 
                currentPrice={currentPrice}
                gameActive={gameActive}
                timeLeft={timeLeft}
                prediction={prediction}
                onPrediction={handlePrediction}
              />
            </div>

            {/* Right Column - Leaderboard/Info */}
            <div className="space-y-6">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">🏆 Leaderboard</h3>
                <div className="space-y-3">
                  {[
                    { name: "CryptoWizard", score: 2450 },
                    { name: "XRPFortune", score: 2180 },
                    { name: "BrettLover", score: 1920 },
                    { name: "MoonPredictor", score: 1650 },
                  ].map((player, index) => (
                    <div key={index} className="flex justify-between items-center p-2 rounded bg-slate-700/30">
                      <span className="text-gray-300">#{index + 1} {player.name}</span>
                      <span className="text-green-400 font-semibold">{player.score}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">📈 How to Play</h3>
                <div className="space-y-3 text-gray-300 text-sm">
                  <p>• Predict if XRP will go UP or DOWN</p>
                  <p>• You have 60 seconds per round</p>
                  <p>• Correct predictions earn $BRETT</p>
                  <p>• Build your streak for bonus points</p>
                  <p>• Fund your wallet to play with real stakes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onAuth={handleAuth}
      />
    </div>
  );
};

export default Index;
