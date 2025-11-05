import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AiAssistantModal } from './AiAssistantModal';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AiTriggerButtonProps {
  className?: string;
}

export function AiTriggerButton({ className }: AiTriggerButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className={cn(
          'fixed bottom-6 left-6 h-14 w-14 rounded-full shadow-2xl z-[9999]',
          'hover:scale-110 transition-transform',
          'bg-primary hover:bg-primary/90 text-primary-foreground',
          'ring-2 ring-primary/20 hover:ring-primary/40',
          'flex items-center justify-center p-0 !px-0',
          className
        )}
        aria-label="Open AI Assistant"
      >
        <Sparkles className="w-6 h-6 flex-shrink-0 stroke-current" />
      </Button>

      <AiAssistantModal open={open} onOpenChange={setOpen} />
    </>
  );
}

