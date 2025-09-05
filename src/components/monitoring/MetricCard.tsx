import { AlertLevel } from '@/types/monitoring';
import { AlertIndicator } from './AlertIndicator';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  alertLevel: AlertLevel;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
  className?: string;
}

export const MetricCard = ({
  title,
  value,
  unit,
  alertLevel,
  icon,
  trend,
  className
}: MetricCardProps) => {
  const formatValue = (val: string | number): string => {
    if (typeof val === 'number') {
      return val.toFixed(1);
    }
    return val;
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    
    const iconClasses = 'w-3 h-3';
    switch (trend) {
      case 'up':
        return <div className={cn(iconClasses, 'text-alert-warning')}>↗</div>;
      case 'down':
        return <div className={cn(iconClasses, 'text-alert-caution')}>↘</div>;
      case 'stable':
        return <div className={cn(iconClasses, 'text-monitor-text-muted')}>→</div>;
    }
  };

  return (
    <div className={cn(
      'bg-monitor-panel border border-monitor-border rounded-lg p-3 transition-all duration-300 hover:bg-monitor-surface',
      className
    )}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon && <div className="text-monitor-text-secondary">{icon}</div>}
          <span className="text-xs font-medium text-monitor-text-secondary">{title}</span>
        </div>
        <AlertIndicator level={alertLevel} size="sm" showPulse />
      </div>
      
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-bold text-monitor-text-primary">
          {formatValue(value)}
        </span>
        {unit && (
          <span className="text-xs text-monitor-text-muted">{unit}</span>
        )}
        {getTrendIcon()}
      </div>
    </div>
  );
};

interface MetricGroupProps {
  title: string;
  children: React.ReactNode;
  alertLevel?: AlertLevel;
}

export const MetricGroup = ({ title, children, alertLevel }: MetricGroupProps) => {
  return (
    <div className="bg-monitor-surface border border-monitor-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-monitor-text-primary">{title}</h3>
        {alertLevel && <AlertIndicator level={alertLevel} size="md" showPulse />}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {children}
      </div>
    </div>
  );
};