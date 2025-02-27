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
const api_picrew = document.getElementById('api_picrew');
const picre_box = document.querySelector('.picre')

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


const weathericon = document.querySelector('.icon')
const weathertext = document.querySelector('.weather')
const temp = document.querySelector('.temp')
const ngu = atob("OTFiOTgzODdmNzEyZWRhZTA3MWMyN2JhYjMzZjVkYWM=")
fetch(`https://api.openweathermap.org/data/2.5/weather?q=${'Ha long'}&appid=${ngu}&units=metric&lang=vi`)

    .then(response => response.json())

    .then(data => {
        temp.innerText = `${Math.round(data.main.temp)}°C`
        weathericon.style.backgroundImage = 'url(' + `http://openweathermap.org/img/wn/${data.weather[0].icon}.png` + ')'
        weathertext.innerText = `${data.name},\n${data.weather[0].description}, cảm giác như ${Math.round(data.main.feels_like)}°C`
    })

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
    searchbox.style.width = '220px';
    document.getElementsByName('search')[0].placeholder = 'Tìm kiếm [Nhập bất kỳ]';
    clearsearch.style.display = 'none'
    searchbox.blur()
    searchbox.value = ''
    searchbox.style.fontSize = '0.8em'
}

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

// Settings handler
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

// Tab title handler
const tabtitle = document.getElementById('new-tab-title');
tabtitle.addEventListener('change', () => {
    if (tabtitle.value != '') {
        document.title = tabtitle.value;
    } else {
        document.title = 'Tab mới';
    }
    tabtitle.blur()
});

// Slider handler
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

// Fullview handler
fullview.addEventListener('click', () => {
    if (fullview.checked) {
        image.style.backgroundSize = 'contain';
    } else {
        image.style.backgroundSize = 'cover';
    }
})

// Safemode handler
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


// API handler
choose_API.addEventListener('click', () => {
    API_select_box.classList.toggle('shown');
})

// Close all API options
function closeall() {
    picre_box.classList.remove('shown');
}

// none
api_none.addEventListener('click', () => {
    API_name.innerText = 'Không có';
    previewImage.style.display = 'none'
    API_select_box.classList.remove('shown');
    closeall()
    localStorage.removeItem('imgdata');
    image.style.opacity = 0;
    setTimeout(() => {
        image.style.backgroundImage = 'none';
    }, 1000);
    loader.style.opacity = 0;
});


// picrew
api_picrew.addEventListener('click', () => {
    API_name.innerText = api_picrew.innerText;
    API_select_box.classList.remove('shown');
    closeall()
    picre_box.classList.toggle('shown');
    picrew_fetch();
    setTimeout(() => {
        loadImage();
    }, 1000);
});
const picre_changewall = document.getElementById('picre-changewall');
const picre_pixiv = document.getElementById('picre-pixiv');
const picre_download = document.getElementById('picre-download');
picre_changewall.addEventListener('click', () => {
    picre_changewall.disabled = true;
    picre_pixiv.disabled = true;
    picre_download.disabled = true;
    picre_changewall.innerText = 'Đang đổi hình nền...';
    picrew_fetch();
})
picre_download.addEventListener('click', () => {
    data = JSON.parse(localStorage.getItem('imgdata'));
    window.open(data.url);
})
picre_pixiv.addEventListener('click', () => {
    data = JSON.parse(localStorage.getItem('imgdata'));
    window.open(data.pixiv);
})

// Image API handler
if (localStorage.getItem('imgdata') == null) {
    API_name.innerText = 'Không có';
    closeall()
    loader.style.opacity = 0;
} else {
    data = JSON.parse(localStorage.getItem('imgdata'));
    setTimeout(() => {
        loadImage();
    }, 500);
    API_name.innerText = data.API_name;
    let a = '.' + data.API_class
    let api_element = document.querySelector(a)
    api_element.classList.toggle('shown')
}

function picrew_fetch() {
    fetch('https://pic.re/image.json')
        .then(response => response.json())
        .then(data => {
            imgdata = {
                "API_name": "Anime Wallpapers",
                "API_class": "picre",
                "url": 'https://' + data.file_url,
                "pixiv": data.source
            }
            localStorage.setItem('imgdata', JSON.stringify(imgdata));
            loadImage()
        })
        setTimeout(() => {
            picre_changewall.disabled = false;
            picre_pixiv.disabled = false;
            picre_download.disabled = false;
            picre_changewall.innerText = 'Đổi hình nền';
        }, 10000);
}

function loadImage() {
    let data = JSON.parse(localStorage.getItem('imgdata'))
    loader.style.opacity = 1
    image.style.opacity = 0.2
    let img = new Image();
    img.onload = function () {
        image.style.backgroundImage = 'url(' + img.src + ')';
        loader.style.opacity = 0;
        image.style.opacity = opacitySlider.value / 100;
    };
    img.src = data.url
    previewImage.src = data.url
    previewImage.style.display = 'block'
}


// Save and Load settings
// Save settings to localStorage
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
