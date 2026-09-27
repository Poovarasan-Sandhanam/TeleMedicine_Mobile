import moment from 'moment';

/**
 * Appointment dates are calendar days stored as UTC midnight. Reading them in
 * local time would show the previous day anywhere west of UTC, so take the UTC
 * date part and treat it as a local day.
 */
export const calendarDay = (date: string | Date) => moment(moment.utc(date).format('YYYY-MM-DD'), 'YYYY-MM-DD');

const hour12 = (h: number) => `${h % 12 || 12} ${h % 24 >= 12 ? 'PM' : 'AM'}`;

/** "10-11" -> "10 AM - 11 AM"; slots are stored as 24h hour ranges. */
export const formatSlot = (slot?: string) => {
  if (!slot) {
    return '';
  }
  const [a, b] = slot.split('-').map(Number);
  if (Number.isNaN(a) || Number.isNaN(b)) {
    return slot;
  }
  return `${hour12(a)} - ${hour12(b)}`;
};

/** "Today", "Tomorrow", otherwise "Mon, 28 Sep". */
export const formatDay = (date?: string | Date) => {
  if (!date) {
    return '';
  }
  const d = calendarDay(date);
  if (d.isSame(moment(), 'day')) {
    return 'Today';
  }
  if (d.isSame(moment().add(1, 'day'), 'day')) {
    return 'Tomorrow';
  }
  return d.format('ddd, D MMM');
};

export const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
};

/** Start of the booking's hour on its date, for sorting and "is upcoming" checks. */
export const bookingStart = (b: { date?: string; checkupTiming?: string }) =>
  calendarDay(b.date ?? new Date()).add(Number(b.checkupTiming?.split('-')[0] ?? 0), 'hours');
