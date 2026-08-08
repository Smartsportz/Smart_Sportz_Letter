export type LetterMethod = 'from_to_sub_body' | 'dear_body';

export interface LetterheadConfig {
  id: string;
  name: string;
  companyName: string;
  tagline: string;
  logoUrl?: string; // custom image or default crest
  website: string;
  email: string;
  phone: string;
  address: string;
  primaryColor: string;
  accentColor: string;
  hasGeometricHeader: boolean;
  hasWatermark: boolean;
  signatoryTitle: string;
  signatoryCompany: string;
  signatoryName?: string;
  signatureUrl?: string;
}

export interface Method1Data {
  title: string;
  date: string;
  refNo: string;
  from: string;
  to: string;
  subject: string;
  body: string;
}

export interface Method2Data {
  title: string;
  date: string;
  refNo: string;
  dear: string;
  body: string;
}

export interface LetterState {
  method: LetterMethod;
  letterhead: LetterheadConfig;
  method1: Method1Data;
  method2: Method2Data;
  closingSalutation: string;
  showWatermark: boolean;
  showSignatureLine: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

export interface PresetSample {
  id: string;
  name: string;
  category: string;
  method: LetterMethod;
  method1?: Partial<Method1Data>;
  method2?: Partial<Method2Data>;
}
