import { useController } from "./useController.ts";
import type { Props }    from "./types.ts";
import { ForecastTable } from "../ForecastTable";
import { TheHeader }     from "../Header";
import { ForecastChart } from "../ForecastChart";
import { DayTabs }       from "../DayTabs";

export function WeatherApp(props: Props) {
  const {
    infoMessage,
    errorMessage,
    hasError,
    tableData,
    isDataLoading,
    location,
    setLocation,
    selectedDay,
    setSelectedDay,
    days
  } = useController({ props });


  return (
    <div className="weather-app">
      <div className="container">
        <div className="box flex flex-col gap-4">
          <TheHeader
            selectedLocation={ location }
            onSelectedLocation={ setLocation }
            disableCityRepository={ props.disableCityRepository }
          />

          <DayTabs day={ selectedDay } days={ days } onDaySelected={ setSelectedDay } />
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
              !hasError && !isDataLoading &&
              (
                <div className="box">
                  <div className="overflow-x-auto">
                    <ForecastTable
                      data={ tableData }
                    />
                  </div>
                </div>
              )
            }

            {
              !hasError && !isDataLoading &&
              (
                <div className="box">
                  <ForecastChart
                    data={ tableData }
                  />
                </div>
              )
            }
          </div>
        </div>
      </main>
    </div>
  );
}