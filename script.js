const form = document.querySelector('.search-form');
const resultDiv = document.querySelector('.weather-result');

form.addEventListener('submit', async function(event) {
    event.preventDefault();

    const API_KEY = '5d44c8cb9a9e2d710e993a8839e93d21';
    const input = form.querySelector('input');
    const city = input.value.trim();

    if (!city) {
        alert('Enter the city!');
        return;
    }

    try {
        const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`);
        const geoData = await geoRes.json();

        if (geoData.length === 0) {
            alert("City not found!");
            return;
        }

        const { lat, lon } = geoData[0];

        const weatherRes = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        const weatherData = await weatherRes.json();

        const date = new Date((weatherData.dt + weatherData.timezone) * 1000);
        const time = date.toUTCString().replace('GMT', '');

        const temp = weatherData.main.temp;
        const desc = weatherData.weather[0].description;
        const feels = weatherData.main.feels_like;
        const humidity = weatherData.main.humidity;
        const wind = weatherData.wind.speed;
        const icon = weatherData.weather[0].icon;

        // Формируем HTML с иконкой
        resultDiv.innerHTML = `
            <div class="weather-card">
                <h2>Weather in ${city}</h2>
                <p><strong>Time:</strong> ${time}</p>
                <p>🌡️ <strong>Temp:</strong> ${temp}°C</p>
                <p>🤔 <strong>Feels like:</strong> ${feels}°C</p>
                <p>💧 <strong>Humidity:</strong> ${humidity}%</p>
                <p>💨 <strong>Wind:</strong> ${wind} m/s</p>
                <p>☁️ <strong>Description:</strong> ${desc} <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${desc}"></p>
            </div>
        `;

    } catch (err) {
        console.error(err);
        resultDiv.innerHTML = `<p style="color:red;">Error while fetching data</p>`;
    }

    input.value = '';
});
