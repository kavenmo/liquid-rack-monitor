import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CabinetMetrics } from '@/types/monitoring';
import { generateMockData } from '@/utils/mockData';
import { CabinetCard } from '@/components/monitoring/CabinetCard';
import { ServerGrid } from '@/components/monitoring/ServerCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';

const CabinetDetail = () => {
  const { cabinetId } = useParams<{ cabinetId: string }>();
  const navigate = useNavigate();
  const [cabinet, setCabinet] = useState<CabinetMetrics | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadCabinetData = async () => {
    setIsRefreshing(true);
    try {
      const data = generateMockData();
      const foundCabinet = data.cabinets.find(c => c.id === cabinetId);
      setCabinet(foundCabinet || null);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load cabinet data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadCabinetData();
  }, [cabinetId]);

  if (!cabinet) {
    return (
      <div className="min-h-screen bg-monitor-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="bg-monitor-surface border-monitor-border text-monitor-text-secondary hover:bg-monitor-panel"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回机房总览
            </Button>
          </div>
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-monitor-text-primary mb-2">
              机柜未找到
            </h2>
            <p className="text-monitor-text-muted">
              机柜 ID "{cabinetId}" 不存在或暂时无法访问
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-monitor-background">
      <div className="container mx-auto px-4 py-8">
        {/* 页面头部 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="bg-monitor-surface border-monitor-border text-monitor-text-secondary hover:bg-monitor-panel"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回机房总览
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-monitor-text-primary">
                {cabinet.name} 详细监控
              </h1>
              <p className="text-monitor-text-muted">
                机柜 ID: {cabinet.id} | 最后更新: {lastUpdated.toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          <Button 
            onClick={loadCabinetData}
            disabled={isRefreshing}
            className="bg-primary hover:bg-primary/90"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? '刷新中...' : '刷新数据'}
          </Button>
        </div>

        {/* 机柜概览卡片 */}
        <div className="mb-8">
          <CabinetCard cabinet={cabinet} />
        </div>

        {/* 服务器详细信息 */}
        <div className="bg-monitor-surface border border-monitor-border rounded-lg p-6">
          <ServerGrid servers={cabinet.servers} />
        </div>
      </div>
    </div>
  );
};

export default CabinetDetail;