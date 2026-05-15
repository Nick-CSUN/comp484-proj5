// Load Google Maps API key dynamically
document.getElementById("googleMapsScript").src =
    `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;

// =====================
// GLOBAL VARIABLES
// =====================

let map;

let score = 0;

let currentQuestion = 0;

let timer = 0;

let timerInterval;

let gameStarted = false;

//let selectedDifficulty = "easy";

const totalQuestions = 5;

const tolerance = 0.0007;

// =====================
// LOCATION DATA
// =====================

const locations = [

    {
        name: "Oviatt Library",
        lat: 34.2400,
        lng: -118.5293
    },

    {
        name: "Bookstore",
        lat: 34.2374,
        lng: -118.5282
    },

    {
        name: "Student Recreation Center",
        lat: 34.2400,
        lng: -118.5249
    },

    {
        name: "University Student Union",
        lat: 34.2402,
        lng: -118.5263
    },

    {
        name: "Sierra Hall",
        lat: 34.2387,
        lng: -118.5307
    },

    {
        name: "Jacaranda Hall",
        lat: 34.2416,
        lng: -118.5285
    },

    {
        name: "Citrus Hall",
        lat: 34.2391,
        lng: -118.5282
    },

    {
        name: "Chaparral  Hall",
        lat: 34.2382,
        lng: -118.5269
    },

    {
        name: "Bookstein Hall",
        lat: 34.2420,
        lng: -118.5306
    }

];

// =====================
// INITIALIZE MAP
// =====================

function initMap() {

    map = new google.maps.Map(document.getElementById("map"), {

        center: {
            lat: 34.2375,
            lng: -118.5280
        },

        zoom: 16,

        minZoom: 16,

        maxZoom: 18,

        gestureHandling: "none",

        zoomControl: false,

        disableDefaultUI: true,

        draggable: false,

        scrollwheel: false,

        keyboardShortcuts: false,

        disableDoubleClickZoom: true,

        // FEATURE #1
        // MapTypeId is used to control the visual style of the map.
        // The SATELLITE map type displays real-world aerial imagery,
        // making the game more challenging because players must identify
        // buildings and landmarks without standard road labels.

        // Different map styles:
        //ROADMAP displays the default road map view with basemap labels.
        //SATELLITE displays a photorealistic map based on aerial imagery.
        //HYBRID displays the satellite map view with basemap labels.
        //TERRAIN displays a physical map based on terrain information.
        mapTypeId: google.maps.MapTypeId.SATELLITE/*,

    restriction: {

    latLngBounds: {

      //north: 34.2475,

      south: 34.2350,

      east: -118.5200,

      west: -118.5300
    },

    strictBounds: true
    }*/
    });

    updateHighScore();

    map.addListener("dblclick", handleGuess);
}

// =====================
// START GAME
// =====================

function startGame() {

    if (gameStarted) return;

    gameStarted = true;

    document.getElementById("startBtn").disabled = true;

    startTimer();

    locations.sort(() => Math.random() - 0.5);

    updateQuestion();
}

// =====================
// UPDATE QUESTION
// =====================

function updateQuestion() {

    if (currentQuestion >= totalQuestions) {

        endGame();

        return;
    }

    document.getElementById("question").innerText =
        `Find:\n${locations[currentQuestion].name}`;
}

// =====================
// HANDLE GUESS
// =====================

function handleGuess(event) {

    if (!gameStarted) return;

    const guessLat = event.latLng.lat();

    const guessLng = event.latLng.lng();

    const correctLocation = locations[currentQuestion];

    const feedback = document.getElementById("feedback");

    const isCorrect =

        Math.abs(guessLat - correctLocation.lat) < tolerance &&

        Math.abs(guessLng - correctLocation.lng) < tolerance;

    // FEATURE #2
    showOverlay(correctLocation, isCorrect);
    //showRectangle(correctLocation, isCorrect);

    if (isCorrect) {

        feedback.innerText = "Correct!";

        feedback.className = "correct";

        score++;
    }
    else {

        feedback.innerText = "Incorrect!";

        feedback.className = "incorrect";
    }

    currentQuestion++;

    updateScore();

    setTimeout(() => {

        feedback.innerText = "";

        updateQuestion();

    }, 2000);
}

// =====================
// DRAW RECTANGLE
// =====================

function showOverlay(location, isCorrect) {

    const image =
        isCorrect ? "greenOverlay.jpg" : "redOverlay.png";

    const bounds = {

        north: location.lat + tolerance,

        south: location.lat - tolerance,

        east: location.lng + tolerance,

        west: location.lng - tolerance
    };

    // FEATURE #2
    // GroundOverlay places an image directly onto a geographic
    // section of the map using latitude and longitude bounds.
    // This is used to visually highlight the correct building area
    // after a player submits a guess.

    const overlay =
        new google.maps.GroundOverlay(image, bounds);

    overlay.setMap(map);

    setTimeout(() => {

        overlay.setMap(null);

    }, 2000);
}

/*function showRectangle(location, isCorrect) {

    // FEATURE #2
    // Rectangle is used to visually display the correct answer area
    // on the map after the player makes a guess. The rectangle changes
    // color depending on whether the player's answer was correct or
    // incorrect, providing immediate visual feedback during gameplay.
    // Simply put, this creates a rectangle based on specific dimensions.
    const rectangle = new google.maps.Rectangle({

        map: map,

        bounds: {

            north: location.lat + tolerance,

            south: location.lat - tolerance,

            east: location.lng + tolerance,

            west: location.lng - tolerance
        },

        strokeColor: isCorrect ? "#00FF00" : "#FF0000",

        strokeOpacity: 1,

        strokeWeight: 4,

        fillColor: isCorrect ? "#00FF00" : "#FF0000",

        fillOpacity: 0.45
    });

    setTimeout(() => {

        rectangle.setMap(null);

    }, 2000);
}*/

// =====================
// UPDATE SCORE
// =====================

function updateScore() {

    document.getElementById("score").innerText =
        `Score: ${score} / ${totalQuestions}`;
}

// =====================
// TIMER
// =====================

function startTimer() {

    timerInterval = setInterval(() => {

        timer++;

        document.getElementById("timer").innerText =
            `Time: ${timer}s`;

    }, 1000);
}

// =====================
// END GAME
// =====================

function endGame() {

    clearInterval(timerInterval);

    let highScore = localStorage.getItem("highScore");

    if (highScore === null || score > highScore) {

        localStorage.setItem("highScore", score);

        highScore = score;
    }

    updateHighScore();

    document.getElementById("question").innerText =
        "Game Complete!";

    document.getElementById("feedback").innerText =
        `Final Score: ${score} / ${totalQuestions}`;
}

// =====================
// HIGH SCORE
// =====================

function updateHighScore() {

    let highScore = localStorage.getItem("highScore");

    if (highScore === null) {

        highScore = 0;
    }

    document.getElementById("highScore").innerText =
        `High Score: ${highScore}`;
}

// =====================
// BUTTON EVENTS
// =====================

document.getElementById("startBtn")
    .addEventListener("click", startGame);

document.getElementById("restartBtn")
    .addEventListener("click", () => {

        location.reload();
    });

/*document.getElementById("easyBtn")
.addEventListener("click", () => {

  selectedDifficulty = "easy";

  map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
});

document.getElementById("hardBtn")
.addEventListener("click", () => {

  selectedDifficulty = "hard";

  map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
});*/

// =====================
// LOAD MAP
// =====================

window.onload = initMap;