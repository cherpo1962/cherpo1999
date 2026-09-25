import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, CartesianGrid 
} from 'recharts';
import { SceneDetail } from '../types';
import { Activity, Zap, TrendingUp, AlertTriangle, ChevronDown, ChevronUp, Clock } from 'lucide-react';

interface PacingChartProps {
  scenes: SceneDetail[];
  onSelectScene?: (sceneNumber: number) => void;
}

export const PacingChart: React.FC<PacingChartProps> = ({ scenes, onSelectScene }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<'timeline' | 'distribution'>('timeline');

  if (scenes.length === 0) return null;

  // Compute metrics
  const durations = scenes.map(s => s.duration || 8);
  const totalSeconds = durations.reduce((a, b) => a + b, 0);
  const avgDuration = Number((totalSeconds / scenes.length).toFixed(1));
  const minDuration = Math.min(...durations);
  const maxDuration = Math.max(...durations);

  const shortestScenes = scenes.filter(s => (s.duration || 8) === minDuration);
  const longestScenes = scenes.filter(s => (s.duration || 8) === maxDuration);

  // Timeline Data
  const timelineData = scenes.map((s, idx) => {
    const dur = s.duration || 8;
    let pacingCategory = 'Standard';
    let color = '#f59e0b'; // Amber - standard

    if (dur <= 5) {
      pacingCategory = 'Snappy / Fast';
      color = '#38bdf8'; // Sky blue
    } else if (dur >= 11) {
      pacingCategory = 'Extended / Slow';
      color = '#a855f7'; // Purple
    }

    return {
      sceneNumber: s.sceneNumber || idx + 1,
      name: `S${s.sceneNumber || idx + 1}`,
      duration: dur,
      timestamp: s.timestamp || '',
      transition: s.transition || 'Hard Cut',
      pacingCategory,
      color,
      charactersCount: s.characters?.length || 0,
      narrativePreview: s.narrativeDescription 
        ? s.narrativeDescription.slice(0, 70) + (s.narrativeDescription.length > 70 ? '...' : '') 
        : ''
    };
  });

  // Duration Distribution Buckets (Histogram)
  const buckets = [
    { label: 'Snappy (1-5s)', range: '1-5s', count: 0, color: '#38bdf8', category: 'Fast paced cut' },
    { label: 'Standard (6-8s)', range: '6-8s', count: 0, color: '#f59e0b', category: 'Standard pacing' },
    { label: 'Moderate (9-11s)', range: '9-11s', count: 0, color: '#10b981', category: 'Moderate hold' },
    { label: 'Extended (12s+)', range: '12s+', count: 0, color: '#a855f7', category: 'Slow dramatic beat' },
  ];

  durations.forEach(d => {
    if (d <= 5) buckets[0].count++;
    else if (d <= 8) buckets[1].count++;
    else if (d <= 11) buckets[2].count++;
    else buckets[3].count++;
  });

  const distributionData = buckets.map(b => ({
    name: b.range,
    label: b.label,
    count: b.count,
    percentage: Math.round((b.count / scenes.length) * 100),
    color: b.color,
    category: b.category
  }));

  // Pacing health alert
  const hasExtremeOutliers = maxDuration >= avgDuration * 2.5 || (minDuration <= 2 && maxDuration >= 15);

  const CustomTimelineTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs space-y-1.5 max-w-xs z-50">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span 
                className="w-2.5 h-2.5 rounded-full inline-block" 
                style={{ backgroundColor: data.color }}
              />
              Scene {data.sceneNumber}
            </span>
            <span className="font-mono text-amber-300 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
              {data.duration}s
            </span>
          </div>
          {data.timestamp && (
            <p className="text-[11px] text-slate-400 font-mono">
              Timestamp: <span className="text-slate-200">{data.timestamp}</span>
            </p>
          )}
          <p className="text-[11px] text-slate-400">
            Flow: <span className="text-indigo-300">{data.transition}</span>
          </p>
          <div className="text-[10px] uppercase font-bold tracking-wider inline-block px-1.5 py-0.5 rounded" style={{ backgroundColor: `${data.color}22`, color: data.color }}>
            {data.pacingCategory}
          </div>
          {data.narrativePreview && (
            <p className="text-[11px] text-slate-300 italic pt-1 border-t border-slate-800">
              "{data.narrativePreview}"
            </p>
          )}
          <p className="text-[10px] text-slate-500 pt-0.5">
            Click bar to scroll to scene
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomDistributionTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs space-y-1 max-w-xs z-50">
          <div className="font-bold text-white flex items-center gap-2">
            <span 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: data.color }} 
            />
            {data.label}
          </div>
          <p className="text-slate-300">
            <span className="font-mono font-bold text-amber-300">{data.count}</span> scene{data.count !== 1 ? 's' : ''} ({data.percentage}% of story)
          </p>
          <p className="text-[11px] text-slate-400">
            Pacing feel: <span className="text-slate-200">{data.category}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl mb-6 transition-all">
      {/* Header Bar */}
      <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              Scene Pacing & Duration Distribution
              <span className="text-[11px] font-mono text-slate-400 font-normal">
                ({scenes.length} Scenes • Avg {avgDuration}s)
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Visualize scene rhythm to balance fast action cuts vs. extended dramatic beats
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
                viewMode === 'timeline' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Timeline Flow
            </button>
            <button
              onClick={() => setViewMode('distribution')}
              className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
                viewMode === 'distribution' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Duration Buckets
            </button>
          </div>

          {/* Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title={isCollapsed ? 'Expand Pacing Chart' : 'Collapse Pacing Chart'}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-4 space-y-4">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block truncate">Avg Duration</span>
                <span className="text-sm font-mono font-bold text-white">{avgDuration}s</span>
              </div>
            </div>

            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-sky-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block truncate">Fastest Beat</span>
                <span className="text-sm font-mono font-bold text-sky-300">
                  {minDuration}s <span className="text-[10px] text-slate-500 font-normal font-sans">({shortestScenes.map(s => `S${s.sceneNumber}`).join(', ')})</span>
                </span>
              </div>
            </div>

            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2.5">
              <TrendingUp className="w-4 h-4 text-purple-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block truncate">Longest Scene</span>
                <span className="text-sm font-mono font-bold text-purple-300">
                  {maxDuration}s <span className="text-[10px] text-slate-500 font-normal font-sans">({longestScenes.map(s => `S${s.sceneNumber}`).join(', ')})</span>
                </span>
              </div>
            </div>

            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2.5">
              <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block truncate">Pacing Rhythm</span>
                <span className="text-xs font-semibold text-emerald-400 truncate block">
                  {hasExtremeOutliers ? 'High Contrast' : 'Balanced Cinematic'}
                </span>
              </div>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
            <div className="h-44 w-full">
              {viewMode === 'timeline' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={timelineData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    onClick={(state) => {
                      if (state && state.activePayload && state.activePayload.length) {
                        const sceneNum = state.activePayload[0].payload.sceneNumber;
                        if (onSelectScene) onSelectScene(sceneNum);
                      }
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#94a3b8', fontSize: 10 }}
                      stroke="#475569"
                    />
                    <YAxis 
                      unit="s"
                      tick={{ fill: '#94a3b8', fontSize: 10 }}
                      stroke="#475569"
                      domain={[0, (dataMax: number) => Math.max(dataMax + 2, 12)]}
                    />
                    <Tooltip content={<CustomTimelineTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                    <ReferenceLine 
                      y={avgDuration} 
                      stroke="#f59e0b" 
                      strokeDasharray="4 4" 
                      label={{ 
                        value: `Avg ${avgDuration}s`, 
                        fill: '#f59e0b', 
                        fontSize: 10, 
                        position: 'right' 
                      }} 
                    />
                    <Bar 
                      dataKey="duration" 
                      radius={[4, 4, 0, 0]}
                      className="cursor-pointer"
                    >
                      {timelineData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={distributionData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                      stroke="#475569"
                    />
                    <YAxis 
                      unit=" scenes"
                      tick={{ fill: '#94a3b8', fontSize: 10 }}
                      stroke="#475569"
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomDistributionTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                    <Bar 
                      dataKey="count" 
                      radius={[6, 6, 0, 0]}
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`bucket-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Legend & Guide */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 mt-2 border-t border-slate-800 text-[11px] text-slate-400">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-sky-400" />
                  <span>Snappy Cut (&le; 5s)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" />
                  <span>Standard Beat (6&ndash;10s)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-purple-400" />
                  <span>Extended / Slow (&ge; 11s)</span>
                </span>
              </div>

              {hasExtremeOutliers && (
                <div className="flex items-center gap-1 text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20 text-[10px]">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  <span>Noticeable pacing variation detected</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
