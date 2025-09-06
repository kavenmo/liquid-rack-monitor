export type AlertLevel = 'normal' | 'caution' | 'warning' | 'critical';

export interface PowerMetrics {
  current: number; // 电流 (A)
  voltage: number; // 电压 (V)
  power: number; // 功率 (W)
}

export interface FlowMetrics {
  flowRate: number; // 流量 (L/min)
  pressure: number; // 压力 (kPa)
  flowSpeed: number; // 流速 (m/s)
  temperature: number; // 温度 (°C)
}

export interface TemperaturePoint {
  id: string;
  name: string;
  temperature: number;
  alertLevel: AlertLevel;
}

export interface ServerMetrics {
  id: string;
  name: string;
  temperaturePoints: TemperaturePoint[]; // 每个服务器两个探测点
  alertLevel: AlertLevel;
}

export interface CabinetMetrics {
  id: string;
  name: string;
  powerMetrics: PowerMetrics & { alertLevel: AlertLevel };
  inputFlow: FlowMetrics & { alertLevel: AlertLevel };
  outputFlow: FlowMetrics & { alertLevel: AlertLevel };
  cabinetTemperature: number;
  cabinetTemperatureAlert: AlertLevel;
  liquidLevel: number; // 液位百分比 (0-100)
  liquidLevelAlert: AlertLevel;
  hasLeak: boolean; // 漏液标识
  servers: ServerMetrics[];
  overallAlert: AlertLevel;
}

export interface MonitoringData {
  cabinets: CabinetMetrics[];
  lastUpdated: Date;
}