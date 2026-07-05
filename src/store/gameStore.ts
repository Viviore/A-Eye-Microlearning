import { create } from 'zustand';

interface GameState {
  preQuizScore: number | null;
  postQuizScore: number | null;
  completedLevels: number[];
  setPreQuizScore: (score: number) => void;
  setPostQuizScore: (score: number) => void;
  completeLevel: (levelId: number) => void;
  resetGame: () => void;

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

export const useGameStore = create<GameState>((set) => ({
  preQuizScore: 0,
  postQuizScore: 0,
  completedLevels: [],
  setPreQuizScore: (score) => set({ preQuizScore: score }),
  setPostQuizScore: (score) => set({ postQuizScore: score }),
  completeLevel: (levelId) =>
    set((state) => ({
      completedLevels: state.completedLevels.includes(levelId)
        ? state.completedLevels
        : [...state.completedLevels, levelId],
    })),
  resetGame: () => set({ 
    preQuizScore: null, 
    postQuizScore: null, 
    completedLevels: [],
    level1FoundArtifacts: [],
    level1Verdict: null,
    level1Confidence: null,
  }),

  // Level 1 state initialization
  level1FoundArtifacts: [],
  level1Verdict: null,
  level1Confidence: null,
  addLevel1Artifact: (artifactId) => 
    set((state) => {
      if (!state.level1FoundArtifacts.includes(artifactId)) {
        return { level1FoundArtifacts: [...state.level1FoundArtifacts, artifactId] };
      }
      return state;
    }),
  setLevel1Verdict: (verdict) => set({ level1Verdict: verdict }),
  setLevel1Confidence: (confidence) => set({ level1Confidence: confidence }),

  resetLevel1: () => set({ level1FoundArtifacts: [], level1Verdict: null, level1Confidence: null }),
  
  // Level 2 state initialization
  level2FoundArtifacts: [],
  level2Verdict: null,
  level2Confidence: null,
  addLevel2Artifact: (artifactId) => 
    set((state) => {
      if (!state.level2FoundArtifacts.includes(artifactId)) {
        return { level2FoundArtifacts: [...state.level2FoundArtifacts, artifactId] };
      }
      return state;
    }),
  setLevel2Verdict: (verdict) => set({ level2Verdict: verdict }),
  setLevel2Confidence: (confidence) => set({ level2Confidence: confidence }),
  resetLevel2: () => set({ level2FoundArtifacts: [], level2Verdict: null, level2Confidence: null }),

  // Level 3 state initialization
  level3FoundArtifacts: [],
  level3Verdict: null,
  level3Confidence: null,
  addLevel3Artifact: (artifactId) => 
    set((state) => {
      if (!state.level3FoundArtifacts.includes(artifactId)) {
        return { level3FoundArtifacts: [...state.level3FoundArtifacts, artifactId] };
      }
      return state;
    }),
  setLevel3Verdict: (verdict) => set({ level3Verdict: verdict }),
  setLevel3Confidence: (confidence) => set({ level3Confidence: confidence }),
  resetLevel3: () => set({ level3FoundArtifacts: [], level3Verdict: null, level3Confidence: null }),
}));
