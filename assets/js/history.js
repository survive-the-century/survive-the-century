// We need to know whether the player is playing for the first time,
// whether they are a repeat player, and where their last location was.


function ebActivateNavButtons (hasPlayedBefore) {
    // Use the values in local storage to alter home page buttons

    if (document.querySelector("body.home")) {
        if (!hasPlayedBefore) {   
            // If the player is playing for the first time, show "play-first-time"
            // on the homepage
            var playButtonDiv = document.querySelector('.play-first-time');
            playButtonDiv.classList.remove("hidden");

        } else {
            var playButtonDiv = document.querySelector(".play-again");
            playButtonDiv.classList.remove("hidden");

            // Now there is a "Resume game" button that needs an href

            var lastLocation = window.localStorage.getItem("lastLocation");
            var resumeButton = document.querySelector("a.resume-game");
            resumeButton.setAttribute("href", lastLocation);
        }
    }
}


function ebTrackPlayHistory () {
    // Track last location
    var lastLocation = document.referrer;
    window.localStorage.setItem("lastLocation", lastLocation);

    // Track play history
    // Check for history in local storage
    var hasPlayedBefore = window.localStorage.getItem("hasPlayedBefore");

    ebActivateNavButtons(hasPlayedBefore);

    // If they have not played before, set this to true
    if (!hasPlayedBefore) {
        window.localStorage.setItem("hasPlayedBefore", true);
        hasPlayedBefore = true;
    }
}

ebTrackPlayHistory();
