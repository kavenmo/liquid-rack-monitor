import { CabinetMetrics, AlertLevel, MonitoringData } from '@/types/monitoring';

// 生成随机告警级别
const getRandomAlertLevel = (): AlertLevel => {
  const levels: AlertLevel[] = ['normal', 'caution', 'warning', 'critical'];
  const weights = [0.7, 0.15, 0.1, 0.05]; // 正常状态占70%，其他告警逐渐减少
  
  const random = Math.random();
  let sum = 0;
  
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i];
    if (random <= sum) {
      return levels[i];
    }
  }
  
  return 'normal';
};

// 根据告警级别生成对应的异常值
const generateValueByAlert = (baseValue: number, alertLevel: AlertLevel, factor = 1): number => {
  switch (alertLevel) {
    case 'normal':
      return baseValue + (Math.random() - 0.5) * 2 * factor;
    case 'caution':
      return baseValue + (Math.random() > 0.5 ? 1 : -1) * (5 + Math.random() * 5) * factor;
    case 'warning':
      return baseValue + (Math.random() > 0.5 ? 1 : -1) * (10 + Math.random() * 10) * factor;
    case 'critical':
      return baseValue + (Math.random() > 0.5 ? 1 : -1) * (20 + Math.random() * 20) * factor;
  }
};

export const generateMockData = (): MonitoringData => {
  const cabinets: CabinetMetrics[] = [];

  // 生成6个机柜的数据
  for (let cabinetId = 1; cabinetId <= 6; cabinetId++) {
    const overallAlert = getRandomAlertLevel();
    const powerAlert = getRandomAlertLevel();
    const inputFlowAlert = getRandomAlertLevel();
    const outputFlowAlert = getRandomAlertLevel();
    const tempAlert = getRandomAlertLevel();
    const liquidAlert = getRandomAlertLevel();

    // 生成服务器数据（每个机柜4-8台服务器）
    const serverCount = Math.floor(Math.random() * 5) + 4;
    const servers = [];

    for (let serverId = 1; serverId <= serverCount; serverId++) {
      const serverAlert = getRandomAlertLevel();
      const temp1Alert = getRandomAlertLevel();
      const temp2Alert = getRandomAlertLevel();

      servers.push({
        id: `S${serverId.toString().padStart(2, '0')}`,
        name: `Server-${cabinetId}${serverId.toString().padStart(2, '0')}`,
        temperaturePoints: [
          {
            id: `${cabinetId}-${serverId}-1`,
            name: `探测点1`,
            temperature: generateValueByAlert(45, temp1Alert, 0.5),
            alertLevel: temp1Alert
          },
          {
            id: `${cabinetId}-${serverId}-2`, 
            name: `探测点2`,
            temperature: generateValueByAlert(42, temp2Alert, 0.5),
            alertLevel: temp2Alert
          }
        ],
        alertLevel: serverAlert
      });
    }

    const cabinet: CabinetMetrics = {
      id: `C${cabinetId.toString().padStart(2, '0')}`,
      name: `机柜-${cabinetId}`,
      powerMetrics: {
        current: generateValueByAlert(85, powerAlert, 0.1),
        voltage: generateValueByAlert(220, powerAlert, 0.02),
        power: generateValueByAlert(18700, powerAlert, 0.05),
        alertLevel: powerAlert
      },
      inputFlow: {
        flowRate: generateValueByAlert(45, inputFlowAlert, 0.2),
        pressure: generateValueByAlert(350, inputFlowAlert, 0.1),
        flowSpeed: generateValueByAlert(1.8, inputFlowAlert, 0.1),
        temperature: generateValueByAlert(25, inputFlowAlert, 0.3), // 进液温度 ~25°C
        alertLevel: inputFlowAlert
      },
      outputFlow: {
        flowRate: generateValueByAlert(44, outputFlowAlert, 0.2),
        pressure: generateValueByAlert(280, outputFlowAlert, 0.1),
        flowSpeed: generateValueByAlert(1.7, outputFlowAlert, 0.1),
        temperature: generateValueByAlert(35, outputFlowAlert, 0.3), // 出液温度 ~35°C
        alertLevel: outputFlowAlert
      },
      cabinetTemperature: generateValueByAlert(28, tempAlert, 0.3),
      cabinetTemperatureAlert: tempAlert,
      liquidLevel: Math.max(10, Math.min(100, generateValueByAlert(85, liquidAlert, 0.2))),
      liquidLevelAlert: liquidAlert,
      hasLeak: Math.random() < 0.05, // 5%的概率有漏液
      servers,
      overallAlert
    };

    cabinets.push(cabinet);
  }

  return {
    cabinets,
    lastUpdated: new Date()
  };
};