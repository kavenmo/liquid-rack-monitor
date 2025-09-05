import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CabinetCard } from '@/components/monitoring/CabinetCard';
import { AlertBadge } from '@/components/monitoring/AlertIndicator';
import { generateMockData } from '@/utils/mockData';
import { MonitoringData, AlertLevel } from '@/types/monitoring';
import { Monitor, RefreshCw, Server, AlertTriangle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();
  const [monitoringData, setMonitoringData] = useState<MonitoringData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 模拟实时数据更新
  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setMonitoringData(generateMockData());
      setIsRefreshing(false);
    }, 500);
  };

  useEffect(() => {
    // 初始化数据
    refreshData();

    // 每30秒自动刷新数据
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, []);

  // 计算总体统计
  const getOverallStats = () => {
    if (!monitoringData) return null;

    const totalServers = monitoringData.cabinets.reduce((sum, cabinet) => sum + cabinet.servers.length, 0);
    const alertCounts = {
      critical: 0,
      warning: 0, 
      caution: 0,
      normal: 0
    };

    monitoringData.cabinets.forEach(cabinet => {
      alertCounts[cabinet.overallAlert]++;
      cabinet.servers.forEach(server => {
        alertCounts[server.alertLevel]++;
      });
    });

    const leakCount = monitoringData.cabinets.filter(c => c.hasLeak).length;

    return {
      totalCabinets: monitoringData.cabinets.length,
      totalServers,
      alertCounts,
      leakCount
    };
  };

  const stats = getOverallStats();

  if (!monitoringData || !stats) {
    return (
      <div className="min-h-screen bg-monitor-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-monitor-text-secondary">加载监控数据...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-monitor-bg">
      {/* 顶部状态栏 */}
      <div className="bg-monitor-panel border-b border-monitor-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Monitor className="w-6 h-6 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-monitor-text-primary">IDC液冷监控系统</h1>
                <p className="text-sm text-monitor-text-muted">
                  最后更新: {monitoringData.lastUpdated.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* 总体状态 */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-monitor-text-muted" />
                <span className="text-monitor-text-secondary">{stats.totalCabinets}个机柜</span>
              </div>
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-monitor-text-muted" />
                <span className="text-monitor-text-secondary">{stats.totalServers}台服务器</span>
              </div>
              {stats.leakCount > 0 && (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-alert-critical" />
                  <span className="text-alert-critical">{stats.leakCount}个漏液</span>
                </div>
              )}
            </div>

            {/* 告警统计 */}
            <div className="flex items-center gap-2">
              {(['critical', 'warning', 'caution', 'normal'] as AlertLevel[]).map(level => {
                const count = stats.alertCounts[level];
                if (count === 0 && level === 'normal') return null;
                return (
                  <AlertBadge key={level} level={level} label={count.toString()} />
                );
              })}
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshData}
              disabled={isRefreshing}
              className="bg-monitor-surface border-monitor-border text-monitor-text-secondary hover:bg-monitor-panel"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              刷新数据
            </Button>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="p-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {monitoringData.cabinets.map((cabinet) => (
            <div key={cabinet.id} className="relative group">
              <CabinetCard cabinet={cabinet} />
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  size="sm"
                  onClick={() => navigate(`/cabinet/${cabinet.id}`)}
                  className="bg-primary hover:bg-primary/90 text-white shadow-lg"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  详细监控
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
