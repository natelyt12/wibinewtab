// const
const loader = document.querySelector('.loader');
const bgimg = document.querySelector('.bg-img');
const setting = document.querySelector('.settings');
const image = document.querySelector('.image');
const settingBtn = document.querySelector('.opt-btn');
const opacitySlider = document.getElementById('opacity-slider');
const blurSlider = document.getElementById('blur-slider');
const bgposSlider = document.getElementById('bgpos-slider');
const API_select_box = document.querySelector('.API-select-box');
const choose_API = document.querySelector('.choose-API');
const previewImage = document.querySelector('.preview-image');
const ngu = atob("OTFiOTgzODdmNzEyZWRhZTA3MWMyN2JhYjMzZjVkYWM=")
const date = document.getElementById('calendar');
const lunar = document.getElementById('lunar-calendar');
const clock = document.querySelector('.clock'); 

const bgposCenter = document.getElementById('bgpos-center');
const safemode = document.getElementById('safemode');
// settings
const fullview = document.getElementById('fullview');
// API
const API_name = document.querySelector('.API-name');
const api_none = document.getElementById('api_none');
const api_picrew = document.getElementById('api_picrew');

const picre_box = document.querySelector('.picre')

// // Default settings
// const DefaultSettings = {
//     API: 'none',
//     opacity: 100,
//     blur: 0,
//     bgpos: 50,
//     fullview: false
// }

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
});

document.addEventListener('keydown', (event) => {
    if (event.key === "Escape") {
        z()
    }
})

function z() {
    searchcontainer.classList.remove('searching');
    searchbox.style.width = '220px';
    document.getElementsByName('search')[0].placeholder = 'Tìm kiếm [Bấm phím bất kỳ]';
    clearsearch.style.display = 'none'
    searchbox.blur()
}

const searchbox = document.getElementById('search')
const searchcontainer = document.querySelector('.search')
const clearsearch = document.getElementById('clear')
searchbox.addEventListener('keypress', () => {
    if (searchbox.value.length >= 0) {
        searchcontainer.classList.add('searching')
        searchbox.style.width = '500px'
        clearsearch.style.display = 'block'
        document.getElementsByName('search')[0].placeholder = 'Tìm kiếm'
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
    } else if (event.ctrlKey && event.key === 'x') {
        safemode.checked = !safemode.checked;
        safemode.dispatchEvent(new Event('click'));
    } else if (event.key.length === 1 && !event.ctrlKey) {
        searchbox.focus();
    }
});

settingBtn.addEventListener('click', () => {
    setting.classList.toggle('active');
    settingBtn.classList.toggle('active2');
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
opacitySlider.addEventListener('input', (event) => {
    const opacityValue = event.target.value;
    const opacityText = document.getElementById('opacity-value');
    image.style.opacity = opacityValue / 100;
    opacityText.innerText = opacityValue + '%';
});

blurSlider.addEventListener('input', (event) => {
    const blurValue = event.target.value;
    const blurText = document.getElementById('blur-value');
    image.style.filter = `blur(${blurValue}px)`;
    blurText.innerText = blurValue + '%';
});

bgposSlider.addEventListener('input', (event) => {
    const bgposValue = event.target.value;
    const bgposText = document.getElementById('bgpos-value');
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
    localStorage.removeItem('imgdata');
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
    setTimeout(() => {
        picre_changewall.innerText = "Chờ một chút..."
    }, 3000)
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
        loadImage(`${data.url}`);
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
    }, 6000);
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