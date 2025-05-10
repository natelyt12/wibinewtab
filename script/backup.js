// Định nghĩa giá trị mặc định
const defaultSettings = {
    opacity: '100',
    bgpos: '50',
    wavy: false,
    safemode: false,
    tabTitle: '',
    location: 'Hà Nội',
    lumina: false
};

export function loadSettings() {
    // Lấy settings, nếu null thì dùng object rỗng
    let settings = JSON.parse(localStorage.getItem('settings')) || {};

    // Lấy tất cả input có class wibi-settings
    const inputs = document.querySelectorAll('.wibi-settings');

    // Cập nhật UI và trigger sự kiện
    inputs.forEach((item) => {
        const value = settings[item.id] !== undefined ? settings[item.id] : defaultSettings[item.id];

        if (item.type === 'checkbox') {
            item.checked = !!value; // Ép về boolean
            // Trigger sự kiện click để chạy logic tính năng
            const clickEvent = new Event('click', { bubbles: true });
            item.dispatchEvent(clickEvent);
        } else if (item.type === 'text') {
            item.value = String(value); // Ép về chuỗi
            // Trigger sự kiện change
            const changeEvent = new Event('change', { bubbles: true });
            item.dispatchEvent(changeEvent);
        } else if (item.type === 'range') {
            item.value = Number(value); // Ép về số
            // Trigger sự kiện input
            const inputEvent = new Event('input', { bubbles: true });
            item.dispatchEvent(inputEvent);
        }
    });
}

export function saveSettings() {
    let settings = JSON.parse(localStorage.getItem('settings')) || {};

    document.querySelectorAll('.wibi-settings').forEach((item) => {
        if (item.type === 'checkbox') {
            settings[item.id] = item.checked;
        } else if (item.type === 'text') {
            settings[item.id] = item.value;
        } else if (item.type === 'range') {
            settings[item.id] = item.value;
        }
    });

    localStorage.setItem('settings', JSON.stringify(settings));
}
