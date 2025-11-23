import { memo } from 'react';
import type { AiToolResult, AiFaq } from '@/types/aiAssistant';

interface AiFaqResultsProps {
  tool: AiToolResult;
}

export const AiFaqResults = memo(function AiFaqResults({ tool }: AiFaqResultsProps) {
  // Support both mapped type and raw tool name
  const isFaqTool = tool.type === 'faq_search' || 
                    tool.type === 'faqsearchtool' ||
                    tool.name?.toLowerCase().includes('faq') ||
                    tool.name?.toLowerCase().includes('search_faqs');
  
  if (!isFaqTool || !tool.result) {
    return null;
  }

  const result = tool.result as { count: number; faqs: AiFaq[] };
  const faqs = result.faqs || [];

  if (faqs.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-gradient-to-b from-primary to-primary/60 rounded-full" />
        <h3 className="text-base font-semibold text-gray-900">
          Found {result.count} {result.count === 1 ? 'FAQ' : 'FAQs'}
        </h3>
      </div>
      
      <div className="flex flex-col gap-4">
        {faqs.map((faq, index) => (
          <div key={faq.id} style={{ animationDelay: `${index * 50}ms` }}>
            <h4 className="font-semibold text-sm mb-1.5 text-gray-900">
              {faq.question_en}
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {faq.answer_en}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
});

