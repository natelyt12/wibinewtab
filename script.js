// const
const loader = document.querySelector('.loader');
const bgimg = document.querySelector('.bg-img');
const setting = document.querySelector('.settings');
const image = document.querySelector('.image');
const settingBtn = document.querySelector('.opt-btn');
const opacitySlider = document.getElementById('opacity-slider');
const bgposSlider = document.getElementById('bgpos-slider');
const API_select_box = document.querySelector('.API-select-box');
const choose_API = document.querySelector('.choose-API');
const previewImage = document.querySelector('.preview-image');
const date = document.getElementById('calendar');
const lunar = document.getElementById('lunar-calendar');
const clock = document.querySelector('.clock');
const bgopt = document.querySelector('.bg-settings');

const bgposCenter = document.getElementById('bgpos-center');
const safemode = document.getElementById('safemode');
// settings
const wavy = document.getElementById('wavy');
let settingstate = false;
// API
const API_name = document.querySelector('.API-name');
const api_none = document.getElementById('api_none');

// Error and alert handler
const errorDisplay = document.querySelector('.error-display');
const errorText = document.getElementById('error-text');
const alertBg = document.querySelector('.alert-box-bg');
const alertBox = document.querySelector('.alert-box');
const alertContent = document.getElementById('alert-content');
const alertClose = document.querySelector('.alert-close');
const alertProceed = document.querySelector('.alert-proceed');

window.onerror = function (message, source, lineno, colno, error) {
    errorDisplay.style.display = 'block';
    errorText.innerText = `Error: ${message} at ${source}:${lineno}:${colno}`;
};
function triggerError(message) {
    throw new Error(message);
}

function showalert(content) {
    alertContent.innerText = content;
    alertBg.style.display = 'block';
    setTimeout(() => {
        alertBox.style.opacity = 1;
        alertBg.style.opacity = 1;
        alertBox.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);

    return new Promise((resolve) => {
        alertProceed.addEventListener('click', () => {
            alertBox.style.opacity = 0;
            alertBox.style.transform = 'translate(-50%, -50%) scale(0.7)';
            alertBg.style.opacity = 0;
            setTimeout(() => {
                alertBg.style.display = 'none';
            }, 300);
            resolve(true);
        }, { once: true });

        alertClose.addEventListener('click', () => {
            alertBox.style.opacity = 0;
            alertBox.style.transform = 'translate(-50%, -50%) scale(0.7)';
            alertBg.style.opacity = 0;
            setTimeout(() => {
                alertBg.style.display = 'none';
            }, 300);
            resolve(false);
        }, { once: true });
    });
}

// Cache stuff -------------------------------------------------------
if (localStorage.getItem('cache') == null) {
    let cache = {
        "cache": 0,
        "weather_cache": {},
        "lunar_cache": {}
    }
    localStorage.setItem('cache', JSON.stringify(cache))
}
const cache = JSON.parse(localStorage.getItem('cache'))
document.getElementById('cache_status').innerText = `${day().day}`

// Time stuff -------------------------------------------------------
function getClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const time = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    clock.innerText = time;
    return {
        "hours": hours,
        "minutes": minutes
    }
}
getClock()
setInterval(getClock, 5000);

function day() {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const fullDate = today.toLocaleDateString('vi-VN', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
    lunarconvert = {
        "day": day,
        "month": month,
        "year": year
    }
    date.innerText = fullDate;
    return lunarconvert
}

// Lunar calendar
function nunar() {
    fetch('https://open.oapi.vn/date/convert-to-lunar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(day())
    })
        .then(response => response.json())
        .then(data => {
            let d = data.data
            lunar.innerText = `Âm lịch: ${d.day} tháng ${d.month} năm ${d.sexagenaryCycle}`
            cache.lunar_cache = lunar.innerText
            localStorage.setItem('cache', JSON.stringify(cache))
        })
}


// Weather stuff -------------------------------------------------------
const weathericon = document.querySelector('.icon')
const weathertext = document.querySelector('.weather')
const temp = document.querySelector('.temp')
const weather_input = document.getElementById('weather-input')
const weatherDescMap = {
    "Sunny": "Trời nắng",
    "Clear": "Trời quang đãng",
    "Partly cloudy": "Ít mây",
    "Cloudy": "Nhiều mây",
    "Overcast": "Mây đen u ám",
    "Light rain": "Mưa nhỏ",
    "Heavy rain": "Mưa lớn",
    "Fog": "Sương mù",
    "Patchy rain nearby": "Mưa rào rải rác",
};

const weatherIconMap = {
    "Sunny": "01d_t@2x.png",
    "Clear": "01d_t@2x.png",
    "Partly cloudy": "02d_t@2x.png",
    "Cloudy": "03d_t@2x.png",
    "Overcast": "04d_t@2x.png",
    "Light rain": "10d_t@2x.png",
    "Heavy rain": "09d_t@2x.png",
    "Fog": "50d_t@2x.png",
    "Patchy rain nearby": "09d_t@2x.png"
};

weather_input.addEventListener('change', () => {
    if (weather_input.value == '') {
        weather_input.value = "Hà Nội"
    }
    getWeather(weather_input.value)
})

function getWeather(city) {
    fetch(`https://wttr.in/${city}?format=j1`)
        .then(response => response.text())
        .then(data => {
            data = JSON.parse(data)
            let desc = data.current_condition[0].weatherDesc[0].value
            let descVN = weatherDescMap[desc] || desc;
            let iconMap = weatherIconMap[desc] || desc;
            let icon = './image/weather/' + iconMap
            weathertext.innerText = data.nearest_area[0].areaName[0].value + ', ' + data.nearest_area[0].country[0].value + '\n' + descVN + ', cảm giác như ' + data.current_condition[0].FeelsLikeC + '°C'
            temp.innerText = data.current_condition[0].temp_C + '°C'
            weathericon.style.backgroundImage = `url(${icon})`

            // Save to cache
            cache.weather_cache = {
                "weather": weathertext.innerText,
                "temp": temp.innerText,
                "icon": icon
            }
            cache.cache = day().day
            localStorage.setItem('cache', JSON.stringify(cache))
            nunar()
        }
        )
}


// Search stuff -------------------------------------------------------
const searchbox = document.getElementById('search')
const searchcontainer = document.querySelector('.search')
const clearsearch = document.getElementById('clear')
function focusonsearch() {
    searchbox.style.width = '500px'
    searchbox.style.transition = '0.5s cubic-bezier(0.190, 1.000, 0.220, 1.000)'
    clearsearch.style.display = 'flex'
    document.getElementsByName('search')[0].placeholder = 'Tìm kiếm [Enter để tìm]'
    searchbox.style.fontSize = '1.2em'
}
function normsearchstate() {
    searchbox.style.width = '230px';
    document.getElementsByName('search')[0].placeholder = 'Tìm kiếm [Nhập bất kỳ]';
    clearsearch.style.display = 'none'
    searchbox.blur()
    searchbox.style.fontSize = '0.8em'
}
searchbox.addEventListener('keypress', () => {
    if (searchbox.value.length >= 0) {
        focusonsearch()
    }
    if (event.key === 'Enter') {
        window.open(`https://www.google.com/search?q=${searchbox.value}`, "_self")
    }
})
searchbox.addEventListener('focus', () => {
    focusonsearch()
})
clearsearch.addEventListener('click', () => {
    searchbox.value = ''
    searchbox.focus()
})

// Zoom search box when type
document.addEventListener('click', (event) => {
    if (!searchcontainer.contains(event.target) && !searchbox.contains(event.target)) {
        normsearchstate()
    }
});
document.addEventListener('keydown', (event) => {
    if (event.key === "Escape") {
        normsearchstate()
    }
})


// Hotkeys -------------------------------------------------------
document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'z') {
        setting.classList.toggle('active');
        settingBtn.classList.toggle('active2');
        settingstate = !settingstate;
        checkSettingState()
    } else if (event.ctrlKey && event.key === 'x') {
        safemode.checked = !safemode.checked;
        safemode.dispatchEvent(new Event('click'));
    } else if (event.key.length === 1 && !event.ctrlKey) {
        if (settingstate == false) {
            searchbox.focus();
        }
    } else if (event.key === 'Escape') {
        setting.classList.remove('active');
        settingBtn.classList.remove('active2');
        settingstate = false;
    }
});

settingBtn.addEventListener('click', () => {
    setting.classList.toggle('active');
    settingBtn.classList.toggle('active2');
    settingstate = !settingstate;
    checkSettingState()
});

const optbtnCon = document.querySelector('.opt-btn-con');
const optbtn = document.querySelector('.opt-btn');
function checkSettingState() {
    if (settingstate) {
        optbtnCon.style.transform = 'translateX(-240px)';
        optbtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <line x1="4" y1="4" x2="20" y2="20" stroke="white" stroke-width="2" stroke-linecap="round" />
                        <line x1="20" y1="4" x2="4" y2="20" stroke="white" stroke-width="2" stroke-linecap="round" />
                        </svg>`
        optbtn.style.transform = 'rotate(-90deg) scale(0.8)'
    } else {
        optbtnCon.style.transform = 'translateX(0)';
        optbtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" 
                            fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5Z" 
                            stroke="white" stroke-width="2"/>
                            <path d="M19.43 12.98C19.47 12.66 19.5 12.33 19.5 12C19.5 11.67 19.47 11.34 19.43 11.02L21.54 9.37C21.73 9.22 21.78 8.95 21.66 8.73L19.66 5.27C19.54 5.05 19.28 4.97 19.06 5.06L16.56 6.06C16.04 5.65 15.47 5.31 14.85 5.06L14.5 2.39C14.47 2.17 14.28 2 14.05 2H9.95C9.72 2 9.53 2.17 9.5 2.39L9.15 5.06C8.53 5.31 7.96 5.65 7.44 6.06L4.94 5.06C4.72 4.97 4.46 5.05 4.34 5.27L2.34 8.73C2.22 8.95 2.27 9.22 2.46 9.37L4.57 11.02C4.53 11.34 4.5 11.67 4.5 12C4.5 12.33 4.53 12.66 4.57 12.98L2.46 14.63C2.27 14.78 2.22 15.05 2.34 15.27L4.34 18.73C4.46 18.95 4.72 19.03 4.94 18.94L7.44 17.94C7.96 18.35 8.53 18.69 9.15 18.94L9.5 21.61C9.53 21.83 9.72 22 9.95 22H14.05C14.28 22 14.47 21.83 14.5 21.61L14.85 18.94C15.47 18.69 16.04 18.35 16.56 17.94L19.06 18.94C19.28 19.03 19.54 18.95 19.66 18.73L21.66 15.27C21.78 15.05 21.73 14.78 21.54 14.63L19.43 12.98Z" 
                            stroke="white" stroke-width="2"/>
<                           /svg>`   
        optbtn.style.transform = 'rotate(90deg) scale(1)'

    }
}

// Settings items -------------------------------------------------------
// Tab title
const tabtitle = document.getElementById('new-tab-title');
tabtitle.addEventListener('change', () => {
    if (tabtitle.value != '') {
        document.title = tabtitle.value;
    } else {
        document.title = 'Tab mới';
    }
    tabtitle.blur()
});

// Opacity
const opacityText = document.getElementById('opacity-value');
opacitySlider.addEventListener('input', (event) => {
    const opacityValue = event.target.value;
    image.style.opacity = opacityValue / 100;
    opacityText.innerText = opacityValue + '%';
});

// Background position
const bgposText = document.getElementById('bgpos-value');
bgposSlider.addEventListener('input', (event) => {
    const bgposValue = event.target.value;
    image.style.backgroundPosition = `50% ${bgposValue}%`;
    bgposText.innerText = bgposValue + '%';
});
bgposCenter.addEventListener('click', () => {
    bgposSlider.value = 50;
    bgposSlider.dispatchEvent(new Event('input'));
});

// Full view
const movebgtoggle = document.querySelector('.movebgtoggle');
const sliderbox = document.querySelector('.slider');
const wavybg = document.querySelector('.wavy-image');
function checkwavy() {
    if (wavy.checked) {
        startWavy()
    } else {
        pauseWavy()
    }
}
wavy.addEventListener('click', () => {
    checkwavy()
})

// Wavy backround
let start = null;
let animationId = null;
let isPaused = false;

function animate(timestamp) {
    if (isPaused) return; // nếu pause thì không chạy nữa

    if (!start) start = timestamp;
    const elapsed = (timestamp - start) / 1000; // tính giây

    const x = Math.sin(elapsed * 1.2) * 4; // trái phải
    const y = Math.cos(elapsed * 1.5) * 4; // lên xuống
    const rotation = Math.sin(elapsed * 0.8) * 0.7; // xoay


    image.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;

    animationId = requestAnimationFrame(animate);
}

function startWavy() {
    isPaused = false;
    start = null;
    requestAnimationFrame(animate);
}

function pauseWavy() {
    isPaused = true;
    cancelAnimationFrame(animationId);
    image.style.transform = 'translate(-0%, -0%) rotate(0deg)'; // Đặt lại transform về trạng thái ban đầu
}

// Safemode
const safemodebox = document.querySelector('.safemode-box');
function safemodebg() {
    if (safemode.checked) {
        safemodebox.classList.toggle('shown');
    } else {
        safemodebox.classList.remove('shown');
    }
}
safemode.addEventListener('click', () => {
    safemodebg()
});

// Debug -------------------------------------------------------
const del_local = document.querySelector('.del-local');
const clear_cache = document.querySelector('.clear-cache');
del_local.addEventListener('click', () => {
    showalert('Đặt lại toàn bộ cài đặt?').then((userConfirmed) => {
        if (userConfirmed) {
            setTimeout(() => {
                localStorage.clear();
                chrome.storage.local.clear();
                location.reload();
            }, 600);
        }
    });
});
clear_cache.addEventListener('click', () => {
    showalert('Fetch lại thông tin?').then((userConfirmed) => {
        if (userConfirmed) {
            localStorage.removeItem('cache');
            location.reload();
        }
    });
})

// API options -------------------------------------------------------
const apihandle = document.querySelector('.API-handle');

const api_picrew = document.getElementById('api_picrew');
const picre_box = document.querySelector('.picre')
const picre_changewall = document.getElementById('picre-changewall');
const picre_pixiv = document.getElementById('picre-pixiv');
const picre_download = document.getElementById('picre-download');

const localimage = document.getElementById('api_local');
const localimagebox = document.querySelector('.localimage');

const api_picsum = document.getElementById('api_picsum');
const picsum_box = document.querySelector('.picsum')
const picsum_changewall = document.getElementById('picsum-changewall');
const picsum_download = document.getElementById('picsum-download');

// Get API status when load the page
if (chrome.storage == undefined) {
    showalert('Tab mới không thể hoạt động bằng cách này. Hãy thử mở nó bằng cách sử dụng extension.')
}
chrome.storage.local.get('imgdata', (data) => {
    if (data.imgdata == undefined) {
        API_name.innerText = 'Không có';
        closeall()
        loader.style.opacity = 0;
    } else {
        let parseddata = JSON.parse(data.imgdata);
        API_name.innerText = parseddata.API_name;
        let a = '.' + parseddata.API_class
        let api_element = document.querySelector(a)
        api_element.classList.toggle('shown')
        loadImage();
        if (parseddata.url == '') {
            loader.style.opacity = 0;
        }
    }
});

const API_arrow = document.querySelector('.API-arrow');
choose_API.addEventListener('click', () => {
    API_select_box.classList.toggle('shown');
})

// Close all API options
function closeall() {
    picre_box.classList.remove('shown');
    localimagebox.classList.remove('shown');
    picsum_box.classList.remove('shown');
}

// Select: No API
api_none.addEventListener('click', () => {
    API_name.innerText = 'Không có';
    previewImage.style.display = 'none'
    API_select_box.classList.remove('shown');
    closeall()
    image.style.opacity = 0;
    // Đợi fadeout hết
    setTimeout(() => {
        image.style.backgroundImage = 'none';
    }, 1000);
    loader.style.opacity = 0;
    chrome.storage.local.remove('imgdata');
});

// Select: Local image
localimage.addEventListener('click', () => {
    closeall()
    API_name.innerText = localimage.innerText;
    API_select_box.classList.remove('shown');
    localimagebox.classList.toggle('shown');
    let imgdata = {
        "API_name": "Hình nền cục bộ",
        "API_class": "localimage",
        "url": ""
    }
    chrome.storage.local.set({ imgdata: JSON.stringify(imgdata) });
    document.getElementById("fileInput").click();
});
// Local image options
document.getElementById("pick-image").addEventListener("click", function () {
    document.getElementById("fileInput").click();
});

// Select: Picsum Photos
api_picsum.addEventListener('click', () => {
    API_name.innerText = api_picsum.innerText;
    API_select_box.classList.remove('shown');
    closeall()
    picsum_box.classList.toggle('shown');
    picsum_fetch();
});
// Picsum options
picsum_changewall.addEventListener('click', () => {
    picsum_fetch();
})
picsum_download.addEventListener('click', () => {
    chrome.storage.local.get('imgdata', (data) => {
        data = JSON.parse(data.imgdata);
        let link = document.createElement('a');
        link.href = data.url;
        link.download = 'background.jpg'; // Tên file khi tải về
        link.click();
    });
});

document.getElementById("fileInput").addEventListener("change", function (event) {
    let file = event.target.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = function (e) {
            chrome.storage.local.get('imgdata', (data) => {
                let imgdata = {
                    "API_name": "Hình nền cục bộ",
                    "API_class": "localimage",
                    "url": e.target.result
                }
                chrome.storage.local.set({ imgdata: JSON.stringify(imgdata) });
                loadImage();
            })
        };
        reader.readAsDataURL(file); // Chuyển file thành Base64 để hiển thị
    }
});

// Select: Picrew
api_picrew.addEventListener('click', async () => {
    const userConfirmed = await showalert(
        'Bạn có thể gặp phải những hình ảnh chứa nội dung nhạy cảm (sensitive content), mặc dù nó không phải NSFW. Bạn có chắc chắn muốn tiếp tục?'
    );

    if (userConfirmed) {
        API_name.innerText = api_picrew.innerText;
        API_select_box.classList.remove('shown');
        closeall();
        picre_box.classList.toggle('shown');
        picrew_fetch();
    }
});
// Picrew options
picre_changewall.addEventListener('click', () => {
    picre_changewall.innerText = 'Đang đổi hình nền...';
    loader.style.opacity = 1
    picrew_fetch();
})
picre_download.addEventListener('click', () => {
    chrome.storage.local.get('imgdata', (data) => {
        data = JSON.parse(data.imgdata);
        window.open(data.cdnurl);
    });
})
picre_pixiv.addEventListener('click', () => {
    chrome.storage.local.get('imgdata', (data) => {
        data = JSON.parse(data.imgdata);
        window.open(data.pixiv);
    });
})

// Lorem Picsum: Fetch
function picsum_fetch() {
    apihandle.style.opacity = 0.5
    sliderbox.style.opacity = 0.5
    sliderbox.style.pointerEvents = 'none'
    loader.style.opacity = 1
    picsum_changewall.innerText = 'Đang đổi hình nền...';
    apihandle.style.pointerEvents = 'none'
    fetch('https://picsum.photos/2560/1440.webp')
        .then(response => response.blob())
        .then(blob => {
            let reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function () {
                let imgdata = {
                    "API_name": "Lorem Picsum",
                    "API_class": "picsum",
                    "url": reader.result
                }
                chrome.storage.local.set({ imgdata: JSON.stringify(imgdata) });
                setTimeout(() => {
                    loadImage()
                }, 500);
            }
        })
}

// Picrew: Fetch
function picrew_fetch() {
    apihandle.style.opacity = 0.5
    apihandle.style.pointerEvents = 'none'
    sliderbox.style.opacity = 0.5
    sliderbox.style.pointerEvents = 'none'
    picre_changewall.innerText = 'Đang đổi hình nền...';
    fetch('https://pic.re/image.json')
        .then(response => response.json())
        .then(data => {
            loader.style.opacity = 1
            let imgurl = 'https://' + data.file_url
            compressImageFromURL(imgurl, 0.8, (compressedBase64) => {
                let imgdata = {
                    "API_name": "Picre",
                    "API_class": "picre",
                    "url": compressedBase64,
                    "cdnurl": imgurl,
                    "pixiv": data.source
                }
                chrome.storage.local.set({ imgdata: JSON.stringify(imgdata) });
                setTimeout(() => {
                    loadImage()
                }, 500);
            })
        })
}

// Load background image
function loadImage() {
    chrome.storage.local.get('imgdata', (data) => {
        data = JSON.parse(data.imgdata);
        let img = new Image();
        img.onload = function () {
            image.style.backgroundImage = 'url(' + img.src + ')';
            loader.style.opacity = 0;
            image.style.opacity = opacitySlider.value / 100;
        };
        img.src = data.url
        previewImage.src = data.url
        previewImage.style.display = 'block'

        // pic.re
        if (data.API_name == 'Picre') {
            apihandle.style.opacity = 1
            apihandle.style.pointerEvents = 'auto'
            sliderbox.style.opacity = 1
            sliderbox.style.pointerEvents = 'auto'
            picre_changewall.innerText = 'Đổi hình nền';
        }
        // Picsum
        if (data.API_name == 'Lorem Picsum') {
            apihandle.style.opacity = 1
            apihandle.style.pointerEvents = 'auto'
            sliderbox.style.opacity = 1
            sliderbox.style.pointerEvents = 'auto'
            picsum_changewall.innerText = 'Đổi hình nền';
        }
    });

}

// Covert to Webp
function compressImageFromURL(imageUrl, quality = 0.8, callback) {
    let img = new Image();
    img.crossOrigin = "Anonymous"; // Cho phép tải ảnh từ domain khác
    img.src = imageUrl;

    img.onload = function () {
        picre_changewall.innerText = 'Đang nén hình nền...'
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        // Resize ảnh nếu quá lớn
        let maxWidth = 1920, maxHeight = 1080;
        let width = img.width, height = img.height;
        if (width > maxWidth || height > maxHeight) {
            let ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Chuyển sang WebP
        let compressedBase64 = canvas.toDataURL("image/webp", quality);
        callback(compressedBase64);
    };

    img.onerror = function () {
        console.error("Không thể tải ảnh:", imageUrl);
    };
}

// Save and Load settings ----------------------------------------------------------
function saveSettings() {
    const settings = {
        opacity: opacitySlider.value,
        bgpos: bgposSlider.value,
        wavy: wavy.checked,
        safemode: safemode.checked,
        tabTitle: tabtitle.value,
        location: weather_input.value
    };
    localStorage.setItem('settings', JSON.stringify(settings));
}


if (localStorage.getItem('settings') == null) {
    saveSettings()
}

// Load settings from localStorage
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('settings'));
    if (settings) {
        opacitySlider.value = settings.opacity;
        bgposSlider.value = settings.bgpos;
        wavy.checked = settings.wavy;
        safemode.checked = settings.safemode;
        tabtitle.value = settings.tabTitle;
        weather_input.value = settings.location
        if (cache.cache != day().day) {
            getWeather(weather_input.value)
        } else {
            weathertext.innerText = cache.weather_cache.weather
            temp.innerText = cache.weather_cache.temp
            weathericon.style.backgroundImage = `url(${cache.weather_cache.icon})`
            lunar.innerText = cache.lunar_cache
        }

        // Apply settings
        image.style.opacity = opacitySlider.value / 100;
        opacityText.innerText = opacitySlider.value + '%';
        image.style.backgroundPosition = `50% ${bgposSlider.value}%`;
        bgposText.innerText = bgposSlider.value + '%';
        checkwavy()
        safemodebg()
        if (tabtitle.value != '') {
            document.title = tabtitle.value;
        } else {
            document.title = 'Tab mới';
        }
    }
}

// Call loadSettings when the page loads
window.addEventListener('load', loadSettings);

// Save settings whenever a setting is changed
opacitySlider.addEventListener('input', saveSettings);
bgposSlider.addEventListener('input', saveSettings);
wavy.addEventListener('click', saveSettings);
safemode.addEventListener('click', saveSettings);
tabtitle.addEventListener('change', saveSettings);
weather_input.addEventListener('change', saveSettings);


// Check version
const version = document.getElementById('version');
const manifest = chrome.runtime.getManifest();
version.innerText = `v${manifest.version}`;