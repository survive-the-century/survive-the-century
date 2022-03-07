/*jslint */
/*globals Prince */

function ebAddPageNumbers() {
    "use strict";

    if (typeof Prince === "object" && typeof Prince.addScriptFunc === "function") {

        Prince.addScriptFunc("turnToPage", function (targetPage) {
            return "\u00A0" + " Turn to page " + targetPage + ".";
        });

        Prince.addScriptFunc("pagereference", function (currentPage, targetPage) {
            // if the target is on this page, return blank
            if (currentPage === targetPage) {
                return "";
            }
            // otherwise show a space and the page number in parentheses
            return "\u00A0" + "(page " + targetPage + ")";
        });
        Prince.addScriptFunc("pagereferencePlain", function (currentPage, targetPage) {
            // if the target is on this page, return blank
            if (currentPage === targetPage) {
                return "";
            }
            // otherwise show a space and the page number
            return "\u00A0" + targetPage;
        });
    }
}

ebAddPageNumbers();
