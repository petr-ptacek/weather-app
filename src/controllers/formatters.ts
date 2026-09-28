export const TEMPERATURE_FORMAT = new Intl.NumberFormat(undefined, {
  style: "unit",
  unit: "celsius",
  maximumFractionDigits: 0
});

export const WIND_FORMAT = new Intl.NumberFormat(undefined, {
  style: "unit",
  unit: "meter-per-second",
  maximumFractionDigits: 1
});

export const PERCENT_FORMAT = new Intl.NumberFormat(undefined, {
  style: "unit",
  unit: "percent",
  maximumFractionDigits: 0
});