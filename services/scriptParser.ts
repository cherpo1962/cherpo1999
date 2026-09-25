import { CharacterProfile, SceneDetail, ProjectResult } from '../types';

export function parseDirectorScript(text: string): ProjectResult | null {
  if (!text || typeof text !== 'string') return null;

  // Check if text contains scene markers like "SCENE 01" or "SCENE 1"
  const sceneRegex = /SCENE\s+(\d+)[\s—\-:]+([0-9:]+[–\-][0-9:]+)?[:\s]*(?:VIDEO\s*PROMPT[:\s]*)?([\s\S]*?)(?=(?:SCENE\s+\d+|$))/gi;
  
  const scenes: SceneDetail[] = [];
  const knownCharactersMap: Record<string, string[]> = {
    'Emma': ['35-year-old realistic American woman, shoulder-length dark brown hair, expressive hazel eyes', 'Mother & Protagonist'],
    'Lily': ['8-year-old small girl with long dark brown hair, innocent expressive eyes', 'Daughter'],
    'Daniel': ['38-year-old identical twin brother, short dark hair, light stubble', 'Missing Husband / Twin'],
    'Michael': ['38-year-old identical twin brother to Daniel, short dark hair, light stubble', 'Identical Twin Brother']
  };

  let globalLock = '';
  const globalLockMatch = text.match(/GLOBAL\s*CHARACTER\s*LOCK[^\n:]*[:—\-]\s*([\s\S]*?)(?=\n\s*\n|\n\s*SCENE|\n\s*\*\*SCENE|SCENE\s+\d+)/i);
  if (globalLockMatch) {
    globalLock = globalLockMatch[1].trim();
  }

  let match: RegExpExecArray | null;
  while ((match = sceneRegex.exec(text)) !== null) {
    const sceneNum = parseInt(match[1], 10);
    const timestamp = (match[2] || '').trim();
    const body = (match[3] || '').trim();

    // Check for VIDEO PROMPT and VOICE PROMPT
    let videoPrompt = '';
    let voicePrompt = '';
    let narrative = '';

    const voicePromptMatch = body.match(/VOICE\s*PROMPT[:\s]*([\s\S]*)$/i);
    if (voicePromptMatch) {
      voicePrompt = voicePromptMatch[1].trim();
      const beforeVoice = body.slice(0, voicePromptMatch.index).trim();
      
      const videoMatch = beforeVoice.match(/^(?:VIDEO\s*PROMPT[:\s]*)?([\s\S]*)$/i);
      videoPrompt = videoMatch ? videoMatch[1].replace(/;\s*$/, '').trim() : beforeVoice;
    } else {
      const videoMatch = body.match(/VIDEO\s*PROMPT[:\s]*([\s\S]*)$/i);
      if (videoMatch) {
        videoPrompt = videoMatch[1].trim();
      } else {
        videoPrompt = body;
      }
    }

    narrative = videoPrompt.split(',')[0] || videoPrompt;

    // Detect characters in video prompt or voice prompt
    const detectedChars: string[] = [];
    ['Emma', 'Lily', 'Daniel', 'Michael'].forEach(c => {
      if (new RegExp(`\\b${c}\\b`, 'i').test(body)) {
        detectedChars.push(c);
      }
    });

    // Derive camera angle
    let cameraAngle = 'Cinematic push-in, shallow depth of field';
    const cameraMatch = videoPrompt.match(/\b(slow push-in camera|extreme close-up|handheld cinematic camera|camera tracks|whip-pans|overhead camera|macro cinematic focus|lateral camera|passenger seat|slow dramatic reveal|shot\/reverse-shot|orbit|flashback montage|two-shot|slow dolly|dramatic camera orbit|creeping camera)\b/i);
    if (cameraMatch) {
      cameraAngle = cameraMatch[1];
    }

    // Derive lighting & time of day
    let timeOfDay = 'Cinematic';
    let lighting = 'Moody warm-neutral cinematic lighting';
    if (/sunset/i.test(videoPrompt)) {
      timeOfDay = 'Sunset';
      lighting = 'Natural golden hour sunset lighting';
    } else if (/night/i.test(videoPrompt) || /bedroom/i.test(videoPrompt)) {
      timeOfDay = 'Night';
      lighting = 'Warm bedside lamp, low-key interior shadows';
    } else if (/morning/i.test(videoPrompt)) {
      timeOfDay = 'Morning';
      lighting = 'Overcast morning daylight';
    } else if (/flashback/i.test(videoPrompt)) {
      timeOfDay = 'Night (Flashback 7 Years Ago)';
      lighting = 'Desaturated high-contrast cool noir lighting';
    } else if (/flickering/i.test(videoPrompt)) {
      timeOfDay = 'Daytime';
      lighting = 'Flickering corridor fluorescent lighting, eerie shadows';
    } else if (/dusk/i.test(videoPrompt)) {
      timeOfDay = 'Dusk';
      lighting = 'Ambient twilight with streetlights';
    }

    // Derive transition
    let transition = 'Hard Cut';
    const transitionMatch = body.match(/TRANSITION[:\s]*([^\n;]+)/i);
    if (transitionMatch) {
      transition = transitionMatch[1].trim();
    } else if (/cutting to black|cut to black|cuts to black/i.test(body)) {
      transition = 'Hard cut to black (Climax)';
    } else if (/whip-pan/i.test(body)) {
      transition = 'Whip-pan transition';
    } else if (/flashback/i.test(body)) {
      transition = 'Dissolve into flashback';
    } else if (/rack focus/i.test(body)) {
      transition = 'Rack focus match cut';
    } else if (/door slowly opens/i.test(body)) {
      transition = 'Slow push cut to black';
    }

    // Derive duration
    let duration = 8;
    if (timestamp) {
      const parts = timestamp.split(/[–\-]/);
      if (parts.length === 2) {
        const toSeconds = (s: string) => {
          const m = s.trim().split(':');
          if (m.length === 2) {
            return parseInt(m[0], 10) * 60 + parseInt(m[1], 10);
          }
          return 0;
        };
        const diff = toSeconds(parts[1]) - toSeconds(parts[0]);
        if (diff > 0) duration = diff;
      }
    }

    // Derive director notes
    let directorNotes: string | undefined;
    const notesMatch = body.match(/(?:DIRECTOR\s*NOTES?|NOTES?|PRODUCTION\s*NOTES?)[:\s]*([^\n;]+)/i);
    if (notesMatch) {
      directorNotes = notesMatch[1].trim();
    }

    // Derive tags
    let tags: string[] = [];
    const tagsMatch = body.match(/(?:SCENE\s*TAGS?|TAGS?)[:\s]*([^\n;]+)/i);
    if (tagsMatch) {
      tags = tagsMatch[1].split(/[,|]/).map(t => t.trim().replace(/^#/, '')).filter(Boolean);
    } else {
      // Auto-derive common dramatic tags
      if (/flashback|memory|remember/i.test(body)) tags.push('Flashback');
      if (/tension|fear|terrified|shock|whisper/i.test(body)) tags.push('Tension');
      if (/rushes|accelerates|running|car|screech/i.test(body)) tags.push('Action');
      if (/climax|finally found/i.test(body)) tags.push('Climax');
      if (/voice|dialogue|says|whispers|asks/i.test(body)) tags.push('Dialogue');
      if (tags.length === 0) tags.push('Drama');
    }

    const imagePrompt = `16:9 cinematic shot. ${videoPrompt}. Natural skin texture, photorealistic, subtle film grain, moody warm-neutral color grading, shallow depth of field, realistic environments, no text, no subtitles.`;

    scenes.push({
      sceneNumber: sceneNum,
      timestamp: timestamp || undefined,
      duration,
      narrativeDescription: narrative,
      videoPrompt: videoPrompt || body,
      voicePrompt: voicePrompt || undefined,
      imagePrompt,
      cameraAngle,
      lighting,
      timeOfDay,
      visualStyle: 'Premium cinematic human drama, photorealistic, 16:9',
      transition,
      directorNotes,
      tags,
      characters: detectedChars.length > 0 ? detectedChars : ['Emma']
    });
  }

  if (scenes.length === 0) return null;

  // Sort scenes by number
  scenes.sort((a, b) => a.sceneNumber - b.sceneNumber);

  // Generate character profiles for detected characters
  const activeCharNames = new Set<string>();
  scenes.forEach(s => s.characters.forEach(c => activeCharNames.add(c)));
  if (globalLock) {
    ['Emma', 'Lily', 'Daniel', 'Michael'].forEach(c => activeCharNames.add(c));
  }

  const characters: CharacterProfile[] = Array.from(activeCharNames).map(name => {
    const info = knownCharactersMap[name] || [`Character in the narrative`, 'Cast'];
    return {
      name,
      role: info[1],
      description: info[0],
      locked: true,
      imagePrompt: `Photorealistic cinematic portrait of ${name}, ${info[0]}, natural skin texture, expressive eyes, subtle film grain, moody warm-neutral color grading, shallow depth of field, 16:9, no text.`
    };
  });

  return {
    globalCharacterLock: globalLock,
    characters,
    scenes
  };
}
