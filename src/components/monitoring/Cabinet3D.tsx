import { useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Text } from '@react-three/drei';
import { CabinetMetrics, AlertLevel } from '@/types/monitoring';
import * as THREE from 'three';

interface Cabinet3DProps {
  cabinet: CabinetMetrics;
}

const alertColors = {
  normal: '#22c55e',
  caution: '#eab308', 
  warning: '#f97316',
  critical: '#ef4444'
};

const Server3D = ({ 
  position, 
  alertLevel, 
  name, 
  index 
}: { 
  position: [number, number, number];
  alertLevel: AlertLevel;
  name: string;
  index: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  return (
    <group position={position}>
      {/* Server body - 4U server (177.8mm height) */}
      <Box
        ref={meshRef}
        args={[0.22, 0.178, 0.6]} // 220mm × 177.8mm × 600mm in scale
        position={[0, 0, 0]}
      >
        <meshStandardMaterial 
          color={alertColors[alertLevel]}
          metalness={0.6}
          roughness={0.4}
          transparent
          opacity={0.9}
        />
      </Box>
      
      {/* Server label */}
      <Text
        position={[0, 0.1, 0.31]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.02}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
      
      {/* Front panel LED indicator */}
      <Box
        args={[0.015, 0.015, 0.015]}
        position={[0.11, 0.08, 0.31]}
      >
        <meshStandardMaterial 
          color={alertColors[alertLevel]}
          emissive={alertColors[alertLevel]}
          emissiveIntensity={0.8}
        />
      </Box>
    </group>
  );
};

const LiquidFlow = ({ isInlet }: { isInlet: boolean }) => {
  const position: [number, number, number] = isInlet ? [-0.95, 0.2, 0.31] : [0.95, 0.2, 0.31];
  const color = isInlet ? '#3b82f6' : '#ef4444'; // 蓝色进液，红色出液
  
  return (
    <group position={position}>
      {/* 管道 */}
      <Box args={[0.05, 0.05, 0.1]}>
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </Box>
      
      {/* 流向箭头 */}
      <Text
        position={[0, 0.08, 0]}
        fontSize={0.03}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {isInlet ? '↓ 冷液进' : '↑ 热液出'}
      </Text>
    </group>
  );
};

const CabinetFrame = () => {
  const cabinetMaterial = useMemo(() => (
    <meshStandardMaterial 
      color="#374151" 
      metalness={0.8} 
      roughness={0.2} 
      transparent 
      opacity={0.3}
    />
  ), []);

  const liquidMaterial = useMemo(() => (
    <meshStandardMaterial 
      color="#0ea5e9" 
      metalness={0.1} 
      roughness={0.8} 
      transparent 
      opacity={0.4}
    />
  ), []);

  return (
    <group>
      {/* Cabinet frame - 2000mm × 600mm × 1200mm */}
      {/* Bottom frame */}
      <Box args={[2.0, 0.02, 1.2]} position={[0, -0.3, 0]}>
        {cabinetMaterial}
      </Box>
      
      {/* Top frame */}
      <Box args={[2.0, 0.02, 1.2]} position={[0, 0.3, 0]}>
        {cabinetMaterial}
      </Box>
      
      {/* Side frames */}
      <Box args={[0.02, 0.6, 1.2]} position={[-1.0, 0, 0]}>
        {cabinetMaterial}
      </Box>
      <Box args={[0.02, 0.6, 1.2]} position={[1.0, 0, 0]}>
        {cabinetMaterial}
      </Box>
      
      {/* Back frame */}
      <Box args={[2.0, 0.6, 0.02]} position={[0, 0, -0.6]}>
        {cabinetMaterial}
      </Box>
      
      {/* Front frame (partial) */}
      <Box args={[2.0, 0.05, 0.02]} position={[0, 0.275, 0.6]}>
        {cabinetMaterial}
      </Box>
      <Box args={[2.0, 0.05, 0.02]} position={[0, -0.275, 0.6]}>
        {cabinetMaterial}
      </Box>
      
      {/* Liquid pool */}
      <Box args={[1.96, 0.4, 1.16]} position={[0, -0.1, 0]}>
        {liquidMaterial}
      </Box>
    </group>
  );
};

export const Cabinet3D = ({ cabinet }: Cabinet3DProps) => {
  const servers = cabinet.servers.slice(0, 4); // 显示4台服务器
  
  return (
    <div className="w-full h-96 bg-monitor-surface border border-monitor-border rounded-lg overflow-hidden relative">
      <Canvas
        camera={{ 
          position: [3, 1.5, 2], 
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        shadows
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[15, 15, 8]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-15, -15, -15]} intensity={0.5} />
        
        {/* Cabinet frame and liquid */}
        <CabinetFrame />
        
        {/* Liquid flow indicators */}
        <LiquidFlow isInlet={true} />
        <LiquidFlow isInlet={false} />
        
        {/* Servers arranged horizontally with gaps */}
        {servers.map((server, index) => {
          // Calculate position along the length (X-axis) with gaps for liquid immersion
          // 4 servers spread across 2m length with gaps: positions at -0.6, -0.2, 0.2, 0.6
          const xPos = -0.6 + (index * 0.4);
          const yPos = -0.18; // Slightly above liquid level
          const zPos = 0; // Center depth
          
          return (
            <Server3D
              key={server.id}
              position={[xPos, yPos, zPos]}
              alertLevel={server.alertLevel}
              name={server.name}
              index={index}
            />
          );
        })}
        
        {/* Grid helper */}
        <gridHelper args={[3, 30, '#4b5563', '#374151']} position={[0, -0.31, 0]} />
        
        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={8}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
      
      {/* 3D View Legend */}
      <div className="absolute top-2 left-2 bg-monitor-panel border border-monitor-border rounded p-2 text-xs">
        <div className="font-semibold text-monitor-text-primary mb-1">3D 液冷机柜</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded"></div>
            <span className="text-monitor-text-secondary">正常</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded"></div>
            <span className="text-monitor-text-secondary">注意</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded"></div>
            <span className="text-monitor-text-secondary">警告</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded"></div>
            <span className="text-monitor-text-secondary">严重</span>
          </div>
        </div>
      </div>
      
      {/* Flow Legend */}
      <div className="absolute top-2 right-2 bg-monitor-panel border border-monitor-border rounded p-2 text-xs">
        <div className="font-semibold text-monitor-text-primary mb-1">液体流向</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded"></div>
            <span className="text-monitor-text-secondary">冷液进入</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded"></div>
            <span className="text-monitor-text-secondary">热液流出</span>
          </div>
        </div>
      </div>
    </div>
  );
};