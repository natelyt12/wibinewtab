import { getClock } from "./date.js";

// Cache
if (localStorage.getItem('cache') == null) {
    let cache = {
        "cache": getClock().hours,
        "weather_cache": {},
        "lunar_cache": {}
    }
    localStorage.setItem('cache', JSON.stringify(cache))
}
const cache = JSON.parse(localStorage.getItem('cache'))
document.getElementById('cache_status').innerText = `Lần tiếp theo: ${cache.cache + 1}h`
