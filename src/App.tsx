import { WeatherApp } from "@/components";

const disableCityRepository = import.meta.env.VITE_ENABLE_CITY_REPOSITORY === "false";

export default function App() {
  return (
    <WeatherApp disableCityRepository={disableCityRepository} />
  );
}
