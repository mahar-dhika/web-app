import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { CoverageData, PerformanceData, TestType } from '../testLogger';
import { TestLogger } from '../testLogger';

describe('TestLogger Utility', () => {
  beforeEach(() => {
    TestLogger.clearLogs();
    TestLogger.setEnabled(true);
  });

  afterEach(() => {
    TestLogger.clearLogs();
  });

  describe('Basic Logging', () => {
    it('logs test start events', () => {
      TestLogger.logTestStart('UNIT', 'Sample Test');

      const logs = TestLogger.getLogEntries();
      expect(logs).toHaveLength(1);
      expect(logs[0]).toContain('[UNIT] STARTED: Sample Test');
    });

    it('logs test results', () => {
      TestLogger.logTestResult(
        'UNIT',
        'Sample Test',
        'PASS',
        'Additional details'
      );

      const logs = TestLogger.getLogEntries();
      expect(logs).toHaveLength(1);
      expect(logs[0]).toContain(
        '[UNIT] PASS: Sample Test - Additional details'
      );
    });

    it('logs test results without details', () => {
      TestLogger.logTestResult('E2E', 'Another Test', 'FAIL');

      const logs = TestLogger.getLogEntries();
      expect(logs).toHaveLength(1);
      expect(logs[0]).toContain('[E2E] FAIL: Another Test');
      expect(logs[0]).not.toContain(' - ');
    });
  });

  describe('Coverage Logging', () => {
    it('logs coverage data', () => {
      const coverageData: CoverageData = {
        component: 'Button',
        statements: 95,
        branches: 90,
        functions: 100,
        lines: 95,
        testsPassed: true,
        timestamp: '2025-07-07T10:30:15.123Z',
      };

      TestLogger.logCoverage(coverageData);

      const logs = TestLogger.getLogEntries();
      expect(logs).toHaveLength(1);
      expect(logs[0]).toContain('[COVERAGE]');
      expect(logs[0]).toContain('"component":"Button"');
      expect(logs[0]).toContain('"statements":95');
    });

    it('logs minimal coverage data', () => {
      const coverageData: CoverageData = {
        statements: 80,
        branches: 75,
        functions: 90,
        lines: 85,
      };

      TestLogger.logCoverage(coverageData);

      const logs = TestLogger.getLogEntries();
      expect(logs).toHaveLength(1);
      expect(logs[0]).toContain('"statements":80');
    });
  });

  describe('Performance Logging', () => {
    it('logs performance metrics', () => {
      const performanceData: PerformanceData = {
        performance: 95,
        accessibility: 100,
        bestPractices: 90,
        seo: 85,
        fcp: 1200,
        lcp: 2400,
        cls: 0.1,
      };

      TestLogger.logPerformance('Lighthouse Audit', performanceData);

      const logs = TestLogger.getLogEntries();
      expect(logs).toHaveLength(1);
      expect(logs[0]).toContain('[PERFORMANCE] PASS: Lighthouse Audit');
      expect(logs[0]).toContain('"performance":95');
      expect(logs[0]).toContain('"accessibility":100');
    });

    it('logs minimal performance data', () => {
      const performanceData: PerformanceData = {
        performance: 80,
        accessibility: 90,
      };

      TestLogger.logPerformance('Basic Performance Test', performanceData);

      const logs = TestLogger.getLogEntries();
      expect(logs).toHaveLength(1);
      expect(logs[0]).toContain('"performance":80');
      expect(logs[0]).toContain('"accessibility":90');
    });
  });

  describe('Log Filtering and Querying', () => {
    beforeEach(() => {
      TestLogger.logTestStart('UNIT', 'Unit Test 1');
      TestLogger.logTestResult('UNIT', 'Unit Test 1', 'PASS');
      TestLogger.logTestStart('E2E', 'E2E Test 1');
      TestLogger.logTestResult(
        'E2E',
        'E2E Test 1',
        'FAIL',
        'Something went wrong'
      );
      TestLogger.logTestStart('API', 'API Test 1');
      TestLogger.logTestResult('API', 'API Test 1', 'PASS');
    });

    it('gets logs by type', () => {
      const unitLogs = TestLogger.getLogsByType('UNIT');
      const e2eLogs = TestLogger.getLogsByType('E2E');
      const apiLogs = TestLogger.getLogsByType('API');

      expect(unitLogs).toHaveLength(2);
      expect(e2eLogs).toHaveLength(2);
      expect(apiLogs).toHaveLength(2);

      expect(unitLogs.every(log => log.includes('[UNIT]'))).toBe(true);
      expect(e2eLogs.every(log => log.includes('[E2E]'))).toBe(true);
      expect(apiLogs.every(log => log.includes('[API]'))).toBe(true);
    });

    it('gets failed tests', () => {
      const failedTests = TestLogger.getFailedTests();

      expect(failedTests).toHaveLength(1);
      expect(failedTests[0]).toContain('FAIL: E2E Test 1');
      expect(failedTests[0]).toContain('Something went wrong');
    });

    it('generates test summary', () => {
      const summary = TestLogger.getTestSummary();

      expect(summary.total).toBe(3);
      expect(summary.passed).toBe(2);
      expect(summary.failed).toBe(1);

      expect(summary.byType.UNIT.passed).toBe(1);
      expect(summary.byType.UNIT.failed).toBe(0);
      expect(summary.byType.E2E.passed).toBe(0);
      expect(summary.byType.E2E.failed).toBe(1);
      expect(summary.byType.API.passed).toBe(1);
      expect(summary.byType.API.failed).toBe(0);
    });
  });

  describe('Test Types', () => {
    const testTypes: TestType[] = [
      'UNIT',
      'INTEGRATION',
      'E2E',
      'API',
      'COVERAGE',
      'PERFORMANCE',
      'A11Y',
    ];

    it('supports all defined test types', () => {
      testTypes.forEach(type => {
        TestLogger.logTestStart(type, `${type} Test`);
        TestLogger.logTestResult(type, `${type} Test`, 'PASS');
      });

      const logs = TestLogger.getLogEntries();
      expect(logs).toHaveLength(testTypes.length * 2);

      testTypes.forEach(type => {
        expect(logs.some(log => log.includes(`[${type}] STARTED`))).toBe(true);
        expect(logs.some(log => log.includes(`[${type}] PASS`))).toBe(true);
      });
    });
  });

  describe('Enable/Disable Functionality', () => {
    it('respects enabled state', () => {
      TestLogger.setEnabled(false);
      TestLogger.logTestStart('UNIT', 'Disabled Test');

      const logs = TestLogger.getLogEntries();
      expect(logs).toHaveLength(0);

      TestLogger.setEnabled(true);
      TestLogger.logTestStart('UNIT', 'Enabled Test');

      const logsAfterEnable = TestLogger.getLogEntries();
      expect(logsAfterEnable).toHaveLength(1);
    });
    it('is enabled by default in test environment', () => {
      TestLogger.logTestStart('UNIT', 'Default Test');

      const logs = TestLogger.getLogEntries();
      expect(logs).toHaveLength(1);
    });
  });

  describe('Log Entry Format', () => {
    it('includes timestamp in correct format', () => {
      TestLogger.logTestStart('UNIT', 'Timestamp Test');

      const logs = TestLogger.getLogEntries();
      const timestampRegex = /^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/;

      expect(logs[0]).toMatch(timestampRegex);
    });

    it('formats entries consistently', () => {
      TestLogger.logTestStart('UNIT', 'Format Test');
      TestLogger.logTestResult('UNIT', 'Format Test', 'PASS', 'Details');

      const logs = TestLogger.getLogEntries();

      expect(logs[0]).toMatch(
        /\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[UNIT\] STARTED: Format Test/
      );
      expect(logs[1]).toMatch(
        /\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[UNIT\] PASS: Format Test - Details/
      );
    });
  });

  describe('Edge Cases', () => {
    it('handles empty test names', () => {
      TestLogger.logTestStart('UNIT', '');
      TestLogger.logTestResult('UNIT', '', 'PASS');

      const logs = TestLogger.getLogEntries();
      expect(logs).toHaveLength(2);
      expect(logs[0]).toContain('[UNIT] STARTED: ');
      expect(logs[1]).toContain('[UNIT] PASS: ');
    });

    it('handles special characters in test names', () => {
      const specialName = 'Test with "quotes" and \'apostrophes\' & symbols';
      TestLogger.logTestStart('UNIT', specialName);

      const logs = TestLogger.getLogEntries();
      expect(logs[0]).toContain(specialName);
    });

    it('handles undefined details gracefully', () => {
      TestLogger.logTestResult(
        'UNIT',
        'Undefined Details Test',
        'PASS',
        undefined
      );

      const logs = TestLogger.getLogEntries();
      expect(logs[0]).not.toContain(' - undefined');
      expect(logs[0]).not.toContain(' - ');
    });

    it('handles empty details string', () => {
      TestLogger.logTestResult('UNIT', 'Empty Details Test', 'PASS', '');

      const logs = TestLogger.getLogEntries();
      expect(logs[0]).not.toContain(' - ');
      expect(logs[0]).toContain('PASS: Empty Details Test');
    });
  });

  describe('Memory Management', () => {
    it('clears logs properly', () => {
      TestLogger.logTestStart('UNIT', 'Test 1');
      TestLogger.logTestStart('UNIT', 'Test 2');

      expect(TestLogger.getLogEntries()).toHaveLength(2);

      TestLogger.clearLogs();

      expect(TestLogger.getLogEntries()).toHaveLength(0);
    });

    it('maintains log order', () => {
      const testNames = ['First', 'Second', 'Third'];

      testNames.forEach(name => {
        TestLogger.logTestStart('UNIT', name);
      });

      const logs = TestLogger.getLogEntries();
      testNames.forEach((name, index) => {
        expect(logs[index]).toContain(`STARTED: ${name}`);
      });
    });
  });

  describe('Complex Scenarios', () => {
    it('handles mixed test types and statuses', () => {
      TestLogger.logTestStart('UNIT', 'Unit Test');
      TestLogger.logTestResult('UNIT', 'Unit Test', 'PASS');
      TestLogger.logTestStart('E2E', 'E2E Test');
      TestLogger.logTestResult('E2E', 'E2E Test', 'FAIL', 'Network error');
      TestLogger.logCoverage({
        statements: 85,
        branches: 80,
        functions: 90,
        lines: 85,
      });
      TestLogger.logPerformance('Performance Test', {
        performance: 90,
        accessibility: 95,
      });

      const logs = TestLogger.getLogEntries();
      expect(logs).toHaveLength(6);

      const summary = TestLogger.getTestSummary();
      expect(summary.total).toBe(3);
      expect(summary.passed).toBe(2);
      expect(summary.failed).toBe(1);
    });

    it('maintains state across multiple operations', () => {
      // Simulate a test session
      for (let i = 0; i < 10; i++) {
        TestLogger.logTestStart('UNIT', `Test ${i}`);
        TestLogger.logTestResult(
          'UNIT',
          `Test ${i}`,
          i % 3 === 0 ? 'FAIL' : 'PASS'
        );
      }

      const summary = TestLogger.getTestSummary();
      expect(summary.total).toBe(10);
      expect(summary.failed).toBe(4); // Tests 0, 3, 6, 9
      expect(summary.passed).toBe(6);
    });
  });
});
