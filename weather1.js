const cityInput = document.getElementById('city_input');
const searchBtn = document.getElementById('searchBtn');
const apiKey = 'cd2b167e0493f182c1803321a2cbf6ea';

const currentWeatherCard = document.getElementById('currentWeatherCard');
const fiveDayForecastCard = document.getElementById('fiveDayForecast');

const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function getWeatherDetails(name, lat, lon, country) {
  const weatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  const forecastAPI = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  // Current Weather
  fetch(weatherAPI)
    .then(res => res.json())
    .then(data => {
      const date = new Date();
      const temp = (data.main.temp - 273.15).toFixed(1);
      const description = data.weather[0].description;
      const icon = data.weather[0].icon;

      currentWeatherCard.innerHTML = `
        <div class="details">
          <p>Now</p>
          <h2>${temp}&deg;C</h2>
          <p>${description}</p>
        </div>
        <div class="weather-icon">
          <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="">
        </div>
        <hr>
        <div class="card-footer">
          <p><i class="fa-light fa-calendar"></i> ${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}</p>
          <p><i class="fa-light fa-location-dot"></i> ${name}, ${country}</p>
        </div>
      `;
    })
    .catch(() => alert("Failed to fetch current weather"));

  // 5-Day Forecast
  fetch(forecastAPI)
    .then(res => res.json())
    .then(data => {
      let uniqueDays = [];
      let filteredForecast = data.list.filter(item => {
        const date = new Date(item.dt_txt).getDate();
        if (!uniqueDays.includes(date)) {
          uniqueDays.push(date);
          return true;
        }
        return false;
      });

      fiveDayForecastCard.innerHTML = '';
      filteredForecast.slice(1, 6).forEach(item => {
        const date = new Date(item.dt_txt);
        const icon = item.weather[0].icon;
        const temp = (item.main.temp - 273.15).toFixed(1);
        const day = days[date.getDay()];
        const month = months[date.getMonth()];
        const dateNum = date.getDate();

        fiveDayForecastCard.innerHTML += `
          <div class="forecast-item">
            <div class="icon-wrapper">
              <img src="https://openweathermap.org/img/wn/${icon}.png" alt="">
              <span>${temp}&deg;C</span>
            </div>
            <p>${dateNum} ${month}</p>
            <p>${day}</p>
          </div>
        `;
      });
    })
    .catch(() => alert("Failed to fetch 5-day forecast"));
}

function getCityCoordinates() {
  const city = cityInput.value.trim();
  if (!city) return;

  const geoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
  fetch(geoURL)
    .then(res => res.json())
    .then(data => {
      if (!data.length) {
        alert("City not found!");
        return;
      }

      const { name, lat, lon, country } = data[0];
      getWeatherDetails(name, lat, lon, country);
    })
    .catch(() => alert("Failed to fetch coordinates"));
}

searchBtn.addEventListener('click', getCityCoordinates);

// Optional: search on Enter key
cityInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') getCityCoordinates();
});
