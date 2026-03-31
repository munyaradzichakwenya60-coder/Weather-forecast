const apiKey = 'd2f7006958eaa8301a8f607bb96c8240 ';
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');

async function fetchWeather(city) {
    if (!city) return;
    
    try {
        const currentRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`);
        
        if (!currentRes.ok) {
            const errorData = await currentRes.json();
            if (currentRes.status === 401) throw new Error("API Key still activating. Wait 1 hour.");
            throw new Error(errorData.message || "City not found");
        }
        
        const currentData = await currentRes.json();
        updateCurrentUI(currentData);

        const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`);
        const forecastData = await forecastRes.json();
        updateForecastUI(forecastData);

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

function updateCurrentUI(data) {
    document.getElementById('temp').textContent = Math.round(data.main.temp);
    document.getElementById('location').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('wind').textContent = `${data.wind.speed} km/h`;
    document.getElementById('visibility').textContent = `${(data.visibility / 1000).toFixed(1)} km`;
    document.getElementById('feels-like').textContent = `${Math.round(data.main.feels_like)}°`;
    
  
    document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
   
    document.getElementById('uv-index').textContent = "Normal"; 

    const condition = data.weather[0].main.toLowerCase();
    document.getElementById('weather-icon').textContent = getEmoji(condition);
}

function updateForecastUI(data) {
    const container = document.getElementById('forecast-container');
    container.innerHTML = '';
    
    const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));
    
    dailyData.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const condition = day.weather[0].main.toLowerCase();
        
        const div = document.createElement('div');
        div.className = 'forecast-item';
        div.innerHTML = `
            <div class="day">${dayName}</div>
            <div class="icon">${getEmoji(condition)}</div>
            <div class="temp">${Math.round(day.main.temp)}°C</div>
        `;
        container.appendChild(div);
    });
}

function getEmoji(condition) {
    if (condition.includes('cloud')) return '☁️';
    if (condition.includes('rain')) return '🌧️';
    if (condition.includes('clear')) return '☀️';
    if (condition.includes('thunderstorm')) return '⚡';
    return '⛅';
}

const navIcons = document.querySelectorAll('.nav-icons .icon');

navIcons.forEach(icon => {
    icon.addEventListener('click', () => {
        navIcons.forEach(i => i.classList.remove('active'));
        icon.classList.add('active');
        
        const iconTitle = icon.textContent;
        if (iconTitle === '⚙️') {
            console.log("Settings opened");
        } else if (iconTitle === '📊') {
            console.log("Dashboard view");
        } else if (iconTitle === '🗺️') {
            console.log("Map view");
        }
    });
});

const modal = document.getElementById('settings-modal');
const settingsIcon = document.querySelector('.icon:nth-child(4)'); // Selects the ⚙️ icon
const closeBtn = document.querySelector('.close-btn');

settingsIcon.addEventListener('click', () => {
    modal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});


navIcons.forEach((icon, index) => {
    icon.addEventListener('click', () => {
  
        navIcons.forEach(i => i.classList.remove('active'));
        icon.classList.add('active');

   
        switch(index) {
            case 0: 
                const currentCity = document.getElementById('location').textContent.split(',')[0];
                if (currentCity !== "Location") {
                    fetchWeather(currentCity);
                }
                break;
                
            case 1: 
                document.querySelector('.weather-grid').style.display = 'grid';
                console.log("Switched to Dashboard View");
                break;
                
            case 2:
                alert("Weather Map feature coming soon!");
                
                break;
                
            case 3: 
                document.getElementById('settings-modal').style.display = 'block';
                break;
        }
    });
});


searchBtn.addEventListener('click', () => fetchWeather(cityInput.value));
cityInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') fetchWeather(cityInput.value) });


fetchWeather('Bulawayo');
