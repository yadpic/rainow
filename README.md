# Rain Check - Johor Bahru 🌧️

A simple, fast web app to check if it's raining right now in Johor Bahru. Perfect for deciding whether to wear a raincoat before your motorcycle ride home from work.

## Features

- ✅ **Real-time weather** - Current temperature and rain status
- ✅ **Quick answer** - Big, easy-to-read "IS IT RAINING NOW?" display
- ✅ **2-hour forecast** - See if rain is coming soon
- ✅ **Fast refresh** - One-tap update
- ✅ **Mobile optimized** - Perfect for checking at the mall
- ✅ **Caching** - Minimal API calls to avoid rate limits

## Quick Start

### Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the server**
   ```bash
   npm start
   ```

3. **Open in browser**
   ```
   http://localhost:3000
   ```

That's it! The app will fetch weather data from OpenWeather API and cache it for 10 minutes.

## Deployment Options

### Option 1: Deploy to Heroku (Free with account)

1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
2. Login to Heroku:
   ```bash
   heroku login
   ```
3. Create app:
   ```bash
   heroku create your-app-name
   ```
4. Deploy:
   ```bash
   git push heroku main
   ```
5. Open:
   ```bash
   heroku open
   ```

### Option 2: Deploy to Railway.app (Recommended - simple, free tier)

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Connect your GitHub repo
4. Railway auto-detects Node.js and deploys
5. Get your URL from the project dashboard

### Option 3: Deploy to Vercel (Free)

1. Push code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Click Deploy
5. Vercel builds and deploys automatically

### Option 4: Deploy to your own server (VPS)

1. SSH into your server
2. Clone this repo
3. Run `npm install && npm start`
4. Use PM2 to keep it running:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "rain-check"
   pm2 startup
   pm2 save
   ```

## Project Structure

```
.
├── server.js          # Express.js server with weather API
├── package.json       # Dependencies
├── public/
│   └── index.html     # Frontend (HTML/CSS/JS)
└── README.md          # This file
```

## How It Works

1. **Frontend** (`public/index.html`) - Beautiful, mobile-optimized UI
2. **Backend** (`server.js`) - Node.js/Express server that:
   - Fetches weather from OpenWeather API
   - Caches data for 10 minutes (saves API quota)
   - Serves the frontend
   - Provides `/api/weather` endpoint

## API Endpoints

### GET `/api/weather`
Returns current weather and forecast for Johor Bahru.

**Response:**
```json
{
  "location": "Johor Bahru, Malaysia",
  "temp": 28,
  "condition": "Rain",
  "description": "light rain",
  "isRaining": true,
  "forecast": [
    { "hour": 1, "rainChance": 45 },
    { "hour": 2, "rainChance": 30 }
  ],
  "timestamp": "2024-01-15T14:30:00.000Z",
  "lastUpdate": "02:30 PM"
}
```

### GET `/api/health`
Health check endpoint.

## Configuration

Edit these in `server.js` to customize:

```javascript
const PORT = process.env.PORT || 3000;  // Server port
const JOHOR_LAT = 1.4854;               // Latitude
const JOHOR_LON = 103.7618;             // Longitude
const CACHE_DURATION = 10 * 60 * 1000;  // Cache time in ms
```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Set to 'production' for production deployment

## Weather Data

This app uses the free tier of OpenWeather API:
- Updates every 15 minutes
- Includes 5-day forecast
- No API key required for the demo (built-in)

## Browser Compatibility

Works on:
- ✅ iOS Safari 12+
- ✅ Android Chrome
- ✅ Firefox
- ✅ Edge
- ✅ Chrome

## License

MIT - Feel free to use and modify for your needs.

## Support

If the weather API is down or you get errors:
1. Check your internet connection
2. Click "Refresh Now" button
3. The app caches data, so it might show old data
4. Check https://openweathermap.org/api status

---

Stay safe on your motorcycle ride! 🏍️
