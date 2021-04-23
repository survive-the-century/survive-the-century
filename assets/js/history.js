/*jslint browser */

// We need to know whether the player is playing for the first time,
// whether they are a repeat player, and where their last location was.


function ebActivateNavButtons(hasPlayedBefore) {
    // Use the values in local storage to alter home page buttons

    var playButtonDiv;

    if (document.querySelector("body.home")) {
        if (!hasPlayedBefore) {
            // If the player is playing for the first time, show
            // "play-first-time" on the homepage
            playButtonDiv = document.querySelector(".play-first-time");
            playButtonDiv.classList.remove("hidden");

        } else {
            playButtonDiv = document.querySelector(".play-again");
            playButtonDiv.classList.remove("hidden");

            // Now there is a "Resume game" button that needs an href

            var lastLocation = window.localStorage.getItem("lastLocation");
            var resumeButton = document.querySelector("a.resume-game");
            resumeButton.setAttribute("href", lastLocation);
        }
    }
}


function ebLastLocationIsInGame (lastLocation) {
    // If the last location was a chapter, part-page, newspaper, or ending
    // Don't worry about stories, they'll just go back to the newspaper before
    if (
        lastLocation.includes("chapter") ||
        lastLocation.includes("newspaper") ||
        lastLocation.includes("part-page") ||
        lastLocation.includes("ending")
    ) {
        return true;
    } else {
        return false;
    }
}


function ebTrackPlayHistory () {
    // Track last location
    // This is not true last location, it's just last useful game location

    // var lastLocation = document.referrer;
    var lastLocation = window.location.href;
    if (ebLastLocationIsInGame(lastLocation)) {
        window.localStorage.setItem("lastLocation", lastLocation);
    }

    // Track play history
    // Check for history in local storage
    var hasPlayedBefore = window.localStorage.getItem("hasPlayedBefore");

    ebActivateNavButtons(hasPlayedBefore);

    // If they have not played before, set this to true
    if (!hasPlayedBefore) {

        // only activate hasPlayedBefore the first time a user visits a chapter
        if (
            window.location.href.includes("chapter") &&
            window.localStorage.getItem("lastLocation")
        ) {
            window.localStorage.setItem("hasPlayedBefore", true);
            hasPlayedBefore = true;
        }
    }
}

ebTrackPlayHistory();
