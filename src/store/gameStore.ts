import { create } from 'zustand';
import { Evidence, InvestigationSession } from '@/lib/investigation';

interface GameState {
  // Session Architecture per ARCHITECTURE.md
  sessions: Record<string, InvestigationSession>;
  discoverEvidence: (
    missionId: string,
    evidenceItem: {
      id: string;
      title: string;
      description: string;
      category: string;
      explanation: string;
      metadata?: Record<string, unknown>;
    }
  ) => void;
  setSessionVerdict: (missionId: string, verdict: string) => void;
  setSessionConfidence: (missionId: string, confidence: number) => void;
  resetSession: (missionId: string) => void;

  preQuizScore: number | null;
  postQuizScore: number | null;
  completedLevels: number[];
  cumulativeScore: number;
  setPreQuizScore: (score: number) => void;
  setPostQuizScore: (score: number) => void;
  completeLevel: (levelId: number) => void;
  addCumulativeScore: (points: number) => void;
  resetCumulativeScore: () => void;
  resetGame: () => void;
  
  case001Score: number;
  addCase001Score: (points: number) => void;
  case002Score: number;
  addCase002Score: (points: number) => void;
  case003Score: number;
  addCase003Score: (points: number) => void;
  
  playedCase001Rounds: number[];
  markCase001RoundPlayed: (roundId: number) => void;
  playedCase002Rounds: string[];
  markCase002RoundPlayed: (roundId: string) => void;
  playedCase003Rounds: string[];
  markCase003RoundPlayed: (roundId: string) => void;

  // Level 1 specific state
  level1FoundArtifacts: string[];
  level1Verdict: string | null;
  level1Confidence: number | null;
  addLevel1Artifact: (artifactId: string) => void;
  setLevel1Verdict: (verdict: string) => void;
  setLevel1Confidence: (confidence: number) => void;
  resetLevel1: () => void;

  // Level 2 specific state
  level2FoundArtifacts: string[];
  level2Verdict: string | null;
  level2Confidence: number | null;
  addLevel2Artifact: (artifactId: string) => void;
  setLevel2Verdict: (verdict: string) => void;
  setLevel2Confidence: (confidence: number) => void;
  resetLevel2: () => void;

  // Level 3 specific state
  level3FoundArtifacts: string[];
  level3Verdict: string | null;
  level3Confidence: number | null;
  addLevel3Artifact: (artifactId: string) => void;
  setLevel3Verdict: (verdict: string) => void;
  setLevel3Confidence: (confidence: number) => void;
  resetLevel3: () => void;
}

const initialSessions = (): Record<string, InvestigationSession> => ({
  "case-001": { missionId: "case-001", evidence: {}, progress: 0, isCompleted: false, verdict: null, confidence: null },
  "case-002": { missionId: "case-002", evidence: {}, progress: 0, isCompleted: false, verdict: null, confidence: null },
  "case-003": { missionId: "case-003", evidence: {}, progress: 0, isCompleted: false, verdict: null, confidence: null },
  "level-1": { missionId: "level-1", evidence: {}, progress: 0, isCompleted: false, verdict: null, confidence: null },
  "level-2": { missionId: "level-2", evidence: {}, progress: 0, isCompleted: false, verdict: null, confidence: null },
  "level-3": { missionId: "level-3", evidence: {}, progress: 0, isCompleted: false, verdict: null, confidence: null },
});

export const useGameStore = create<GameState>((set) => ({
  sessions: initialSessions(),

  discoverEvidence: (missionId, evidenceItem) =>
    set((state) => {
      const session = state.sessions[missionId] || {
        missionId,
        evidence: {},
        progress: 0,
        isCompleted: false,
      };

      if (session.evidence[evidenceItem.id]) return state;

      const newEvidence: Evidence = {
        id: evidenceItem.id,
        missionId,
        title: evidenceItem.title,
        description: evidenceItem.description,
        category: evidenceItem.category,
        discovered: true,
        timestamp: Date.now(),
        explanation: evidenceItem.explanation,
        metadata: evidenceItem.metadata,
      };

      const updatedEvidence = {
        ...session.evidence,
        [evidenceItem.id]: newEvidence,
      };

      let totalTarget = 2;
      if (missionId.includes('1')) totalTarget = 2;
      else if (missionId.includes('2')) totalTarget = 2;
      else if (missionId.includes('3')) totalTarget = 2;

      const progress = Math.min(1, Object.keys(updatedEvidence).length / totalTarget);

      return {
        sessions: {
          ...state.sessions,
          [missionId]: {
            ...session,
            evidence: updatedEvidence,
            progress,
          },
        },
      };
    }),

  setSessionVerdict: (missionId, verdict) =>
    set((state) => {
      const session = state.sessions[missionId] || {
        missionId,
        evidence: {},
        progress: 0,
        isCompleted: false,
      };

      return {
        sessions: {
          ...state.sessions,
          [missionId]: {
            ...session,
            verdict,
          },
        },
      };
    }),

  setSessionConfidence: (missionId, confidence) =>
    set((state) => {
      const session = state.sessions[missionId] || {
        missionId,
        evidence: {},
        progress: 0,
        isCompleted: false,
      };

      return {
        sessions: {
          ...state.sessions,
          [missionId]: {
            ...session,
            confidence,
          },
        },
      };
    }),

  resetSession: (missionId) =>
    set((state) => {
      const defaults = initialSessions();
      return {
        sessions: {
          ...state.sessions,
          [missionId]: defaults[missionId] || { missionId, evidence: {}, progress: 0, isCompleted: false },
        },
      };
    }),

  preQuizScore: null,
  postQuizScore: null,
  completedLevels: [],
  cumulativeScore: 0,
  setPreQuizScore: (score) => set({ preQuizScore: score }),
  setPostQuizScore: (score) => set({ postQuizScore: score }),
  completeLevel: (levelId) =>
    set((state) => ({
      completedLevels: state.completedLevels.includes(levelId)
        ? state.completedLevels
        : [...state.completedLevels, levelId],
    })),
  addCumulativeScore: (points) =>
    set((state) => ({ cumulativeScore: state.cumulativeScore + points })),
  resetCumulativeScore: () => set({ cumulativeScore: 0 }),
  
  case001Score: 0,
  addCase001Score: (points) =>
    set((state) => ({ case001Score: state.case001Score + points })),
  case002Score: 0,
  addCase002Score: (points) =>
    set((state) => ({ case002Score: state.case002Score + points })),
  case003Score: 0,
  addCase003Score: (points) =>
    set((state) => ({ case003Score: state.case003Score + points })),
  
  playedCase001Rounds: [],
  markCase001RoundPlayed: (roundId) => 
    set((state) => {
      if (state.playedCase001Rounds.includes(roundId)) return state;
      return { playedCase001Rounds: [...state.playedCase001Rounds, roundId] };
    }),
    
  playedCase002Rounds: [],
  markCase002RoundPlayed: (roundId) => 
    set((state) => {
      if (state.playedCase002Rounds.includes(roundId)) return state;
      return { playedCase002Rounds: [...state.playedCase002Rounds, roundId] };
    }),
    
  playedCase003Rounds: [],
  markCase003RoundPlayed: (roundId) => 
    set((state) => {
      if (state.playedCase003Rounds.includes(roundId)) return state;
      return { playedCase003Rounds: [...state.playedCase003Rounds, roundId] };
    }),
    
  resetGame: () =>
    set({
      preQuizScore: null,
      postQuizScore: null,
      completedLevels: [],
      cumulativeScore: 0,
      case001Score: 0,
      case002Score: 0,
      case003Score: 0,
      level1FoundArtifacts: [],
      level1Verdict: null,
      level1Confidence: null,
      level2FoundArtifacts: [],
      level2Verdict: null,
      level2Confidence: null,
      level3FoundArtifacts: [],
      level3Verdict: null,
      level3Confidence: null,
      playedCase001Rounds: [],
      playedCase002Rounds: [],
      playedCase003Rounds: [],
      sessions: initialSessions(),
    }),

  // Level 1 state initialization
  level1FoundArtifacts: [],
  level1Verdict: null,
  level1Confidence: null,
  addLevel1Artifact: (artifactId) =>
    set((state) => {
      const updated = state.level1FoundArtifacts.includes(artifactId)
        ? state.level1FoundArtifacts
        : [...state.level1FoundArtifacts, artifactId];
      return { level1FoundArtifacts: updated };
    }),
  setLevel1Verdict: (verdict) => set({ level1Verdict: verdict }),
  setLevel1Confidence: (confidence) => set({ level1Confidence: confidence }),

  resetLevel1: () =>
    set({ level1FoundArtifacts: [], level1Verdict: null, level1Confidence: null }),

  // Level 2 state initialization
  level2FoundArtifacts: [],
  level2Verdict: null,
  level2Confidence: null,
  addLevel2Artifact: (artifactId) =>
    set((state) => {
      const updated = state.level2FoundArtifacts.includes(artifactId)
        ? state.level2FoundArtifacts
        : [...state.level2FoundArtifacts, artifactId];
      return { level2FoundArtifacts: updated };
    }),
  setLevel2Verdict: (verdict) => set({ level2Verdict: verdict }),
  setLevel2Confidence: (confidence) => set({ level2Confidence: confidence }),
  resetLevel2: () =>
    set({ level2FoundArtifacts: [], level2Verdict: null, level2Confidence: null }),

  // Level 3 state initialization
  level3FoundArtifacts: [],
  level3Verdict: null,
  level3Confidence: null,
  addLevel3Artifact: (artifactId) =>
    set((state) => {
      const updated = state.level3FoundArtifacts.includes(artifactId)
        ? state.level3FoundArtifacts
        : [...state.level3FoundArtifacts, artifactId];
      return { level3FoundArtifacts: updated };
    }),
  setLevel3Verdict: (verdict) => set({ level3Verdict: verdict }),
  setLevel3Confidence: (confidence) => set({ level3Confidence: confidence }),
  resetLevel3: () =>
    set({ level3FoundArtifacts: [], level3Verdict: null, level3Confidence: null }),
}));
