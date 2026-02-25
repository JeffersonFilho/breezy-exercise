import { Platform } from 'react-native';

const HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
const BASE_URL = `http://${HOST}:3000/api`;

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new ApiError(res.status, body.error ?? 'Unknown error');
  }
  return res.json();
}

export interface ProfileSection {
  id: string;
  title: string;
  subtitle?: string;
  status: 'todo' | 'complete';
  iconName: string;
  photoUri?: string;
  data?: Record<string, unknown>;
}

export interface ProfileResponse {
  sections: ProfileSection[];
  completionPercentage: number;
  updatedAt: string;
}

export async function fetchProfile(signal?: AbortSignal): Promise<ProfileResponse> {
  const res = await fetch(`${BASE_URL}/profile`, { signal });
  return handleResponse<ProfileResponse>(res);
}

export async function updateSection(
  sectionId: string,
  status: string,
  data?: Record<string, unknown>,
  signal?: AbortSignal,
): Promise<ProfileSection> {
  const res = await fetch(`${BASE_URL}/profile/sections/${sectionId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, data }),
    signal,
  });
  return handleResponse<ProfileSection>(res);
}

export interface ProgressUpdate {
  completionPercentage: number;
  updatedAt: string;
}

export async function fetchProgress(signal?: AbortSignal): Promise<ProgressUpdate> {
  const res = await fetch(`${BASE_URL}/profile/progress`, { signal });
  return handleResponse<ProgressUpdate>(res);
}

export async function uploadPhoto(
  photoUri: string,
  signal?: AbortSignal,
): Promise<{ photoUri: string }> {
  const res = await fetch(`${BASE_URL}/profile/photo`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ photoUri }),
    signal,
  });
  return handleResponse<{ photoUri: string }>(res);
}
