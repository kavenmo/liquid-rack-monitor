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
      {/* Server body */}
      <Box
        ref={meshRef}
        args={[0.18, 0.044, 0.9]} // 180mm × 44.45mm × 900mm in scale
        position={[0, 0, 0]}
      >
        <meshStandardMaterial 
          color={alertColors[alertLevel]}
          metalness={0.6}
          roughness={0.4}
        />
      </Box>
      
      {/* Server label */}
      <Text
        position={[0, 0.03, 0.46]}
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
        args={[0.01, 0.01, 0.01]}
        position={[0.09, 0, 0.46]}
      >
        <meshStandardMaterial 
          color={alertColors[alertLevel]}
          emissive={alertColors[alertLevel]}
          emissiveIntensity={0.5}
        />
      </Box>
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

  return (
    <group>
      {/* Cabinet frame - only edges visible */}
      {/* Bottom frame */}
      <Box args={[1.2, 0.01, 0.9]} position={[0, -0.3, 0]}>
        {cabinetMaterial}
      </Box>
      
      {/* Top frame */}
      <Box args={[1.2, 0.01, 0.9]} position={[0, 0.3, 0]}>
        {cabinetMaterial}
      </Box>
      
      {/* Side frames */}
      <Box args={[0.01, 0.6, 0.9]} position={[-0.6, 0, 0]}>
        {cabinetMaterial}
      </Box>
      <Box args={[0.01, 0.6, 0.9]} position={[0.6, 0, 0]}>
        {cabinetMaterial}
      </Box>
      
      {/* Back frame */}
      <Box args={[1.2, 0.6, 0.01]} position={[0, 0, -0.45]}>
        {cabinetMaterial}
      </Box>
      
      {/* Front frame (partial) */}
      <Box args={[1.2, 0.05, 0.01]} position={[0, 0.275, 0.45]}>
        {cabinetMaterial}
      </Box>
      <Box args={[1.2, 0.05, 0.01]} position={[0, -0.275, 0.45]}>
        {cabinetMaterial}
      </Box>
    </group>
  );
};

export const Cabinet3D = ({ cabinet }: Cabinet3DProps) => {
  const servers = cabinet.servers.slice(0, 6); // 确保只显示6台服务器
  
  return (
    <div className="w-full h-96 bg-monitor-surface border border-monitor-border rounded-lg overflow-hidden">
      <Canvas
        camera={{ 
          position: [2, 1, 2], 
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        shadows
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {/* Cabinet frame */}
        <CabinetFrame />
        
        {/* Servers arranged horizontally */}
        {servers.map((server, index) => {
          // Calculate position along the length (X-axis)
          // Start from left (-0.45) and space servers every 0.18m
          const xPos = -0.45 + (index * 0.18);
          const yPos = -0.25; // Bottom of cabinet
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
        <gridHelper args={[2, 20, '#4b5563', '#374151']} position={[0, -0.31, 0]} />
        
        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={1}
          maxDistance={5}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
      
      {/* 3D View Legend */}
      <div className="absolute top-2 left-2 bg-monitor-panel border border-monitor-border rounded p-2 text-xs">
        <div className="font-semibold text-monitor-text-primary mb-1">3D 机柜视图</div>
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
    </div>
  );
};