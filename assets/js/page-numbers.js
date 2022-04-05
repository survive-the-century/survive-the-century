/*jslint */
/*globals Prince, document */

function ebAddPageNumbers() {
    "use strict";

    if (typeof Prince === "object" && typeof Prince.addScriptFunc === "function") {

        Prince.addScriptFunc("turnToPage", function (targetPage) {
            return "\u00A0" + " Turn to page\u00A0" + targetPage + ".";
        });

        Prince.addScriptFunc("pagereference", function (currentPage, targetPage) {
            // if the target is on this page, return blank
            if (currentPage === targetPage) {
                return "";
            }
            // otherwise show a space and the page number in parentheses
            return "\u00A0" + "(page\u00A0" + targetPage + ")";
        });
        Prince.addScriptFunc("pagereferencePlain", function (currentPage, targetPage) {
            // if the target is on this page, return blank
            if (currentPage === targetPage) {
                return "";
            }
            // otherwise show a space and the page number
            return "\u00A0" + targetPage;
        });
        Prince.addScriptFunc("lastPageCheck", function (currentPage, targetPage) {
            // if the target is on this page, or a string zero
            // (i.e. not a valid page for Prince) return blank
            if (currentPage === targetPage
                    || targetPage === '0') {
                return "";
            }
            // otherwise show an arrow
            return "\u2192";
        });
    }
}

// Add a not-the-last-page arrow in the right-bottom margin
function lastPageCheck() {
    'use strict';

    // Don't do this on some pages
    if (document.body.classList.contains('praise-page')
            || document.body.classList.contains('badges-page')
            || document.body.classList.contains('trackers-page')) {
        return;
    }

    // Create a target at the end of the doc,
    // which will only appear on its last page.
    // It must be block-level element (not a span)
    // for Prince to include it on the page as a valid target.
    var endContentTarget = document.createElement('div');
    endContentTarget.id = 'end-content';
    var wrapper = document.getElementById('wrapper');
    wrapper.appendChild(endContentTarget);

    // Add content to the margin-box. The content is created in
    // ebAddPageNumbers() above as lastPageCheck.
    // It's then placed into the margin box here.
    // We do this with an on-page <style> element because
    // the url('#end-content') resolves relative to the file
    // the CSS is in, so if we do this in the main, external CSS file,
    // e.g. print-pdf.scss, the URL will resolve to print-pdf.scss#end-content,
    // rather than [filename].html#end-content. For more detail see
    // https://www.princexml.com/forum/topic/4353/target-counter-not-working
    var lastPageStyleElement = document.createElement('style');
    lastPageStyleElement.innerHTML = '@page { @right-bottom { content: prince-script(lastPageCheck, counter(page), target-counter(url("#end-content"), page)) !important;} }';
    document.head.appendChild(lastPageStyleElement);
}

ebAddPageNumbers();
lastPageCheck();
