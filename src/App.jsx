import { useState, useEffect, useRef } from 'react';
import { RecoilRoot, useRecoilValue, useSetRecoilState } from 'recoil';
import { cityInput } from './assets/store/cityInput';
import { searchCity } from './assets/store/searchCity';
import { weatherData } from './assets/store/weatherData';
import { loadingWeather } from './assets/store/loading';
import { errorWeather } from './assets/store/error';

// The API key is accessed securely from the .env.local file
const API_KEY = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

function App() {
  return (
    <RecoilRoot>
      <WeatherApp />
    </RecoilRoot>
  )
}

function WeatherApp() {
  return (
    <div style={{
      padding: '30px', fontFamily: 'Arial', textAlign: 'center',
      maxWidth: '400px', margin: '50px auto',
      backgroundColor: '#000000ff', borderRadius: '10px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    }}>
      <h1>What's The Weather</h1>
      <SearchComponent />
      <WeatherDataComponent />
    </div>
  )
}

function SearchComponent() {

  // const city = useRecoilValue(cityInput)
  // const setCity = useSetRecoilState(cityInput)

  const cityRef = useRef("")
  // here we minimises render using useRef()
  //earlier it uses city state which was re-rendering every time due to onchange function

  const setSearchCity = useSetRecoilState(searchCity)

  const handleSearch = () => {
    setSearchCity(cityRef.current.value)
    cityRef.current.value = ""
  }

  return (
    <div>
      <input type="text"
        // value={cityRef}
        ref = {cityRef}
        // onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city name"
        style={{ flexGrow: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
        // Allows pressing "Enter" to search
        onKeyPress={(e) => {
          if (e.key === 'Enter') handleSearch();
        }}
      />
      <button
        style={{
          padding: '10px 15px', marginLeft: '10px', border: 'none',
          backgroundColor: '#34D399', color: 'white',
          borderRadius: '5px', cursor: 'pointer'
        }}
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  )
}

function WeatherDataComponent() {

  const SearchCity = useRecoilValue(searchCity)

  const setWeatherData = useSetRecoilState(weatherData)
  const WeatherData = useRecoilValue(weatherData)

  const setLoading = useSetRecoilState(loadingWeather)
  const loading = useRecoilValue(loadingWeather)

  const setError = useSetRecoilState(errorWeather)
  const error = useRecoilValue(errorWeather)


  useEffect(() => {
    // This function will fetch the weather data
    const fetchWeatherData = async () => {
      // Don't fetch if searchCity is empty
      if (!SearchCity) return;

      setLoading(true); // Show loading every time we search
      setError(null);   // Clear any previous errors

      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${SearchCity}&appid=${API_KEY}&units=metric`;

        const response = await fetch(url);

        if (!response.ok) {
          // If the city is not found, response.ok will be false
          throw new Error('City not found. Please try again.');
        }

        const data = await response.json();
        setWeatherData(data); // Store the received data in state
      } catch (e) {
        setError(e.message); // Set the specific error message
        console.error(e);
      } finally {
        setLoading(false); // Set loading to false after fetch is complete
      }
    };

    fetchWeatherData();
  }, [SearchCity]);

  return (
    <div style={{
      padding: '30px', fontFamily: 'Arial', textAlign: 'center',
      maxWidth: '400px', margin: '50px auto',
      backgroundColor: '#00ddffff', borderRadius: '10px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    }}>
      {/* 6. The conditional display logic */}
      {loading && <p>Loading weather data...</p>}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {WeatherData && !loading && !error && (
        <div style={{ color: "black" }}>
          <h2>Current Weather in {WeatherData.name}</h2>
          <h1>{Math.round(WeatherData.main.temp)}°C</h1>
          <p>{WeatherData.weather[0].description}</p>
        </div>
      )}
    </div>
  )
}

export default App;