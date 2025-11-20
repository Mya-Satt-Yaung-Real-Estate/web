import { memo } from 'react';
import type { AiToolResult, AiContactInformation as AiContactInformationType } from '@/types/aiAssistant';

interface AiContactInformationProps {
  tool: AiToolResult;
}

export const AiContactInformation = memo(function AiContactInformation({ tool }: AiContactInformationProps) {
  if (tool.type !== 'contact_information' || !tool.result) {
    return null;
  }

  const result = tool.result as { contact_information: AiContactInformationType };
  const contactInfo = result.contact_information || {};

  if (Object.keys(contactInfo).length === 0) {
    return null;
  }

  return (
    <div className="mt-6 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-gradient-to-b from-primary to-primary/60 rounded-full" />
        <h3 className="text-base font-semibold text-gray-900">
          Contact Information
        </h3>
      </div>
      
      <div className="flex flex-col gap-2">
        {contactInfo.company_name && (
          <p className="text-sm text-gray-900">
            <span className="font-medium">Company:</span> {contactInfo.company_name}
          </p>
        )}
        {contactInfo.address && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Address:</span> {contactInfo.address}
          </p>
        )}
        {contactInfo.primary_phone && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Phone:</span> {contactInfo.primary_phone}
            {contactInfo.secondary_phone && `, ${contactInfo.secondary_phone}`}
          </p>
        )}
        {!contactInfo.primary_phone && contactInfo.secondary_phone && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Phone:</span> {contactInfo.secondary_phone}
          </p>
        )}
        {contactInfo.primary_email && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Email:</span> {contactInfo.primary_email}
            {contactInfo.support_email && `, ${contactInfo.support_email}`}
          </p>
        )}
        {!contactInfo.primary_email && contactInfo.support_email && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Email:</span> {contactInfo.support_email}
          </p>
        )}
        {contactInfo.website && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Website:</span> {contactInfo.website}
          </p>
        )}
        {contactInfo.facebook && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Facebook:</span> {contactInfo.facebook}
          </p>
        )}
        {contactInfo.instagram && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Instagram:</span> {contactInfo.instagram}
          </p>
        )}
      </div>
    </div>
  );
});

