import { memo } from 'react';
import type { AiToolResult, AiAdvertisement } from '@/types/aiAssistant';

interface MobileAiAdvertisementResultsProps {
  tool: AiToolResult;
}

export const MobileAiAdvertisementResults = memo(function MobileAiAdvertisementResults({ tool }: MobileAiAdvertisementResultsProps) {
  if (tool.type !== 'advertisement_search' || !tool.result) {
    return null;
  }

  const result = tool.result as { count: number; advertisements: AiAdvertisement[] };
  const advertisements = result.advertisements || [];

  if (advertisements.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-gradient-to-b from-primary to-primary/60 rounded-full" />
        <h3 className="text-sm font-bold text-gray-900">
          Found {result.count} {result.count === 1 ? 'advertisement' : 'advertisements'}
        </h3>
      </div>
      
      <div className="flex flex-col gap-3">
        {advertisements.map((advertisement, index) => (
          <div key={advertisement.id} style={{ animationDelay: `${index * 50}ms` }}>
            <h4 className="font-semibold text-sm mb-1.5 text-gray-900 leading-snug">
              {advertisement.title_en}
              {advertisement.is_featured && <span className="text-primary text-xs ml-2">(Featured)</span>}
            </h4>
            {advertisement.description && (
              <p className="text-xs text-gray-600 leading-relaxed mb-1.5">
                {advertisement.description}
              </p>
            )}
            {advertisement.address && (
              <p className="text-xs text-gray-600 mb-1.5">
                <span className="font-medium">Address:</span> {advertisement.address}
                {advertisement.region && advertisement.township && `, ${advertisement.township}, ${advertisement.region}`}
              </p>
            )}
            {advertisement.contact_name && (
              <p className="text-xs text-gray-600 mb-1.5">
                <span className="font-medium">Contact:</span> {advertisement.contact_name}
              </p>
            )}
            {advertisement.phone_numbers && advertisement.phone_numbers.length > 0 && (
              <p className="text-xs text-gray-600 mb-1.5">
                <span className="font-medium">Phone:</span> {advertisement.phone_numbers.join(', ')}
              </p>
            )}
            {advertisement.email && (
              <p className="text-xs text-gray-600">
                <span className="font-medium">Email:</span> {advertisement.email}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

