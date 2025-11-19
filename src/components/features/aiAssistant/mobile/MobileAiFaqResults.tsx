import { memo } from 'react';
import type { AiToolResult, AiFaq } from '@/types/aiAssistant';

interface MobileAiFaqResultsProps {
  tool: AiToolResult;
}

export const MobileAiFaqResults = memo(function MobileAiFaqResults({ tool }: MobileAiFaqResultsProps) {
  if (tool.type !== 'faq_search' || !tool.result) {
    return null;
  }

  const result = tool.result as { count: number; faqs: AiFaq[] };
  const faqs = result.faqs || [];

  if (faqs.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-gradient-to-b from-primary to-primary/60 rounded-full" />
        <h3 className="text-sm font-bold text-gray-900">
          Found {result.count} {result.count === 1 ? 'FAQ' : 'FAQs'}
        </h3>
      </div>
      
      <div className="flex flex-col gap-3">
        {faqs.map((faq, index) => (
          <div key={faq.id} style={{ animationDelay: `${index * 50}ms` }}>
            <h4 className="font-semibold text-sm mb-1.5 text-gray-900 leading-snug">
              {faq.question_en}
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              {faq.answer_en}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
});

