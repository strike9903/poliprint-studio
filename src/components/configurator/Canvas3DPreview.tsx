"use client";

import { Suspense, useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Text, Html, useProgress } from '@react-three/drei';
import { TextureLoader, DoubleSide, Vector3 } from 'three';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Move3D, 
  Sun, 
  Home,
  Palette,
  Eye,
  Download
} from 'lucide-react';

interface Canvas3DPreviewProps {
  imageUrl: string;
  canvasConfig: {
    width: number;
    height: number;
    depth: number;
    edge: 'gallery' | 'mirror' | 'solid';
    edgeColor?: string;
    frameColor: string;
  };
  environmentType?: 'studio' | 'room' | 'gallery';
  onConfigChange?: (config: any) => void;
}

// Компонент загрузки
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="text-center space-y-2">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <div className="text-sm font-medium">Завантаження 3D превью</div>
        <div className="text-xs text-muted-foreground">{Math.round(progress)}%</div>
      </div>
    </Html>
  );
}

// Компонент холста
function CanvasModel({ imageUrl, config }: { 
  imageUrl: string; 
  config: Canvas3DPreviewProps['canvasConfig'] 
}) {
  const meshRef = useRef<any>();
  const frameRef = useRef<any>();
  
  // Загрузка текстуры
  const texture = useLoader(TextureLoader, imageUrl);
  
  // Анимация
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  // Размеры в метрах (конвертация из см)
  const width = config.width / 100;
  const height = config.height / 100;
  const depth = config.depth / 1000; // из мм

  return (
    <group ref={meshRef}>
      {/* Подрамник */}
      <group ref={frameRef}>
        {/* Основа подрамника */}
        <mesh position={[0, 0, -depth/2]}>
          <boxGeometry args={[width + 0.02, height + 0.02, depth]} />
          <meshStandardMaterial color={config.frameColor} />
        </mesh>
        
        {/* Боковые планки для галерейной кромки */}
        {config.edge === 'gallery' && (
          <>
            <mesh position={[-width/2, 0, 0]}>
              <boxGeometry args={[0.02, height, depth * 2]} />
              <meshStandardMaterial color={config.frameColor} />
            </mesh>
            <mesh position={[width/2, 0, 0]}>
              <boxGeometry args={[0.02, height, depth * 2]} />
              <meshStandardMaterial color={config.frameColor} />
            </mesh>
            <mesh position={[0, -height/2, 0]}>
              <boxGeometry args={[width, 0.02, depth * 2]} />
              <meshStandardMaterial color={config.frameColor} />
            </mesh>
            <mesh position={[0, height/2, 0]}>
              <boxGeometry args={[width, 0.02, depth * 2]} />
              <meshStandardMaterial color={config.frameColor} />
            </mesh>
          </>
        )}
      </group>

      {/* Холст с изображением */}
      <mesh position={[0, 0, 0.001]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial 
          map={texture} 
          side={DoubleSide}
          transparent={false}
        />
      </mesh>

      {/* Кромка холста */}
      {config.edge === 'gallery' && (
        <>
          {/* Левая кромка */}
          <mesh position={[-width/2, 0, -depth/4]} rotation={[0, Math.PI/2, 0]}>
            <planeGeometry args={[depth/2, height]} />
            <meshStandardMaterial 
              map={texture} 
              side={DoubleSide}
            />
          </mesh>
          
          {/* Правая кромка */}
          <mesh position={[width/2, 0, -depth/4]} rotation={[0, -Math.PI/2, 0]}>
            <planeGeometry args={[depth/2, height]} />
            <meshStandardMaterial 
              map={texture} 
              side={DoubleSide}
            />
          </mesh>
          
          {/* Верхняя кромка */}
          <mesh position={[0, height/2, -depth/4]} rotation={[-Math.PI/2, 0, 0]}>
            <planeGeometry args={[width, depth/2]} />
            <meshStandardMaterial 
              map={texture} 
              side={DoubleSide}
            />
          </mesh>
          
          {/* Нижняя кромка */}
          <mesh position={[0, -height/2, -depth/4]} rotation={[Math.PI/2, 0, 0]}>
            <planeGeometry args={[width, depth/2]} />
            <meshStandardMaterial 
              map={texture} 
              side={DoubleSide}
            />
          </mesh>
        </>
      )}

      {/* Размеры и подписи */}
      <Html position={[0, height/2 + 0.1, 0]} center>
        <div className="bg-black/80 text-white px-2 py-1 rounded text-xs">
          {config.width}×{config.height} см
        </div>
      </Html>
    </group>
  );
}

// Компонент окружения
function SceneEnvironment({ type, lighting }: { type: string; lighting: number }) {
  const { camera } = useThree();
  
  useEffect(() => {
    // Настройка камеры в зависимости от окружения
    if (type === 'room') {
      camera.position.set(2, 1, 3);
    } else if (type === 'gallery') {
      camera.position.set(0, 0, 4);
    } else {
      camera.position.set(2, 2, 4);
    }
  }, [type, camera]);

  return (
    <>
      {/* Освещение */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={lighting} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />

      {/* Окружение */}
      {type === 'studio' && (
        <>
          <Environment preset="studio" />
          <ContactShadows 
            position={[0, -1.5, 0]} 
            opacity={0.4} 
            scale={10} 
            blur={2} 
          />
        </>
      )}
      
      {type === 'room' && (
        <>
          <Environment preset="apartment" />
          {/* Стена */}
          <mesh position={[0, 0, -2]} receiveShadow>
            <planeGeometry args={[8, 6]} />
            <meshStandardMaterial color="#f5f5f5" />
          </mesh>
          {/* Пол */}
          <mesh position={[0, -1.5, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
            <planeGeometry args={[8, 8]} />
            <meshStandardMaterial color="#e0e0e0" />
          </mesh>
        </>
      )}
      
      {type === 'gallery' && (
        <>
          <Environment preset="warehouse" />
          {/* Галерейная стена */}
          <mesh position={[0, 0, -1.5]}>
            <planeGeometry args={[6, 4]} />
            <meshStandardMaterial color="white" />
          </mesh>
        </>
      )}
    </>
  );
}

export function Canvas3DPreview({ 
  imageUrl, 
  canvasConfig, 
  environmentType = 'studio',
  onConfigChange 
}: Canvas3DPreviewProps) {
  const [currentEnvironment, setCurrentEnvironment] = useState(environmentType);
  const [lighting, setLighting] = useState(1.0);
  const [autoRotate, setAutoRotate] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Сохранение скриншота
  const handleScreenshot = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `canvas-preview-${Date.now()}.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  return (
    <div className="space-y-4">
      {/* 3D Превью */}
      <Card className="relative overflow-hidden">
        <CardContent className="p-0">
          <div className="aspect-[4/3] bg-gradient-to-br from-background to-muted">
            <Canvas
              ref={canvasRef}
              shadows
              camera={{ position: [2, 2, 4], fov: 50 }}
              dpr={[1, 2]}
            >
              <Suspense fallback={<Loader />}>
                <SceneEnvironment type={currentEnvironment} lighting={lighting} />
                <CanvasModel 
                  imageUrl={imageUrl} 
                  config={canvasConfig} 
                />
                <OrbitControls 
                  autoRotate={autoRotate}
                  autoRotateSpeed={2}
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  minDistance={1}
                  maxDistance={10}
                />
              </Suspense>
            </Canvas>
          </div>

          {/* Overlay элементы */}
          <div className="absolute top-4 left-4 space-y-2">
            <Badge className="bg-black/80 text-white border-0">
              3D Preview
            </Badge>
            <div className="bg-black/80 text-white px-2 py-1 rounded text-xs">
              {canvasConfig.width}×{canvasConfig.height} см
            </div>
          </div>

          <div className="absolute top-4 right-4">
            <Button
              variant="secondary"
              size="icon"
              className="bg-black/80 border-0 hover:bg-black/60"
              onClick={handleScreenshot}
            >
              <Download className="w-4 h-4 text-white" />
            </Button>
          </div>

          {/* Инструкция */}
          <div className="absolute bottom-4 left-4 bg-black/80 text-white px-3 py-2 rounded text-xs">
            🖱️ Крутіть • 🔍 Зум • ✋ Переміщення
          </div>
        </CardContent>
      </Card>

      {/* Контролы */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Окружение */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Home className="w-4 h-4" />
              Оточення
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'studio', name: 'Студія', icon: '🎬' },
                { id: 'room', name: 'Кімната', icon: '🏠' },
                { id: 'gallery', name: 'Галерея', icon: '🖼️' }
              ].map((env) => (
                <Button
                  key={env.id}
                  variant={currentEnvironment === env.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentEnvironment(env.id as "gallery" | "studio" | "room")}
                  className="text-xs"
                >
                  {env.icon} {env.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Освещение */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Sun className="w-4 h-4" />
              Освітлення
            </h4>
            <div className="space-y-2">
              <Slider
                value={[lighting]}
                onValueChange={(values) => setLighting(values[0])}
                min={0.2}
                max={2.0}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Тьмяне</span>
                <span>Яскраве</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Дополнительные контролы */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAutoRotate(!autoRotate)}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          {autoRotate ? 'Стоп обертання' : 'Авто обертання'}
        </Button>

        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          AR превью
        </Button>

        <Button variant="outline" size="sm">
          <Move3D className="w-4 h-4 mr-2" />
          Порівняти розміри
        </Button>

        <Button variant="outline" size="sm">
          <Palette className="w-4 h-4 mr-2" />
          Змінити колір рами
        </Button>
      </div>

      {/* Информация о размерах */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3">Інформація про розміри</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Розмір холста</div>
              <div className="font-medium">{canvasConfig.width}×{canvasConfig.height} см</div>
            </div>
            <div>
              <div className="text-muted-foreground">Товщина підрамника</div>
              <div className="font-medium">{canvasConfig.depth} мм</div>
            </div>
            <div>
              <div className="text-muted-foreground">Тип кромки</div>
              <div className="font-medium">
                {canvasConfig.edge === 'gallery' ? 'Галерейна' : 'Дзеркальна'}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Вага</div>
              <div className="font-medium">~{Math.round((canvasConfig.width * canvasConfig.height) / 100)} г</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}