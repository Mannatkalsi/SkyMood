var API_KEY = "5ff063d22bba104fe88e5b0o0a3edt8a";
var form = document.getElementById("weatherForm");
var weatherDisplay = document.getElementById("weatherDisplay");
var errorMessage = document.getElementById("errorMessage");

function displayWeather(city) {
  var xhr = new XMLHttpRequest();
  var url =
    "https://api.shecodes.io/weather/v1/current?query=" +
    encodeURIComponent(city) +
    "&key=" +
    API_KEY;
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        errorMessage.style.display = "none";
        var icon = data.condition.icon_url;
        var now = new Date();
        var day = now.toLocaleDateString(undefined, { weekday: "long" });
        var time = now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        weatherDisplay.innerHTML = `
              <h3>${data.city}</h3>
              <img src="${icon}" alt="weather icon" />
              <p>${data.condition.description}</p>
              <p>Temperature: ${Math.round(data.temperature.current)}°C</p>
              <p>Humidity: ${Math.round(data.humidity)}%</p>
              <p>Wind: ${Math.round(data.wind.speed)} km/h</p>
              <p>${day} | ${time}</p>
            `;
      } else {
        errorMessage.style.display = "block";
        weatherDisplay.innerHTML = "";
      }
    }
  };
  xhr.send();
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  var city = document.getElementById("cityInput").value;
  if (city) displayWeather(city);
});

document.getElementById("modeToggle").addEventListener("change", function () {
  document.body.classList.toggle("dark-mode");
});

// Auto-load local weather using geolocation
window.onload = function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      var xhr = new XMLHttpRequest();
      var url = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&key=${API_KEY}`;
      xhr.open("GET", url, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);
          displayWeather(data.city);
        }
      };
      xhr.send();
    });
  }
};
