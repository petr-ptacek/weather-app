import { App } from "./controllers";

/**
 * default to true if it is not set
 */
const enableCityRepository = import.meta.env.VITE_ENABLE_CITY_REPOSITORY !== "false";

new App({
  enableCityRepository,
}).init();
