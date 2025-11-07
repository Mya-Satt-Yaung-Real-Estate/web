import { Button } from '@/components/ui/button';
import { X, Sparkles } from 'lucide-react';

interface AiAssistantHeaderProps {
  onClose: () => void;
}

export function AiAssistantHeader({ onClose }: AiAssistantHeaderProps) {
  return (
    <div 
      className="flex items-center justify-between px-4 py-3 flex-shrink-0"
      style={{
        background: 'linear-gradient(to right, oklch(0.558 0.288 302.321) 0%, oklch(0.546 0.245 262.881) 100%)'
      }}
    >
      <div className="flex items-center gap-2.5">
        <Sparkles className="w-5 h-5 text-white" />
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white">Jad's AI Assistant</h2>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-300/80 text-white border border-purple-200/50">
              Alpha
            </span>
          </div>
          <p className="text-xs text-white/80 mt-0.5">Powered by Advanced Jade AI</p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="h-8 w-8 hover:bg-white/20 rounded-lg transition-colors text-white"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}

