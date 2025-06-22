
import { useState, useEffect } from 'react';
import { GameHeader } from '@/components/GameHeader';
import { PredictionCard } from '@/components/PredictionCard';
import { UserStats } from '@/components/UserStats';
import { PriceChart } from '@/components/PriceChart';
import { WalletInfo } from '@/components/WalletInfo';
import { AuthModal } from '@/components/AuthModal';
import { Trophy, TrendingUp, Users, BookOpen } from 'lucide-react';

const Index = () => {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [timeLeft, setTimeLeft] = useState(90);
  const [initialPrice, setInitialPrice] = useState(0);
  const [score, setScore] = useState(0);
  const [balance, setBalance] = useState(100);

  // Game timer with 90 seconds
  useEffect(() => {
    let interval;
    if (gameActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && prediction) {
      // Game end logic
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
    setInitialPrice(currentPrice); // Capture the exact price when bet is placed
  };

  const handleAuth = (userData) => {
    setUser(userData);
    setShowAuthModal(false);
  };

  const handlePriceUpdate = (newPrice: number) => {
    setCurrentPrice(newPrice);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      {/* Professional animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute top-1/2 -right-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute bottom-8 left-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        <GameHeader user={user} onShowAuth={() => setShowAuthModal(true)} />
        
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <TrendingUp className="text-indigo-400 w-12 h-12" />
              <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                BRETT XRP Oracle
              </h1>
              <TrendingUp className="text-indigo-400 w-12 h-12" />
            </div>
            <p className="text-xl text-slate-300 mb-4 max-w-2xl mx-auto">
              Professional cryptocurrency prediction platform with real-time XRP data
            </p>
            <p className="text-lg text-indigo-400 font-semibold">
              Predict • Trade • Earn $BRETT Tokens
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
                initialPrice={initialPrice}
              />
            </div>

            {/* Right Column - Leaderboard/Info */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-indigo-500/30 shadow-2xl shadow-indigo-500/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Trophy className="text-yellow-400 w-6 h-6" />
                  <h3 className="text-xl font-bold text-white">Leaderboard</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { name: "CryptoMaster", score: 2450, profit: "+24.5%" },
                    { name: "XRPTrader", score: 2180, profit: "+18.2%" },
                    { name: "BrettWhale", score: 1920, profit: "+15.1%" },
                    { name: "OraclePro", score: 1650, profit: "+12.8%" },
                  ].map((player, index) => (
                    <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 font-mono">#{index + 1}</span>
                        <span className="text-white font-medium">{player.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-indigo-400 font-bold">{player.score}</div>
                        <div className="text-green-400 text-xs">{player.profit}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-indigo-500/30 shadow-2xl shadow-indigo-500/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="text-indigo-400 w-6 h-6" />
                  <h3 className="text-xl font-bold text-white">How to Play</h3>
                </div>
                <div className="space-y-4 text-slate-300 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-xs font-bold text-white">1</div>
                    <p>Choose BULL (up) or BEAR (down) prediction</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-xs font-bold text-white">2</div>
                    <p>Watch live XRP price for 90 seconds</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-xs font-bold text-white">3</div>
                    <p>Earn $BRETT tokens for correct predictions</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-xs font-bold text-white">4</div>
                    <p>Build your streak for bonus multipliers</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-indigo-500/30 shadow-2xl shadow-indigo-500/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="text-purple-400 w-6 h-6" />
                  <h3 className="text-xl font-bold text-white">Live Stats</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-indigo-400">847</div>
                    <div className="text-xs text-slate-400">Active Players</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-400">$2.4M</div>
                    <div className="text-xs text-slate-400">Total Volume</div>
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
