function ebAddGlow (selector) {
    "use strict";

    var nodesToGlow = document.querySelectorAll(selector);

    nodesToGlow.forEach(function (node) {
        // give it an event listener, which adds a class of css-glow when it 
        // is being hovered over, or touched on a touchscreen
        node.addEventListener("mouseenter", function () {
            node.classList.add("css-glow");
        })
        node.addEventListener("mouseleave", function () {
            node.classList.remove("css-glow");
        })
    })
}

ebAddGlow("ul.choice-options li");
ebAddGlow(".part-page-button");
ebAddGlow(".button");
