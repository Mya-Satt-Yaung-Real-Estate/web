import { memo } from 'react';
import type { AiToolResult, AiCompany } from '@/types/aiAssistant';

interface MobileAiCompanyResultsProps {
  tool: AiToolResult;
}

export const MobileAiCompanyResults = memo(function MobileAiCompanyResults({ tool }: MobileAiCompanyResultsProps) {
  if (tool.type !== 'company_search' || !tool.result) {
    return null;
  }

  const result = tool.result as { count: number; companies: AiCompany[] };
  const companies = result.companies || [];

  if (companies.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-gradient-to-b from-primary to-primary/60 rounded-full" />
        <h3 className="text-sm font-bold text-gray-900">
          Found {result.count} {result.count === 1 ? 'company' : 'companies'}
        </h3>
      </div>
      
      <div className="flex flex-col gap-3">
        {companies.map((company, index) => (
          <div key={company.id} style={{ animationDelay: `${index * 50}ms` }}>
            <h4 className="font-semibold text-sm mb-1.5 text-gray-900 leading-snug">
              {company.name}
              {company.company_type && <span className="text-gray-600 font-normal"> - {company.company_type}</span>}
            </h4>
            {company.description && (
              <p className="text-xs text-gray-600 leading-relaxed mb-1.5">
                {company.description}
              </p>
            )}
            {company.services && company.services.length > 0 && (
              <p className="text-xs text-gray-600 mb-1.5">
                <span className="font-medium">Services:</span> {company.services.join(', ')}
              </p>
            )}
            {company.specializations && company.specializations.length > 0 && (
              <p className="text-xs text-gray-600 mb-1.5">
                <span className="font-medium">Specializations:</span> {company.specializations.join(', ')}
              </p>
            )}
            {company.business_address && (
              <p className="text-xs text-gray-600 mb-1.5">
                <span className="font-medium">Address:</span> {company.business_address}
                {company.region && company.township && `, ${company.township}, ${company.region}`}
              </p>
            )}
            {company.phone && (
              <p className="text-xs text-gray-600">
                <span className="font-medium">Phone:</span> {company.phone}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

