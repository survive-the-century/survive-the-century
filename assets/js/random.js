/*jslint browser */

var dataObject = {
    "insect": {
        max: 6,
        values: [2, 6],
        keywords: ["failure", "success"]
    },
    "luck": {
        max: 6,
        values: [5, 6],
        keywords: ["low", "high"]
    },
    "geoengineering1": {
        max: 6,
        values: [1, 3, 6],
        keywords: ["low", "med", "high"]
    },
    "geoengineering2": {
        max: 6,
        values: [1, 3, 4, 6],
        keywords: ["low", "med", "medplus", "high"]
    },
    "geoengineering3": {
        max: 6,
        values: [1, 6],
        keywords: ["low", "high"]
    }
};


function ebRandomNumberGenerator(max) {
    var randomInteger = Math.ceil(Math.random() * max);
    return randomInteger;
}


function ebFindTheCorrectIndex(number, list) {
    var index = 0;

    while (index < list.length) {
        if (number > list[index]) {
            index = index + 1;
        } else {
            break;
        }
    }

    return index;
}


function ebDisplayRandomChoices() {
    var thisPageHasRandomness = document.querySelector(
        "div[data-js-var^='js-rand-']"
    );

    if (thisPageHasRandomness) {
        var keywordString = thisPageHasRandomness.getAttribute("data-js-var");

        // get the keyword from the attribute
        var objectName = keywordString.split("-")[2];

        var randomNumber = ebRandomNumberGenerator(dataObject[objectName].max);

        // find which position in the value list is the one
        var correctIndex = ebFindTheCorrectIndex(
            randomNumber,
            dataObject[objectName].values
        );

        // pull out the corresponding keyword
        var keyword = dataObject[objectName].keywords[correctIndex];

        // put the string together
        var attributeString = `js-rand-${objectName}-${keyword}`;

        // find the correct div in the dom
        var divToShow = document.querySelector(
            `div[data-js-var^='${attributeString}']`
        );

        // remove the hidden class
        divToShow.classList.remove("hidden");
    }
}

ebDisplayRandomChoices();

// Animate the dice roll

function ebRollTheDice(linkDest) {
    setTimeout(function () {
        window.location = linkDest;
    }, 1000);
}

function ebAnimateTheDiceRoll() {
    // find the random buttons
    var diceRollChoices = document.querySelectorAll("li.random");
    if (diceRollChoices.length !== 0) {

        diceRollChoices.forEach(function (choice) {
            var linkElement = choice.querySelector("a");
            var linkDest = linkElement.href;
            linkElement.addEventListener("click", function () {
                // add a class if the random choice is selected by the user
                choice.classList.add("rolling");
                linkElement.href = `javascript:ebRollTheDice('${linkDest}')`;
            });
            linkElement.addEventListener("keydown", function (event) {
                if (event.key === "Enter") {
                    choice.classList.add("rolling");
                    linkElement.href = `javascript:ebRollTheDice('${linkDest}')`;
                }
            });
            linkElement.addEventListener("touchstart", function () {
                choice.classList.add("rolling");
                linkElement.href = `javascript:ebRollTheDice('${linkDest}')`;
            });
        });
    }
}

ebAnimateTheDiceRoll();
