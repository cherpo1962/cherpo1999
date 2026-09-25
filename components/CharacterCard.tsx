import React, { useState } from 'react';
import { CharacterProfile } from '../types';
import { Copy, Check, User, Lock, Sparkles } from 'lucide-react';

interface CharacterCardProps {
  character: CharacterProfile;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(character.imagePrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl overflow-hidden shadow-lg transition-all duration-200">
      <div className="bg-slate-950/70 p-4 border-b border-slate-800 flex justify-between items-start gap-2">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-950/60 p-2.5 rounded-xl border border-indigo-500/30 text-indigo-300">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">{character.name}</h3>
              {character.age && (
                <span className="text-[11px] font-mono font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                  {character.age} yo
                </span>
              )}
            </div>
            <span className="text-xs text-indigo-400 font-medium tracking-wide">
              {character.role}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            <Lock className="w-3 h-3" />
            Locked
          </span>
        </div>
      </div>
      
      <div className="p-4 space-y-3.5">
        <p className="text-slate-300 text-xs leading-relaxed italic border-l-2 border-indigo-500/40 pl-3">
          "{character.description}"
        </p>

        {character.traits && (
          <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Consistency Anchor Traits
            </span>
            <p className="text-xs text-slate-300 font-mono">
              {character.traits}
            </p>
          </div>
        )}

        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              Character Design Prompt
            </label>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs text-indigo-300 hover:text-white bg-indigo-950/50 hover:bg-indigo-900/60 px-2 py-1 rounded-md border border-indigo-500/30 transition-colors"
              title="Copy Character Prompt"
            >
              {copied ? (
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
          </div>
          <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-lg p-2.5">
            <p className="text-xs text-indigo-200/90 font-mono leading-relaxed select-all">
              {character.imagePrompt}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
