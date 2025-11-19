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

export interface AiFaq {
  id: number;
  slug: string;
  question_en: string;
  question_mm: string;
  answer_en: string;
  answer_mm: string;
}

export interface AiFaqSearchResult {
  count: number;
  faqs: AiFaq[];
}

export interface AiLawer {
  id: number;
  slug: string;
  name: string;
  title: string | null;
  specialization: string | null;
  experience_years: number | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  about: string | null;
  services: string[] | null;
  skillful_languages: string[] | null;
  region: string | null;
  township: string | null;
}

export interface AiLegalSearchResult {
  count: number;
  lawers: AiLawer[];
}

export interface AiCompany {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  phone: string | null;
  business_address: string | null;
  services: string[] | null;
  specializations: string[] | null;
  company_type: string | null;
  region: string | null;
  township: string | null;
  view_count: number | null;
  contact_count: number | null;
}

export interface AiCompanySearchResult {
  count: number;
  companies: AiCompany[];
}

export interface AiContactInformation {
  company_name?: string;
  primary_phone?: string;
  secondary_phone?: string;
  primary_email?: string;
  support_email?: string;
  address?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
}

export interface AiContactInformationResult {
  contact_information: AiContactInformation;
}

export interface AiEvent {
  id: number;
  slug: string;
  name_en: string;
  name_mm: string;
  description: string | null;
  date: string | null;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  is_free: boolean;
  price: number | null;
  need_registration: boolean;
  is_online: boolean;
  host_contact_number: string | null;
  registration_link: string | null;
  category: string | null;
  region: string | null;
  township: string | null;
}

export interface AiEventSearchResult {
  count: number;
  events: AiEvent[];
}

export interface AiAdvertisement {
  id: number;
  title_en: string;
  title_mm: string;
  description: string | null;
  address: string | null;
  contact_name: string | null;
  phone_numbers: string[] | null;
  email: string | null;
  is_featured: boolean;
  region: string | null;
  township: string | null;
  published_at: string | null;
}

export interface AiAdvertisementSearchResult {
  count: number;
  advertisements: AiAdvertisement[];
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

export interface AiHistoryMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  tools?: AiToolResult[];
}

export interface AiHistoryResponse {
  session_id: string;
  messages: AiHistoryMessage[];
}

export interface AiHistoryApiResponse {
  success: boolean;
  message: string;
  data: AiHistoryResponse;
}

export interface AiMessageDisplay {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tools?: AiToolResult[];
  isWelcome?: boolean;
}


