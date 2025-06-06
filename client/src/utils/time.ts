import 'dayjs/locale/zh-tw';
import 'dayjs/locale/en';

import dayjs, { ConfigType } from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isLeapYear);
dayjs.extend(relativeTime);

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
 */
export const humanReadable = (time: ConfigType, formatOrRelative: string | true = 'YYYY-MM-DD HH:mm:ss'): string => {
    const d = dayjs(time).utcOffset(timezoneOffset);

    if (typeof formatOrRelative === 'boolean' && formatOrRelative) {
        return d.fromNow();
    }

    return d.format(formatOrRelative);
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

export const changeDayjsLanguage = (lang: string) => {
    const localeMap: Record<string, string> = {
        zh: 'zh-tw',
        en: 'en',
    };

    const dayjsLocale = localeMap[lang] ?? 'en';

    dayjs.locale(dayjsLocale);
};

const defaultLang = localStorage.getItem('todoless-lang') || 'zh';
changeDayjsLanguage(defaultLang);

export default dayjs;
