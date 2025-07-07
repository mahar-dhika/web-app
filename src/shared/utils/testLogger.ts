/**
 * Test Logger Utility
 * Provides centralized logging for all test types as specified in the implementation checklist
 */

export type TestType =
  | 'UNIT'
  | 'INTEGRATION'
  | 'E2E'
  | 'API'
  | 'COVERAGE'
  | 'PERFORMANCE'
  | 'A11Y';
export type TestStatus = 'STARTED' | 'PASS' | 'FAIL';

export interface CoverageData {
  feature?: string;
  component?: string;
  statements: number;
  branches: number;
  functions: number;
  lines: number;
  testsPassed?: boolean;
  timestamp?: string;
}

export interface PerformanceData {
  performance: number;
  accessibility: number;
  bestPractices?: number;
  seo?: number;
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  cls?: number; // Cumulative Layout Shift
}

export class TestLogger {
  private static logEntries: string[] = [];
  private static isEnabled =
    process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development';

  /**
   * Log the start of a test
   */
  static logTestStart(testType: TestType, testName: string): void {
    if (!this.isEnabled) return;

    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${testType}] STARTED: ${testName}`;

    this.logEntries.push(logEntry);
    console.log(logEntry);

    // In a real implementation, this would write to testing.log file
    if (typeof window === 'undefined') {
      // Node.js environment (tests)
      this.writeToFile(logEntry);
    }
  }

  /**
   * Log the result of a test
   */
  static logTestResult(
    testType: TestType,
    testName: string,
    status: TestStatus,
    details?: string
  ): void {
    if (!this.isEnabled) return;

    const timestamp = new Date().toISOString();
    const detailsStr = details ? ` - ${details}` : '';
    const logEntry = `[${timestamp}] [${testType}] ${status}: ${testName}${detailsStr}`;

    this.logEntries.push(logEntry);
    console.log(logEntry);

    // In a real implementation, this would write to testing.log file
    if (typeof window === 'undefined') {
      this.writeToFile(logEntry);
    }
  }

  /**
   * Log coverage data
   */
  static logCoverage(coverageData: CoverageData): void {
    if (!this.isEnabled) return;

    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [COVERAGE] ${JSON.stringify(coverageData)}`;

    this.logEntries.push(logEntry);
    console.log(logEntry);

    if (typeof window === 'undefined') {
      this.writeToFile(logEntry);
    }
  }

  /**
   * Log performance metrics
   */
  static logPerformance(
    testName: string,
    performanceData: PerformanceData
  ): void {
    if (!this.isEnabled) return;

    const timestamp = new Date().toISOString();
    const metricsStr = JSON.stringify(performanceData, null, 0);
    const logEntry = `[${timestamp}] [PERFORMANCE] PASS: ${testName} - ${metricsStr}`;

    this.logEntries.push(logEntry);
    console.log(logEntry);

    if (typeof window === 'undefined') {
      this.writeToFile(logEntry);
    }
  }

  /**
   * Get all log entries
   */
  static getLogEntries(): string[] {
    return [...this.logEntries];
  }

  /**
   * Clear all log entries
   */
  static clearLogs(): void {
    this.logEntries = [];
  }

  /**
   * Get log entries by test type
   */
  static getLogsByType(testType: TestType): string[] {
    return this.logEntries.filter(entry => entry.includes(`[${testType}]`));
  }

  /**
   * Get failed tests
   */
  static getFailedTests(): string[] {
    return this.logEntries.filter(entry => entry.includes('FAIL:'));
  }

  /**
   * Get test summary
   */
  static getTestSummary(): {
    total: number;
    passed: number;
    failed: number;
    byType: Record<TestType, { passed: number; failed: number }>;
  } {
    const summary = {
      total: 0,
      passed: 0,
      failed: 0,
      byType: {} as Record<TestType, { passed: number; failed: number }>,
    };

    const testTypes: TestType[] = [
      'UNIT',
      'INTEGRATION',
      'E2E',
      'API',
      'COVERAGE',
      'PERFORMANCE',
      'A11Y',
    ];

    testTypes.forEach(type => {
      summary.byType[type] = { passed: 0, failed: 0 };
    });

    this.logEntries.forEach(entry => {
      if (entry.includes('PASS:')) {
        summary.passed++;
        summary.total++;

        const typeMatch = entry.match(/\[(\w+)\]/);
        if (typeMatch && testTypes.includes(typeMatch[1] as TestType)) {
          summary.byType[typeMatch[1] as TestType].passed++;
        }
      } else if (entry.includes('FAIL:')) {
        summary.failed++;
        summary.total++;

        const typeMatch = entry.match(/\[(\w+)\]/);
        if (typeMatch && testTypes.includes(typeMatch[1] as TestType)) {
          summary.byType[typeMatch[1] as TestType].failed++;
        }
      }
    });

    return summary;
  }

  /**
   * Write to file (Node.js environment only)
   * In a real implementation, this would append to testing.log
   */
  private static writeToFile(logEntry: string): void {
    // This would be implemented with fs.appendFileSync in a real scenario
    // For now, we'll just store in memory
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
      // In tests, we might want to write to a mock file or just keep in memory
      console.log(`[LOG_FILE] ${logEntry}`);
    }
  }

  /**
   * Enable/disable logging
   */
  static setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }
}

// Export for use in tests
export default TestLogger;
