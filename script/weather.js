import { lunarCalendar, getClock } from "../script/date.js";
const weathericon = document.querySelector('.icon')
const weathertext = document.querySelector('.weather')
const temp = document.querySelector('.temp')
const weather_error = document.getElementById('weather-error')
const weather_input = document.getElementById('location')

weather_input.addEventListener('change', () => {
    if (weather_input.value == '') {
        weather_input.value = "Hà Nội"
    }
    getWeather(weather_input.value)
})

export async function getWeather(city) {
    let x = JSON.parse(localStorage.getItem('cache'))
    if (Object.keys(x.weather_cache).length == 0 || x.weather_cache.inputcity != city || x.cache != getClock().hours) {
        try {
            console.log('Fetch:', city);
            
            const response = await fetch('https://memaybeo.thanhlaphuc2007.workers.dev/?q=' + city)
            const data = await response.json()
            let desc = data.weather[0].description
            let icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            temp.innerText = Math.round(data.main.temp) + '°C'
            weathertext.innerText = data.name + '\n' + desc + ', cảm giác như ' + Math.round(data.main.feels_like) + '°C'
            weathericon.style.backgroundImage = `url(${icon})`

            // Save to cache
            let parsed = JSON.parse(localStorage.getItem('cache'))
            let cache = {
                "inputcity": city,
                "weather": weathertext.innerText,
                "temp": temp.innerText,
                "icon": icon
            }
            parsed.weather_cache = cache
            parsed.cache = getClock().hours
            localStorage.setItem('cache', JSON.stringify(parsed))
            weather_error.style.display = 'none'
        } catch (error) {
            weather_error.style.display = 'block'
        }
    } else {
        let parsed = JSON.parse(localStorage.getItem('cache'))
        console.log('Weather cached');
        weathertext.innerText = parsed.weather_cache.weather
        temp.innerText = parsed.weather_cache.temp
        weathericon.style.backgroundImage = `url(${parsed.weather_cache.icon})`
    }
    lunarCalendar()
}