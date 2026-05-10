import Constants from 'expo-constants';

export const API_BASE_URL = 
  Constants.expoConfig?.extra?.apiBaseUrl || 
  process.env.API_BASE_URL || 
  'http://localhost:3000/api/v1';

export const API_TIMEOUT = 10000;

export const MOCK_API_DELAY = 800;

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
