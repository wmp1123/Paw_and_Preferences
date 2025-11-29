const screenStart = document.getElementById("screen-start");
const screenSwipe = document.getElementById("screen-swipe");
const screenResult = document.getElementById("screen-result");
const screenLoading = document.getElementById("screen-loading")
const appHeader = document.getElementById("appHeader")
const catImg = document.getElementById("cat-image");
catImg.setAttribute("draggable", "false");
const likedCats = document.getElementById("liked-cats");
const result = document.getElementById("result");
const counter = document.getElementById("catCounter");

let totalCats;
let catUrls = [];
let liked = [];
let currentIndex = 0;

function showStart() {
    screenStart.classList.remove("hidden");
    screenLoading.classList.add("hidden")
    screenSwipe.classList.add("hidden");
    screenResult.classList.add("hidden");
}

function showSwipe() {
    screenStart.classList.add("hidden");
    screenLoading.classList.add("hidden")
    screenSwipe.classList.remove("hidden");
    screenResult.classList.add("hidden");
}

function showResult() {
    screenStart.classList.add("hidden");
    screenLoading.classList.add("hidden")
    screenSwipe.classList.add("hidden");
    screenResult.classList.remove("hidden");
}

function showLoading() {
    screenStart.classList.add("hidden");
    screenLoading.classList.remove("hidden")
    screenSwipe.classList.add("hidden");
    screenResult.classList.add("hidden");
}

async function loadCats(count) {
    const urls = [];
    for (let i = 0; i < count; i++) {
        const res = await fetch("https://cataas.com/cat?json=true");
        const data = await res.json();
        const id = data.id;

        urls.push(`https://cataas.com/cat/${id}`);
    }
    return urls;
}

async function preLoading(urls) {
    return Promise.all(
        urls.map(url => {
            return new Promise(resolve => {
                const img = new Image();
                img.src = url;
                img.onload = resolve;
                img.onerror = resolve;
            });
        })
    );
}

async function startSwiping() {
    liked = [];
    currentIndex = 0;
    showLoading();
    catUrls = await loadCats(totalCats);
    await preLoading(catUrls);

    showCat(currentIndex);
    showSwipe();
}

function showCat(index) {
    if (index >= totalCats) {
        finishSession();
        return;
    }
    showLoading();
    updateCounter();

    const url = catUrls[index];
    const img = new Image();
    img.src = url;

    img.onload = () => {
        catImg.src = url;
        showSwipe();
    };
}

async function likeCat() {
    liked.push(catUrls[currentIndex]);
    nextCat();
}

async function dislikeCat() {
    nextCat();
}

function nextCat() {
    currentIndex++;
    showCat(currentIndex);
}

function updateCounter() {
    counter.textContent = `${currentIndex + 1} out of ${totalCats} Cats`;
}

function finishSession() {
    showResult();

    result.textContent = `You liked ${liked.length} out of ${totalCats} cats`;
    likedCats.innerHTML = "";
    liked.forEach(url => {
        const img = document.createElement("img");
        img.src = url;
        img.className = "w-full rounded-xl object-cover";
        likedCats.appendChild(img);
    });
}

function resetApp() {
    liked = [];
    catUrls = [];
    currentIndex = 0;
    likedCats.innerHTML = "";
    showStart();
}

// document.getElementById("testButton").addEventListener("click", showResult);
document.getElementById("startBtn").addEventListener("click", () => {
    const userInput = Number(document.getElementById("totalCats").value);
    if (isNaN(userInput) || userInput <= 0) {
        alert("Please enter a valid number!");
        return;
    }
    totalCats = userInput;
    console.log("User wants", totalCats, "cats");
    startSwiping();
});
document.getElementById("retryBtn").addEventListener("click", resetApp);
document.getElementById("appHeader").addEventListener("click", resetApp);
document.getElementById("likeBtn").addEventListener("click", likeCat);
document.getElementById("dislikeBtn").addEventListener("click", dislikeCat);