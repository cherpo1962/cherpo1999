import React, { useState, useEffect } from 'react';
import { SceneDetail } from '../types';
import { 
  Copy, Check, Camera, Sun, Palette, RefreshCw, Loader2, Pencil, X, Users, 
  Video, Mic, Clock, Sparkles, Image as ImageIcon, GripVertical, ChevronUp, ChevronDown,
  ArrowRightLeft, Scissors, NotebookPen, StickyNote, Tag, Plus, Hash
} from 'lucide-react';

export const TRANSITION_PRESETS = [
  'Hard Cut',
  'Fade to Black',
  'Cross Dissolve',
  'Match Cut',
  'Whip Pan',
  'Smash Cut',
  'J-Cut / L-Cut',
  'Dissolve',
  'Fade to White'
];

interface SceneCardProps {
  scene: SceneDetail;
  index: number;
  totalScenes: number;
  onRegenerate: () => Promise<void>;
  onUpdatePrompt: (newPrompt: string) => void;
  onUpdateVideoPrompt?: (newVideoPrompt: string) => void;
  onUpdateVoicePrompt?: (newVoicePrompt: string) => void;
  onUpdateTransition?: (newTransition: string) => void;
  onUpdateDuration?: (newDuration: number) => void;
  onUpdateNotes?: (newNotes: string) => void;
  onUpdateTags?: (newTags: string[]) => void;
  // Drag and drop props
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragLeave?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void;
  isDragging?: boolean;
  isDragOver?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export const SceneCard: React.FC<SceneCardProps> = ({ 
  scene,
  index,
  totalScenes,
  onRegenerate, 
  onUpdatePrompt,
  onUpdateVideoPrompt,
  onUpdateVoicePrompt,
  onUpdateTransition,
  onUpdateDuration,
  onUpdateNotes,
  onUpdateTags,
  draggable = true,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  isDragging = false,
  isDragOver = false,
  onMoveUp,
  onMoveDown
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [editImagePrompt, setEditImagePrompt] = useState(scene.imagePrompt);
  const [editVideoPrompt, setEditVideoPrompt] = useState(scene.videoPrompt || '');
  const [editVoicePrompt, setEditVoicePrompt] = useState(scene.voicePrompt || '');
  const [editTransition, setEditTransition] = useState(scene.transition || 'Hard Cut');
  const [editDuration, setEditDuration] = useState<number>(scene.duration || 8);
  const [editNotes, setEditNotes] = useState(scene.directorNotes || '');
  const [isEditingNotesInline, setIsEditingNotesInline] = useState(false);

  // Scene Tags state
  const [editTags, setEditTags] = useState<string[]>(scene.tags || []);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const [activeTab, setActiveTab] = useState<'video' | 'voice' | 'image'>('video');

  // Sync state with props
  useEffect(() => {
    setEditImagePrompt(scene.imagePrompt);
    setEditVideoPrompt(scene.videoPrompt || '');
    setEditVoicePrompt(scene.voicePrompt || '');
    setEditTransition(scene.transition || 'Hard Cut');
    setEditDuration(scene.duration || 8);
    setEditNotes(scene.directorNotes || '');
    setEditTags(scene.tags || []);
  }, [scene.imagePrompt, scene.videoPrompt, scene.voicePrompt, scene.transition, scene.duration, scene.directorNotes, scene.tags]);

  const handleAddTag = (tagToAdd: string) => {
    const trimmed = tagToAdd.trim();
    if (!trimmed) return;
    const formatted = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    if (editTags.includes(formatted)) return;
    const updated = [...editTags, formatted];
    setEditTags(updated);
    if (onUpdateTags) onUpdateTags(updated);
    setTagInput('');
    setIsAddingTag(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updated = editTags.filter(t => t !== tagToRemove);
    setEditTags(updated);
    if (onUpdateTags) onUpdateTags(updated);
  };

  const getTagColorClass = (tag: string) => {
    const lower = tag.toLowerCase();
    if (lower.includes('flashback') || lower.includes('memory')) return 'bg-purple-900/40 text-purple-300 border-purple-500/40';
    if (lower.includes('tension') || lower.includes('suspense')) return 'bg-amber-900/40 text-amber-300 border-amber-500/40';
    if (lower.includes('action') || lower.includes('climax') || lower.includes('fight') || lower.includes('vehicle')) return 'bg-rose-900/40 text-rose-300 border-rose-500/40';
    if (lower.includes('dialogue') || lower.includes('conversation')) return 'bg-sky-900/40 text-sky-300 border-sky-500/40';
    if (lower.includes('emotion') || lower.includes('drama') || lower.includes('shock')) return 'bg-emerald-900/40 text-emerald-300 border-emerald-500/40';
    if (lower.includes('mystery') || lower.includes('investigation') || lower.includes('twist') || lower.includes('secret')) return 'bg-indigo-900/40 text-indigo-300 border-indigo-500/40';
    return 'bg-slate-800/80 text-slate-300 border-slate-700';
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleCopyFullScene = () => {
    const fullText = [
      `SCENE ${scene.sceneNumber < 10 ? '0' + scene.sceneNumber : scene.sceneNumber}${scene.timestamp ? ` — ${scene.timestamp}` : ''}`,
      `DURATION: ${scene.duration || 8} seconds`,
      scene.tags && scene.tags.length > 0 ? `TAGS: ${scene.tags.join(', ')}` : '',
      scene.directorNotes ? `DIRECTOR NOTES: ${scene.directorNotes}` : '',
      scene.videoPrompt ? `VIDEO PROMPT: ${scene.videoPrompt}` : `IMAGE PROMPT: ${scene.imagePrompt}`,
      scene.voicePrompt ? `VOICE PROMPT: ${scene.voicePrompt}` : '',
      `CAMERA: ${scene.cameraAngle}`,
      `LIGHTING: ${scene.lighting}`,
      `TRANSITION TO NEXT SCENE: ${scene.transition || 'Hard Cut'}`,
      `CHARACTERS: ${scene.characters.join(', ')}`
    ].filter(Boolean).join('\n');

    copyToClipboard(fullText, 'full');
  };

  const handleRegenerateClick = async () => {
    setIsRegenerating(true);
    try {
      await onRegenerate();
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSaveEdit = () => {
    onUpdatePrompt(editImagePrompt);
    if (onUpdateVideoPrompt) onUpdateVideoPrompt(editVideoPrompt);
    if (onUpdateVoicePrompt) onUpdateVoicePrompt(editVoicePrompt);
    if (onUpdateTransition) onUpdateTransition(editTransition);
    if (onUpdateDuration) onUpdateDuration(editDuration);
    if (onUpdateNotes) onUpdateNotes(editNotes);
    if (onUpdateTags) onUpdateTags(editTags);
    setIsEditing(false);
    setIsEditingNotesInline(false);
  };

  const handleCancelEdit = () => {
    setEditImagePrompt(scene.imagePrompt);
    setEditVideoPrompt(scene.videoPrompt || '');
    setEditVoicePrompt(scene.voicePrompt || '');
    setEditTransition(scene.transition || 'Hard Cut');
    setEditDuration(scene.duration || 8);
    setEditNotes(scene.directorNotes || '');
    setEditTags(scene.tags || []);
    setIsEditing(false);
    setIsEditingNotesInline(false);
    setIsAddingTag(false);
    setTagInput('');
  };

  return (
    <div 
      draggable={draggable && !isEditing}
      onDragStart={(e) => onDragStart?.(e, index)}
      onDragOver={(e) => onDragOver?.(e, index)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop?.(e, index)}
      onDragEnd={onDragEnd}
      className={`bg-slate-900 border rounded-2xl overflow-hidden shadow-xl mb-5 transition-all duration-200 relative ${
        isDragging 
          ? 'opacity-40 border-indigo-500 border-dashed scale-[0.99] shadow-2xl ring-2 ring-indigo-500/40' 
          : isDragOver
            ? 'border-indigo-400 ring-2 ring-indigo-500 bg-indigo-950/20 -translate-y-1 shadow-indigo-500/20 shadow-2xl'
            : 'border-slate-700/80 hover:border-indigo-500/50'
      }`}
    >
      {/* Drop indicator banner when dragging over */}
      {isDragOver && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 z-10 animate-pulse" />
      )}

      {/* Scene Header */}
      <div className="bg-slate-950/80 px-5 py-3.5 border-b border-slate-800 flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-3">
          {/* Drag Handle */}
          <div 
            className="cursor-grab active:cursor-grabbing p-1.5 -ml-1 text-slate-500 hover:text-indigo-400 hover:bg-slate-800/80 rounded-lg transition-colors flex items-center justify-center group"
            title="Click and drag to reorder scene sequence"
          >
            <GripVertical className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
          </div>

          {/* Reorder Up/Down quick buttons */}
          <div className="flex flex-col -space-y-0.5">
            <button
              onClick={onMoveUp}
              disabled={index === 0}
              className="text-slate-500 hover:text-white disabled:opacity-20 disabled:hover:text-slate-500 p-0.5 rounded hover:bg-slate-800 transition-colors"
              title="Move Scene Up"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onMoveDown}
              disabled={index === totalScenes - 1}
              className="text-slate-500 hover:text-white disabled:opacity-20 disabled:hover:text-slate-500 p-0.5 rounded hover:bg-slate-800 transition-colors"
              title="Move Scene Down"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600/30 text-indigo-400 font-bold font-mono text-sm border border-indigo-500/30">
            {scene.sceneNumber < 10 ? `0${scene.sceneNumber}` : scene.sceneNumber}
          </span>
          <h3 className="text-lg font-bold text-white tracking-wide">
            Scene {scene.sceneNumber}
          </h3>

          {/* Duration & Timestamp Badge */}
          <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-amber-300 bg-amber-950/40 border border-amber-500/30 px-2.5 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{scene.duration || 8}s</span>
            {onUpdateDuration && (
              <div className="flex items-center gap-0.5 ml-1 border-l border-amber-500/30 pl-1.5">
                <button
                  type="button"
                  onClick={() => onUpdateDuration(Math.max(1, (scene.duration || 8) - 1))}
                  className="w-4 h-4 rounded hover:bg-amber-900/60 flex items-center justify-center text-amber-400 hover:text-white"
                  title="Decrease duration by 1s"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateDuration((scene.duration || 8) + 1)}
                  className="w-4 h-4 rounded hover:bg-amber-900/60 flex items-center justify-center text-amber-400 hover:text-white"
                  title="Increase duration by 1s"
                >
                  +
                </button>
              </div>
            )}
            {scene.timestamp && (
              <span className="text-amber-400/60 text-[10px] hidden sm:inline ml-0.5">({scene.timestamp})</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 bg-slate-800/80 border border-slate-700 px-2.5 py-1 rounded-md">
            {scene.timeOfDay}
          </span>
          <button
            onClick={handleCopyFullScene}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors"
            title="Copy complete scene breakdown"
          >
            {copiedType === 'full' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Scene</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="p-5 space-y-5">
        {/* Narrative Description */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Director's Narrative</h4>
            {scene.characters && scene.characters.length > 0 && (
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-400">Cast:</span>
                <div className="flex flex-wrap gap-1">
                  {scene.characters.map((char, idx) => (
                    <span 
                      key={idx} 
                      className="text-xs font-medium bg-slate-800 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-full"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <p className="text-slate-200 text-base leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80" dir="auto">
            {scene.narrativeDescription}
          </p>
        </div>

        {/* Scene Tags (Keywords: Flashback, Tension, Action, etc.) */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/40 px-3.5 py-2.5 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-1.5 mr-1 text-slate-400">
            <Tag className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Scene Tags:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
            {editTags.map((tag) => (
              <span
                key={tag}
                className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full border transition-all ${getTagColorClass(tag)}`}
              >
                <Hash className="w-2.5 h-2.5 opacity-60" />
                <span>{tag}</span>
                {onUpdateTags && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-0.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-700/50 p-0.5 transition-colors"
                    title={`Remove "${tag}" tag`}
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                )}
              </span>
            ))}

            {editTags.length === 0 && !isAddingTag && (
              <span className="text-xs text-slate-500 italic">No scene tags assigned</span>
            )}

            {/* Quick Add Tag UI */}
            {isAddingTag ? (
              <div className="inline-flex items-center gap-1 bg-slate-900 border border-indigo-500/60 rounded-lg p-0.5 px-1.5 shadow-lg animate-in fade-in">
                <input
                  type="text"
                  autoFocus
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag(tagInput);
                    } else if (e.key === 'Escape') {
                      setIsAddingTag(false);
                    }
                  }}
                  placeholder="e.g. Flashback, Tension..."
                  className="bg-transparent text-xs text-white placeholder:text-slate-500 outline-none w-32 px-1 py-0.5 font-medium"
                />
                <button
                  type="button"
                  onClick={() => handleAddTag(tagInput)}
                  className="p-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                  title="Add tag"
                >
                  <Check className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingTag(false)}
                  className="p-1 rounded text-slate-400 hover:text-white transition-colors"
                  title="Cancel"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : onUpdateTags ? (
              <div className="inline-flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsAddingTag(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-indigo-300 bg-slate-900 hover:bg-slate-800 border border-dashed border-slate-700 hover:border-indigo-500/50 px-2 py-0.5 rounded-full transition-all"
                  title="Add a custom keyword or tag"
                >
                  <Plus className="w-3 h-3" />
                  <span>Tag</span>
                </button>

                {/* Popular tag suggestions for 1-click add */}
                {editTags.length < 3 && (
                  <div className="hidden sm:flex items-center gap-1 ml-1 text-[10px]">
                    {['Flashback', 'Tension', 'Action', 'Dialogue'].filter(p => !editTags.includes(p)).slice(0, 3).map(preset => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handleAddTag(preset)}
                        className="px-1.5 py-0.5 rounded bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-amber-300 border border-slate-800 hover:border-slate-700 transition-colors"
                      >
                        +{preset}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>

        {/* Cinematic Technical Specs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/40 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-950/40 border border-sky-500/20">
              <Camera className="w-4 h-4 text-sky-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Camera Angle</p>
              <p className="text-xs text-slate-200 font-medium truncate" title={scene.cameraAngle}>{scene.cameraAngle}</p>
            </div>
          </div>

          <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/40 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-500/20">
              <Sun className="w-4 h-4 text-amber-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Lighting & Shadow</p>
              <p className="text-xs text-slate-200 font-medium truncate" title={scene.lighting}>{scene.lighting}</p>
            </div>
          </div>

          <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/40 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-pink-950/40 border border-pink-500/20">
              <Palette className="w-4 h-4 text-pink-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Color Grading & Aspect</p>
              <p className="text-xs text-slate-200 font-medium truncate" title={scene.visualStyle}>{scene.visualStyle}</p>
            </div>
          </div>
        </div>

        {/* Scene Transition & Flow to Next Scene */}
        <div className="bg-gradient-to-r from-amber-950/20 via-slate-900/90 to-indigo-950/20 border border-amber-500/30 rounded-xl p-3.5 transition-all">
          <div className="flex flex-wrap items-center justify-between gap-2.5 mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <ArrowRightLeft className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  Flow into Next Scene / Transition
                  {index < totalScenes - 1 ? (
                    <span className="text-[10px] text-slate-400 font-normal">
                      → Scene {(scene.sceneNumber || index + 1) + 1}
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-400/80 font-normal">
                      (Final Scene Climax)
                    </span>
                  )}
                </h4>
              </div>
            </div>

            {!isEditing && onUpdateTransition && (
              <div className="flex flex-wrap items-center gap-1">
                <span className="text-[10px] text-slate-400 font-medium mr-1 hidden sm:inline">Quick Presets:</span>
                {['Hard Cut', 'Fade to Black', 'Dissolve', 'Match Cut'].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => onUpdateTransition(preset)}
                    className={`text-[10px] px-2 py-0.5 rounded transition-colors border ${
                      (scene.transition || 'Hard Cut').toLowerCase() === preset.toLowerCase()
                        ? 'bg-amber-500/30 text-amber-200 border-amber-500/50 font-semibold'
                        : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editTransition}
                onChange={(e) => setEditTransition(e.target.value)}
                placeholder="e.g. Fade to black, Hard cut, Dissolve, Smash cut, Match cut, Whip pan..."
                className="w-full bg-slate-950 text-amber-100 font-mono text-xs px-3 py-2 rounded-lg border border-amber-500/50 focus:border-amber-400 outline-none"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400 mr-1 self-center">Presets:</span>
                {TRANSITION_PRESETS.map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setEditTransition(p)}
                    className={`text-[10px] px-2 py-0.5 rounded transition-colors border ${
                      editTransition.toLowerCase() === p.toLowerCase()
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                        : 'bg-slate-800 text-amber-300 hover:bg-amber-950/60 border-amber-500/30'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-slate-950/60 px-3.5 py-2.5 rounded-lg border border-slate-800/80">
              <p className="text-xs font-mono text-amber-200/90 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block animate-pulse" />
                {scene.transition || 'Hard Cut'}
              </p>
              {index < totalScenes - 1 ? (
                <span className="text-[11px] font-mono text-slate-500">
                  Cuts to Scene {(scene.sceneNumber || index + 1) + 1}
                </span>
              ) : (
                <span className="text-[11px] font-mono text-amber-400/70">
                  End of Screenplay
                </span>
              )}
            </div>
          )}
        </div>

        {/* Duration Configuration in Edit Mode */}
        {isEditing && (
          <div className="bg-indigo-950/40 border border-indigo-500/40 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Scene Duration
                </span>
                <span className="text-[10px] text-slate-400">
                  Target runtime in seconds for video & audio generation
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={1}
                  max={300}
                  value={editDuration}
                  onChange={(e) => setEditDuration(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 bg-slate-950 text-amber-300 font-mono font-bold text-xs p-1.5 rounded-lg border border-indigo-500/50 text-center outline-none focus:border-indigo-400"
                />
                <span className="text-xs font-mono text-slate-300">seconds</span>
              </div>

              <div className="flex gap-1 ml-2">
                {[4, 5, 8, 10, 15, 20].map((sec) => (
                  <button
                    type="button"
                    key={sec}
                    onClick={() => setEditDuration(sec)}
                    className={`text-[10px] font-mono px-2 py-1 rounded border transition-colors ${
                      editDuration === sec
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Dedicated Director's Production Notes & Commentary */}
        <div className="bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 rounded-xl p-3.5 space-y-2.5 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <NotebookPen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  Director's Commentary & Production Notes
                  {scene.directorNotes && (
                    <span className="text-[10px] text-amber-400 bg-amber-950/50 px-1.5 py-0.5 rounded font-mono font-normal border border-amber-500/30">
                      Active Note
                    </span>
                  )}
                </h4>
                <p className="text-[10px] text-slate-400">
                  Acting cues, camera framing, audio design & VFX guidance
                </p>
              </div>
            </div>

            {!isEditing && onUpdateNotes && (
              <div>
                {isEditingNotesInline ? (
                  <button
                    type="button"
                    onClick={() => {
                      setEditNotes(scene.directorNotes || '');
                      setIsEditingNotesInline(false);
                    }}
                    className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditingNotesInline(true)}
                    className="flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 bg-amber-950/30 hover:bg-amber-950/60 border border-amber-500/30 px-2.5 py-1 rounded-lg transition-colors"
                    title={scene.directorNotes ? "Edit Director's Notes" : "Add Director's Notes"}
                  >
                    <Pencil className="w-3 h-3" />
                    <span>{scene.directorNotes ? 'Edit Notes' : '+ Add Notes'}</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Edit State (Full Edit Mode or Inline Note Edit Mode) */}
          {(isEditing || isEditingNotesInline) ? (
            <div className="space-y-2 pt-1">
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Add director commentary, actor direction, sound design cues, camera pacing, or VFX notes for this scene..."
                rows={3}
                className="w-full bg-slate-900/90 text-amber-100 font-sans text-xs p-3 rounded-xl border border-amber-500/40 focus:border-amber-400 outline-none resize-y placeholder:text-slate-600 leading-relaxed shadow-inner"
              />
              {isEditingNotesInline && !isEditing && (
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditNotes(scene.directorNotes || '');
                      setIsEditingNotesInline(false);
                    }}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (onUpdateNotes) onUpdateNotes(editNotes);
                      setIsEditingNotesInline(false);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Note</span>
                  </button>
                </div>
              )}
            </div>
          ) : scene.directorNotes ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 leading-relaxed italic border-l-2 border-l-amber-400 relative">
              "{scene.directorNotes}"
            </div>
          ) : (
            <div 
              onClick={() => setIsEditingNotesInline(true)}
              className="text-xs text-slate-500 italic bg-slate-900/30 p-2.5 rounded-lg border border-dashed border-slate-800 hover:border-amber-500/30 hover:text-slate-400 cursor-pointer transition-colors flex items-center justify-between"
            >
              <span>No notes added for this scene yet. Click to write production commentary...</span>
              <span className="text-[11px] text-amber-400 font-medium not-italic">+ Add</span>
            </div>
          )}
        </div>

        {/* Video Prompt Section (Runway Gen-3 / Sora / Luma / Kling) */}
        {scene.videoPrompt && (
          <div className="bg-purple-950/20 border border-purple-500/30 rounded-xl p-4 relative group">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-purple-400" />
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                  AI Video Prompt <span className="text-[10px] text-purple-400/80 font-normal font-sans">(Runway Gen-3, Luma, Sora, Kling, Pika)</span>
                </h4>
              </div>
              <button
                onClick={() => copyToClipboard(scene.videoPrompt || '', 'video')}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-purple-200 bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/30 rounded-lg transition-colors"
                title="Copy Video AI Prompt"
              >
                {copiedType === 'video' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Video Prompt</span>
                  </>
                )}
              </button>
            </div>
            
            {isEditing ? (
              <textarea
                value={editVideoPrompt}
                onChange={(e) => setEditVideoPrompt(e.target.value)}
                className="w-full bg-slate-950/80 text-purple-100 font-mono text-xs p-3 rounded-lg border border-purple-500/50 focus:border-purple-400 outline-none min-h-[80px]"
              />
            ) : (
              <p className="text-xs text-purple-100 font-mono leading-relaxed select-all">
                {scene.videoPrompt}
              </p>
            )}
          </div>
        )}

        {/* Voice & Audio Prompt Section (ElevenLabs / Voice AI / Dialogue) */}
        {scene.voicePrompt && (
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 relative group">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  Voice & Sound Prompt <span className="text-[10px] text-emerald-400/80 font-normal font-sans">(ElevenLabs, Dialogue & Sound Design)</span>
                </h4>
              </div>
              <button
                onClick={() => copyToClipboard(scene.voicePrompt || '', 'voice')}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-200 bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-500/30 rounded-lg transition-colors"
                title="Copy Voice Dialogue Prompt"
              >
                {copiedType === 'voice' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Voice Prompt</span>
                  </>
                )}
              </button>
            </div>
            
            {isEditing ? (
              <textarea
                value={editVoicePrompt}
                onChange={(e) => setEditVoicePrompt(e.target.value)}
                className="w-full bg-slate-950/80 text-emerald-100 font-mono text-xs p-3 rounded-lg border border-emerald-500/50 focus:border-emerald-400 outline-none min-h-[60px]"
              />
            ) : (
              <p className="text-xs text-emerald-200 font-mono leading-relaxed select-all">
                {scene.voicePrompt}
              </p>
            )}
          </div>
        )}

        {/* Image Prompt Section */}
        <div className={`bg-indigo-950/30 border ${isEditing ? 'border-indigo-500' : 'border-indigo-500/30'} rounded-xl p-4 relative group transition-colors`}>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-indigo-400" />
              <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Keyframe / Concept Art Prompt <span className="text-[10px] text-indigo-400/80 font-normal font-sans">(Midjourney, Imagen 3, FLUX, SDXL)</span>
              </h4>
            </div>

            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveEdit}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors shadow-sm"
                    title="Save Changes"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg border border-slate-700 transition-colors"
                    title="Cancel"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
                    title="Edit Prompts"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleRegenerateClick}
                    disabled={isRegenerating}
                    className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Regenerate Prompt"
                  >
                    {isRegenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => copyToClipboard(scene.imagePrompt, 'image')}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-indigo-200 bg-indigo-900/40 hover:bg-indigo-800/60 border border-indigo-500/30 rounded-lg transition-colors"
                    title="Copy Image Prompt"
                  >
                    {copiedType === 'image' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
          
          {isEditing ? (
            <textarea
              value={editImagePrompt}
              onChange={(e) => setEditImagePrompt(e.target.value)}
              className="w-full bg-indigo-950/50 text-white font-mono text-xs p-3 rounded-lg border border-indigo-500/50 focus:border-indigo-400 outline-none min-h-[90px]"
            />
          ) : (
            <p className="text-xs text-indigo-100 font-mono leading-relaxed select-all">
              {scene.imagePrompt}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
