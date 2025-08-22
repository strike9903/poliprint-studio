"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initWebVitals, PerformanceTracker } from '@/lib/analytics';

interface WebVitalsTrackerProps {
  debug?: boolean;
  trackResources?: boolean;
  trackLongTasks?: boolean;
}

export function WebVitalsTracker({ 
  debug = false,
  trackResources = true,
  trackLongTasks = true
}: WebVitalsTrackerProps) {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize Web Vitals tracking
    initWebVitals();

    // Get performance tracker instance
    const tracker = PerformanceTracker.getInstance();

    // Track resource loading if enabled
    if (trackResources) {
      tracker.trackResourceLoading();
    }

    // Track long tasks if enabled
    if (trackLongTasks) {
      tracker.trackLongTasks();
    }

    // Mark navigation start for SPA navigation tracking
    performance.mark('navigation-start');

    // Cleanup on component unmount
    return () => {
      if (!trackResources && !trackLongTasks) {
        tracker.disconnect();
      }
    };
  }, [trackResources, trackLongTasks]);

  // Track page navigation for SPA
  useEffect(() => {
    const tracker = PerformanceTracker.getInstance();
    
    // Mark navigation end
    performance.mark('navigation-end');
    
    // Measure navigation time
    try {
      tracker.trackCustomMetric('spa-navigation', 'navigation-start', 'navigation-end');
    } catch (error) {
      // Navigation start mark might not exist on first load
    }

    // Mark new navigation start
    performance.mark('navigation-start');
  }, [pathname]);

  // Debug component - only render in development
  if (debug && process.env.NODE_ENV === 'development') {
    return <WebVitalsDebugPanel />;
  }

  return null;
}

// Debug panel component
function WebVitalsDebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [metrics, setMetrics] = useState<any[]>([]);

  useEffect(() => {
    // Update metrics every 5 seconds
    const interval = setInterval(() => {
      const stored = JSON.parse(localStorage.getItem('webVitals') || '[]');
      setMetrics(stored.slice(-10)); // Show last 10 metrics
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-black text-white p-2 rounded-full shadow-lg z-50 text-xs"
        style={{ fontFamily: 'monospace' }}
      >
        📊 Web Vitals
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg shadow-lg z-50 max-w-sm text-xs"
         style={{ fontFamily: 'monospace' }}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Web Vitals Debug</h3>
        <button onClick={() => setIsOpen(false)} className="text-gray-400">×</button>
      </div>
      
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {metrics.length === 0 ? (
          <div className="text-gray-400">No metrics yet...</div>
        ) : (
          metrics.map((metric, index) => {
            const gradeColor: Record<string, string> = {
              good: 'text-green-400',
              needs_improvement: 'text-yellow-400',
              poor: 'text-red-400'
            };
            const color = gradeColor[metric.grade] || 'text-gray-400';

            return (
              <div key={index} className="border-b border-gray-700 pb-1 mb-1">
                <div className="flex justify-between">
                  <span className="font-semibold">{metric.name}</span>
                  <span className={color}>{metric.grade}</span>
                </div>
                <div className="text-gray-300">
                  {metric.value.toFixed(2)}{metric.name === 'CLS' ? '' : 'ms'}
                </div>
                <div className="text-gray-500 text-xs">
                  {new Date(metric.timestamp).toLocaleTimeString()}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-2 pt-2 border-t border-gray-700">
        <button
          onClick={() => {
            localStorage.removeItem('webVitals');
            setMetrics([]);
          }}
          className="text-gray-400 hover:text-white text-xs"
        >
          Clear Metrics
        </button>
      </div>
    </div>
  );
}

// Hook for components that need to track custom performance
export function usePerformanceTracking() {
  const tracker = PerformanceTracker.getInstance();

  const trackCustomMetric = (name: string, startMark?: string, endMark?: string) => {
    tracker.trackCustomMetric(name, startMark, endMark);
  };

  const startTiming = (name: string) => {
    performance.mark(`${name}-start`);
  };

  const endTiming = (name: string) => {
    performance.mark(`${name}-end`);
    tracker.trackCustomMetric(name, `${name}-start`, `${name}-end`);
  };

  const getCurrentScores = async () => {
    return await tracker.getCurrentScores();
  };

  return {
    trackCustomMetric,
    startTiming,
    endTiming,
    getCurrentScores
  };
}

import { useState } from 'react';