// Weather App JavaScript
class WeatherApp {
    constructor() {
        this.API_KEY = 'd3fb99dcf201cbd79d4d12c63c023a23';
        this.BASE_URL = 'https://api.openweathermap.org/data/2.5';
        
        this.initElements();
        this.bindEvents();
    }

    initElements() {
        this.locationInput = document.getElementById('locationInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.currentLocationBtn = document.getElementById('currentLocationBtn');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.errorMessage = document.getElementById('errorMessage');
        this.weatherDisplay = document.getElementById('weatherDisplay');
        
        // Weather display elements
        this.cityName = document.getElementById('cityName');
        this.countryName = document.getElementById('countryName');
        this.weatherIcon = document.getElementById('weatherIcon');
        this.currentTemp = document.getElementById('currentTemp');
        this.weatherDescription = document.getElementById('weatherDescription');
        this.feelsLike = document.getElementById('feelsLike');
        this.humidity = document.getElementById('humidity');
        this.windSpeed = document.getElementById('windSpeed');
        this.pressure = document.getElementById('pressure');
        this.visibility = document.getElementById('visibility');
        this.uvIndex = document.getElementById('uvIndex');
    }

    bindEvents() {
        this.searchBtn.addEventListener('click', () => {
            const location = this.locationInput.value.trim();
            if (location) {
                this.fetchWeatherByCity(location);
            }
        });

        this.currentLocationBtn.addEventListener('click', () => {
            this.requestUserLocation();
        });

        this.locationInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const location = this.locationInput.value.trim();
                if (location) {
                    this.fetchWeatherByCity(location);
                }
            }
        });
    }

    showLoading() {
        this.hideAllSections();
        this.loadingSpinner.classList.remove('hidden');
    }

    showError(message = 'Error fetching weather data. Please try again.') {
        this.hideAllSections();
        this.errorMessage.querySelector('p').textContent = message;
        this.errorMessage.classList.remove('hidden');
    }

    showWeatherData() {
        this.hideAllSections();
        this.weatherDisplay.classList.remove('hidden');
    }

    hideAllSections() {
        this.loadingSpinner.classList.add('hidden');
        this.errorMessage.classList.add('hidden');
        this.weatherDisplay.classList.add('hidden');
    }

    requestUserLocation() {
        if (navigator.geolocation) {
            this.showLoading();
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    this.fetchWeatherByCoords(latitude, longitude);
                },
                () => {
                    this.showError('Unable to get your location. Please enter a city name.');
                }
            );
        } else {
            this.showError('Geolocation is not supported by this browser.');
        }
    }

    async fetchWeatherByCity(city) {
        this.showLoading();
        
        try {
            const response = await fetch(
                `${this.BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${this.API_KEY}&units=metric`
            );
            
            if (!response.ok) {
                throw new Error('City not found');
            }
            
            const data = await response.json();
            this.displayWeatherData(data);
        } catch (error) {
            this.showError('City not found. Please check the spelling and try again.');
        }
    }

    async fetchWeatherByCoords(lat, lon) {
        this.showLoading();
        
        try {
            const response = await fetch(
                `${this.BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric`
            );
            
            if (!response.ok) {
                throw new Error('Weather data unavailable');
            }
            
            const data = await response.json();
            this.displayWeatherData(data);
        } catch (error) {
            this.showError('Unable to fetch weather data for your location.');
        }
    }

    displayWeatherData(data) {
        // Basic weather information
        this.cityName.textContent = data.name;
        this.countryName.textContent = data.sys.country;
        this.currentTemp.textContent = `${Math.round(data.main.temp)}°C`;
        this.weatherDescription.textContent = data.weather[0].description;
        
        // Weather icon
        const iconCode = data.weather[0].icon;
        this.weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        this.weatherIcon.alt = data.weather[0].description;
        
        // Detailed weather information
        this.feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
        this.humidity.textContent = `${data.main.humidity}%`;
        this.windSpeed.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
        this.pressure.textContent = `${data.main.pressure} hPa`;
        
        // Visibility
        const visibility = data.visibility ? (data.visibility / 1000).toFixed(1) : 'N/A';
        this.visibility.textContent = `${visibility} km`;
        
        // UV Index (not available in basic API, so show N/A)
        this.uvIndex.textContent = 'N/A';
        
        this.showWeatherData();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});
