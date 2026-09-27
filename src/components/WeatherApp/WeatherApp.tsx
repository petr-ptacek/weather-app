import type { Props } from "./types.ts";

export function WeatherApp(_props: Props) {
  return (
    <div className="weather-app">
      <div className="container">
        <div className="box flex flex-col gap-4">
          {/*<TheHeader*/}
          {/*  v-model:selected-location="location"*/}
          {/*:disable-city-repository="disableCityRepository"*/}
          {/* />*/}
          {/*<DayTabs*/}
          {/*  v-model:day="selectedDay"*/}
          {/*:days="days"*/}
          {/* />*/}
        </div>
      </div>

      {/*<main>*/}
      {/*  <div className="container">*/}
      {/*    <div className="forecast">*/}

      {/*      <div v-show="infoMessage" className="box">*/}
      {/*        <div className="forecast__message">{ { infoMessage } }</div>*/}
      {/*      </div>*/}

      {/*      <div v-show="errorMessage" className="box">*/}
      {/*        <div className="forecast__message forecast__message--error">{ { errorMessage } }</div>*/}
      {/*      </div>*/}

      {/*      <div*/}
      {/*        v-if="initialized && !hasError"*/}
      {/*        className="box"*/}
      {/*      >*/}
      {/*        <div className="overflow-x-auto">*/}
      {/*          <ForecastTable*/}
      {/*          :data="tableData"*/}
      {/*           />*/}
      {/*        </div>*/}
      {/*      </div>*/}

      {/*      <div*/}
      {/*        v-if="initialized && !hasError"*/}
      {/*        className="box"*/}
      {/*      >*/}
      {/*        <ForecastChart*/}
      {/*        :data="tableData"*/}
      {/*         />*/}
      {/*      </div>*/}

      {/*    </div>*/}
      {/*  </div>*/}
      {/*</main>*/}
    </div>
  );
}