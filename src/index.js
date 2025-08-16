function formatDateTime(timestamp) {
  const now = new Date(timestamp * 1000);
  const options = { weekday: "long", hour: "2-digit", minute: "2-digit" };
  return now.toLocaleDateString("en-US", options);
}

function updateWeather(data) {
  document.getElementById("city").textContent = data.city;
  document.getElementById("temperature").textContent =
    "🌡️ Temperature: " + Math.round(data.temperature.current) + "°C";
  document.getElementById("wind").textContent =
    "💨 Wind: " + Math.round(data.wind.speed) + " km/h";
  document.getElementById("humidity").textContent =
    "💧 Humidity: " +
    (data.temperature.humidity !== undefined
      ? Math.round(data.temperature.humidity) + "%"
      : "N/A");
  document.getElementById("icon").setAttribute("src", data.condition.icon_url);
  document.getElementById("date-time").textContent =
    "🕒 " + formatDateTime(data.time);
}

function showError(message) {
  document.getElementById("error-message").textContent = message;
}

function fetchWeather(city) {
  const xhr = new XMLHttpRequest();
  const apiKey = "5ff063d22bba104fe88e5b0o0a3edt8a";
  const currentUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}`;
  const forecastUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}`;

  xhr.open("GET", currentUrl, true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      const currentResponse = JSON.parse(xhr.responseText);
      updateWeather(currentResponse);
      showError("");

      // Fetch forecast data
      const forecastXhr = new XMLHttpRequest();
      forecastXhr.open("GET", forecastUrl, true);
      forecastXhr.onload = function () {
        if (forecastXhr.status === 200) {
          const forecastResponse = JSON.parse(forecastXhr.responseText);
          updateForecast(forecastResponse);
        }
      };
      forecastXhr.send();
    } else {
      showError("City not found. Please try again.");
    }
  };
  xhr.onerror = function () {
    showError("Failed to connect. Check your internet connection.");
  };
  xhr.send();
}

function detectLocation() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "https://ipapi.co/json/", true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      const location = JSON.parse(xhr.responseText);
      fetchWeather(location.city || "Melbourne");
    } else {
      fetchWeather("Melbourne");
    }
  };
  xhr.onerror = function () {
    fetchWeather("Melbourne");
  };
  xhr.send();
}

document.getElementById("search-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const city = document.getElementById("search-input").value.trim();
  if (city) {
    fetchWeather(city);
  }
});
function updateForecast(forecastData) {
  const forecastContainer = document.getElementById("forecast");
  forecastContainer.innerHTML = "";

  forecastData.daily.slice(1, 6).forEach((day) => {
    const date = new Date(day.time * 1000);
    const options = { weekday: "short" };
    const dayName = date.toLocaleDateString("en-US", options);

    const card = document.createElement("div");
    card.classList.add("forecast-card");

    card.innerHTML = `
      <div><strong>${dayName}</strong></div>
      <img src="${day.condition.icon_url}" alt="${day.condition.description}" />
      <div>${Math.round(day.temperature.maximum)}° / ${Math.round(
      day.temperature.minimum
    )}°</div>
    `;

    forecastContainer.appendChild(card);
  });
}

detectLocation();
function updateForecast(forecastData) {
  const forecastContainer = document.getElementById("forecast");
  forecastContainer.innerHTML = "";

  forecastData.daily.slice(1, 6).forEach((day) => {
    const date = new Date(day.time * 1000);
    const options = { weekday: "short" };
    const dayName = date.toLocaleDateString("en-US", options);

    const card = document.createElement("div");
    card.classList.add("forecast-card");

    card.innerHTML = `
      <div><strong>${dayName}</strong></div>
      <img src="${day.condition.icon_url}" alt="${day.condition.description}" />
      <div>${Math.round(day.temperature.maximum)}° / ${Math.round(
      day.temperature.minimum
    )}°</div>
    `;

    forecastContainer.appendChild(card);
  });
}
