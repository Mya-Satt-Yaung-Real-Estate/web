import { memo } from 'react';
import type { AiToolResult, AiNews } from '@/types/aiAssistant';

interface MobileAiNewsResultsProps {
  tool: AiToolResult;
}

export const MobileAiNewsResults = memo(function MobileAiNewsResults({ tool }: MobileAiNewsResultsProps) {
  if (tool.type !== 'news_search' || !tool.result) {
    return null;
  }

  const result = tool.result as { count: number; news: AiNews[] };
  const news = result.news || [];

  if (news.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-gradient-to-b from-primary to-primary/60 rounded-full" />
        <h3 className="text-sm font-bold text-gray-900">
          Found {result.count} {result.count === 1 ? 'article' : 'articles'}
        </h3>
      </div>
      
      <div className="flex flex-col gap-3">
        {news.map((article, index) => (
          <div key={article.id} style={{ animationDelay: `${index * 50}ms` }}>
            <h4 className="font-semibold text-sm mb-1.5 text-gray-900 leading-snug">
              {article.title_en}
              {article.category && <span className="text-gray-600 font-normal"> - {article.category}</span>}
            </h4>
            {article.short_description && (
              <p className="text-xs text-gray-600 leading-relaxed mb-1.5">
                {article.short_description}
              </p>
            )}
            {article.writer_name && (
              <p className="text-xs text-gray-600 mb-1.5">
                <span className="font-medium">Writer:</span> {article.writer_name}
              </p>
            )}
            {article.created_at && (
              <p className="text-xs text-gray-600">
                <span className="font-medium">Published:</span> {article.created_at}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

