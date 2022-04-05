/*jslint */
/*globals document */

// Change links to part pages into
// links to newspaper pages, so that
// we can skip part pages in print.

function updatePartPageLinks() {
    'use strict';

    // Get the links on the page,
    // which we'll test for links
    // to part pages.
    var links = document.querySelectorAll('a');

    links.forEach(function (link) {
        var target = link.getAttribute('href');
        if (target.indexOf('part-page_') === 0) {
            var newTarget = target.replace('part-page_', 'newspaper_welcome-to-');
            link.href = newTarget;
        }
    });
}

// Go
updatePartPageLinks();
