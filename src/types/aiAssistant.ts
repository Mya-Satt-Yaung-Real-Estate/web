export interface AiMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface AiToolResult {
  type: string;
  name: string;
  result?: any;
  error?: string;
}

export interface AiProperty {
  id: number;
  title: string;
  title_mm: string | null;
  price: string | null;
  area_sqft: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  address: string | null;
  property_type: string | null;
  listing_type: string | null;
  region: string | null;
  township: string | null;
  image_url: string | null;
}

export interface AiPropertySearchResult {
  count: number;
  properties: AiProperty[];
}

export interface AiChatRequest {
  message: string;
  session_id?: string;
}

export interface AiChatResponse {
  message: string;
  session_id: string;
  finish_reason?: string;
  tools?: AiToolResult[];
}

export interface AiChatApiResponse {
  success: boolean;
  message: string;
  data: AiChatResponse;
}

export interface AiMessageDisplay {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tools?: AiToolResult[];
}


