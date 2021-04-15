function ebAddGlowToElement (selector) {

    var nodesToGlow = document.querySelectorAll(selector);

    nodesToGlow.forEach(function (node) {
        // give it an event listener, which adds a class of css-glow when it
        // is being hovered over
        node.addEventListener("mouseenter", function () {
            node.classList.add("css-glow");
        })
        node.addEventListener("mouseleave", function () {
            node.classList.remove("css-glow");
        })
    })
}

ebAddGlowToElement("ul.choice-options li");
ebAddGlowToElement(".part-page-button");
ebAddGlowToElement(".button");

function ebMoveElementBelowGlow (selector) {
    // some elements need to live outside .main-content so that they
    // are below the footer glow

    var nodeToMove = document.querySelector(selector);
    var mainContentNode = document.querySelector(".main-content");

    if (nodeToMove) {
        mainContentNode.after(nodeToMove);
    }

}

ebMoveElementBelowGlow(".call-to-action");
ebMoveElementBelowGlow(".infobox");
