export interface Evidence {
  id: string;
  missionId: string;
  title: string;
  description: string;
  category: string;
  discovered: boolean;
  timestamp: number;
  explanation: string;
  metadata?: Record<string, any>;
}

export interface InvestigationSession {
  missionId: string;
  evidence: Record<string, Evidence>;
  progress: number;
  isCompleted: boolean;
  verdict?: string | null;
  confidence?: number | null;
}

export type MILVerdict =
  | 'Credible'
  | 'Needs Verification'
  | 'Misleading'
  | 'Insufficient Evidence';
