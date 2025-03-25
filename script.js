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

// Error handler
const errorDisplay = document.querySelector('.error-display');
const errorText = document.getElementById('error-text');

window.onerror = function (message, source, lineno, colno, error) {
    errorDisplay.style.display = 'block';
    errorText.innerText = `Error: ${message} at ${source}:${lineno}:${colno}`;
};

// function triggerError() {
//     throw new Error("This is a test error");
// }
// triggerError();


// time stuff
function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const time = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    clock.innerText = time;
}
updateClock()
setInterval(updateClock, 5000);

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
    })
    .catch(error => console.error(error))


document.addEventListener('click', (event) => {
    if (!searchcontainer.contains(event.target) && !searchbox.contains(event.target)) {
        z()
    }
    if (!setting.contains(event.target) && !settingBtn.contains(event.target)) {
        setting.classList.remove('active');
        settingBtn.classList.remove('active2');
        settingstate = false;
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === "Escape") {
        z()
    }
})

function z() {
    searchbox.style.width = '230px';
    document.getElementsByName('search')[0].placeholder = 'Tìm kiếm [Nhập bất kỳ]';
    clearsearch.style.display = 'none'
    searchbox.blur()
    searchbox.style.fontSize = '0.8em'
}


// Weather
const weather_loc = document.getElementById('weather-location');
const weathericon = document.querySelector('.icon')
const weathertext = document.querySelector('.weather')
const temp = document.querySelector('.temp')
const ngu = atob("OTFiOTgzODdmNzEyZWRhZTA3MWMyN2JhYjMzZjVkYWM=")

getWeather("Halong")
function getWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${ngu}&units=metric&lang=vi`)

        .then(response => response.json())

        .then(data => {
            temp.innerText = `${Math.round(data.main.temp)}°`
            weathericon.style.backgroundImage = 'url(' + `http://openweathermap.org/img/wn/${data.weather[0].icon}.png` + ')'
            weathertext.innerText = `${data.name},\n${data.weather[0].description}, cảm giác như ${Math.round(data.main.feels_like)}°`
        })
}


// Search
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

// Toggle settings
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

// document.addEventListener('click', (event) => {
//     if (!setting.contains(event.target) && !settingBtn.contains(event.target)) {
//         setting.classList.remove('active');
//         settingBtn.classList.remove('active2');
//     }
// });

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



// Slider
const opacityText = document.getElementById('opacity-value');
opacitySlider.addEventListener('input', (event) => {
    const opacityValue = event.target.value;
    image.style.opacity = opacityValue / 100;
    opacityText.innerText = opacityValue + '%';
});

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

fullview.addEventListener('click', () => {
    if (fullview.checked) {
        image.style.backgroundSize = 'contain';
    } else {
        image.style.backgroundSize = 'cover';
    }
})

const safemodebox = document.querySelector('.safemode-box');
safemode.addEventListener('click', () => {
    if (safemode.checked) {
        safemodebox.classList.toggle('shown');
    } else {
        safemodebox.classList.remove('shown');
    }
});

// debug
const del_local = document.querySelector('.del-local');
const del_confirm = document.querySelector('.del-confirm');
const del_yes = document.querySelector('.del-yes');
const del_no = document.querySelector('.del-no');
del_local.addEventListener('click', () => {
    del_confirm.classList.toggle('shown');
    del_local.disabled = true;
});
del_yes.addEventListener('click', () => {
    localStorage.clear();
    location.reload();
});
del_no.addEventListener('click', () => {
    del_confirm.classList.remove('shown');
    del_local.disabled = false;
});

// API options -------------------------------------------------------
const api_picrew = document.getElementById('api_picrew');
const picre_box = document.querySelector('.picre')
const picre_changewall = document.getElementById('picre-changewall');
const picre_pixiv = document.getElementById('picre-pixiv');
const picre_download = document.getElementById('picre-download');
const apihandle = document.querySelector('.API-handle');
const localimage = document.getElementById('api_local');
const localimagebox = document.querySelector('.localimage');


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
});

// Local image options
document.getElementById("pick-image").addEventListener("click", function () {
    document.getElementById("fileInput").click();
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


// Select: Anime Wallpapers
api_picrew.addEventListener('click', () => {
    API_name.innerText = api_picrew.innerText;
    API_select_box.classList.remove('shown');
    closeall()
    picre_box.classList.toggle('shown');
    picrew_fetch();
});
// Anime Wallpapers options
picre_changewall.addEventListener('click', () => {
    picre_changewall.innerText = 'Đang đổi hình nền...';
    loader.style.opacity = 1
    image.style.opacity = 0.2
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


// Anime Wallpapers: Fetch
function picrew_fetch() {
    apihandle.style.opacity = 0.4
    apihandle.style.pointerEvents = 'none'
    picre_changewall.innerText = 'Đang đổi hình nền...';
    fetch('https://pic.re/image.json')
        .then(response => response.json())
        .then(data => {
            loader.style.opacity = 1
            image.style.opacity = 0.2
            let imgurl = 'https://' + data.file_url
            compressImageFromURL(imgurl, 0.8, (compressedBase64) => {
                let imgdata = {
                    "API_name": "Anime Wallpapers",
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
    let data = chrome.storage.local.get('imgdata', (data) => {
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
        if (data.API_name == 'Anime Wallpapers') {
            apihandle.style.opacity = 1
            apihandle.style.pointerEvents = 'auto'
            picre_changewall.innerText = 'Đổi hình nền';
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
        safemode: safemode.checked,
        tabTitle: tabtitle.value
    };
    localStorage.setItem('settings', JSON.stringify(settings));
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

        // Apply settings
        image.style.opacity = opacitySlider.value / 100;
        opacityText.innerText = opacitySlider.value + '%';
        image.style.backgroundPosition = `50% ${bgposSlider.value}%`;
        bgposText.innerText = bgposSlider.value + '%';
        if (fullview.checked) {
            image.style.backgroundSize = 'contain';
        } else {
            image.style.backgroundSize = 'cover';
        }
        if (safemode.checked) {
            safemodebox.classList.add('shown');
        } else {
            safemodebox.classList.remove('shown');
        }
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
