
import { MessageCircle, Send, Twitter, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const SocialSidebar = () => {
  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50">
      <div className="flex flex-col gap-3">
        <Button
          size="sm"
          className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white border-0 transform rotate-45 group"
          onClick={() => window.open('https://twitter.com', '_blank')}
        >
          <Twitter className="w-5 h-5 transform -rotate-45 group-hover:scale-110 transition-transform" />
        </Button>
        
        <Button
          size="sm"
          className="w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white border-0 transform rotate-45 group"
          onClick={() => window.open('https://telegram.org', '_blank')}
        >
          <Send className="w-5 h-5 transform -rotate-45 group-hover:scale-110 transition-transform" />
        </Button>
        
        <Button
          size="sm"
          className="w-12 h-12 bg-green-600 hover:bg-green-700 text-white border-0 transform rotate-45 group"
        >
          <MessageCircle className="w-5 h-5 transform -rotate-45 group-hover:scale-110 transition-transform" />
        </Button>
        
        <Button
          size="sm"
          className="w-12 h-12 bg-purple-600 hover:bg-purple-700 text-white border-0 transform rotate-45 group"
          onClick={() => window.open('https://brett-casino.com', '_blank')}
        >
          <Globe className="w-5 h-5 transform -rotate-45 group-hover:scale-110 transition-transform" />
        </Button>
      </div>
    </div>
  );
};
