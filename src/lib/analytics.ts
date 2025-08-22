"use client";

import { onCLS, onINP, onFCP, onLCP, onTTFB, Metric } from 'web-vitals';

// Web Vitals configuration
const WEB_VITALS_CONFIG = {
  // Google Analytics measurement ID
  GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
  
  // Custom endpoint for analytics (optional)
  ANALYTICS_ENDPOINT: process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT || '',
  
  // Development mode flag
  IS_DEV: process.env.NODE_ENV === 'development',
  
  // Sampling rate (0-1)
  SAMPLE_RATE: 1.0
};

// Web Vitals thresholds (Google's recommendations)
const THRESHOLDS = {
  CLS: { good: 0.1, needs_improvement: 0.25 },
  INP: { good: 200, needs_improvement: 500 },
  FCP: { good: 1800, needs_improvement: 3000 },
  LCP: { good: 2500, needs_improvement: 4000 },
  TTFB: { good: 800, needs_improvement: 1800 }
};

// Performance grade calculation
function getPerformanceGrade(name: string, value: number): 'good' | 'needs_improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
  if (!threshold) return 'good';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.needs_improvement) return 'needs_improvement';
  return 'poor';
}

// Send metric to Google Analytics
function sendToGoogleAnalytics(metric: Metric) {
  if (!WEB_VITALS_CONFIG.GA_MEASUREMENT_ID) return;

  const { name, value, id } = metric;
  const grade = getPerformanceGrade(name, value);

  // Send to GA4
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as any).gtag('event', name, {
      event_category: 'Web Vitals',
      event_label: id,
      value: Math.round(name === 'CLS' ? value * 1000 : value),
      custom_map: {
        metric_grade: grade,
        metric_name: name
      },
      non_interaction: true
    });
  }
}

// Send metric to custom analytics endpoint
async function sendToCustomAnalytics(metric: Metric) {
  if (!WEB_VITALS_CONFIG.ANALYTICS_ENDPOINT) return;

  try {
    const body = JSON.stringify({
      metric: {
        name: metric.name,
        value: metric.value,
        id: metric.id,
        grade: getPerformanceGrade(metric.name, metric.value),
        timestamp: Date.now(),
        url: window.location.href,
        user_agent: navigator.userAgent,
        connection_type: (navigator as any)?.connection?.effectiveType || 'unknown',
        device_memory: (navigator as any)?.deviceMemory || 'unknown'
      }
    });

    await fetch(WEB_VITALS_CONFIG.ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
      keepalive: true
    });
  } catch (error) {
    if (WEB_VITALS_CONFIG.IS_DEV) {
      console.error('Failed to send Web Vitals to custom analytics:', error);
    }
  }
}

// Console logging for development
function logToConsole(metric: Metric) {
  if (!WEB_VITALS_CONFIG.IS_DEV) return;

  const { name, value, id } = metric;
  const grade = getPerformanceGrade(name, value);
  
  const gradeEmoji = {
    good: '✅',
    needs_improvement: '⚠️',
    poor: '❌'
  };

  console.log(`${gradeEmoji[grade]} ${name}: ${value.toFixed(2)}ms (${grade})`);
}

// Main metric handler
function handleMetric(metric: Metric) {
  // Sample rate check
  if (Math.random() > WEB_VITALS_CONFIG.SAMPLE_RATE) return;

  // Log to console in development
  logToConsole(metric);

  // Send to Google Analytics
  sendToGoogleAnalytics(metric);

  // Send to custom analytics
  sendToCustomAnalytics(metric);

  // Store in localStorage for debugging
  if (WEB_VITALS_CONFIG.IS_DEV) {
    const stored = JSON.parse(localStorage.getItem('webVitals') || '[]');
    stored.push({
      ...metric,
      grade: getPerformanceGrade(metric.name, metric.value),
      timestamp: Date.now(),
      url: window.location.href
    });
    localStorage.setItem('webVitals', JSON.stringify(stored.slice(-50))); // Keep last 50 entries
  }
}

// Initialize Web Vitals tracking
export function initWebVitals() {
  if (typeof window === 'undefined') return;

  try {
    onCLS(handleMetric);
    onINP(handleMetric);
    onFCP(handleMetric);
    onLCP(handleMetric);
    onTTFB(handleMetric);
  } catch (error) {
    if (WEB_VITALS_CONFIG.IS_DEV) {
      console.error('Failed to initialize Web Vitals:', error);
    }
  }
}

// Performance observer for custom metrics
export class PerformanceTracker {
  private static instance: PerformanceTracker;
  private observers: PerformanceObserver[] = [];

  static getInstance(): PerformanceTracker {
    if (!PerformanceTracker.instance) {
      PerformanceTracker.instance = new PerformanceTracker();
    }
    return PerformanceTracker.instance;
  }

  // Track custom performance marks
  trackCustomMetric(name: string, startMark?: string, endMark?: string) {
    try {
      if (startMark && endMark) {
        performance.measure(name, startMark, endMark);
      } else {
        performance.mark(name);
      }

      if (WEB_VITALS_CONFIG.IS_DEV) {
        const entries = performance.getEntriesByName(name);
        const entry = entries[entries.length - 1];
        console.log(`📊 Custom Metric - ${name}: ${entry.duration?.toFixed(2) || 'N/A'}ms`);
      }
    } catch (error) {
      if (WEB_VITALS_CONFIG.IS_DEV) {
        console.error('Failed to track custom metric:', error);
      }
    }
  }

  // Track resource loading performance
  trackResourceLoading() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            
            // Track slow resources (> 1 second)
            if (resourceEntry.duration > 1000) {
              if (WEB_VITALS_CONFIG.IS_DEV) {
                console.warn(`🐌 Slow resource: ${resourceEntry.name} (${resourceEntry.duration.toFixed(2)}ms)`);
              }

              // Send to analytics if configured
              // Send custom performance data
              if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'slow_resource', {
                  custom_parameter_1: resourceEntry.name,
                  custom_parameter_2: resourceEntry.duration
                });
              }
            }
          }
        }
      });

      observer.observe({ entryTypes: ['resource'] });
      this.observers.push(observer);
    } catch (error) {
      if (WEB_VITALS_CONFIG.IS_DEV) {
        console.error('Failed to track resource loading:', error);
      }
    }
  }

  // Track long tasks
  trackLongTasks() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'longtask') {
            if (WEB_VITALS_CONFIG.IS_DEV) {
              console.warn(`⏱️ Long task detected: ${entry.duration.toFixed(2)}ms`);
            }

            // Send custom performance data
            if (typeof window !== 'undefined' && (window as any).gtag) {
              (window as any).gtag('event', 'long_task', {
                custom_parameter_1: entry.duration,
                custom_parameter_2: entry.name
              });
            }
          }
        }
      });

      observer.observe({ entryTypes: ['longtask'] });
      this.observers.push(observer);
    } catch (error) {
      if (WEB_VITALS_CONFIG.IS_DEV) {
        console.error('Failed to track long tasks:', error);
      }
    }
  }

  // Get current Web Vitals scores
  async getCurrentScores(): Promise<Record<string, number>> {
    const scores: Record<string, number> = {};
    
    return new Promise((resolve) => {
      const metrics = ['CLS', 'INP', 'FCP', 'LCP', 'TTFB'];
      let collected = 0;

      const collectMetric = (metric: Metric) => {
        scores[metric.name] = metric.value;
        collected++;
        if (collected === metrics.length) {
          resolve(scores);
        }
      };

      onCLS(collectMetric);
      onINP(collectMetric);
      onFCP(collectMetric);
      onLCP(collectMetric);
      onTTFB(collectMetric);

      // Timeout after 5 seconds
      setTimeout(() => resolve(scores), 5000);
    });
  }

  // Disconnect all observers
  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Utility functions for debugging
export const webVitalsDebug = {
  // Get stored metrics from localStorage
  getStoredMetrics() {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('webVitals') || '[]');
  },

  // Clear stored metrics
  clearStoredMetrics() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('webVitals');
  },

  // Generate performance report
  async generateReport() {
    const tracker = PerformanceTracker.getInstance();
    const currentScores = await tracker.getCurrentScores();
    const storedMetrics = this.getStoredMetrics();

    return {
      current: currentScores,
      history: storedMetrics,
      summary: {
        totalMeasurements: storedMetrics.length,
        averageScores: this.calculateAverages(storedMetrics),
        gradeDistribution: this.calculateGradeDistribution(storedMetrics)
      }
    };
  },

  // Calculate average scores
  calculateAverages(metrics: any[]) {
    const averages: Record<string, number> = {};
    const counts: Record<string, number> = {};

    metrics.forEach(metric => {
      if (!averages[metric.name]) {
        averages[metric.name] = 0;
        counts[metric.name] = 0;
      }
      averages[metric.name] += metric.value;
      counts[metric.name]++;
    });

    Object.keys(averages).forEach(key => {
      averages[key] = averages[key] / counts[key];
    });

    return averages;
  },

  // Calculate grade distribution
  calculateGradeDistribution(metrics: any[]) {
    const distribution: Record<string, Record<string, number>> = {};

    metrics.forEach(metric => {
      if (!distribution[metric.name]) {
        distribution[metric.name] = { good: 0, needs_improvement: 0, poor: 0 };
      }
      distribution[metric.name][metric.grade]++;
    });

    return distribution;
  }
};

// Export for use in components
export { handleMetric, THRESHOLDS, getPerformanceGrade };