/*jslint browser */

function ebTrackTheVariables() {

    var initialStorageObject = {
        temperature: 0,
        decade: 0,
        conflict: 0,
        economy: 0
    };

    var pageDataObject = {
        temperature: document.querySelector(".temperature-value").innerHTML,
        decade: document.querySelector(".decade-value").innerHTML,
        conflict: document.querySelector(".conflict-value").innerHTML,
        economy: document.querySelector(".economy-value").innerHTML
    };

    var localStorageObject;

    Object.keys(pageDataObject).forEach(function (key) {
        if (window.localStorage.getItem(key) === undefined) {
            window.localStorage.setItem(key, initialStorageObject[key]);
        } else {
            if (pageDataObject[key]) {
                window.localStorage.setItem(key, pageDataObject[key]);
            }
        }

        localStorageObject = {
            temperature: window.localStorage.getItem("temperature"),
            decade: window.localStorage.getItem("decade"),
            conflict: window.localStorage.getItem("conflict"),
            economy: window.localStorage.getItem("economy")
        };

    });
}

ebTrackTheVariables();


function ebChooseTheTemperatureIcon(variableValue) {
    var temperature = Number(variableValue);

    if (temperature > 1 && temperature < 2) {
        if (temperature < 1.4) {
            return "1";
        } else if (temperature < 1.8) {
            return "1-5";
        } else {
            return "2";
        }
    } else {
        return Math.round(Number(variableValue));
    }
}


function ebDisplayTheIcons() {
    var dashVariables = [
        "decade",
        "temperature",
        "conflict",
        "economy"
    ];

    // for each of the four variables
    dashVariables.forEach(function (variable) {
        var dashListItem = document.querySelector(`li.${variable}`);

        if (dashListItem) {
            var variableValue = window.localStorage.getItem(variable);

            // first page won't have localStorage value
            if (variableValue === null) {
                variableValue = document.querySelector(`.${variable}-value`).innerHTML;
            }

            // round the value if it's a number
            if (Number(variableValue)) {
                if (variable == "temperature") {
                    variableValue = ebChooseTheTemperatureIcon(variableValue);
                } else {
                    variableValue = Math.round(Number(variableValue));
                }
            }

            var filePath = `../images/web/icon_${variable}-${variableValue}.png`;
            var altText = `${variable} = ${variableValue}`;

            var imageNode = document.createElement("img");
            imageNode.setAttribute("src", filePath);
            imageNode.setAttribute("alt", altText);

            dashListItem.prepend(imageNode);
        }
    });
}

ebDisplayTheIcons();
