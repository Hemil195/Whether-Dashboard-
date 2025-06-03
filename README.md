# WeatherPro Dashboard

## Description

WeatherPro is a modern, responsive web application built with React, TypeScript, and Tailwind CSS. It provides real-time weather data and forecasts using the OpenWeatherMap API.

## Key Features

*   **Real-time Weather Data:** Displays current weather conditions for a searched or current location.
*   **5-Day Forecast:** Provides a detailed forecast for the next five days.
*   **Location Search:** Allows users to search for weather data by city name.
*   **Geolocation:** Automatically detects and displays weather for the user's current location (with permission).
*   **Favorites:** Users can save locations to a favorites list for quick access.
*   **Recent Searches:** Keeps track of recently searched locations.
*   **Unit Toggle:** Switch between Celsius and Fahrenheit temperature units.
*   **Dark Mode:** Supports a dark mode for better viewing in low light.
*   **Responsive Design:** Optimized for display on various devices.

## Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd WeatherPro-Dashboard
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or yarn install
    ```
3.  **Obtain an OpenWeatherMap API Key:**
    *   Go to the [OpenWeatherMap website](https://openweathermap.org/api).
    *   Sign up for a free account.
    *   Get your API key from your account dashboard.
4.  **Create a `.env` file:**
    *   In the root directory of the project, create a file named `.env`.
    *   Add your API key to this file in the following format:
        ```env
        VITE_OPENWEATHER_API_KEY=YOUR_API_KEY_HERE
        ```
    *   Replace `YOUR_API_KEY_HERE` with the actual API key you obtained.
5.  **Run the application:**
    ```bash
    npm run dev
    # or yarn dev
    ```

The application should now be running on `http://localhost:5173/` (or another port specified in your terminal).