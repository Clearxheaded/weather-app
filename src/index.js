import './styles.css';

const apiKey = process.env.WEATHER_API_KEY;

function createLocationForm() {
    const form = document.createElement('form');
    form.id = 'locationForm';

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'locationInput';
    input.placeholder = 'Enter your location';

    const button = document.createElement('button');
    button.type = 'submit';
    button.textContent = 'Get Weather';

    form.appendChild(input);
    form.appendChild(button);

    return form;
}

async function getWeather(location) {
    try {
        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}`;
        const response = await fetch(`${url}?key=${apiKey}&unitGroup=metric`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather', error);
    }
}

async function displayWeather(weather) {
    const weatherDiv = document.createElement('div');
    weatherDiv.classList.add('weather');
    weatherDiv.innerHTML = `
        <h2>Weather in ${weather.resolvedAddress}</h2>
        <div class="weather-main">
            <i class="wi wi-${getWeatherIcon(weather.currentConditions.icon)}"></i>
            <div class="temperature">
                <span class="temp-value">${Math.round(weather.currentConditions.temp)}°C</span>
                <span class="temp-description">${weather.currentConditions.conditions}</span>
            </div>
        </div>
        <div class="weather-details">
            <div class="detail">
                <i class="wi wi-thermometer"></i>
                <p>Feels like: ${Math.round(weather.currentConditions.feelslike)}°C</p>
            </div>
            <div class="detail">
                <i class="wi wi-strong-wind"></i>
                <p>Wind: ${weather.currentConditions.windspeed} km/h</p>
            </div>
            <div class="detail">
                <i class="wi wi-humidity"></i>
                <p>Humidity: ${weather.currentConditions.humidity}%</p>
            </div>
        </div>
    `;
    return weatherDiv;
}

function getWeatherIcon(condition) {
    const iconMap = {
        'clear-day': 'day-sunny',
        'clear-night': 'night-clear',
        'partly-cloudy-day': 'day-cloudy',
        'partly-cloudy-night': 'night-alt-cloudy',
        'cloudy': 'cloudy',
        'rain': 'rain',
        'snow': 'snow',
        'wind': 'strong-wind',
        'fog': 'fog'
    };
    return iconMap[condition] || 'na';
}

function showLoadingSpinner() {
    const spinner = document.createElement('div');
    spinner.classList.add('loading-spinner');
    return spinner;
}

document.addEventListener('DOMContentLoaded', () => {
    const form = createLocationForm();
    const weatherContainer = document.createElement('div');
    weatherContainer.id = 'weatherContainer';
    
    document.body.appendChild(form);
    document.body.appendChild(weatherContainer);

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const input = document.getElementById('locationInput');
        const location = input.value;

        if (location) {
            weatherContainer.innerHTML = '';
            const spinner = showLoadingSpinner();
            weatherContainer.appendChild(spinner);

            const weatherData = await getWeather(location);
            const weatherDisplay = await displayWeather(weatherData);
            
            weatherContainer.innerHTML = '';
            weatherContainer.appendChild(weatherDisplay);
        } else {
            alert('Please enter a location');
        }
    });
});

