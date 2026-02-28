import React from 'react';
import * as LucideIcons from 'lucide-react';

// Fallback icon if requested icon doesn't exist
const FallbackIcon = ({ size, color, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const Icon = ({ name, size = 24, color = "currentColor", className = "", strokeWidth = 2 }) => {
  // If name is empty or undefined, show fallback
  if (!name) {
    console.warn('Icon name is empty or undefined');
    return <FallbackIcon size={size} color={color} className={className} />;
  }

  // Check if the icon exists in Lucide icons
  const LucideIcon = LucideIcons[name];
  
  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in Lucide icons. Using fallback.`);
    return <FallbackIcon size={size} color={color} className={className} />;
  }

  return <LucideIcon size={size} color={color} strokeWidth={strokeWidth} className={className} />;
};

export default Icon;