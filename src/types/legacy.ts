export interface LegacyTeamMember {
  id: number;
  name: string;
  slug: string;
  title: string;
  experience_years: number;
  specialization: string;
  education: string[];
  profile_image: string;
}

export interface LegacyTeamResponse {
  success: boolean;
  message: string;
  data: LegacyTeamMember[];
}

export interface LegacyTeamDetail {
  id: number;
  name: string;
  title: string;
  slug: string;
  region: {
    name_mm: string;
    name_en: string;
  };
  township: {
    name_mm: string;
    name_en: string;
  };
  experience_years: number;
  phone: string;
  email: string | null;
  specialization: string;
  skillful_languages: string[];
  services: string[];
  about: string;
  education: string[];
  certifications: string[];
  profile_image: string;
}

export interface LegacyTeamDetailResponse {
  success: boolean;
  message: string;
  data: LegacyTeamDetail;
}
