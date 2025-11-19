import { memo } from 'react';
import type { AiToolResult, AiContactInformation } from '@/types/aiAssistant';

interface MobileAiContactInformationProps {
  tool: AiToolResult;
}

export const MobileAiContactInformation = memo(function MobileAiContactInformation({ tool }: MobileAiContactInformationProps) {
  if (tool.type !== 'contact_information' || !tool.result) {
    return null;
  }

  const result = tool.result as { contact_information: AiContactInformation };
  const contactInfo = result.contact_information || {};

  if (Object.keys(contactInfo).length === 0) {
    return null;
  }

  return (
    <div className="mt-4 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-gradient-to-b from-primary to-primary/60 rounded-full" />
        <h3 className="text-sm font-bold text-gray-900">
          Contact Information
        </h3>
      </div>
      
      <div className="flex flex-col gap-2">
        {contactInfo.company_name && (
          <p className="text-xs text-gray-900">
            <span className="font-medium">Company:</span> {contactInfo.company_name}
          </p>
        )}
        {contactInfo.address && (
          <p className="text-xs text-gray-600">
            <span className="font-medium">Address:</span> {contactInfo.address}
          </p>
        )}
        {contactInfo.primary_phone && (
          <p className="text-xs text-gray-600">
            <span className="font-medium">Phone:</span> {contactInfo.primary_phone}
            {contactInfo.secondary_phone && `, ${contactInfo.secondary_phone}`}
          </p>
        )}
        {!contactInfo.primary_phone && contactInfo.secondary_phone && (
          <p className="text-xs text-gray-600">
            <span className="font-medium">Phone:</span> {contactInfo.secondary_phone}
          </p>
        )}
        {contactInfo.primary_email && (
          <p className="text-xs text-gray-600">
            <span className="font-medium">Email:</span> {contactInfo.primary_email}
            {contactInfo.support_email && `, ${contactInfo.support_email}`}
          </p>
        )}
        {!contactInfo.primary_email && contactInfo.support_email && (
          <p className="text-xs text-gray-600">
            <span className="font-medium">Email:</span> {contactInfo.support_email}
          </p>
        )}
        {contactInfo.website && (
          <p className="text-xs text-gray-600">
            <span className="font-medium">Website:</span> {contactInfo.website}
          </p>
        )}
        {contactInfo.facebook && (
          <p className="text-xs text-gray-600">
            <span className="font-medium">Facebook:</span> {contactInfo.facebook}
          </p>
        )}
        {contactInfo.instagram && (
          <p className="text-xs text-gray-600">
            <span className="font-medium">Instagram:</span> {contactInfo.instagram}
          </p>
        )}
      </div>
    </div>
  );
});

