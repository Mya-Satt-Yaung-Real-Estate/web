import { memo } from 'react';
import type { AiToolResult, AiEvent } from '@/types/aiAssistant';

interface AiEventResultsProps {
  tool: AiToolResult;
}

export const AiEventResults = memo(function AiEventResults({ tool }: AiEventResultsProps) {
  if (tool.type !== 'event_search' || !tool.result) {
    return null;
  }

  const result = tool.result as { count: number; events: AiEvent[] };
  const events = result.events || [];

  if (events.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-gradient-to-b from-primary to-primary/60 rounded-full" />
        <h3 className="text-base font-semibold text-gray-900">
          Found {result.count} {result.count === 1 ? 'event' : 'events'}
        </h3>
      </div>
      
      <div className="flex flex-col gap-4">
        {events.map((event, index) => (
          <div key={event.id} style={{ animationDelay: `${index * 50}ms` }}>
            <h4 className="font-semibold text-sm mb-1.5 text-gray-900">
              {event.name_en}
              {event.category && <span className="text-gray-600 font-normal"> - {event.category}</span>}
            </h4>
            {event.description && (
              <p className="text-sm text-gray-600 leading-relaxed mb-1.5">
                {event.description}
              </p>
            )}
            {event.date && (
              <p className="text-sm text-gray-600 mb-1.5">
                <span className="font-medium">Date:</span> {event.date}
                {event.start_time && event.end_time && ` (${event.start_time} - ${event.end_time})`}
                {event.start_time && !event.end_time && ` (${event.start_time})`}
              </p>
            )}
            {event.location && (
              <p className="text-sm text-gray-600 mb-1.5">
                <span className="font-medium">Location:</span> {event.location}
                {event.region && event.township && `, ${event.township}, ${event.region}`}
                {event.is_online && <span className="text-primary"> (Online)</span>}
              </p>
            )}
            {event.is_online && !event.location && (
              <p className="text-sm text-gray-600 mb-1.5">
                <span className="font-medium">Type:</span> Online Event
              </p>
            )}
            <p className="text-sm text-gray-600 mb-1.5">
              <span className="font-medium">Price:</span> {event.is_free ? 'Free' : event.price ? `${event.price} MMK` : 'Contact for pricing'}
            </p>
            {event.need_registration && (
              <p className="text-sm text-gray-600 mb-1.5">
                <span className="font-medium">Registration:</span> Required
                {event.registration_link && ` - ${event.registration_link}`}
              </p>
            )}
            {event.host_contact_number && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Contact:</span> {event.host_contact_number}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

