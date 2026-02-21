/**
 * Backend API for diagnose and diagnose/details.
 * Base URL: VITE_API_BASE or /api (proxied to backend in dev).
 */
import type { DiagnosisResponse } from '../types';

const API_BASE = (import.meta as unknown as { env: { VITE_API_BASE?: string } }).env?.VITE_API_BASE ?? '/api';

export interface DetailsSection {
  title: string;
  items: string[];
}

export interface DiagnoseDetailsResponse {
  sections: DetailsSection[];
}

async function request<T>(path: string, body: object): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

/** Get top 3 diagnoses for the given symptoms. */
export function diagnose(symptoms: string): Promise<DiagnosisResponse> {
  return request<DiagnosisResponse>('/diagnose', { symptoms });
}

/** Get detailed sections (doctors, procedures, recommendations, symptoms) for the 1st ranked diagnosis by ICD-10. */
export function diagnoseDetails(symptoms: string, icd10_code: string): Promise<DiagnoseDetailsResponse> {
  return request<DiagnoseDetailsResponse>('/diagnose/details', { symptoms, icd10_code });
}
