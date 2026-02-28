import React from 'react';

const LevelCard = ({ level, onStartCase }) => {
  const {
    levelNumber,
    title,
    difficulty,
    difficultyColor,
    icon,
    description,
    features,
    tagline,
    progress
  } = level;

  const getDifficultyColor = () => {
    switch(difficultyColor) {
      case 'cyan': return 'from-cyan-500 to-blue-500';
      case 'orange': return 'from-orange-500 to-red-500';
      case 'green': return 'from-green-500 to-teal-500';
      default: return 'from-cyan-500 to-blue-500';
    }
  };

  const getDifficultyBadgeColor = () => {
    switch(difficultyColor) {
      case 'cyan': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'orange': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'green': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
    }
  };

  // Calculate progress percentage for level 1
  const progressPercentage = progress && progress.discoveries 
    ? (progress.discoveries.length / 5) * 100 
    : 0;

  const discoveriesFound = progress?.discoveries?.length || 0;
  const isCompleted = progress?.completed || false;

  return (
    <div className={`level-card group ${isCompleted ? 'completed' : ''}`}>
      {/* Card Header with Gradient */}
      <div className={`relative h-32 bg-gradient-to-br ${getDifficultyColor()} rounded-t-2xl overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-black/10 rounded-full"></div>
        
        {/* Level Number and Icon */}
        <div className="relative z-10 p-6">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-sm font-semibold text-white/80">Case</span>
              <h3 className="text-3xl font-bold text-white">{levelNumber}</h3>
            </div>
            <div className="text-4xl filter drop-shadow-lg">{icon}</div>
          </div>
        </div>
        
        {/* Difficulty Badge */}
        <div className="absolute bottom-4 right-4">
          <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getDifficultyBadgeColor()}`}>
            {difficulty}
          </span>
        </div>

        {/* Completed Badge */}
        {isCompleted && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full border border-green-300 shadow-lg">
              ✅ COMPLETED
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-6 bg-[#1a1d3a] rounded-b-2xl">
        <h4 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition">
          {title}
        </h4>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {description}
        </p>

        {/* Progress Bar for Level 1 */}
        {levelNumber === '#101' && progress && (
          <div className="mb-4">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-cyan-400">Progress</span>
              <span className="text-white">{discoveriesFound}/5 discoveries</span>
            </div>
            <div className="w-full h-1.5 bg-[#0a0a1a] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            {isCompleted && (
              <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
                <span>✅</span> Completed with {progress.accuracy}% accuracy
              </div>
            )}
          </div>
        )}

        {/* Features List */}
        <div className="space-y-2 mb-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <span className="text-cyan-400">•</span>
              <span className={`${isCompleted ? 'text-green-400 line-through opacity-70' : 'text-gray-300'}`}>
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* Tagline */}
        <p className="text-xs text-gray-500 italic mb-4">"{tagline}"</p>

        {/* Start Button */}
        <button
          onClick={() => onStartCase(level)}
          className={`w-full py-3 font-semibold rounded-lg transition transform hover:scale-[1.02] 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1a1d3a]
            ${isCompleted 
              ? 'bg-green-600 hover:bg-green-500 text-white focus:ring-green-500' 
              : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white focus:ring-cyan-500'
            }`}
        >
          {isCompleted ? 'Review Case' : 'Start Investigation'}
        </button>
      </div>
    </div>
  );
};

export default LevelCard;