import React, { useState, useEffect, useRef } from 'react';
import { RecoilRoot, useRecoilValue, useSetRecoilState, atom } from 'recoil';

// --- Recoil State Atoms ---
const cityInput = atom({ key: 'cityInput', default: '' });
const searchCity = atom({ key: 'searchCity', default: '' });
const weatherData = atom({ key: 'weatherData', default: null });
const loadingWeather = atom({ key: 'loadingWeather', default: false });
const errorWeather = atom({ key: 'errorWeather', default: null });
// --- End of Recoil State ---

// --- API Key ---
const API_KEY = import.meta.env.VITE_OPEN_WEATHER_API_KEY; // <<< REMEMBER TO ADD YOUR API KEY HERE

// --- Global Styles & Keyframes (Moved to component for better React integration) ---
// We'll inject these styles using a component for cleaner management
const GlobalStyles = () => (
  <style>
    {`
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }

      body {
        margin: 0;
        font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
    `}
  </style>
);


// --- Components ---

function App() {
  return (
    <RecoilRoot>
      <GlobalStyles /> {/* Inject global styles here */}
      <AppWrapper />
    </RecoilRoot>
  )
}

function AppWrapper() {
  return (
    <div style={{
      minHeight: '100vh',
      padding: '20px',
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1A237E, #283593)', // Deeper, richer blue gradient
      fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif"
    }}>
      <WeatherApp />
    </div>
  )
}

function WeatherApp() {
  return (
    <div style={{
      width: '100%',
      maxWidth: '450px', // Slightly wider max-width
      background: 'rgba(255, 255, 255, 0.08)', // Slightly less opaque background
      backdropFilter: 'blur(20px)', // Increased blur for a stronger effect
      border: '1px solid rgba(255, 255, 255, 0.15)', // Thinner, subtle border
      boxShadow: '0 8px 60px 0 rgba(0, 0, 0, 0.4)', // Stronger shadow for depth
      borderRadius: '25px', // Slightly more rounded corners
      padding: '2.5rem 2rem', // Increased padding
      color: 'white',
      textAlign: 'center',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem', // Consistent spacing between sections
    }}>
      <h1 style={{ margin: '0', fontSize: '2.2rem', fontWeight: '700', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
        Weather Forecast
      </h1>
      <SearchComponent />
      <WeatherComponent />
    </div>
  )
}

function SearchComponent() {
  const cityRef = useRef(null);
  const setSearchCity = useSetRecoilState(searchCity);

  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const handleSearch = () => {
    if (cityRef.current.value.trim()) { // Trim to prevent searching empty spaces
      setSearchCity(cityRef.current.value.trim());
      cityRef.current.value = "";
    }
  }

  const inputStyle = {
    flex: 1,
    minWidth: 0,
    padding: '0.85rem 1.2rem', // Slightly more padding
    fontSize: '1.05rem', // Slightly larger font
    color: 'white',
    background: 'rgba(255, 255, 255, 0.15)', // Lighter input background
    border: '1px solid rgba(255, 255, 255, 0.25)',
    borderRadius: '10px', // More rounded input
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    '::placeholder': { // Placeholder style
      color: 'rgba(255, 255, 255, 0.6)',
    },
    // Focus style
    ...(isInputFocused && {
      borderColor: '#81D4FA', // Brighter blue on focus
      boxShadow: '0 0 8px rgba(129, 212, 250, 0.6)'
    })
  };

  const buttonStyle = {
    padding: '0.85rem 1.5rem', // Slightly more padding
    border: 'none',
    background: 'linear-gradient(to right, #00BFFF, #1E90FF)', // Brighter, more defined gradient
    color: 'white',
    borderRadius: '10px', // More rounded button
    cursor: 'pointer',
    fontSize: '1.05rem',
    fontWeight: '600',
    transition: 'background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
    boxShadow: '0 4px 10px rgba(0, 191, 255, 0.3)', // Button shadow
    // Hover style
    ...(isButtonHovered && {
      background: 'linear-gradient(to right, #1E90FF, #00BFFF)', // Invert gradient on hover
      transform: 'translateY(-2px)', // Lift effect
      boxShadow: '0 6px 15px rgba(0, 191, 255, 0.4)'
    })
  };

  return (
    <div style={{ display: 'flex', width: '100%', gap: '1rem' }}> {/* Increased gap */}
      <input
        type="text"
        ref={cityRef}
        placeholder="Enter city name..." // More inviting placeholder
        style={inputStyle}
        onFocus={() => setIsInputFocused(true)}
        onBlur={() => setIsInputFocused(false)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') handleSearch();
        }}
      />
      <button
        style={buttonStyle}
        onClick={handleSearch}
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
      >
        Search
      </button>
    </div>
  )
}

function WeatherComponent() {
  return (
    <div style={{
      width: '100%',
      minHeight: "300px", // Maintain min-height
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: '1rem', // Add some space above
    }}>
      <WeatherDataComponent />
    </div>
  )
}

function WeatherDataComponent() {
  const SearchCity = useRecoilValue(searchCity);
  const setWeatherData = useSetRecoilState(weatherData);
  const WeatherData = useRecoilValue(weatherData);
  const setLoading = useSetRecoilState(loadingWeather);
  const loading = useRecoilValue(loadingWeather);
  const setError = useSetRecoilState(errorWeather);
  const error = useRecoilValue(errorWeather);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!SearchCity) return;
      if (API_KEY === "YOUR_API_KEY" || API_KEY === "") {
        setError("Please add your OpenWeather API key to the code!");
        setLoading(false);
        setWeatherData(null); // Ensure data is cleared
        return;
      }
      setLoading(true);
      setError(null);
      setWeatherData(null);
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${SearchCity}&appid=${API_KEY}&units=metric`;
        const response = await fetch(url);
        if (!response.ok) {
          if (response.status === 404) throw new Error('City not found. Please check spelling.');
          if (response.status === 401) throw new Error('Invalid API key. Check your .env file or code.');
          throw new Error('Could not fetch weather. Try again.');
        }
        const data = await response.json();
        setWeatherData(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWeatherData();
  }, [SearchCity, setWeatherData, setLoading, setError]);

  if (loading) {
    return <p style={{ fontSize: '1.3rem', color: 'rgba(255, 255, 255, 0.9)' }}>Loading weather data...</p>;
  }

  if (error) {
    return (
      <p style={{
        fontSize: '1.15rem',
        color: '#FFEB3B', // Brighter yellow for errors
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        textAlign: 'center',
        maxWidth: '90%' // Ensure error message wraps
      }}>
        <span role="img" aria-label="warning">⚠️</span> {error}
      </p>
    );
  }

  if (!WeatherData) {
    return <p style={{ fontSize: '1.3rem', color: 'rgba(255, 255, 255, 0.7)' }}>Enter a city name above to get the latest weather forecast!</p>;
  }

  return (
    <div style={{ animation: 'fadeIn 0.7s ease-out', width: '100%' }}>
      <h2 style={{
        margin: '0 0 0.5rem 0',
        fontSize: '2.4rem', // Larger city name
        fontWeight: '700',
        textShadow: '0 2px 4px rgba(0,0,0,0.2)',
        maxWidth: '90%', // Ensure city name wraps if long
        wordBreak: 'break-word',
      }}>
        {WeatherData.name}
      </h2>

      <img
        src={`https://openweathermap.org/img/wn/${WeatherData.weather[0].icon}@4x.png`}
        alt={WeatherData.weather[0].description}
        style={{
          width: '180px', // Larger icon
          height: '180px',
          margin: '-20px 0 -10px 0', // Adjust margin
          filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.4))', // Stronger shadow
          animation: 'pulse 2s infinite ease-in-out', // Subtle pulse animation
        }}
      />
      
      <h1 style={{
        margin: '0',
        fontSize: '6rem', // Even larger temperature
        fontWeight: '800', // Bolder temperature
        lineHeight: 1,
        textShadow: '0 3px 6px rgba(0,0,0,0.3)'
      }}>
        {Math.round(WeatherData.main.temp)}°C
      </h1>

      <p style={{
        margin: '0.75rem 0 0 0',
        fontSize: '1.4rem', // Larger description
        fontWeight: '500',
        textTransform: 'capitalize',
        color: 'rgba(255, 255, 255, 0.95)',
        textShadow: '0 1px 2px rgba(0,0,0,0.2)'
      }}>
        {WeatherData.weather[0].description}
      </p>
    </div>
  );
}

export default App;