
export const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 mt-16">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/lovable-uploads/71a7ed5b-cbac-4c1d-8ccd-dbb95f5d9ef7.png" 
                alt="BRETT" 
                className="w-8 h-8"
              />
              <h3 className="text-lg font-orbitron font-bold text-white">BRETT CASINO</h3>
            </div>
            <p className="text-slate-400 text-sm font-orbitron">
              Professional crypto gaming platform with fair odds and instant payouts.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-orbitron font-semibold mb-4">GAMES</h4>
            <ul className="space-y-2 text-slate-400 text-sm font-orbitron">
              <li><a href="#" className="hover:text-yellow-500 transition-colors">Genie Prediction</a></li>
              <li><a href="#" className="hover:text-yellow-500 transition-colors">Dice Roll</a></li>
              <li><a href="#" className="hover:text-yellow-500 transition-colors">Roulette</a></li>
              <li><a href="#" className="hover:text-yellow-500 transition-colors">Blackjack</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-orbitron font-semibold mb-4">SUPPORT</h4>
            <ul className="space-y-2 text-slate-400 text-sm font-orbitron">
              <li><a href="#" className="hover:text-yellow-500 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-yellow-500 transition-colors">Live Chat</a></li>
              <li><a href="#" className="hover:text-yellow-500 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-yellow-500 transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-orbitron font-semibold mb-4">LEGAL</h4>
            <ul className="space-y-2 text-slate-400 text-sm font-orbitron">
              <li><a href="#" className="hover:text-yellow-500 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-yellow-500 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-yellow-500 transition-colors">Responsible Gaming</a></li>
              <li><a href="#" className="hover:text-yellow-500 transition-colors">Fairness</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm font-orbitron">
            © 2024 BRETT Casino. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span className="text-slate-500 text-sm font-orbitron">18+ Only</span>
            <span className="text-slate-500 text-sm font-orbitron">Play Responsibly</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
