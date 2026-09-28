import { useController } from "./useController.ts";
import type { Props }    from "./types.ts";

export function WeatherApp(props: Props) {
  const { infoMessage, errorMessage, hasError } = useController({ props });


  return (
    <div className="weather-app">
      <div className="container">
        <div className="box flex flex-col gap-4">
          {/*<TheHeader*/ }
          {/*  v-model:selected-location="location"*/ }
          {/*:disable-city-repository="disableCityRepository"*/ }
          {/* />*/ }
          {/*<DayTabs*/ }
          {/*  v-model:day="selectedDay"*/ }
          {/*:days="days"*/ }
          {/* />*/ }
        </div>
      </div>

      <main>
        <div className="container">
          <div className="forecast">

            <div style={ { display: !!infoMessage ? "block" : "none" } } className="box">
              <div className="forecast__message">{ infoMessage }</div>
            </div>

            <div style={ { display: !!errorMessage ? "block" : "none" } } className="box">
              <div className="forecast__message forecast__message--error"> { errorMessage }</div>
            </div>

            {
              !hasError &&
              (
                <div className="box">
                  <div className="overflow-x-auto">
                    {/*  <ForecastTable*/ }
                    {/*  :data="tableData"*/ }
                    {/*   />*/ }
                  </div>
                </div>
              )
            }

            {/*<div*/ }
            {/*  v-if="initialized && !hasError"*/ }
            {/*  className="box"*/ }
            {/*>*/ }
            {/*<div className="overflow-x-auto">*/ }
            {/*  <ForecastTable*/ }
            {/*  :data="tableData"*/ }
            {/*   />*/ }
            {/*</div>*/ }
            {/*</div>*/ }

            {/*<div*/ }
            {/*  v-if="initialized && !hasError"*/ }
            {/*  className="box"*/ }
            {/*>*/ }
            {/*  <ForecastChart*/ }
            {/*  :data="tableData"*/ }
            {/*   />*/ }
            {/*</div>*/ }

          </div>
        </div>
      </main>
    </div>
  );
}