/*jslint browser */

function choicesSections() {
    'use strict';

    // Get the choices on the page
    var choicesElements = document.querySelectorAll('.choice-question, .choice-options');

    if (choicesElements && choicesElements.length > 0) {

        // Create a new section to hold choices
        var choicesSection = document.createElement('div');
        choicesSection.classList.add('choices-section');

        // Move the choice elements into the choices section
        choicesElements.forEach(function (element) {
            choicesSection.appendChild(element);
        });

        // Append the new section to the parent
        var pageContent = document.getElementById('content');
        pageContent.appendChild(choicesSection);
    }
}

// Go
choicesSections();
