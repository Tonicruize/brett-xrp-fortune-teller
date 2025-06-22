
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface GameCardProps {
  title: string;
  status: 'active' | 'coming-soon';
  description: string;
  image: string;
  onPlay?: () => void;
}

export const GameCard = ({ title, status, description, image, onPlay }: GameCardProps) => {
  return (
    <Card className="bg-slate-900 border-2 border-slate-700 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
      <div className="absolute top-0 right-0 w-16 h-16 bg-slate-800 transform rotate-45 translate-x-8 -translate-y-8"></div>
      
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <img src={image} alt={title} className="w-12 h-12 rounded" />
          <div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-slate-400 text-sm">{description}</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className={`px-3 py-1 text-xs font-semibold rounded ${
            status === 'active' 
              ? 'bg-green-900 text-green-300 border border-green-700' 
              : 'bg-slate-800 text-slate-400 border border-slate-600'
          }`}>
            {status === 'active' ? 'LIVE' : 'COMING SOON'}
          </div>
          
          {status === 'active' ? (
            <Button 
              onClick={onPlay}
              className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold px-6"
            >
              PLAY
            </Button>
          ) : (
            <Button disabled className="bg-slate-700 text-slate-500 px-6">
              SOON
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
