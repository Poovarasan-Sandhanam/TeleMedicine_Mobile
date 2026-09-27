import type {} from 'jest';
import moment from 'moment';
import { bookingStart, calendarDay, formatDay, formatSlot } from '../format';

describe('formatSlot', () => {
  it('turns 24h hour ranges into readable times', () => {
    expect(formatSlot('9-10')).toBe('9 AM - 10 AM');
    expect(formatSlot('12-13')).toBe('12 PM - 1 PM');
    expect(formatSlot('23-0')).toBe('11 PM - 12 AM');
    expect(formatSlot('0-1')).toBe('12 AM - 1 AM');
  });
  it('leaves unexpected input alone', () => {
    expect(formatSlot('')).toBe('');
    expect(formatSlot('soon')).toBe('soon');
  });
});

describe('calendarDay', () => {
  it('keeps the stored calendar date whatever the device timezone', () => {
    // Stored as UTC midnight; west of UTC a naive local read gives the day before.
    expect(calendarDay('2026-10-01T00:00:00.000Z').format('YYYY-MM-DD')).toBe('2026-10-01');
  });
});

describe('formatDay', () => {
  it('names today and tomorrow', () => {
    const today = moment().format('YYYY-MM-DD');
    const tomorrow = moment().add(1, 'day').format('YYYY-MM-DD');
    expect(formatDay(`${today}T00:00:00.000Z`)).toBe('Today');
    expect(formatDay(`${tomorrow}T00:00:00.000Z`)).toBe('Tomorrow');
  });
});

describe('bookingStart', () => {
  it('is the slot hour on the booking date', () => {
    const start = bookingStart({ date: '2026-10-01T00:00:00.000Z', checkupTiming: '15-16' });
    expect(start.format('YYYY-MM-DD HH:mm')).toBe('2026-10-01 15:00');
  });
});
