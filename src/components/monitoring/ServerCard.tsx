import { ServerMetrics } from '@/types/monitoring';
import { AlertIndicator, AlertBadge } from './AlertIndicator';
import { MetricCard } from './MetricCard';
import { Thermometer } from 'lucide-react';

interface ServerCardProps {
  server: ServerMetrics;
}

export const ServerCard = ({ server }: ServerCardProps) => {
  return (
    <div className="bg-monitor-panel border border-monitor-border rounded-lg p-4 hover:bg-monitor-surface transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <span className="text-xs font-bold text-primary">{server.id}</span>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-monitor-text-primary">{server.name}</h4>
            <p className="text-xs text-monitor-text-muted">服务器 {server.id}</p>
          </div>
        </div>
        <AlertBadge level={server.alertLevel} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {server.temperaturePoints.map((point, index) => (
          <MetricCard
            key={point.id}
            title={`温度探测点 ${index + 1}`}
            value={point.temperature}
            unit="°C"
            alertLevel={point.alertLevel}
            icon={<Thermometer className="w-3 h-3" />}
            trend={point.temperature > 65 ? 'up' : point.temperature < 35 ? 'down' : 'stable'}
          />
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-monitor-border">
        <div className="flex justify-between items-center text-xs">
          <span className="text-monitor-text-muted">平均温度</span>
          <span className="text-monitor-text-secondary font-medium">
            {(server.temperaturePoints.reduce((sum, point) => sum + point.temperature, 0) / server.temperaturePoints.length).toFixed(1)}°C
          </span>
        </div>
      </div>
    </div>
  );
};

interface ServerGridProps {
  servers: ServerMetrics[];
}

export const ServerGrid = ({ servers }: ServerGridProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-monitor-text-primary">
          机柜服务器状态 ({servers.length}台)
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-monitor-text-muted">
            告警: {servers.filter(s => s.alertLevel !== 'normal').length}台
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {servers.map((server) => (
          <ServerCard key={server.id} server={server} />
        ))}
      </div>
    </div>
  );
};