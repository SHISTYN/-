
import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconRendererProps {
  iconName: string;
  className?: string;
  size?: number;
}

const IconRenderer: React.FC<IconRendererProps> = ({ iconName, className, size = 16 }) => {
  // Cast to any to prevent Rollup from trying to statically analyze dynamic property access
  // which causes "traceVariable" errors during build
  const IconsMap = LucideIcons as any;
  const IconComponent = IconsMap[iconName];

  if (!IconComponent) {
    // Fallback icon if name not found
    return <LucideIcons.Sparkles size={size} className={className} />;
  }

  return <IconComponent size={size} className={className} />;
};

export default IconRenderer;
