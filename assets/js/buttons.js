function ebReadMoreButtons () {
    "use strict";

    // Get the hyperlink
    var readMoreLinks = document.querySelectorAll(".articles a");

    readMoreLinks.forEach(function (link) {
        // Make the link text invisible 
        // We want to keep it for accessibility
        var linkText = link.text;

        link.innerHTML = "";
        var hiddenLinkText = document.createElement("span");
        hiddenLinkText.classList.add("visuallyhidden");
        hiddenLinkText.innerHTML = linkText;

        link.appendChild(hiddenLinkText);

        // Add the SVG icon
        var svgNode = document.createElement("img");
        svgNode.setAttribute("src", "../../assets/images/web/read-more.svg");
        svgNode.classList.add("read-more");
        link.appendChild(svgNode);
    });
}

ebReadMoreButtons();

function ebNextDecadeButtons () {
    "use strict";

    // create the image element
    var arrowElement1 = document.createElement("img");
    arrowElement1.setAttribute("src", "../../assets/images/web/next-decade-arrow.svg");
    var arrowElement2 = document.createElement("img");
    arrowElement2.setAttribute("src", "../../assets/images/web/next-decade-arrow.svg");

    // get the link
    var nextDecadeLink = document.querySelector(".next-decade-link a");

    if (nextDecadeLink) {
        // put the image inside the link on either side of the content
        nextDecadeLink.prepend(arrowElement1);
        nextDecadeLink.appendChild(arrowElement2);
    }
}

ebNextDecadeButtons();
