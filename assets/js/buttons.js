/*jslint browser */

function ebReadMoreButtons() {
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
        svgNode.setAttribute(
            "src",
            "{{ path-to-root-directory }}assets/images/web/read-more.svg"
        );
        svgNode.classList.add("read-more");
        link.appendChild(svgNode);
    });
}

ebReadMoreButtons();


function ebNextDecadeButtons() {

    // create the image element
    var arrowElement1 = document.createElement("img");
    arrowElement1.setAttribute(
        "src",
        "{{ path-to-root-directory }}assets/images/web/next-decade-arrow.svg"
    );
    var arrowElement2 = document.createElement("img");
    arrowElement2.setAttribute(
        "src",
        "{{ path-to-root-directory }}assets/images/web/next-decade-arrow.svg"
    );

    // get the link
    var nextDecadeLink = document.querySelector(".next-decade-link a");

    if (nextDecadeLink) {
        var linkText = nextDecadeLink.innerHTML;
        nextDecadeLink.innerHTML = "";

        var textSpan = document.createElement("span");
        textSpan.innerHTML = linkText;
        // put the image inside the link on either side of the content
        nextDecadeLink.appendChild(arrowElement1);
        nextDecadeLink.appendChild(textSpan);
        nextDecadeLink.appendChild(arrowElement2);

        // This should not show if you are coming from the stories TOC
        // or if someone has shared a story link
        if (
            !document.referrer.includes("newspaper") &&
            !document.referrer.includes("part-page")
        ) {
            nextDecadeLink.parentNode.classList.add("hidden");

            // Push the footer down to fill the void
            // var footerWrapper = document.querySelector(".footer-wrapper");
            // footerWrapper.classList.add("no-next-decade-link");

            // hide the dash
            document.body.classList.add("dash-hidden");

            // fix the lower margin on the content
            var contentDiv = document.querySelector("#content");
            contentDiv.classList.add("no-next-decade-link");
        }
    }
}

ebNextDecadeButtons();


function ebActionButtons() {
    // need to put an event listener on the share button
    // when it is pressed, reveal the share links
    // and add the classes needed to rearrange the other elements

    var shareButton = document.querySelector("a.share-button");
    var shareLinks = document.querySelector("div.share-links");

    if (shareButton) {
        shareButton.addEventListener("click", function () {
            shareLinks.classList.toggle("hidden");
        });
    }
}

ebActionButtons();


function ebNavShareButton() {
    // the share button in the nav needs interactivity

    var navShareButton = document.querySelector(".nav .share");
    var navShareLinks = document.querySelector("div.nav-share-links");
    if (navShareButton) {
        navShareButton.addEventListener("click", function () {
            navShareLinks.classList.toggle("hidden");
        });
    }
}

ebNavShareButton();
