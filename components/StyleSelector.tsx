import React from 'react';
import { ArtStyle } from '../types';

interface StyleSelectorProps {
  selectedStyle: ArtStyle;
  onSelect: (style: ArtStyle) => void;
}

const styles = Object.values(ArtStyle);

export const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onSelect }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {styles.map((style) => (
        <button
          key={style}
          onClick={() => onSelect(style)}
          className={`
            p-3 text-sm font-medium rounded-xl border transition-all duration-200 text-left relative overflow-hidden group
            ${selectedStyle === style 
              ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/30' 
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-750'
            }
          `}
        >
          <span className="relative z-10">{style}</span>
          {selectedStyle === style && (
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-100 -z-0" />
          )}
        </button>
      ))}
    </div>
  );
};
