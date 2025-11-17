/**
 * Statistics Types
 * 
 * TypeScript interfaces for statistics API responses.
 */

export interface StatisticsCounts {
  all_properties_count: number;
  premium_properties_count: number;
  wanted_listings_count: number;
  advertisements_count: number;
  housing_events_count: number;
  installment_properties_count: number;
  lawyers_count: number;
  tan_tan_tan_properties_count: number;
  cities_covered_count: number;
  years_of_experience: number;
}

export interface StatisticsCountsResponse {
  success: boolean;
  message: string;
  data: StatisticsCounts;
}

