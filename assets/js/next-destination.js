function ebStoreNextDestination () {
    "use strict";

    // look for links with the js-next-dest attribute
    var nextDestLinks = document.querySelectorAll("a[js-next-dest]");
    // add event listeners
    if (nextDestLinks) {
        nextDestLinks.forEach(function (linkNode) {
            linkNode.addEventListener("click", function () {
                window.localStorage.setItem(
                    "next-dest",
                    linkNode.getAttribute("js-next-dest")
                );
            });
        });
    }
}

function ebAddNextDestination () {
    "use strict";

    // look for links that have the href as "js-next-dest-placeholder"
    // replace this href with the local stoagre value of next-dest

    var placeholderLink = document.querySelector("a[href='js-next-dest-placeholder']");

    if (placeholderLink) {
        placeholderLink.setAttribute(
            "href",
            window.localStorage.getItem("next-dest")
        );
    }
}

ebStoreNextDestination();
ebAddNextDestination();
