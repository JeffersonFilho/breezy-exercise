export type SectionStatus = 'complete' | 'todo';

export interface ProfileSection {
  id: string;
  title: string;
  subtitle?: string;
  status: SectionStatus;
  iconName: string;
  photoUri?: string;
  data?: Record<string, unknown>;
}

export interface ProfileResponse {
  sections: ProfileSection[];
  completionPercentage: number;
  updatedAt: string;
}

export interface ProfileUpdateRequest {
  status: 'complete';
  data?: Record<string, unknown>;
}

export interface ProgressUpdate {
  completionPercentage: number;
  updatedAt: string;
}
