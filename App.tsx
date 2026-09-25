import React, { useState, useRef, useMemo } from 'react';
import { ArtStyle, SceneDetail, CharacterProfile } from './types';
import { generateScenes, regenerateSinglePrompt } from './services/geminiService';
import { parseDirectorScript } from './services/scriptParser';
import { 
  PRESET_SCENES, 
  PRESET_CHARACTERS, 
  PRESET_STORY_TEXT, 
  GLOBAL_CHARACTER_LOCK_PRESET 
} from './data/presetScreenplay';
import { StyleSelector } from './components/StyleSelector';
import { SceneCard } from './components/SceneCard';
import { CharacterCard } from './components/CharacterCard';
import { PacingChart } from './components/PacingChart';
import { 
  Sparkles, Film, PenTool, AlertCircle, Loader2, Download, Upload, Users, 
  Lock, Copy, Check, Video, Mic, FileText, RefreshCcw, Search, SlidersHorizontal,
  ChevronDown, ChevronUp, GripVertical, ArrowUpDown, Clock, Timer, Tag, Hash, X
} from 'lucide-react';

const App: React.FC = () => {
  // State initialized with the 23-scene drama project
  const [story, setStory] = useState(PRESET_STORY_TEXT);
  const [sceneCount, setSceneCount] = useState<number | ''>(23);
  const [style, setStyle] = useState<ArtStyle>(ArtStyle.Realistic);
  const [notes, setNotes] = useState('16:9 aspect ratio, subtle film grain, natural skin texture, moody warm-neutral tone, shallow depth of field.');
  const [characterLock, setCharacterLock] = useState(GLOBAL_CHARACTER_LOCK_PRESET);
  
  const [scenes, setScenes] = useState<SceneDetail[]>(PRESET_SCENES);
  const [characters, setCharacters] = useState<CharacterProfile[]>(PRESET_CHARACTERS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search
  const [selectedCharacterFilter, setSelectedCharacterFilter] = useState<string>('ALL');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // UI states
  const [showLockDetails, setShowLockDetails] = useState(true);
  const [copiedBatch, setCopiedBatch] = useState<string | null>(null);
  const [copiedLock, setCopiedLock] = useState(false);

  // Drag and Drop & Reorder State
  const [draggedSceneNumber, setDraggedSceneNumber] = useState<number | null>(null);
  const [dragOverSceneNumber, setDragOverSceneNumber] = useState<number | null>(null);
  const [autoRenumber, setAutoRenumber] = useState<boolean>(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if current story looks like a pre-formatted director script with scenes
  const isScriptFormatted = useMemo(() => {
    return /SCENE\s+\d+/i.test(story) && /VIDEO\s*PROMPT/i.test(story);
  }, [story]);

  // Handle instant script parsing (No API wait required for pre-formatted screenplay)
  const handleParseScript = () => {
    const result = parseDirectorScript(story);
    if (result && result.scenes.length > 0) {
      setScenes(result.scenes);
      setCharacters(result.characters);
      if (result.globalCharacterLock) {
        setCharacterLock(result.globalCharacterLock);
      }
      setSceneCount(result.scenes.length);
      setError(null);
    } else {
      setError("Could not parse scenes from the text. Make sure it contains 'SCENE 01 ... VIDEO PROMPT:' format.");
    }
  };

  const handleGenerate = async () => {
    if (!story.trim()) return;

    setLoading(true);
    setError(null);

    // Fallback to 3 if the input is empty or invalid
    const countToGenerate = typeof sceneCount === 'number' ? sceneCount : 3;

    try {
      const result = await generateScenes(story, countToGenerate, style, notes, characterLock);
      setScenes(result.scenes);
      setCharacters(result.characters);
      if (result.globalCharacterLock) {
        setCharacterLock(result.globalCharacterLock);
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate scenes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegeneratePrompt = async (sceneNumber: number) => {
    const scene = scenes.find(s => s.sceneNumber === sceneNumber);
    if (!scene) return;

    try {
      setError(null);
      const newPrompt = await regenerateSinglePrompt(
        scene.narrativeDescription,
        scene.visualStyle,
        scene.timeOfDay,
        scene.lighting,
        notes
      );

      setScenes(prev => prev.map(s => s.sceneNumber === sceneNumber ? { ...s, imagePrompt: newPrompt } : s));
    } catch (err: any) {
      console.error("Failed to regenerate prompt", err);
      setError(err.message || "Failed to regenerate prompt. Please try again.");
    }
  };

  const handleUpdatePrompt = (sceneNumber: number, newPrompt: string) => {
    setScenes(prev => prev.map(s => s.sceneNumber === sceneNumber ? { ...s, imagePrompt: newPrompt } : s));
  };

  const handleUpdateVideoPrompt = (sceneNumber: number, newVideoPrompt: string) => {
    setScenes(prev => prev.map(s => s.sceneNumber === sceneNumber ? { ...s, videoPrompt: newVideoPrompt } : s));
  };

  const handleUpdateVoicePrompt = (sceneNumber: number, newVoicePrompt: string) => {
    setScenes(prev => prev.map(s => s.sceneNumber === sceneNumber ? { ...s, voicePrompt: newVoicePrompt } : s));
  };

  const handleUpdateTransition = (sceneNumber: number, newTransition: string) => {
    setScenes(prev => prev.map(s => s.sceneNumber === sceneNumber ? { ...s, transition: newTransition } : s));
  };

  const handleUpdateDuration = (sceneNumber: number, newDuration: number) => {
    setScenes(prev => prev.map(s => s.sceneNumber === sceneNumber ? { ...s, duration: newDuration } : s));
  };

  const handleUpdateSceneNotes = (sceneNumber: number, newNotes: string) => {
    setScenes(prev => prev.map(s => s.sceneNumber === sceneNumber ? { ...s, directorNotes: newNotes } : s));
  };

  const handleUpdateSceneTags = (sceneNumber: number, newTags: string[]) => {
    setScenes(prev => prev.map(s => s.sceneNumber === sceneNumber ? { ...s, tags: newTags } : s));
  };

  // Compute all unique tags available across scenes with counts
  const allAvailableTags = useMemo(() => {
    const tagCounts: Record<string, number> = {};
    scenes.forEach(s => {
      if (s.tags) {
        s.tags.forEach(t => {
          tagCounts[t] = (tagCounts[t] || 0) + 1;
        });
      }
    });
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }, [scenes]);

  // Total Estimated Runtime calculation
  const totalEstimatedSeconds = useMemo(() => {
    return scenes.reduce((acc, scene) => acc + (scene.duration || 8), 0);
  }, [scenes]);

  const formattedTotalRuntime = useMemo(() => {
    const mins = Math.floor(totalEstimatedSeconds / 60);
    const secs = totalEstimatedSeconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  }, [totalEstimatedSeconds]);

  const handleScrollToScene = (sceneNumber: number) => {
    const el = document.getElementById(`scene-card-container-${sceneNumber}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-2', 'ring-amber-400', 'rounded-2xl', 'transition-all');
      setTimeout(() => {
        el.classList.remove('ring-2', 'ring-amber-400');
      }, 2200);
    }
  };

  // Reorder Scenes Logic
  const handleReorderScenes = (sourceSceneNumber: number, targetSceneNumber: number) => {
    if (sourceSceneNumber === targetSceneNumber) return;

    setScenes(prevScenes => {
      const sourceIndex = prevScenes.findIndex(s => s.sceneNumber === sourceSceneNumber);
      const targetIndex = prevScenes.findIndex(s => s.sceneNumber === targetSceneNumber);
      if (sourceIndex === -1 || targetIndex === -1) return prevScenes;

      const newScenes = [...prevScenes];
      const [movedScene] = newScenes.splice(sourceIndex, 1);
      newScenes.splice(targetIndex, 0, movedScene);

      if (autoRenumber) {
        return newScenes.map((s, idx) => ({
          ...s,
          sceneNumber: idx + 1
        }));
      }
      return newScenes;
    });
  };

  const handleManualRenumber = () => {
    setScenes(prev => prev.map((s, idx) => ({
      ...s,
      sceneNumber: idx + 1
    })));
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, sceneNumber: number) => {
    setDraggedSceneNumber(sceneNumber);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', sceneNumber.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, sceneNumber: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverSceneNumber !== sceneNumber) {
      setDragOverSceneNumber(sceneNumber);
    }
  };

  const handleDragLeave = () => {
    // Keep clean
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetSceneNumber: number) => {
    e.preventDefault();
    if (draggedSceneNumber !== null && draggedSceneNumber !== targetSceneNumber) {
      handleReorderScenes(draggedSceneNumber, targetSceneNumber);
    }
    setDraggedSceneNumber(null);
    setDragOverSceneNumber(null);
  };

  const handleDragEnd = () => {
    setDraggedSceneNumber(null);
    setDragOverSceneNumber(null);
  };

  const handleMoveSceneByIndex = (currentIndexInFiltered: number, direction: 'up' | 'down') => {
    const targetIndexInFiltered = direction === 'up' ? currentIndexInFiltered - 1 : currentIndexInFiltered + 1;
    if (targetIndexInFiltered < 0 || targetIndexInFiltered >= filteredScenes.length) return;

    const sourceScene = filteredScenes[currentIndexInFiltered];
    const targetScene = filteredScenes[targetIndexInFiltered];
    if (sourceScene && targetScene) {
      handleReorderScenes(sourceScene.sceneNumber, targetScene.sceneNumber);
    }
  };

  // Copy batch actions
  const handleCopyAllVideoPrompts = () => {
    const text = scenes
      .map(s => `SCENE ${s.sceneNumber < 10 ? '0' + s.sceneNumber : s.sceneNumber} (${s.timestamp || '00:08'}):\n${s.videoPrompt || s.imagePrompt}`)
      .join('\n\n');
    navigator.clipboard.writeText(text);
    setCopiedBatch('video');
    setTimeout(() => setCopiedBatch(null), 2500);
  };

  const handleCopyAllVoicePrompts = () => {
    const text = scenes
      .filter(s => s.voicePrompt)
      .map(s => `SCENE ${s.sceneNumber < 10 ? '0' + s.sceneNumber : s.sceneNumber} (${s.timestamp || '00:08'}):\n${s.voicePrompt}`)
      .join('\n\n');
    navigator.clipboard.writeText(text);
    setCopiedBatch('voice');
    setTimeout(() => setCopiedBatch(null), 2500);
  };

  const handleExportMarkdown = () => {
    const lines = [
      `# Story-to-Scene Screenplay & Director Breakdown`,
      `**Generated on:** ${new Date().toLocaleDateString()}`,
      `**Total Scenes:** ${scenes.length}`,
      `**Total Estimated Runtime:** ${formattedTotalRuntime}`,
      ``,
      `## Global Character Lock`,
      characterLock,
      ``,
      `## Cast of Characters`,
      ...characters.map(c => `### ${c.name} (${c.role})\n- **Description:** ${c.description}\n- **Prompt:** \`${c.imagePrompt}\`\n`),
      `## Scenes Breakdown`,
      ...scenes.map(s => [
        `### SCENE ${s.sceneNumber < 10 ? '0' + s.sceneNumber : s.sceneNumber} ${s.timestamp ? `(${s.timestamp})` : ''} — Duration: ${s.duration || 8}s`,
        `**Duration:** ${s.duration || 8}s | **Cast:** ${s.characters.join(', ')} | **Camera:** ${s.cameraAngle} | **Lighting:** ${s.lighting} | **Time:** ${s.timeOfDay}`,
        s.tags && s.tags.length > 0 ? `**Scene Tags:** ${s.tags.map(t => `#${t}`).join(' ')}` : '',
        s.transition ? `**Flow / Transition to Next Scene:** *${s.transition}*` : '',
        s.directorNotes ? `**Director's Commentary / Production Notes:**\n> *${s.directorNotes}*` : '',
        s.narrativeDescription ? `\n> ${s.narrativeDescription}\n` : '',
        s.videoPrompt ? `\n**AI Video Prompt (Runway/Sora/Luma):**\n\`\`\`\n${s.videoPrompt}\n\`\`\`` : '',
        s.voicePrompt ? `\n**Voice / Audio Prompt (ElevenLabs):**\n*${s.voicePrompt}*` : '',
        `\n**Keyframe Image Prompt:**\n\`\`\`\n${s.imagePrompt}\n\`\`\``,
        `\n---`
      ].filter(Boolean).join('\n'))
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `screenplay-breakdown-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportJson = () => {
    const projectData = {
      story,
      sceneCount,
      style,
      notes,
      globalCharacterLock: characterLock,
      characters,
      scenes,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `story-scenes-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        if (data.story !== undefined) setStory(data.story);
        if (data.sceneCount !== undefined) setSceneCount(data.sceneCount);
        if (data.style !== undefined) setStyle(data.style);
        if (data.notes !== undefined) setNotes(data.notes);
        if (data.globalCharacterLock !== undefined) setCharacterLock(data.globalCharacterLock);
        if (data.scenes !== undefined) setScenes(data.scenes);
        if (data.characters !== undefined) setCharacters(data.characters);
        
        setError(null);
      } catch (err) {
        setError("Failed to import file. Invalid JSON format.");
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleResetToPreset = () => {
    setStory(PRESET_STORY_TEXT);
    setScenes(PRESET_SCENES);
    setCharacters(PRESET_CHARACTERS);
    setCharacterLock(GLOBAL_CHARACTER_LOCK_PRESET);
    setStyle(ArtStyle.Realistic);
    setSceneCount(23);
    setError(null);
  };

  // Filtered scenes
  const filteredScenes = useMemo(() => {
    return scenes.filter(s => {
      // Character filter
      const matchesChar = selectedCharacterFilter === 'ALL' || s.characters.includes(selectedCharacterFilter);
      if (!matchesChar) return false;

      // Tag filter
      const matchesTag = selectedTagFilter === 'ALL' || (s.tags && s.tags.includes(selectedTagFilter));
      if (!matchesTag) return false;

      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        s.sceneNumber.toString().includes(q) ||
        (s.timestamp && s.timestamp.toLowerCase().includes(q)) ||
        s.narrativeDescription.toLowerCase().includes(q) ||
        (s.videoPrompt && s.videoPrompt.toLowerCase().includes(q)) ||
        (s.voicePrompt && s.voicePrompt.toLowerCase().includes(q)) ||
        s.imagePrompt.toLowerCase().includes(q) ||
        (s.tags && s.tags.some(t => t.toLowerCase().includes(q))) ||
        (s.directorNotes && s.directorNotes.toLowerCase().includes(q))
      );
    });
  }, [scenes, selectedCharacterFilter, selectedTagFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".json" 
        className="hidden" 
      />

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-xl shadow-md shadow-indigo-600/30">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-slate-400">
                Story-to-Scene Director
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Cinematic AI Video Prompts • Global Character Lock • Voiceover Audio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetToPreset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors border border-slate-800"
              title="Reload Daniel & Michael 23-Scene Drama"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reload Drama Script</span>
            </button>
            <button
              onClick={handleImportClick}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
              title="Import JSON"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Import</span>
            </button>
            <button
              onClick={handleExportMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-300 hover:text-white bg-indigo-950/50 hover:bg-indigo-900/60 border border-indigo-500/30 rounded-lg transition-colors"
              title="Export as Screenplay Markdown"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Markdown</span>
            </button>
            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
              title="Export JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>
          </div>
        </div>
      </header>

      {/* Global Character Lock Banner */}
      <div className="border-b border-indigo-900/40 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/30">
                <Lock className="w-4 h-4" />
              </span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                  Global Character Lock Active
                </span>
                <span className="text-xs text-slate-400 ml-2 hidden sm:inline">
                  (Emma, Lily, Daniel, Michael — Applied across all {scenes.length} scenes)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(characterLock);
                  setCopiedLock(true);
                  setTimeout(() => setCopiedLock(false), 2000);
                }}
                className="flex items-center gap-1 text-xs text-indigo-300 hover:text-white bg-indigo-950/60 hover:bg-indigo-900/80 px-2.5 py-1 rounded-md border border-indigo-500/30 transition-colors"
                title="Copy Global Lock string"
              >
                {copiedLock ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied Lock</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Lock</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setShowLockDetails(!showLockDetails)}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2 py-1 rounded-md hover:bg-slate-800 transition-colors"
              >
                <span>{showLockDetails ? 'Hide' : 'View / Edit Lock'}</span>
                {showLockDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {showLockDetails && (
            <div className="mt-3 pt-3 border-t border-indigo-900/30">
              <textarea
                value={characterLock}
                onChange={(e) => setCharacterLock(e.target.value)}
                placeholder="Global character physical anchors and film style lock..."
                rows={2}
                className="w-full bg-slate-900/90 text-xs font-mono text-indigo-100 p-2.5 rounded-lg border border-indigo-500/30 focus:border-indigo-400 outline-none resize-y"
              />
            </div>
          )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Directing Inputs */}
        <div className="lg:col-span-5 space-y-6 h-fit lg:sticky lg:top-24">
          
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-5">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                  <PenTool className="w-4 h-4 text-indigo-400" />
                  Story / Screenplay Script
                </label>
                {isScriptFormatted && (
                  <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Screenplay detected
                  </span>
                )}
              </div>
              <textarea
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="Paste your story or full screenplay with SCENE tags here..."
                className="w-full h-44 bg-slate-800/80 border-slate-700 border rounded-xl p-3.5 text-xs font-mono text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-y transition-all"
                dir="auto"
              />
            </div>

            {/* Instant Parse Button if screenplay format is detected */}
            {isScriptFormatted && (
              <button
                onClick={handleParseScript}
                className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/20 transition-all active:scale-[0.99]"
              >
                <Sparkles className="w-4 h-4" />
                ⚡ Parse Script into 23 Scenes Instantly
              </button>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">
                  Number of Scenes
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={sceneCount}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '') {
                      setSceneCount('');
                    } else {
                      const parsed = parseInt(val);
                      if (!isNaN(parsed) && parsed > 0) {
                        setSceneCount(parsed);
                      }
                    }
                  }}
                  placeholder="Scene count"
                  className="w-full bg-slate-800 border-slate-700 border rounded-xl p-2.5 text-xs text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">
                  Target Style
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value as ArtStyle)}
                  className="w-full bg-slate-800 border-slate-700 border rounded-xl p-2.5 text-xs text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                >
                  {Object.values(ArtStyle).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">
                Cinematography Directing Notes
              </label>
              <input 
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Camera style, grading, 16:9, film grain..."
                className="w-full bg-slate-800 border-slate-700 border rounded-xl p-2.5 text-xs text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !story.trim()}
              className={`
                w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all
                ${loading || !story.trim() 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 hover:scale-[1.01] active:scale-[0.99]'
                }
              `}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Breakdown with Gemini...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate / Expand with Gemini AI
                </>
              )}
            </button>

            {error && (
              <div className="p-3.5 bg-red-900/20 border border-red-500/30 rounded-xl flex items-start gap-2.5 text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Output */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Character Profiles Section */}
          {characters.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Users className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-lg font-bold text-white">Cast & Character Consistency Lock</h2>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {characters.length} Characters Anchored
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {characters.map((char, index) => (
                  <CharacterCard key={index} character={char} />
                ))}
              </div>
            </div>
          )}

          {/* Scene Breakdown Section */}
          {scenes.length > 0 && (
            <div className="space-y-5">
              <div className="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <Film className="w-5 h-5 text-indigo-400" />
                  <div>
                    <h2 className="text-lg font-bold text-white">Scene Directing Breakdown</h2>
                    <p className="text-slate-400 text-xs">
                      {filteredScenes.length} of {scenes.length} scenes showing
                    </p>
                  </div>
                </div>

                {/* Batch Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleCopyAllVideoPrompts}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-200 bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/30 rounded-lg transition-colors"
                    title="Copy all video prompts for batch video generators"
                  >
                    {copiedBatch === 'video' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">All Video Prompts Copied!</span>
                      </>
                    ) : (
                      <>
                        <Video className="w-3.5 h-3.5" />
                        <span>Copy All Video Prompts</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleCopyAllVoicePrompts}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-200 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/30 rounded-lg transition-colors"
                    title="Copy all dialogue lines and voice prompts"
                  >
                    {copiedBatch === 'voice' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">All Voice Prompts Copied!</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5" />
                        <span>Copy All Voice Lines</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Total Estimated Runtime Card */}
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Total Estimated Runtime
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold font-mono text-white tracking-tight">
                        {formattedTotalRuntime}
                      </span>
                      <span className="text-xs font-mono text-amber-300 bg-amber-950/50 border border-amber-500/30 px-2 py-0.5 rounded-full">
                        {totalEstimatedSeconds}s total
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <div className="bg-slate-950/70 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
                    <span className="text-slate-500 mr-1.5">Scenes:</span>
                    <span className="font-bold text-white">{scenes.length}</span>
                  </div>
                  <div className="bg-slate-950/70 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
                    <span className="text-slate-500 mr-1.5">Avg Scene:</span>
                    <span className="font-bold text-amber-300">
                      {scenes.length > 0 ? (totalEstimatedSeconds / scenes.length).toFixed(1) : 0}s
                    </span>
                  </div>
                </div>
              </div>

              {/* Scene Pacing Distribution Bar Chart (recharts) */}
              <PacingChart 
                scenes={scenes} 
                onSelectScene={handleScrollToScene} 
              />

              {/* Filter & Search Bar */}
              <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl space-y-3 shadow-lg">
                {/* Top Row: Cast Filter & Search */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Cast Filter:</span>
                    <div className="flex flex-wrap gap-1">
                      {['ALL', 'Emma', 'Lily', 'Daniel', 'Michael'].map((charName) => (
                        <button
                          key={charName}
                          onClick={() => setSelectedCharacterFilter(charName)}
                          className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                            selectedCharacterFilter === charName
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {charName}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative min-w-[220px] flex-1 sm:flex-initial">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search prompts, notes or tags..."
                      className="w-full bg-slate-950/60 border border-slate-700 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Bottom Row: Scene Tag Filter System */}
                <div className="flex flex-wrap items-center gap-2 pt-2.5 border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold uppercase tracking-wider mr-1">
                    <Tag className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Scene Tag:</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 flex-1">
                    <button
                      onClick={() => setSelectedTagFilter('ALL')}
                      className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                        selectedTagFilter === 'ALL'
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                          : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/60'
                      }`}
                    >
                      ALL ({scenes.length})
                    </button>

                    {allAvailableTags.map(({ name, count }) => {
                      const isSelected = selectedTagFilter === name;
                      return (
                        <button
                          key={name}
                          onClick={() => setSelectedTagFilter(isSelected ? 'ALL' : name)}
                          className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all inline-flex items-center gap-1.5 border ${
                            isSelected
                              ? 'bg-indigo-600 text-white font-bold border-indigo-400 shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400'
                              : 'bg-slate-950/80 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <Hash className="w-2.5 h-2.5 opacity-60" />
                          <span>{name}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                            isSelected ? 'bg-indigo-800 text-indigo-100 font-bold' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}

                    {selectedTagFilter !== 'ALL' && (
                      <button
                        onClick={() => setSelectedTagFilter('ALL')}
                        className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 px-2 py-1 rounded-md transition-colors flex items-center gap-1 font-medium ml-1"
                        title="Clear Tag Filter"
                      >
                        <X className="w-3 h-3" />
                        <span>Clear Filter</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Reordering Instructions & Auto-renumber Options */}
              <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-indigo-300">
                  <GripVertical className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>
                    <strong className="font-semibold text-white">Drag & drop cards</strong> by the grip handle to reorder the scene sequence.
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={autoRenumber}
                      onChange={(e) => setAutoRenumber(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
                    />
                    <span>Auto-renumber (1..{scenes.length})</span>
                  </label>

                  <button
                    onClick={handleManualRenumber}
                    className="flex items-center gap-1 text-[11px] font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2 py-0.5 rounded transition-colors"
                    title="Renumber all scenes sequentially 1 to N"
                  >
                    <ArrowUpDown className="w-3 h-3 text-indigo-400" />
                    <span>Renumber</span>
                  </button>
                </div>
              </div>

              {/* Scene Cards List */}
              <div className="space-y-4">
                {filteredScenes.map((scene, index) => (
                  <div 
                    key={scene.sceneNumber} 
                    id={`scene-card-container-${scene.sceneNumber}`}
                    className="transition-all rounded-2xl"
                  >
                    <SceneCard 
                      scene={scene}
                      index={index}
                      totalScenes={filteredScenes.length}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, scene.sceneNumber)}
                      onDragOver={(e) => handleDragOver(e, scene.sceneNumber)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, scene.sceneNumber)}
                      onDragEnd={handleDragEnd}
                      isDragging={draggedSceneNumber === scene.sceneNumber}
                      isDragOver={dragOverSceneNumber === scene.sceneNumber && draggedSceneNumber !== scene.sceneNumber}
                      onMoveUp={() => handleMoveSceneByIndex(index, 'up')}
                      onMoveDown={() => handleMoveSceneByIndex(index, 'down')}
                      onRegenerate={() => handleRegeneratePrompt(scene.sceneNumber)}
                      onUpdatePrompt={(newPrompt) => handleUpdatePrompt(scene.sceneNumber, newPrompt)}
                      onUpdateVideoPrompt={(newVideo) => handleUpdateVideoPrompt(scene.sceneNumber, newVideo)}
                      onUpdateVoicePrompt={(newVoice) => handleUpdateVoicePrompt(scene.sceneNumber, newVoice)}
                      onUpdateTransition={(newTransition) => handleUpdateTransition(scene.sceneNumber, newTransition)}
                      onUpdateDuration={(newDuration) => handleUpdateDuration(scene.sceneNumber, newDuration)}
                      onUpdateNotes={(newNotes) => handleUpdateSceneNotes(scene.sceneNumber, newNotes)}
                      onUpdateTags={(newTags) => handleUpdateSceneTags(scene.sceneNumber, newTags)}
                    />
                  </div>
                ))}

                {filteredScenes.length === 0 && (
                  <div className="text-center py-12 text-slate-500 text-sm bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl space-y-2">
                    <p>No scenes matched your current filter criteria.</p>
                    <div className="flex justify-center gap-2 pt-2">
                      {selectedTagFilter !== 'ALL' && (
                        <button
                          onClick={() => setSelectedTagFilter('ALL')}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
                        >
                          Reset Tag Filter
                        </button>
                      )}
                      {selectedCharacterFilter !== 'ALL' && (
                        <button
                          onClick={() => setSelectedCharacterFilter('ALL')}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
                        >
                          Reset Cast Filter
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {scenes.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-3xl p-12 min-h-[400px]">
              <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4">
                <Film className="w-8 h-8 text-slate-700" />
              </div>
              <h3 className="text-lg font-semibold text-slate-400 mb-1">No Scenes Loaded</h3>
              <p className="text-center max-w-sm text-xs text-slate-500">
                Click "Reload Drama Script" or enter a story on the left to direct scenes.
              </p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default App;
