
import { useState, useEffect } from 'react';
import { GameHeader } from '@/components/GameHeader';
import { PredictionCard } from '@/components/PredictionCard';
import { UserStats } from '@/components/UserStats';
import { WalletInfo } from '@/components/WalletInfo';
import { AuthModal } from '@/components/AuthModal';
import { Trophy, TrendingUp, Users, BookOpen, Dice1, Coins, Target } from 'lucide-react';

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

  // Simulate price changes for demo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrice(prev => {
        const change = (Math.random() - 0.5) * 0.00001;
        return Math.max(0, prev + change);
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Game timer with 90 seconds
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-red-900 to-orange-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-400 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-green-400 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-red-400 rounded-full opacity-15 animate-ping"></div>
        <div className="absolute bottom-40 right-10 w-28 h-28 bg-blue-400 rounded-full opacity-25 animate-bounce delay-300"></div>
        
        {/* Floating Coins Animation */}
        <div className="absolute top-32 left-1/4 animate-bounce delay-100">
          <Coins className="w-8 h-8 text-yellow-400 opacity-60" />
        </div>
        <div className="absolute top-52 right-1/3 animate-bounce delay-500">
          <Coins className="w-6 h-6 text-yellow-300 opacity-40" />
        </div>
        <div className="absolute bottom-60 left-1/2 animate-bounce delay-700">
          <Coins className="w-10 h-10 text-yellow-500 opacity-50" />
        </div>
      </div>

      <div className="relative z-10">
        <GameHeader user={user} onShowAuth={() => setShowAuthModal(true)} />
        
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12 relative">
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="relative">
                <img 
                  src="/lovable-uploads/71a7ed5b-cbac-4c1d-8ccd-dbb95f5d9ef7.png" 
                  alt="BRETT Logo" 
                  className="w-32 h-32 rounded-full border-4 border-yellow-400 shadow-2xl shadow-yellow-400/50 animate-pulse"
                />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-white text-xs font-bold">$</span>
                </div>
              </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black mb-6">
              <span className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
                BRETT CASINO
              </span>
            </h1>
            
            <div className="flex items-center justify-center gap-4 mb-6">
              <Dice1 className="text-yellow-400 w-8 h-8 animate-spin" />
              <p className="text-2xl text-white font-bold">
                The Ultimate Crypto Gambling Experience
              </p>
              <Target className="text-red-400 w-8 h-8 animate-pulse" />
            </div>
            
            <div className="bg-gradient-to-r from-red-600 to-purple-600 rounded-full px-8 py-3 inline-block mb-8 border-2 border-yellow-400 shadow-lg shadow-yellow-400/30">
              <p className="text-xl text-white font-bold">
                Predict • Win • Earn $BRETT Tokens
              </p>
            </div>

            {/* Live Stats Banner */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-4 border-2 border-green-400 shadow-lg">
                <div className="text-2xl font-bold text-white">$2.4M</div>
                <div className="text-green-200 text-sm">Total Prizes</div>
              </div>
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-4 border-2 border-purple-400 shadow-lg">
                <div className="text-2xl font-bold text-white">847</div>
                <div className="text-purple-200 text-sm">Active Players</div>
              </div>
              <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl p-4 border-2 border-orange-400 shadow-lg">
                <div className="text-2xl font-bold text-white">98.7%</div>
                <div className="text-orange-200 text-sm">Win Rate</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - User Stats & Wallet */}
            <div className="space-y-6">
              <UserStats score={score} balance={balance} user={user} />
              <WalletInfo user={user} balance={balance} />
            </div>

            {/* Center Column - Main Game */}
            <div className="space-y-6">
              <PredictionCard 
                currentPrice={currentPrice}
                gameActive={gameActive}
                timeLeft={timeLeft}
                prediction={prediction}
                onPrediction={handlePrediction}
                initialPrice={initialPrice}
              />
            </div>

            {/* Right Column - Leaderboard & Info */}
            <div className="space-y-6">
              {/* Leaderboard */}
              <div className="bg-gradient-to-br from-slate-900 to-purple-900 border-2 border-yellow-400 shadow-2xl shadow-yellow-400/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Trophy className="text-yellow-400 w-8 h-8 animate-bounce" />
                  <h3 className="text-2xl font-bold text-white">Top Winners</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { name: "CryptoKing", score: 12450, profit: "+124.5%", avatar: "👑" },
                    { name: "DiamondHands", score: 9180, profit: "+91.8%", avatar: "💎" },
                    { name: "MoonShot", score: 7920, profit: "+79.2%", avatar: "🚀" },
                    { name: "LuckyBrett", score: 6650, profit: "+66.5%", avatar: "🍀" },
                  ].map((player, index) => (
                    <div key={index} className="flex justify-between items-center p-4 rounded-lg bg-gradient-to-r from-purple-800/50 to-red-800/50 border border-yellow-400/30 hover:border-yellow-400 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{player.avatar}</div>
                        <div>
                          <div className="text-white font-bold">{player.name}</div>
                          <div className="text-yellow-400 text-sm">#{index + 1}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-bold text-lg">{player.score}</div>
                        <div className="text-green-300 text-sm">{player.profit}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* How to Play */}
              <div className="bg-gradient-to-br from-slate-900 to-red-900 border-2 border-red-400 shadow-2xl shadow-red-400/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="text-red-400 w-8 h-8 animate-pulse" />
                  <h3 className="text-2xl font-bold text-white">How to Win</h3>
                </div>
                <div className="space-y-4 text-white">
                  <div className="flex items-start gap-3 p-3 bg-red-800/30 rounded-lg">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                    <div>
                      <p className="font-semibold">Choose Your Bet</p>
                      <p className="text-red-200 text-sm">Predict if price goes UP or DOWN</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-orange-800/30 rounded-lg">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                    <div>
                      <p className="font-semibold">Watch the Timer</p>
                      <p className="text-orange-200 text-sm">90 seconds of pure adrenaline</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-800/30 rounded-lg">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                    <div>
                      <p className="font-semibold">Win Big</p>
                      <p className="text-green-200 text-sm">Earn $BRETT tokens for correct predictions</p>
                    </div>
                  </div>
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
