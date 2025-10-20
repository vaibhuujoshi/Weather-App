import { useState, useEffect } from 'react';

// The API key is accessed securely from the .env.local file
const API_KEY = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

function WeatherApp() {
  // --- STATE ---
  // State to hold the weather data from the API
  const [weatherData, setWeatherData] = useState(null);
  // State to manage the loading status
  const [loading, setLoading] = useState(true);
  // State to handle any errors during the fetch
  const [error, setError] = useState(null);
  
  // 1. New state for the user's input
  const [cityInput, setCityInput] = useState("");
  // 2. New state for the city to be searched (default to "Delhi")
  const [searchCity, setSearchCity] = useState("Delhi");

  // --- USE EFFECT ---
  // 3. This effect now depends on 'searchCity'
  useEffect(() => {
    // This function will fetch the weather data
    const fetchWeatherData = async () => {
      // Don't fetch if searchCity is empty
      if (!searchCity) return; 

      setLoading(true); // Show loading every time we search
      setError(null);   // Clear any previous errors

      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${API_KEY}&units=metric`;

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
  }, [searchCity]); // 4. The effect now re-runs when 'searchCity' changes

  // --- HANDLER FUNCTION ---
  // This function runs when the search button is clicked
  const handleSearch = () => {
    setSearchCity(cityInput); // Set the searchCity to trigger the useEffect
    setCityInput(""); // Clear the input field
  };

  // --- JSX (UI) ---
  return (
    <div style={{
      padding: '30px', fontFamily: 'Arial', textAlign: 'center',
      maxWidth: '400px', margin: '50px auto', 
      backgroundColor: '#f4f7f9', borderRadius: '10px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    }}>
      
      {/* 5. The new search bar and button */}
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <input 
          type="text" 
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          placeholder="Enter city name"
          style={{ flexGrow: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
          // Allows pressing "Enter" to search
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
        />
        <button 
          onClick={handleSearch}
          style={{ padding: '10px 15px', marginLeft: '10px', border: 'none', 
                   backgroundColor: '#34D399', color: 'white', 
                   borderRadius: '5px', cursor: 'pointer' }}
        >
          Search
        </button>
      </div>

      {/* 6. The conditional display logic */}
      {loading && <p>Loading weather data...</p>}
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {weatherData && !loading && !error && (
        <div style={{color: "black"}}>
          <h2>Current Weather in {weatherData.name}</h2>
          <h1>{Math.round(weatherData.main.temp)}°C</h1>
          <p>{weatherData.weather[0].description}</p>
        </div>
      )}
    </div>
  );
}

export default WeatherApp;