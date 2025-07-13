// Тесты для утилит
const { formatUptime, sleep } = require('../utils');

describe('Utils', () => {
  describe('formatUptime', () => {
    test('should format seconds correctly', () => {
      expect(formatUptime(3661)).toBe('1ч 1м');
      expect(formatUptime(86400)).toBe('1д');
      expect(formatUptime(90061)).toBe('1д 1ч 1м');
    });

    test('should handle edge cases', () => {
      expect(formatUptime(0)).toBe('N/A');
      expect(formatUptime(-1)).toBe('N/A');
      expect(formatUptime(null)).toBe('N/A');
      expect(formatUptime(undefined)).toBe('N/A');
    });

    test('should handle small values', () => {
      expect(formatUptime(30)).toBe('Только что'); // исправлено
      expect(formatUptime(3600)).toBe('1ч');
    });
  });

  describe('sleep', () => {
    test('should wait for specified time', async () => {
      const start = Date.now();
      await sleep(100);
      const end = Date.now();
      expect(end - start).toBeGreaterThanOrEqual(100);
    });
  });
}); 