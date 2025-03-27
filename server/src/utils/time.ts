import dayjs, { ConfigType } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export default dayjs;

let timezoneOffset = 480;

/**
 * @example
 * normalizeOffset(-8);
 * // expect to: -480;
 *
 * normalizeOffset(210);
 * // expect to: 210;
 */
export const normalizeOffset = (offset: number): number => dayjs().utcOffset(offset).utcOffset();

/**
 * 設定 time util 時區
 */
export const setTimezoneOffset = (offset: number): number => {
    timezoneOffset = normalizeOffset(offset);

    return timezoneOffset;
};

/**
 * Create dayjs object with app's timezone
 *
 * @param keepLocalTime - 保持時間不變, 只改變時區
 */
export const createDate = (time?: ConfigType, keepLocalTime: boolean = false) => dayjs(time).utcOffset(timezoneOffset, keepLocalTime);

/**
 * human readable date-time string formatter
 *
 * @param format - see https://day.js.org/docs/en/parse/string-format
 */
export const humanReadable = (time: ConfigType, format: string = 'YYYY-MM-DD HH:mm:ss'): string => {
    if (dayjs.isDayjs(time)) {
        return dayjs(time).format(format);
    }

    return dayjs(time).utcOffset(timezoneOffset).format(format);
};

/**
 * 將 timestamp 轉換為 YYYY-MM-DD HH:mm
 */
export const timeFormat = (value: ConfigType, format?: string): string => {
    if (!value) return '';

    const toFormat = format ?? 'YYYY-MM-DD HH:mm';

    return humanReadable(value, toFormat);
};

/**
 * 將 timestamp 轉換為 YYYY-MM-DD HH:mm
 */
export const rangeTimeFormat = (dateRange: ConfigType[]): string => {
    const [d1, d2] = dateRange;

    return `${timeFormat(d1)} ~ ${timeFormat(d2)}`;
};

/**
 * 取得範圍日期
 */
export const getRelativeRangeOfDay = (offset: number = 0): {
    from: dayjs.Dayjs;
    to: dayjs.Dayjs;
} => {
    const now = createDate();

    const offsetDay = now.add(offset, 'day');
    const from = offsetDay.startOf('day');
    const to = offsetDay.endOf('day');

    return {
        from,
        to,
    };
};

export const toSeconds = (timestamp: number) => {
    if (String(timestamp).length === 10) {
        return timestamp;
    }

    return Math.floor(timestamp / 1000);
};

export const toMiliSeconds = (timestamp: number) => {
    if (String(timestamp).length === 10) {
        return timestamp * 1000;
    }

    return timestamp;
};
