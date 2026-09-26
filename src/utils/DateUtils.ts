export class DateUtils {
  /** undefined locale = browser language */
  private static readonly DAY_FORMAT = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    day: "numeric",
    month: "numeric",
    year: "numeric"
  });

  private static readonly TIME_FORMAT = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit"
  });

  static formatTime(date: Date): string {
    return DateUtils.TIME_FORMAT.format(date);
  }

  static formatDay(date: Date): string {
    const formatted = DateUtils.DAY_FORMAT.format(date);
    return formatted.charAt(0).toLocaleUpperCase() + formatted.slice(1);
  }

  static startOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  static isEqualDate(a: Date, b: Date): boolean {
    if ( !DateUtils.isValid(a) || !DateUtils.isValid(b) ) return false;

    return a.getFullYear() === b.getFullYear()
      && a.getMonth() === b.getMonth()
      && a.getDate() === b.getDate();
  }

  static isValid(date: Date): boolean {
    return !Number.isNaN(date.getTime());
  }
}
