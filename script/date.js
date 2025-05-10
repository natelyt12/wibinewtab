const clock = document.querySelector('.clock');
const date = document.getElementById('calendar');
const lunar = document.getElementById('lunar-calendar');

export function getClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    clock.innerText = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    return {
        "hours": hours,
        "minutes": minutes
    }
}

export function day() {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    let lunarconvert = {
        "day": day,
        "month": month,
        "year": year
    }
    date.innerText = `Ngày ${day} tháng ${month} năm ${year}`;
    return lunarconvert
}

// Lunar calendar
export async function lunarCalendar() {
    const cache = JSON.parse(localStorage.getItem('cache'))
    if (Object.keys(cache.lunar_cache).length == 0) {
        try {
            const response = await fetch('https://open.oapi.vn/date/convert-to-lunar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(day())
            })
            const data = await response.json()
            let d = data.data
            lunar.innerText = `Âm lịch: ${d.day} tháng ${d.month} năm ${d.sexagenaryCycle}`
            console.log('Lunar fetched');
            cache.lunar_cache = lunar.innerText
            localStorage.setItem('cache', JSON.stringify(cache))
        } catch (error) {
            console.log(error);
        }
    } else {
        console.log('Lunar cached');
        lunar.innerText = cache.lunar_cache
    }
}