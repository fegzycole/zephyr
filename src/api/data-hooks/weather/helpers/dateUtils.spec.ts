import { describe, it, expect } from 'vitest';
import { getLocalHHMM } from './dateUtils';

describe('getLocalHHMM', () => {
  it('formats a valid localtime string into hh:mm a format', () => {
    const input = '2025-09-09 14:05';
    const result = getLocalHHMM(input);
    expect(result).toBe('02:05 PM');
  });

  it('handles midnight correctly', () => {
    const input = '2025-09-09 00:00';
    const result = getLocalHHMM(input);
    expect(result).toBe('12:00 AM');
  });

  it('handles noon correctly', () => {
    const input = '2025-09-09 12:00';
    const result = getLocalHHMM(input);
    expect(result).toBe('12:00 PM');
  });

  it('handles single-digit hours and minutes correctly', () => {
    const input = '2025-09-09 09:07';
    const result = getLocalHHMM(input);
    expect(result).toBe('09:07 AM');
  });
});
