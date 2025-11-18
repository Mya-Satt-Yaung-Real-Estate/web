import { Sparkles } from 'lucide-react';

interface MobileAiHeaderProps {
  onClose: () => void;
}

const GRADIENT_COLOR = 'linear-gradient(to right, oklch(0.558 0.288 302.321) 0%, oklch(0.546 0.245 262.881) 100%)';

export function MobileAiHeader({ onClose }: MobileAiHeaderProps) {
  return (
    <div 
      className="flex items-center justify-center px-4 py-3 flex-shrink-0 safe-area-top"
      style={{ background: GRADIENT_COLOR }}
    >
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-white flex-shrink-0" />
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white">Jade's AI Assistant</h2>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-300/80 text-white border border-purple-200/50 flex-shrink-0">
              Alpha
            </span>
          </div>
          <p className="text-xs text-white/80 mt-0.5">Powered by Advanced Jade AI</p>
        </div>
      </div>
    </div>
  );
}

