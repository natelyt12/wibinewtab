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
const fullview = document.getElementById('fullview');
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
// function triggerError() {
//     throw new Error("This is a test error");
// }
// triggerError();

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
document.getElementById('cache_status').innerText = `${day().day}/${day().month}`

// Time stuff -------------------------------------------------------
function getClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const time = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    clock.innerText = time;
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
    date.innerText = fullDate;
    lunarconvert = {
        "day": day,
        "month": month,
        "year": year
    }
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
            lunar.innerText = `Âm lịch: Ngày ${d.day} tháng ${d.month} năm ${d.sexagenaryCycle}`
            cache.lunar_cache = lunar.innerText
            localStorage.setItem('cache', JSON.stringify(cache))
        })
}


// Weather stuff -------------------------------------------------------
const weathericon = document.querySelector('.icon')
const weathertext = document.querySelector('.weather')
const temp = document.querySelector('.temp')
const loc4tion = 'Halong'
const weatherDescMap = {
    "Sunny": "Trời nắng",
    "Clear": "Trời quang đãng",
    "Partly Cloudy": "Ít mây",
    "Cloudy": "Nhiều mây",
    "Overcast": "Mây đen u ám",
    "Light rain": "Mưa nhỏ",
    "Heavy rain": "Mưa lớn",
    "Mist": "Sương mù"
};

const weatherIconMap = {
    "Sunny": "01d_t@2x.png",
    "Clear": "01d_t@2x.png",
    "Partly Cloudy": "02d_t@2x.png",
    "Cloudy": "03d_t@2x.png",
    "Overcast": "04d_t@2x.png",
    "Light rain": "10d_t@2x.png",
    "Heavy rain": "09d_t@2x.png",
    "Mist": "50d_t@2x.png"
};

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
searchbox.addEventListener('keypress', () => {
    if (searchbox.value.length >= 0) {
        searchbox.style.width = '500px'
        searchbox.style.transition = '0.5s cubic-bezier(0.190, 1.000, 0.220, 1.000)'
        clearsearch.style.display = 'block'
        document.getElementsByName('search')[0].placeholder = 'Tìm kiếm'
        searchbox.style.fontSize = '1.2em'
    }
    if (event.key === 'Enter') {
        window.open(`https://www.google.com/search?q=${searchbox.value}`, "_self")
    }
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
function normsearchstate() {
    searchbox.style.width = '230px';
    document.getElementsByName('search')[0].placeholder = 'Tìm kiếm [Nhập bất kỳ]';
    clearsearch.style.display = 'none'
    searchbox.blur()
    searchbox.style.fontSize = '0.8em'
}


// Hotkeys -------------------------------------------------------
document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'z') {
        setting.classList.toggle('active');
        settingBtn.classList.toggle('active2');
        settingstate = !settingstate;
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
});

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
const move_bg_toggle = document.getElementById('move_bg_toggle');
const background_blur = document.querySelector('.background_blur');
const sliderbox = document.querySelector('.slider');
function movebg() {
    if (move_bg_toggle.checked) {
        background_blur.style.animationPlayState = 'running';
    } else {
        background_blur.style.animationPlayState = 'paused';
    }
}
move_bg_toggle.addEventListener('click', () => {
    movebg()
})
function checkfullview() {
    if (fullview.checked) {
        image.style.backgroundSize = 'contain';
        movebgtoggle.style.display = 'block';
        background_blur.style.display = 'block';
        sliderbox.style.opacity = '0.5';
        sliderbox.style.pointerEvents = 'none';
        opacitySlider.value = 100
        opacitySlider.dispatchEvent(new Event('input'));
        bgposSlider.value = 50
        bgposSlider.dispatchEvent(new Event('input'));
    } else {
        image.style.backgroundSize = 'cover';
        movebgtoggle.style.display = 'none';
        background_blur.style.display = 'none';
        sliderbox.style.opacity = '1';
        sliderbox.style.pointerEvents = 'auto';
        move_bg_toggle.checked = false;
        movebg()
    }
}
fullview.addEventListener('click', () => {
    checkfullview()
})

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
const del_confirm = document.querySelector('.del-confirm');
const del_yes = document.querySelector('.del-yes');
const del_no = document.querySelector('.del-no');
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

// Get API status when load the page
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
    background_blur.style.backgroundImage = 'none';
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
        'Bạn có thể gặp phải những hình ảnh chứa nội dung không phù hợp với một số đối tượng (16+), mặc dù nó không chứa NSFW. Bạn có chắc chắn muốn tiếp tục?\nBạn có thể bấm Ctrl + X để bật chế độ an toàn.'
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
    fetch('https://picsum.photos/1920/1080.webp')
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
            background_blur.style.backgroundImage = 'url(' + img.src + ')';
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
        fullview: fullview.checked,
        bganim: move_bg_toggle.checked,
        safemode: safemode.checked,
        tabTitle: tabtitle.value,
        cache: 0
    };
    localStorage.setItem('settings', JSON.stringify(settings));
}


if (localStorage.getItem('settings') == null) {
    saveSettings()
}
if (cache.cache != day().day) {
    getWeather(loc4tion)
} else {
    weathertext.innerText = cache.weather_cache.weather
    temp.innerText = cache.weather_cache.temp
    weathericon.style.backgroundImage = `url(${cache.weather_cache.icon})`
    lunar.innerText = cache.lunar_cache
}

// Load settings from localStorage
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('settings'));
    if (settings) {
        opacitySlider.value = settings.opacity;
        bgposSlider.value = settings.bgpos;
        fullview.checked = settings.fullview;
        safemode.checked = settings.safemode;
        tabtitle.value = settings.tabTitle;
        move_bg_toggle.checked = settings.bganim

        // Apply settings
        image.style.opacity = opacitySlider.value / 100;
        opacityText.innerText = opacitySlider.value + '%';
        image.style.backgroundPosition = `50% ${bgposSlider.value}%`;
        bgposText.innerText = bgposSlider.value + '%';
        checkfullview()
        movebg()
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
fullview.addEventListener('click', saveSettings);
safemode.addEventListener('click', saveSettings);
tabtitle.addEventListener('change', saveSettings);
move_bg_toggle.addEventListener('click', saveSettings);

