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

// Wrap article text and image in separate
// containers so that we can lay them out without
// flex or grid, which Prince doesn't do.
function articles() {
    'use strict';

    var articleListItems = document.querySelectorAll('.articles li');

    if (articleListItems && articleListItems.length > 0) {
        articleListItems.forEach(function (article) {

            // Create new text container
            var articleText = document.createElement('div');
            articleText.classList.add('article-text');

            // Make a copy of the article contents
            var articleContents = article.innerHTML;

            // Make a copy of the image
            var articleImage = article.querySelector('img');

            // Remove the article contents
            article.innerHTML = "";

            // Add the image to the container and the old
            // article contents to the new text container.
            article.appendChild(articleImage);
            article.appendChild(articleText);
            articleText.innerHTML += articleContents;

            // Remove the image from the text container
            var redundantImage = articleText.querySelector('img');
            articleText.removeChild(redundantImage);

        });
    }
}

// Go
articles();
choicesSections();
