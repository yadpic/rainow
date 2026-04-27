const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Weather API configuration
const OPENWEATHER_API_KEY = 'd6994f7a7ec18d7144fbed686acf1f7d';
const JOHOR_LAT = 1.4854;
const JOHOR_LON = 103.7618;

// Cache for weather data (to avoid hammering the API)
let cachedWeather = null;
let lastFetch = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// API endpoint for weather data
app.get('/api/weather', async (req, res) => {
  try {
    // Get location from query parameters (from user's phone GPS)
    let lat = parseFloat(req.query.lat) || JOHOR_LAT;
    let lon = parseFloat(req.query.lon) || JOHOR_LON;

    // Validate coordinates
    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      lat = JOHOR_LAT;
      lon = JOHOR_LON;
    }

    const now = Date.now();
    
    // Return cached data if fresh (but only if same location)
    if (cachedWeather && (now - lastFetch) < CACHE_DURATION && 
        cachedWeather.requestLat === lat && cachedWeather.requestLon === lon) {
      return res.json(cachedWeather);
    }

    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Weather API error: ${data.message}`);
    }

    // Parse the current and forecast data
    const now_data = data.list[0];
    const temp = Math.round(now_data.main.temp);
    const condition = now_data.weather[0].main;
    const description = now_data.weather[0].description;
    const isRaining = ['Rain', 'Drizzle', 'Thunderstorm'].includes(condition);

    // Get forecast for next 2 periods (each ~3 hours)
    const rainChance1 = Math.round((data.list[1]?.main?.pop || 0) * 100);
    const rainChance2 = Math.round((data.list[2]?.main?.pop || 0) * 100);

    // Get location name (if available from API)
    const locationName = data.city?.name ? `${data.city.name}, ${data.city.country}` : `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;

    const weatherData = {
      location: locationName,
      temp,
      condition,
      description,
      isRaining,
      forecast: [
        { hour: 1, rainChance: rainChance1 },
        { hour: 2, rainChance: rainChance2 }
      ],
      timestamp: new Date().toISOString(),
      lastUpdate: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      requestLat: lat,
      requestLon: lon
    };

    // Cache the result
    cachedWeather = weatherData;
    lastFetch = now;

    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather:', error);
    res.status(500).json({ 
      error: 'Failed to fetch weather data',
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve the main HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🌧️ Rain Check Server running on http://localhost:${PORT}`);
  console.log(`Location: Johor Bahru, Malaysia`);
  console.log(`API endpoint: http://localhost:${PORT}/api/weather`);
});
