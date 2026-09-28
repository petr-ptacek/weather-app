export class FormattersUtils {
  static readonly TEMPERATURE_FORMAT = new Intl.NumberFormat(undefined, {
    style: "unit",
    unit: "celsius",
    maximumFractionDigits: 0
  });

  static readonly WIND_FORMAT = new Intl.NumberFormat(undefined, {
    style: "unit",
    unit: "meter-per-second",
    maximumFractionDigits: 1
  });

  static readonly PERCENT_FORMAT = new Intl.NumberFormat(undefined, {
    style: "unit",
    unit: "percent",
    maximumFractionDigits: 0
  });
}