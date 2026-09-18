import React, { useState, useEffect } from 'react';
import '../PrevisaoTempo.css';

export function WeatherForecast() {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/weather');
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setForecast(data.forecast);
        setError(null);
      } else {
        setError(data.message || 'Erro ao buscar previsão');
      }
    } catch (err) {
      console.error('Erro:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="weather-container">
        <div className="loading">Carregando previsão...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-container">
        <div className="error">❌ {error}</div>
        <button onClick={fetchWeather} className="retry-btn">
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="weather-container">
      <h1 className="weather-title">Presidente Prudente SP</h1>
      <h2 className="weather-title">Previsão - 6 Dias</h2>
      
      <div className="weather-grid">
        {forecast.map((day, index) => (
          <div key={index} className="weather-card">
            <div className="day-name">{day.day}</div>
            
            <div className="weather-icon">
              {day.icon}
            </div>
            
            <div className="temperatures">
              <span className="temp-max">{day.temp_max}°</span>
              <span className="temp-min">{day.temp_min}°</span>
            </div>
            
            <div className="description" title={day.description}>
              {day.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeatherForecast;
