/*jslint browser */

function ebSetTheDefaultVariables() {
    var variableObject = {
        "carboncapture": 0,
        "leaning": "slowfade",
        "fracking": 0,
        "military": "yes",
        "democracy": "no"
    };

    for (var variableName in variableObject) {
        if (!window.localStorage.getItem(variableName)) {
            window.localStorage.setItem(variableName, variableObject[variableName]);
        }
    }
}

ebSetTheDefaultVariables();

function ebCaptureTheChoiceVariables() {
    // the variables are attributes in the href
    // of the form data-js-var="js-var-{variablename}-{variablevalue}"

    var linksWithVariables = document.querySelectorAll("a[data-js-var]");

    if (linksWithVariables) {
        linksWithVariables.forEach(function (link) {
            // get the attribute
            var attributeString = link.getAttribute("data-js-var");
            // split the string
            var stringList = attributeString.split("-");

            var variableName = stringList[2];
            var variableValue = stringList[3];

            // add an eventListener to the link so that we can
            // store the variable when the link is clicked
            link.addEventListener("click", function () {
                window.localStorage.setItem(variableName, variableValue);
            });
        });
    }
}

ebCaptureTheChoiceVariables();

// display based on the variables stored

function ebDisplayVariableCopy() {
    // look on the page for divs that are variable
    var divThatIsVariable = document.querySelector(
        "div[data-js-var^='css-var-']"
    );

    if (divThatIsVariable) {
        // pull out the keyword
        var keywordString = divThatIsVariable.getAttribute("data-js-var");
        var variableName = keywordString.split("-")[2];

        // look in local storgae for the key value
        var variableValue = window.localStorage.getItem(variableName);

        var classNameToShow = `css-var-${variableName}-${variableValue}`;
        // find the div with the correct key-value pair
        // remove the display none

        var divToShow = document.querySelector(
            `div[data-js-var^='${classNameToShow}']`
        );
        divToShow.classList.remove("hidden");
    }
}

ebDisplayVariableCopy();

// Move the SVGs into the hyperlinks to make entire choice box clickable
function ebMoveTheSVGsIntoTheLinks() {
    // get the links
    var choiceLinkList = document.querySelectorAll("ul.choice-options a");

    var svgPath;

    choiceLinkList.forEach(function (link) {
        // find out which kind we have
        if (link.parentElement.classList.contains("random")) {
            svgPath = "{{ path-to-root-directory }}" +
            "assets/images/web/dice.svg";
        } else {
            svgPath = "{{ path-to-root-directory }}" +
            "assets/images/web/next-arrow.svg";
        }

        // put the link text in a span for positioning
        var linkText = link.innerHTML;
        var linkSpan = document.createElement("span");
        linkSpan.innerHTML = linkText;

        // put the span inside the a
        link.innerHTML = "";
        link.appendChild(linkSpan);

        // put the SVG inside the a
        var svgElement = document.createElement("img");
        svgElement.setAttribute("src", svgPath);
        link.appendChild(svgElement);
    });
}

ebMoveTheSVGsIntoTheLinks();
