const searchbox = document.getElementById('search')
const searchcontainer = document.querySelector('.search')

// Clear search
const clearsearch = document.getElementById('clear')
clearsearch.addEventListener('click', () => {
    searchbox.value = ''
    searchbox.focus()
})

function searchFocus() {
    searchcontainer.classList.add('search-active')
}
function searchNormal() {
    searchbox.blur()
    searchcontainer.classList.remove('search-active')
}

// Focus when keypress or click on it
searchbox.addEventListener('keypress', () => {
    if (searchbox.value.length >= 0) {
        searchFocus()
    }
    if (event.key == 'Enter') {
        window.open(`https://www.google.com/search?q=${searchbox.value}`, "_self")
    }
})
searchbox.addEventListener('focus', searchFocus)


// Unfocus when click outside
document.addEventListener('click', (event) => {
    if (!searchcontainer.contains(event.target) && !searchbox.contains(event.target)) {
        searchNormal()
    }
});
document.addEventListener('keydown', (event) => {
    if (event.key === "Escape") {
        searchNormal()
    }
})