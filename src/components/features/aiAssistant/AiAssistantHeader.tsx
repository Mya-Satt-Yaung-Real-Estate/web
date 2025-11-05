import { Button } from '@/components/ui/button';
import { X, Sparkles } from 'lucide-react';

interface AiAssistantHeaderProps {
  onClose: () => void;
}

export function AiAssistantHeader({ onClose }: AiAssistantHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 h-[60px] flex-shrink-0 border-b border-gray-200 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent backdrop-blur-sm">
      <div className="flex items-center gap-2.5">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-md animate-pulse opacity-75" />
          <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <h2 className="text-base font-semibold text-gray-900">Jade's AI Assistant</h2>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-600 border border-green-200">
            Online
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

