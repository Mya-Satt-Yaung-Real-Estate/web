import { memo } from 'react';
import type { AiToolResult, AiLawer } from '@/types/aiAssistant';

interface AiLegalResultsProps {
  tool: AiToolResult;
}

export const AiLegalResults = memo(function AiLegalResults({ tool }: AiLegalResultsProps) {
  // Support both mapped type and raw tool name
  const isLegalTool = tool.type === 'legal_search' || 
                      tool.type === 'legalsearchtool' ||
                      tool.name?.toLowerCase().includes('legal') ||
                      tool.name?.toLowerCase().includes('search_legal');
  
  if (!isLegalTool || !tool.result) {
    return null;
  }

  const result = tool.result as { count: number; lawers: AiLawer[] };
  const lawers = result.lawers || [];

  if (lawers.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-gradient-to-b from-primary to-primary/60 rounded-full" />
        <h3 className="text-base font-semibold text-gray-900">
          Found {result.count} {result.count === 1 ? 'lawyer' : 'lawyers'}
        </h3>
      </div>
      
      <div className="flex flex-col gap-4">
        {lawers.map((lawer, index) => (
          <div key={lawer.id} style={{ animationDelay: `${index * 50}ms` }}>
            <h4 className="font-semibold text-sm mb-1.5 text-gray-900">
              {lawer.name}
              {lawer.title && <span className="text-gray-600 font-normal"> - {lawer.title}</span>}
            </h4>
            {lawer.specialization && (
              <p className="text-sm text-gray-600 mb-1.5">
                <span className="font-medium">Specialization:</span> {lawer.specialization}
              </p>
            )}
            {lawer.experience_years && (
              <p className="text-sm text-gray-600 mb-1.5">
                <span className="font-medium">Experience:</span> {lawer.experience_years} years
              </p>
            )}
            {lawer.about && (
              <p className="text-sm text-gray-600 leading-relaxed mb-1.5">
                {lawer.about}
              </p>
            )}
            {lawer.services && lawer.services.length > 0 && (
              <p className="text-sm text-gray-600 mb-1.5">
                <span className="font-medium">Services:</span> {lawer.services.join(', ')}
              </p>
            )}
            {lawer.address && (
              <p className="text-sm text-gray-600 mb-1.5">
                <span className="font-medium">Address:</span> {lawer.address}
                {lawer.region && lawer.township && `, ${lawer.township}, ${lawer.region}`}
              </p>
            )}
            {lawer.phone && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Phone:</span> {lawer.phone}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

