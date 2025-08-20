import React from 'react';
import {
  JoyIcon,
  SadnessIcon,
  LoveIcon,
  GrowthIcon,
  FearIcon,
  PeaceIcon,
  HopeIcon,
  GentleIcon,
  AnxietyIcon,
} from '../components/emotion-icons';
import { EmotionTile } from '../components/EmotionTile';

const emotionData = [
  {
    icon: JoyIcon,
    label: 'Joy',
    colorClass: 'bg-yellow-50 text-yellow-600 hover:ring-yellow-300',
  },
  {
    icon: SadnessIcon,
    label: 'Sadness',
    colorClass: 'bg-blue-50 text-blue-600 hover:ring-blue-300',
  },
  {
    icon: LoveIcon,
    label: 'Love',
    colorClass: 'bg-pink-50 text-pink-600 hover:ring-pink-300',
  },
  {
    icon: GrowthIcon,
    label: 'Growth',
    colorClass: 'bg-green-50 text-green-600 hover:ring-green-300',
  },
  {
    icon: FearIcon,
    label: 'Fear',
    colorClass: 'bg-purple-50 text-purple-600 hover:ring-purple-300',
  },
  {
    icon: PeaceIcon,
    label: 'Peace',
    colorClass: 'bg-indigo-50 text-indigo-600 hover:ring-indigo-300',
  },
  {
    icon: HopeIcon,
    label: 'Hope',
    colorClass: 'bg-orange-50 text-orange-600 hover:ring-orange-300',
  },
  {
    icon: GentleIcon,
    label: 'Gentle',
    colorClass: 'bg-teal-50 text-teal-600 hover:ring-teal-300',
  },
  {
    icon: AnxietyIcon,
    label: 'Anxiety',
    colorClass: 'bg-red-50 text-red-600 hover:ring-red-300',
  },
];

export default function Emotions() {
  const handleEmotionClick = (emotion: string) => {
    console.log(`Emotion clicked: ${emotion}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Emotion Icons
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A collection of animated SVG icons representing different emotions. 
            Each icon has subtle, loopable animations that respect user motion preferences.
          </p>
        </div>

        {/* Grid of emotion tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {emotionData.map(({ icon: Icon, label, colorClass }) => (
            <EmotionTile
              key={label}
              label={label}
              colorClass={colorClass}
              onClick={() => handleEmotionClick(label)}
            >
              <Icon size={48} aria-label={label} />
            </EmotionTile>
          ))}
        </div>

        {/* Size variations demo */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
            Size Variations
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="text-center">
              <JoyIcon size={32} className="text-yellow-500" aria-label="Joy small" />
              <p className="text-sm text-slate-600 mt-2">32px</p>
            </div>
            <div className="text-center">
              <JoyIcon size={48} className="text-yellow-500" aria-label="Joy medium" />
              <p className="text-sm text-slate-600 mt-2">48px</p>
            </div>
            <div className="text-center">
              <JoyIcon size={64} className="text-yellow-500" aria-label="Joy large" />
              <p className="text-sm text-slate-600 mt-2">64px</p>
            </div>
          </div>
        </div>

        {/* Color variations demo */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mt-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
            Color Variations
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="text-center">
              <JoyIcon size={48} className="text-emerald-500" aria-label="Joy emerald" />
              <p className="text-sm text-slate-600 mt-2">Emerald</p>
            </div>
            <div className="text-center">
              <JoyIcon size={48} className="text-rose-500" aria-label="Joy rose" />
              <p className="text-sm text-slate-600 mt-2">Rose</p>
            </div>
            <div className="text-center">
              <JoyIcon size={48} className="text-violet-500" aria-label="Joy violet" />
              <p className="text-sm text-slate-600 mt-2">Violet</p>
            </div>
            <div className="text-center">
              <JoyIcon size={48} className="text-slate-800" aria-label="Joy slate" />
              <p className="text-sm text-slate-600 mt-2">Slate</p>
            </div>
          </div>
        </div>

        {/* Accessibility note */}
        <div className="mt-8 text-center text-slate-600">
          <p className="text-sm">
            💡 Tip: These icons respect <code className="bg-slate-200 px-1 rounded">prefers-reduced-motion</code> 
            and will pause animations when users have motion sensitivity enabled.
          </p>
        </div>
      </div>
    </div>
  );
}
