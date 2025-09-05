import { AlertLevel } from '@/types/monitoring';
import { cn } from '@/lib/utils';

interface AlertIndicatorProps {
  level: AlertLevel;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
}

export const AlertIndicator = ({ 
  level, 
  size = 'md', 
  showPulse = false 
}: AlertIndicatorProps) => {
  const getAlertStyles = () => {
    const baseClasses = 'rounded-full border-2 transition-all duration-300';
    
    const sizeClasses = {
      sm: 'w-2 h-2',
      md: 'w-3 h-3',
      lg: 'w-4 h-4'
    };

    const levelClasses = {
      normal: 'bg-alert-normal border-alert-normal shadow-[0_0_8px_hsl(var(--alert-normal)/0.6)]',
      caution: 'bg-alert-caution border-alert-caution shadow-[0_0_8px_hsl(var(--alert-caution)/0.6)]',
      warning: 'bg-alert-warning border-alert-warning shadow-[0_0_8px_hsl(var(--alert-warning)/0.6)]',
      critical: 'bg-alert-critical border-alert-critical shadow-[0_0_8px_hsl(var(--alert-critical)/0.6)]'
    };

    const pulseClasses = showPulse && level !== 'normal' 
      ? 'animate-pulse' 
      : '';

    return cn(baseClasses, sizeClasses[size], levelClasses[level], pulseClasses);
  };

  return (
    <div className={getAlertStyles()} />
  );
};

interface AlertBadgeProps {
  level: AlertLevel;
  label?: string;
}

export const AlertBadge = ({ level, label }: AlertBadgeProps) => {
  const getLevelText = () => {
    switch (level) {
      case 'normal': return '正常';
      case 'caution': return '注意';
      case 'warning': return '警告';
      case 'critical': return '严重';
    }
  };

  const getBadgeStyles = () => {
    const baseClasses = 'px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 border';
    
    const levelClasses = {
      normal: 'bg-alert-normal/10 text-alert-normal border-alert-normal/20',
      caution: 'bg-alert-caution/10 text-alert-caution border-alert-caution/20',
      warning: 'bg-alert-warning/10 text-alert-warning border-alert-warning/20',
      critical: 'bg-alert-critical/10 text-alert-critical border-alert-critical/20'
    };

    return cn(baseClasses, levelClasses[level]);
  };

  return (
    <div className={getBadgeStyles()}>
      <AlertIndicator level={level} size="sm" showPulse={level !== 'normal'} />
      {label || getLevelText()}
    </div>
  );
};