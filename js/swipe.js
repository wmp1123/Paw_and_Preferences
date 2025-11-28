const swipeArea = document.getElementById("swipe-area")

let startX = 0;
let endX = 0;
const threshold = 50;

swipeArea.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
});

swipeArea.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX;
    swipeHandler(endX - startX);
});

let isMouseDown = false;

swipeArea.addEventListener("mousedown", (e) => {
    isMouseDown = true;
    startX = e.clientX;
});

swipeArea.addEventListener("mouseup", (e) => {
    if (!isMouseDown)
        return;
    isMouseDown = false;
    endX = e.clientX;
    swipeHandler(endX - startX);
});

function swipeHandler(diff) {
    if (threshold > Math.abs(diff))
        return;

    if (diff > 0) {
        likeCat();
    } else {
        dislikeCat();
    }
};