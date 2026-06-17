import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { id } from 'date-fns/locale';

const TIMEZONE = 'Asia/Jakarta';

/**
 * Format: YYYY-MM-DD
 * Example: 2025-01-20
 */
export const formatDate = (
  value: string | Date | null | undefined
): string | null => {
  if (!value) return null;

  const date =
    typeof value === 'string'
    ? normalizeBackendDate(value)
      : value;

  if (!date) return null;

  return format(date, 'dd-MM-yyyy');
};

export const formatDate2 = (
  value: string | Date | null | undefined
): string | null => {
  if (!value) return null;
  const date = typeof value === 'string' ? normalizeBackendDate(value) : value;
  if (!date || isNaN(date.getTime())) return null;
  return format(date, 'yyyy-MM-dd');
};


/**
 * Format: YYYY-MM-DD HH:mm:ss
 * Example: 2025-01-20 14:35:22
 */
export const formatDateTime = (
  value: string | Date | null | undefined
): string | null => {
  if (!value) return null;

  const date = toZonedTime(new Date(value), TIMEZONE);
  return format(date, 'yyyy-MM-dd HH:mm:ss');
};

/**
 * Format display lokal
 * Example: 20 Januari 2025
 */
export function toDatetimeLocal(date?: string | Date | null): string | null {
  if (!date) return null;

  let d: Date;

  if (typeof date === 'string') {
    // Ambil komponen manual → dianggap LOCAL
    const [datePart, timePart] = date.split(' ');
    const [y, m, day] = datePart.split('-').map(Number);
    const [h, min] = timePart.split(':').map(Number);

    d = new Date(y, m - 1, day, h, min);
  } else {
    d = date;
  }

  const pad = (n: number) => n.toString().padStart(2, '0');

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}


export function datetimeLocalToDate(value: string): Date {
  const [date, time] = value.split('T');
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);

  return new Date(year, month - 1, day, hour, minute, 0);
}

export function normalizeBackendDate(value?: string | Date | number | null): Date | null {
  if (!value) return null;

  if (typeof value === 'number') {
    return excelSerialToDate(value);
  }

  if (typeof value === 'string' && value.endsWith('Z')) {
    const v = value.replace('Z', '');
    const [date, time] = v.split('T');
    const [y, m, d] = date.split('-').map(Number);
    const [hh, mm, ss] = time.split(':').map(Number);
    return new Date(y, m - 1, d, hh, mm, ss || 0);
  }

  // tambahan: tangani format dd-MM-yyyy secara eksplisit
  if (typeof value === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(value)) {
    const [d, m, y] = value.split('-').map(Number);
    const parsed = new Date(y, m - 1, d);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  if (value instanceof Date) return value;

  const fallback = new Date(value);
  return isNaN(fallback.getTime()) ? null : fallback;
}


// input -> backend
export function datetimeLocalToBackend(value: string): string {
  // 2025-12-31T10:50
  return value.replace('T', ' ') + ':00';
}

// backend -> input
export function backendToDatetimeLocal(value?: string | null): string | null {
  if (!value) return null;

  return value
    .replace(' ', 'T')
    .substring(0, 16);
}

export function excelSerialToDate(serial: number): Date {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    return new Date(excelEpoch.getTime() + serial * 86400000);
}
