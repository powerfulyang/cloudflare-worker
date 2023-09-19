import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Shanghai');

export const formatDatetime = (date: Date, format = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs.tz(date).format(format);
};

export function convertDateToString<T extends Record<string, any>>(
  obj: T[],
  format?: string,
): Array<{ [K in keyof T]: T[K] extends Date ? string : T[K] }>;

export function convertDateToString<T extends Record<string, any>>(
  obj: T,
  format?: string,
): { [K in keyof T]: T[K] extends Date ? string : T[K] };

// put keys: ['eventTime', 'createdAt', 'updatedAt'] in the schema convert to string from Date
export function convertDateToString(
  obj: any,
  format?: string,
) {
  if (Array.isArray(obj)) {
    return obj.map(x => {
      return convertDateToString(x, format);
    });
  }
  for (const key in obj) {
    const value = obj[key];
    if (value instanceof Date) {
      Object.assign(obj, { [key]: formatDatetime(obj[key], format) });
    }
  }
  return obj;
}
