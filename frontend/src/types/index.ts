export interface DiagnosisItem {
  rank: number;
  diagnosis: string;
  icd10_code: string;
  explanation: string;
}

export interface DiagnosisResponse {
  diagnoses: DiagnosisItem[];
}

export interface DiagnosisAnalytics {
  specialists: string[];
  procedures: string[];
  medications: string[];
}
