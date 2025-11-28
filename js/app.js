const screenStart = document.getElementById("screen-start");
const screenSwipe = document.getElementById("screen-swipe");
const screenResult = document.getElementById("screen-result");
const appHeader = document.getElementById("appHeader")
const catImg = document.getElementById("cat-image");
catImg.setAttribute("draggable", "false");
const likedCats = document.getElementById("liked-cats");
const result = document.getElementById("result");

let totalCats;
let catUrls = [];
let liked = [];
let currentIndex = 0;

function showStart() {
    screenStart.classList.remove("hidden");
    screenSwipe.classList.add("hidden");
    screenResult.classList.add("hidden");
}

function showSwipe() {
    screenStart.classList.add("hidden");
    screenSwipe.classList.remove("hidden");
    screenResult.classList.add("hidden");
}

function showResult() {
    screenStart.classList.add("hidden");
    screenSwipe.classList.add("hidden");
    screenResult.classList.remove("hidden");
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

async function startSwiping() {
    liked = [];
    currentIndex = 0;

    catUrls = await loadCats(totalCats);

    showCat(currentIndex);
    showSwipe();
}

function showCat(index) {
    if (index >= totalCats) {
        finishSession();
        return;
    }
    catImg.src = catUrls[index];
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