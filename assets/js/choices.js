// capture and store the variables chosen

function ebCaptureTheChoiceVariables () {
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

function ebDisplayVariableCopy () {
    // look on the page for divs that are variable
    var divThatIsVariable = document.querySelector("div[data-js-var^='css-var-']");

    if (divThatIsVariable) {
        // pull out the keyword
        var keywordString = divThatIsVariable.getAttribute("data-js-var");
        var variableName = keywordString.split("-")[2];

        // look in local storgae for the key value
        var variableValue = window.localStorage.getItem(variableName);

        var classNameToShow = `css-var-${variableName}-${variableValue}`;
        // find the div with the correct key-value pair
        // remove the display none

        var divToShow = document.querySelector(`div[data-js-var^='${classNameToShow}']`);
        divToShow.classList.remove("hidden");
    }
}

ebDisplayVariableCopy();
