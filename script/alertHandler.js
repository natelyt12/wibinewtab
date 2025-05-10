const alertBg = document.querySelector('.alert-box-bg');
const alertBox = document.querySelector('.alert-box');
const alertContent = document.getElementById('alert-content');
const alertClose = document.querySelector('.alert-close');
const alertProceed = document.querySelector('.alert-proceed');

export function showalert(content) {
    alertContent.innerText = content;
    alertBg.style.display = 'block';
    setTimeout(() => {
        alertBox.style.opacity = 1;
        alertBg.style.opacity = 1;
        alertBox.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);
    function closeAlert() {
        alertBox.style.opacity = 0;
        alertBox.style.transform = 'translate(-50%, -50%) scale(0.7)';
        alertBg.style.opacity = 0;
        setTimeout(() => {
            alertBg.style.display = 'none';
        }, 300);
    }
    return new Promise((resolve) => {
        alertProceed.addEventListener('click', () => {
            closeAlert();
            resolve(true);
        }, { once: true });

        alertClose.addEventListener('click', () => {
            closeAlert();
            resolve(false);
        }, { once: true });
    });
}