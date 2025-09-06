import { CabinetMetrics } from '@/types/monitoring';
import { AlertIndicator, AlertBadge } from './AlertIndicator';
import { MetricCard, MetricGroup } from './MetricCard';
import { ServerGrid } from './ServerCard';
import { 
  Zap, 
  Gauge, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Thermometer, 
  Droplets, 
  AlertTriangle,
  Server
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CabinetCardProps {
  cabinet: CabinetMetrics;
}

export const CabinetCard = ({ cabinet }: CabinetCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const getFlowTrend = (input: number, output: number) => {
    const diff = Math.abs(input - output);
    if (diff > 5) return input > output ? 'up' : 'down';
    return 'stable';
  };

  return (
    <Card className="bg-monitor-panel border-monitor-border hover:bg-monitor-surface transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Server className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg text-monitor-text-primary">{cabinet.name}</CardTitle>
              <p className="text-sm text-monitor-text-muted">机柜 {cabinet.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {cabinet.hasLeak && (
              <div className="flex items-center gap-1 bg-alert-critical/10 text-alert-critical px-2 py-1 rounded-md border border-alert-critical/20">
                <AlertTriangle className="w-3 h-3" />
                <span className="text-xs font-medium">漏液</span>
              </div>
            )}
            <AlertBadge level={cabinet.overallAlert} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 电力指标 */}
        <MetricGroup title="电力指标" alertLevel={cabinet.powerMetrics.alertLevel}>
          <MetricCard
            title="电流"
            value={cabinet.powerMetrics.current}
            unit="A"
            alertLevel={cabinet.powerMetrics.alertLevel}
            icon={<Activity className="w-3 h-3" />}
          />
          <MetricCard
            title="电压"
            value={cabinet.powerMetrics.voltage}
            unit="V"
            alertLevel={cabinet.powerMetrics.alertLevel}
            icon={<Zap className="w-3 h-3" />}
          />
          <MetricCard
            title="功率"
            value={cabinet.powerMetrics.power}
            unit="W"
            alertLevel={cabinet.powerMetrics.alertLevel}
            icon={<Gauge className="w-3 h-3" />}
          />
        </MetricGroup>

        {/* 液冷系统 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <MetricGroup title="进液指标" alertLevel={cabinet.inputFlow.alertLevel}>
            <MetricCard
              title="流量"
              value={cabinet.inputFlow.flowRate}
              unit="L/min"
              alertLevel={cabinet.inputFlow.alertLevel}
              icon={<TrendingUp className="w-3 h-3" />}
              trend={getFlowTrend(cabinet.inputFlow.flowRate, cabinet.outputFlow.flowRate)}
            />
            <MetricCard
              title="压力"
              value={cabinet.inputFlow.pressure}
              unit="kPa"
              alertLevel={cabinet.inputFlow.alertLevel}
              icon={<Gauge className="w-3 h-3" />}
            />
            <MetricCard
              title="流速"
              value={cabinet.inputFlow.flowSpeed}
              unit="m/s"
              alertLevel={cabinet.inputFlow.alertLevel}
              icon={<Activity className="w-3 h-3" />}
            />
            <MetricCard
              title="进液温度"
              value={cabinet.inputFlow.temperature}
              unit="°C"
              alertLevel={cabinet.inputFlow.alertLevel}
              icon={<Thermometer className="w-3 h-3" />}
            />
          </MetricGroup>

          <MetricGroup title="出液指标" alertLevel={cabinet.outputFlow.alertLevel}>
            <MetricCard
              title="流量"
              value={cabinet.outputFlow.flowRate}
              unit="L/min"
              alertLevel={cabinet.outputFlow.alertLevel}
              icon={<TrendingDown className="w-3 h-3" />}
              trend={getFlowTrend(cabinet.outputFlow.flowRate, cabinet.inputFlow.flowRate)}
            />
            <MetricCard
              title="压力"
              value={cabinet.outputFlow.pressure}
              unit="kPa"
              alertLevel={cabinet.outputFlow.alertLevel}
              icon={<Gauge className="w-3 h-3" />}
            />
            <MetricCard
              title="流速"
              value={cabinet.outputFlow.flowSpeed}
              unit="m/s"
              alertLevel={cabinet.outputFlow.alertLevel}
              icon={<Activity className="w-3 h-3" />}
            />
            <MetricCard
              title="出液温度"
              value={cabinet.outputFlow.temperature}
              unit="°C"
              alertLevel={cabinet.outputFlow.alertLevel}
              icon={<Thermometer className="w-3 h-3" />}
            />
          </MetricGroup>
        </div>

        {/* 温度和液位 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MetricCard
            title="机箱温度"
            value={cabinet.cabinetTemperature}
            unit="°C"
            alertLevel={cabinet.cabinetTemperatureAlert}
            icon={<Thermometer className="w-4 h-4" />}
            className="md:col-span-1"
          />
          <MetricCard
            title="液位"
            value={cabinet.liquidLevel}
            unit="%"
            alertLevel={cabinet.liquidLevelAlert}
            icon={<Droplets className="w-4 h-4" />}
            className="md:col-span-1"
          />
        </div>

        {/* 服务器概览 */}
        <div className="pt-3 border-t border-monitor-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-monitor-text-primary">
                服务器状态 ({cabinet.servers.length}台)
              </span>
              <div className="flex items-center gap-1">
                {['normal', 'caution', 'warning', 'critical'].map((level) => {
                  const count = cabinet.servers.filter(s => s.alertLevel === level).length;
                  if (count === 0) return null;
                  return (
                    <div key={level} className="flex items-center gap-1">
                      <AlertIndicator level={level as any} size="sm" />
                      <span className="text-xs text-monitor-text-muted">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowDetails(!showDetails)}
              className="bg-monitor-surface border-monitor-border text-monitor-text-secondary hover:bg-monitor-panel"
            >
              {showDetails ? '收起详情' : '查看详情'}
            </Button>
          </div>
        </div>

        {/* 服务器详细信息 */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-monitor-border">
            <ServerGrid servers={cabinet.servers} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};