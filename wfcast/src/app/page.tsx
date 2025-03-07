"use client"

import { useState, useEffect } from "react";
import { Header } from "./components/header";

export default function Page() {
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState(null);
  const [warning, setWarning] = useState("");

  useEffect(() => {
    if (!search.trim()) {
      setWeather(null);
      setWarning("Type some city name");
    }
  }, [search]);

  const fetchWeather = async (event) => {
    event.preventDefault();
    if (!search.trim()) return;

    setWarning("Loading...");
    setWeather(null);

    const apiKey = "e432e9bd3d56758a895f48e9b8acdd49";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(search)}&appid=${apiKey}&units=metric&lang=pt_br`;

    try {
      const response = await fetch(url);
      const json = await response.json();


      if (json.cod === 200) {
        setWeather({
          name: json.name,
          country: json.sys.country,
          temp: json.main.temp,
          tempIcon: json.weather[0].icon,
          windSpeed: json.wind.speed,
          windAngle: json.wind.deg,
        });
        setWarning("");
      } else {
        setWarning("We couldn't find this location!");
        setWeather(null);
      }
    } catch (error) {
      setWarning("Error fetching data");
    }
  };

  return (

    <div className="flex flex-col items-center p-4">
      <Header/>
      
      <form onSubmit={fetchWeather} className="busca flex justify-center gap-1 mt-20 mb-8 md:m-10">
        <input
          type="text"
          id="searchInput"
          className="border-4 p-1 text-lg outline-none rounded-lg"
          placeholder="Enter city name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="w-20 border-4 rounded hover:bg-gray-200 font-medium ">Get</button>
      </form>

      {warning && <div className="aviso text-center text-gray-500 font-medium text-xl">{warning}</div>}

      {weather && (
        <div className="resultado w-72 justify-center mx-auto border-4 rounded-xl items-center md:w-1/2">
          <div className="titulo font-bold text-xl text-center mt-5">{weather.name}, {weather.country}</div>
          <div className="temp flex flex-col items-center">
            <div className="tempTitulo font-medium m-2">Temperature</div>
            <div className="tempInfo text-4xl">{weather.temp} <sup>°C</sup></div>
            <img className="w-24 h-24" src={`http://openweathermap.org/img/wn/${weather.tempIcon}.png`} alt="Weather Icon" />
          </div>
          <div className="vento flex flex-col items-center">
            <div className="ventoTitulo font-medium">Wind</div>
            <div className="ventoInfo m-2 font-medium text-2xl">{weather.windSpeed} <span>km/h</span></div>
            <div className="ventoArea w-12 h-12 m-4 border border-black rounded-full pl-6 pt-6 md:mt-8">
              <div className="ventoPonto w-4 h-px bg-black origin-left" style={{ transform: `rotate(${weather.windAngle - 90}deg)` }}></div>
            </div>
          </div>


        </div>
      )}

      <footer class="text-center mt-40 md:m-40 italic">Created by Cristiano</footer>

    </div>
  );
}
