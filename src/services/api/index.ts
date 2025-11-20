/**
 * API Endpoints Index
 * 
 * Centralized exports for all API endpoints.
 */

// ============================================================================
// BASE API CLIENT
// ============================================================================

export { apiClient, api, handleApiError, isNetworkError, isTimeoutError } from './client';

// ============================================================================
// API ENDPOINTS
// ============================================================================

export { propertyApi } from './properties';
export { publicPropertyApi } from './publicProperties';
export { authApi } from './auth';
export { knowledgeApi } from './knowledge';
export { legacyApi } from './legacy';
export { faqApi } from './faq';
export { contactApi } from './contact';
export { newsApi } from './news';
export { companiesApi } from './companies';
export { companyTypesApi } from './companyTypes';
export { wantingListApi } from './wantingList';
export { loanRequestApi } from './loanRequest';
export { aiAssistantApi } from './aiAssistant';
export { notificationApi } from './notifications';
export { statisticsApi } from './statistics';
export { homeApi } from './home';
export { pointApi } from './points';
