/*jslint */
/*globals Prince */

function ebAddPageNumbers() {
    "use strict";

    if (typeof Prince.addScriptFunc === "function") {

        Prince.addScriptFunc("turnToPage", function (targetPage) {
            return " Turn to page " + targetPage + ".";
        });

        Prince.addScriptFunc("pagereference", function (currentPage, targetPage) {
            // if the target is on this page, return blank
            if (currentPage === targetPage) {
                return "";
            }
            // otherwise show a space and the page number in parentheses
            return "(Page " + targetPage + ")";
        });
        Prince.addScriptFunc("pagereferencePlain", function (currentPage, targetPage) {
            // if the target is on this page, return blank
            if (currentPage === targetPage) {
                return "";
            }
            // otherwise show a space and the page number in parentheses
            return targetPage;
        });
    }
}

ebAddPageNumbers();
