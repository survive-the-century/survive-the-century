function ebTrackTheVariables () {
    "use strict";

    var initialStorageObject = {
        temperature: 0,
        decade: 0,
        conflict: 0
    };

    var pageDataObject = {
        temperature: document.querySelector(".temperature").innerHTML,
        decade: document.querySelector(".decade").innerHTML,
        conflict: document.querySelector(".conflict").innerHTML
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
            conflict: window.localStorage.getItem("conflict")
        };

    });
}

ebTrackTheVariables();
