export class DateUtils {
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
