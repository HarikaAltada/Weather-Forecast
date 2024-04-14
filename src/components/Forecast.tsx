import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Sunrise from "./icons/sunrise";
import Sunset from "./icons/sunset";
import Tile from "./Title";
import Switch from "@mui/material/Switch";
import {
  getHumidityValue,
  getVisibilityValue,
  getWindDirection,
  getPop,
} from "./helpers";
enum TempUnit {
  CELSIUS,
  FAHRENHEIT,
}

function kelvinToCelsius(num: number) {
  return Math.round(num - 273.15);
}

function celsiusToFahrenheit(c: number) {
  return Math.round(c * (9 / 5) + 32);
}

function fahrenheitToCelsius(f: number) {
  return Math.round(((f - 32) * 5) / 9);
}

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list?: ListEntity[] | null;
  city: City; // Add city information
}

interface City {
  name: string;
  country: string;
  sunrise: number;
  sunset: number;
}

interface ListEntity {
  dt: number;
  main: Main;
  clouds: Clouds;
  visibility: number;
  weather?: WeatherEntity[] | null;
  pop: number;
  wind: Wind;
  sys: Sys;
}
interface Sys {
  sunrise: number;
  sunset: number;
}
interface Main {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  pressure: number;
}

interface WeatherEntity {
  id: number;
  main: string;
  description: string;
  icon: string;
}
interface Clouds {
  all: number;
}
interface Wind {
  speed: number;
  gust: number;
  deg: number;
}
interface Coord {
  lat: number;
  lon: number;
}
const WeatherComponent: React.FC = () => {
  const [currentForecast, setCurrentForecast] = useState<ListEntity | null>(
    null
  );
  const [forecastData, setForecastData] = useState<ListEntity[] | null>(null);
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sunriseTime, setSunriseTime] = useState("");
  const [sunsetTime, setSunsetTime] = useState("");
  const [currentGust, setCurrentGust] = useState<number | null>(null);
  const [currentFeelsLike, setCurrentFeelsLike] = useState<number | null>(null);
  const [currentClouds, setCurrentClouds] = useState<number | null>(null);
  const [unit, setUnit] = useState(TempUnit.CELSIUS);
  const { cityName: paramCityName } = useParams<{ cityName: string }>();
  const handleChangeUnit = () => {
    setUnit(unit === TempUnit.CELSIUS ? TempUnit.FAHRENHEIT : TempUnit.CELSIUS);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const units = unit === TempUnit.CELSIUS ? "metric" : "imperial";
        const response = await axios.get<WeatherData>(
          `https://api.openweathermap.org/data/2.5/forecast?q=${paramCityName}&appid=9cd871526079279e129cf2106f2487f2&units==${unit}`
        );
        if (response.data.list && response.data.list.length > 0) {
          setCurrentForecast(response.data.list[0]);
          setForecastData(response.data.list);
          setCityName(response.data.city.name);
          setCountry(response.data.city.country);
          const sunriseDate = new Date(response.data.city.sunrise * 1000);
          const sunsetDate = new Date(response.data.city.sunset * 1000);
          setSunriseTime(sunriseDate.toLocaleTimeString());
          setSunsetTime(sunsetDate.toLocaleTimeString());
          setCurrentGust(response.data.list[0].wind.gust);
          setCurrentFeelsLike(response.data.list[0].main.feels_like);
          setCurrentClouds(response.data.list[0].clouds.all);
        } else {
          setCurrentForecast(null);
        }
        setLoading(false);
      } catch (error) {
        setError("Error fetching data");
        setLoading(false);
      }
    };

    fetchData();
  }, [paramCityName]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  let highTemp, lowTemp;
  if (unit === TempUnit.CELSIUS) {
    highTemp = kelvinToCelsius(currentForecast?.main.temp_max ?? 0);
    lowTemp = kelvinToCelsius(currentForecast?.main.temp_min ?? 0);
  } else {
    highTemp = celsiusToFahrenheit(
      kelvinToCelsius(currentForecast?.main.temp_max ?? 0)
    );
    lowTemp = celsiusToFahrenheit(
      kelvinToCelsius(currentForecast?.main.temp_min ?? 0)
    );
  }

  const currentTemp =
    unit === TempUnit.CELSIUS
      ? kelvinToCelsius(currentForecast?.main.temp ?? 0)
      : celsiusToFahrenheit(kelvinToCelsius(currentForecast?.main.temp ?? 0));

  return (
    <div className="flex justify-center">
      {currentForecast && (
        <div className="w-full md:max-w-[500px] py-4 md:py-4 md:px-10 lg:px-10 h-full lg:h-auto bg-white bg-opacity-20 backdrop-blur-ls rounded drop-shadow-lg">
          <Link to="/">
            <button className="bg-black hover:bg-gray-800 text-white font-bold py-1 px-2 rounded text-sm">
              back
            </button>
          </Link>
          <div className="mx-auto w-[300px]">
            <section className="text-center">
              <h2 className="text-2xl font-black">
                {paramCityName}
                <span className="font-thin">{country}</span>
              </h2>
              <div>
                <Switch
                  onChange={handleChangeUnit}
                  inputProps={{ "aria-label": "controlled" }}
                />
                {unit === TempUnit.CELSIUS ? "Celsius" : "Fahrenheit"}
              </div>
              <p className="text-sm">
                {currentForecast.weather?.[0].description}
              </p>
              <p className="text-4xl font-extrabold">{currentTemp}°</p>
              <p className="text-sm">
                {" "}
                H: {highTemp}° L: {lowTemp}°
              </p>
            </section>

            <section className="flex overflow-x-scroll mt-4 pb-2 mb-5">
              {forecastData &&
                forecastData.map((forecast, i) => (
                  <div
                    key={i}
                    className="inline-block text-center w-[50px] flex-shrink-0"
                  >
                    <p className="text-sm">
                      {i === 0
                        ? "Now"
                        : new Date(forecast.dt * 1000).getHours()}
                    </p>
                    {forecast.weather && forecast.weather[0] && (
                      <img
                        alt={`weather-icon-${forecast.weather[0].description}`}
                        src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                      />
                    )}
                    <p className="text-sm font-bold">
                      {unit === TempUnit.CELSIUS
                        ? `${kelvinToCelsius(forecast.main.temp)}°C `
                        : ` ${celsiusToFahrenheit(
                            kelvinToCelsius(forecast.main.temp)
                          )}°C`}
                    </p>
                  </div>
                ))}
            </section>
            <section className="flex flex-wrap justify-between text-zinc-700">
              <div className="w-[140px] text-xs font-bold flex flex-col items-center bg-white/20 backdrop-blur-ls rounded drop-shadow-lg py-4 mb-5">
                <Sunrise />
                <span className="mt-2">{sunriseTime}</span>
              </div>
              <div className="w-[140px] text-xs font-bold flex flex-col items-center bg-white/20 backdrop-blur-ls rounded drop-shadow-lg py-4 mb-5">
                <Sunset />
                <span className="mt-2">{sunsetTime}</span>
              </div>
              <Tile
                icon="wind"
                title="wind"
                info={`${currentForecast.wind.speed} km/h`}
                description={`${getWindDirection(currentForecast.wind.deg)}
                 , gusts 
                ${currentGust} km/h`}
              />
              <Tile
                icon="feels"
                title="Feels like"
                info={`${
                  unit === TempUnit.CELSIUS
                    ? kelvinToCelsius(currentFeelsLike ?? 0)
                    : celsiusToFahrenheit(
                        kelvinToCelsius(currentFeelsLike ?? 0)
                      )
                }°${unit === TempUnit.CELSIUS ? "C" : "F"}`}
                description={`Feels ${
                  Math.round(currentForecast.main.feels_like) <
                  Math.round(currentForecast.main.temp)
                    ? "colder"
                    : "warmer"
                }`}
              />

              <Tile
                icon="humidity"
                title="Humidity"
                info={`${currentForecast.main.humidity} %`}
                description={getHumidityValue(currentForecast.main.humidity)}
              />
              <Tile
                icon="pop"
                title="Precipitation"
                info={`${Math.round(currentForecast.pop * 100)}%`}
                description={`${getPop(
                  currentForecast.pop
                )}, clouds at ${currentClouds}%`}
              />
              <Tile
                icon="pressure"
                title="Pressure"
                info={`${currentForecast.main.pressure} hPa`}
                description={` ${
                  Math.round(currentForecast.main.pressure) < 1013
                    ? "Lower"
                    : "Higher"
                } than standard`}
              />
              <Tile
                icon="visibility"
                title="Visibility"
                info={`${(currentForecast.visibility / 1000).toFixed()} km`}
                description={getVisibilityValue(currentForecast.visibility)}
              />
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherComponent;
