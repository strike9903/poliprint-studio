"use client";

import { memoryCache, cacheUtils } from './cache';

// Performance monitoring configuration
const PERFORMANCE_CONFIG = {
  // Sample rate for performance monitoring
  sampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // API endpoint for sending performance data
  endpoint: process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT || '/api/analytics/performance',
  
  // Buffer size before sending data
  bufferSize: 10,
  
  // Send interval in milliseconds
  sendInterval: 30000, // 30 seconds
  
  // Enable debugging
  debug: process.env.NODE_ENV === 'development',
};

// Performance metrics interface
interface PerformanceMetric {
  name: string;
  value: number;
  grade: 'good' | 'needs_improvement' | 'poor';
  timestamp: number;
  url: string;
  userAgent: string;
  connectionType?: string;
  deviceMemory?: number;
  sessionId: string;
}

// Resource timing interface
interface ResourceTiming {
  name: string;
  duration: number;
  size?: number;
  type: string;
  timestamp: number;
}

// Performance monitoring class
class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metricsBuffer: PerformanceMetric[] = [];
  private sessionId: string;
  private sendTimer?: NodeJS.Timeout;
  private resourceObserver?: PerformanceObserver;
  private longTaskObserver?: PerformanceObserver;

  private constructor() {
    this.sessionId = this.generateSessionId();
    
    if (typeof window !== 'undefined') {
      this.initializeObservers();
      this.startSendTimer();
      
      // Handle page unload
      window.addEventListener('beforeunload', () => {
        this.flushMetrics();
      });
    }
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeObservers() {
    // Resource timing observer
    if ('PerformanceObserver' in window) {
      try {
        this.resourceObserver = new PerformanceObserver((list) => {
          this.handleResourceEntries(list.getEntries() as PerformanceResourceTiming[]);
        });
        this.resourceObserver.observe({ entryTypes: ['resource'] });

        // Long task observer
        this.longTaskObserver = new PerformanceObserver((list) => {
          this.handleLongTaskEntries(list.getEntries());
        });
        this.longTaskObserver.observe({ entryTypes: ['longtask'] });
      } catch (error) {
        if (PERFORMANCE_CONFIG.debug) {
          console.error('Failed to initialize performance observers:', error);
        }
      }
    }
  }

  private handleResourceEntries(entries: PerformanceResourceTiming[]) {
    entries.forEach(entry => {
      // Cache resource timing data
      const resourceData: ResourceTiming = {
        name: entry.name,
        duration: entry.duration,
        size: entry.transferSize,
        type: this.getResourceType(entry.name),
        timestamp: Date.now()
      };

      cacheUtils.setWithFallback(`resource_${entry.name}`, resourceData, 3600000); // 1 hour

      // Report slow resources
      if (entry.duration > 1000) {
        this.recordMetric({
          name: 'slow_resource',
          value: entry.duration,
          grade: this.getGrade('resource', entry.duration),
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
          connectionType: this.getConnectionType(),
          deviceMemory: this.getDeviceMemory(),
          sessionId: this.sessionId
        });
      }
    });
  }

  private handleLongTaskEntries(entries: PerformanceEntry[]) {
    entries.forEach(entry => {
      this.recordMetric({
        name: 'long_task',
        value: entry.duration,
        grade: this.getGrade('task', entry.duration),
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        connectionType: this.getConnectionType(),
        deviceMemory: this.getDeviceMemory(),
        sessionId: this.sessionId
      });
    });
  }

  private getResourceType(url: string): string {
    if (url.includes('.css')) return 'css';
    if (url.includes('.js')) return 'js';
    if (url.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i)) return 'image';
    if (url.match(/\.(woff|woff2|ttf|otf)$/i)) return 'font';
    return 'other';
  }

  private getGrade(type: string, value: number): 'good' | 'needs_improvement' | 'poor' {
    const thresholds = {
      resource: { good: 500, needsImprovement: 1000 },
      task: { good: 50, needsImprovement: 100 },
      cls: { good: 0.1, needsImprovement: 0.25 },
      inp: { good: 200, needsImprovement: 500 },
      lcp: { good: 2500, needsImprovement: 4000 },
      fcp: { good: 1800, needsImprovement: 3000 },
      ttfb: { good: 800, needsImprovement: 1800 }
    };

    const threshold = thresholds[type as keyof typeof thresholds];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.needsImprovement) return 'needs_improvement';
    return 'poor';
  }

  private getConnectionType(): string {
    if ('connection' in navigator) {
      return (navigator as any).connection.effectiveType || 'unknown';
    }
    return 'unknown';
  }

  private getDeviceMemory(): number {
    if ('deviceMemory' in navigator) {
      return (navigator as any).deviceMemory || 0;
    }
    return 0;
  }

  public recordMetric(metric: PerformanceMetric) {
    // Sample rate check
    if (Math.random() > PERFORMANCE_CONFIG.sampleRate) {
      return;
    }

    this.metricsBuffer.push(metric);

    // Cache metric locally
    cacheUtils.setWithFallback(`metric_${metric.name}_${metric.timestamp}`, metric, 86400000); // 24 hours

    if (PERFORMANCE_CONFIG.debug) {
      console.log('Performance metric recorded:', metric);
    }

    // Send if buffer is full
    if (this.metricsBuffer.length >= PERFORMANCE_CONFIG.bufferSize) {
      this.sendMetrics();
    }
  }

  private startSendTimer() {
    this.sendTimer = setInterval(() => {
      if (this.metricsBuffer.length > 0) {
        this.sendMetrics();
      }
    }, PERFORMANCE_CONFIG.sendInterval);
  }

  private async sendMetrics() {
    if (this.metricsBuffer.length === 0) return;

    const metrics = [...this.metricsBuffer];
    this.metricsBuffer = [];

    try {
      const response = await fetch(PERFORMANCE_CONFIG.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metrics,
          sessionId: this.sessionId,
          timestamp: Date.now()
        }),
        keepalive: true
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      if (PERFORMANCE_CONFIG.debug) {
        console.log('Performance metrics sent:', metrics.length);
      }
    } catch (error) {
      if (PERFORMANCE_CONFIG.debug) {
        console.error('Failed to send performance metrics:', error);
      }
      
      // Put metrics back in buffer for retry
      this.metricsBuffer.unshift(...metrics);
      
      // Limit buffer size to prevent memory leaks
      if (this.metricsBuffer.length > PERFORMANCE_CONFIG.bufferSize * 3) {
        this.metricsBuffer = this.metricsBuffer.slice(-PERFORMANCE_CONFIG.bufferSize);
      }
    }
  }

  public flushMetrics() {
    if (this.metricsBuffer.length > 0) {
      // Use sendBeacon for reliable unload sending
      if ('sendBeacon' in navigator) {
        navigator.sendBeacon(
          PERFORMANCE_CONFIG.endpoint,
          JSON.stringify({
            metrics: this.metricsBuffer,
            sessionId: this.sessionId,
            timestamp: Date.now()
          })
        );
      }
    }
  }

  // Get performance insights
  public async getPerformanceInsights() {
    const cachedInsights = cacheUtils.getWithFallback('performance_insights');
    if (cachedInsights) {
      return cachedInsights;
    }

    const insights = {
      sessionId: this.sessionId,
      pageLoadTime: this.getPageLoadTime(),
      resourceCount: this.getResourceCount(),
      slowResources: this.getSlowResources(),
      memoryUsage: this.getMemoryUsage(),
      cacheStats: cacheUtils.getAllStats(),
      connectionInfo: {
        type: this.getConnectionType(),
        deviceMemory: this.getDeviceMemory(),
        hardwareConcurrency: navigator.hardwareConcurrency || 0
      },
      timestamp: Date.now()
    };

    // Cache insights for 5 minutes
    cacheUtils.setWithFallback('performance_insights', insights, 300000);
    
    return insights;
  }

  private getPageLoadTime(): number {
    if ('performance' in window && performance.timing) {
      return performance.timing.loadEventEnd - performance.timing.navigationStart;
    }
    return 0;
  }

  private getResourceCount(): number {
    if ('performance' in window) {
      return performance.getEntriesByType('resource').length;
    }
    return 0;
  }

  private getSlowResources(): string[] {
    if ('performance' in window) {
      return performance.getEntriesByType('resource')
        .filter(entry => entry.duration > 1000)
        .map(entry => entry.name)
        .slice(0, 10); // Top 10 slowest
    }
    return [];
  }

  private getMemoryUsage(): any {
    if ('memory' in performance) {
      return (performance as any).memory;
    }
    return null;
  }

  // Cleanup
  public destroy() {
    if (this.sendTimer) {
      clearInterval(this.sendTimer);
    }
    
    if (this.resourceObserver) {
      this.resourceObserver.disconnect();
    }
    
    if (this.longTaskObserver) {
      this.longTaskObserver.disconnect();
    }
    
    this.flushMetrics();
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// React hook for performance monitoring
export function usePerformanceMonitor() {
  const recordCustomMetric = (name: string, value: number, type: string = 'custom') => {
    performanceMonitor.recordMetric({
      name,
      value,
      grade: performanceMonitor['getGrade'](type, value),
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      sessionId: performanceMonitor['sessionId']
    });
  };

  const getInsights = () => performanceMonitor.getPerformanceInsights();

  return {
    recordCustomMetric,
    getInsights,
    flushMetrics: () => performanceMonitor.flushMetrics()
  };
}

// Utility functions
export const performanceUtils = {
  // Mark start of an operation
  markStart: (name: string) => {
    if ('performance' in window) {
      performance.mark(`${name}-start`);
    }
  },

  // Mark end and measure duration
  markEnd: (name: string) => {
    if ('performance' in window) {
      performance.mark(`${name}-end`);
      try {
        performance.measure(name, `${name}-start`, `${name}-end`);
        const measure = performance.getEntriesByName(name, 'measure')[0];
        if (measure) {
          performanceMonitor.recordMetric({
            name: `custom_${name}`,
            value: measure.duration,
            grade: performanceMonitor['getGrade']('task', measure.duration),
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            sessionId: performanceMonitor['sessionId']
          });
        }
      } catch (error) {
        // Mark might not exist
      }
    }
  },

  // Time a function execution
  timeFunction: async <T>(name: string, fn: () => Promise<T> | T): Promise<T> => {
    performanceUtils.markStart(name);
    try {
      const result = await fn();
      performanceUtils.markEnd(name);
      return result;
    } catch (error) {
      performanceUtils.markEnd(name);
      throw error;
    }
  },

  // Get current performance scores
  getCurrentScores: () => {
    const scores = memoryCache.get<Record<string, number>>('web_vitals_scores') || {};
    return scores;
  }
};

// Initialize performance monitoring on load
if (typeof window !== 'undefined') {
  // Start monitoring after initial load
  window.addEventListener('load', () => {
    requestIdleCallback(() => {
      performanceMonitor.getPerformanceInsights();
    });
  });
}