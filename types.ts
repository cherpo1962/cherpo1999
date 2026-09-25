export enum ArtStyle {
  Realistic = "Cinematic Realistic",
  Pixar = "Pixar 3D Animation",
  Disney = "Classic Disney 2D",
  Ghibli = "Studio Ghibli Anime",
  Anime = "Modern Anime",
  Cyberpunk = "Cyberpunk / Sci-Fi",
  Fantasy = "Fantasy Art / Oil Painting",
  Watercolor = "Watercolor Illustration",
  Noir = "Film Noir / Black & White",
  Claymation = "Claymation / Stop Motion"
}

export interface CharacterProfile {
  name: string;
  role: string;
  description: string;
  imagePrompt: string;
  age?: number | string;
  traits?: string;
  locked?: boolean;
}

export interface SceneDetail {
  sceneNumber: number;
  narrativeDescription: string;
  imagePrompt: string;
  cameraAngle: string;
  lighting: string;
  timeOfDay: string;
  visualStyle: string;
  characters: string[]; // List of character names present in this scene
  timestamp?: string; // e.g. "00:00–00:08"
  duration?: number; // Duration in seconds (e.g. 5, 8, 10)
  videoPrompt?: string; // AI Video Generation prompt (Runway Gen-3, Sora, Luma, Kling)
  voicePrompt?: string; // Dialogue / Voiceover / TTS prompt (ElevenLabs)
  transition?: string; // Scene transition note (e.g., 'Hard Cut', 'Fade to Black', 'Dissolve', 'Match Cut')
  directorNotes?: string; // Extra director's commentary or production notes
  tags?: string[]; // Custom director/scene tags like 'Flashback', 'Tension', 'Action', 'Climax'
}

export interface ProjectResult {
  globalCharacterLock?: string;
  characters: CharacterProfile[];
  scenes: SceneDetail[];
}

export interface GenerationRequest {
  story: string;
  sceneCount: number;
  style: ArtStyle;
  notes?: string;
  globalCharacterLock?: string;
}
