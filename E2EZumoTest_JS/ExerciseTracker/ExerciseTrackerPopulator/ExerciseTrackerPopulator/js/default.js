// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
var zumo = null;
(function () {
    "use strict";

    var app = WinJS.Application;
    var zumo;
    var appURL;
    var appKey;
    app.onactivated = function (eventObject) {
        if (eventObject.detail.kind === Windows.ApplicationModel.Activation.ActivationKind.launch) {
            if (eventObject.detail.previousExecutionState !== Windows.ApplicationModel.Activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }
            WinJS.UI.processAll();
        }
    };

    app.oncheckpoint = function (eventObject) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // eventObject.setPromise().
    };

    app.start();
})();

function doNothing() { }

var SWIMMING_STYLE_BUTTERFLY = 0;
var SWIMMING_STYLE_BACKSTROKE = 1;
var SWIMMING_STYLE_BREASTSTROKE = 2;
var SWIMMING_STYLE_FREESTYLE = 3;
var SWIMMING_STYLE_MEDLEY = 4;
var SWIMMING_STYLE_OPENWATER = 5;

function GetDuration(minutes, seconds) {
    /// <summary>
    /// Returns a duration for an event
    /// </summary>
    /// <param name="minutes" type="Number">
    /// The number of minutes in the event
    /// </param>
    /// <param name="seconds" type="Number">
    /// The number of seconds in the event
    /// </param>
    /// <returns type="Number">
    /// The total number of seconds in the event.
    /// </returns>
    seconds = seconds || 0;
    return (minutes * 60) + seconds;
}

function GetYear(date) {
    if (typeof date === 'string') {
        date = new Date(date);
    }

    return date.getFullYear();
}

function TextValidation() {
    appURL = document.getElementById("txtURL").value.trim();
    appKey = document.getElementById("txtKey").value.trim();
    

    if (appURL == "") {
        document.querySelector('#lblMsg').innerText = "[Hint]: Application URL should not be empty";
        return false;
    }
    if (appKey == "") {
        document.querySelector('#lblMsg').innerText = "[Hint]: Application Key should not be empty";
        return false;
    }
    zumo = new Microsoft.WindowsAzure.MobileServices.MobileServiceClient(appURL, appKey);
    lblMsg.text = "";
    return true;
}

function populateExercises() {
    var allSessions = [];
    if (TextValidation()) {
        allSessions.push({
            date: new Date(2012, 3, 5, 20, 9),
            duration: GetDuration(43, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(16, 15) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200, duration: GetDuration(4, 15) },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 500, duration: GetDuration(8, 40) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100, duration: GetDuration(2, 5) },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 500, duration: GetDuration(9, 20) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100, duration: GetDuration(2, 10) }
            ]
        });
        allSessions.push({
            date: new Date(2012, 2, 21, 20, 35),
            duration: GetDuration(41, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(17, 15) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200, duration: GetDuration(4, 15) },
            { style: SWIMMING_STYLE_MEDLEY, distance: 200, duration: GetDuration(3, 30) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200, duration: GetDuration(4, 45) },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 500, duration: GetDuration(9, 0) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100, duration: GetDuration(2, 15) }
            ]
        });
        allSessions.push({
            date: new Date(2012, 2, 19, 9, 24),
            duration: GetDuration(50, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(17, 20) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200, duration: GetDuration(4, 0) },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(18, 20) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200, duration: GetDuration(4, 10) },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 250, duration: GetDuration(4, 40) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50, duration: GetDuration(1, 15) }
            ]
        });
        allSessions.push({
            date: new Date(2012, 2, 16, 12, 16),
            duration: GetDuration(44, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(16, 30) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200, duration: GetDuration(4, 30) },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 500, duration: GetDuration(9, 0) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100, duration: GetDuration(2, 10) },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 500, duration: GetDuration(9, 30) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100, duration: GetDuration(2, 15) }
            ]
        });
        allSessions.push({
            date: new Date(2012, 2, 12, 11, 40),
            duration: GetDuration(40, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(17, 5) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200, duration: GetDuration(4, 15) },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 500, duration: GetDuration(9, 10) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100, duration: GetDuration(2, 20) },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 400, duration: GetDuration(6, 40) }
            ]
        });
        allSessions.push({
            date: new Date(2012, 2, 1, 16, 30),
            duration: GetDuration(40, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(18, 50) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200, duration: GetDuration(4, 45) },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 500, duration: GetDuration(9, 50) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100, duration: GetDuration(2, 25) },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200, duration: GetDuration(2, 0) }
            ]
        });
        allSessions.push({
            date: new Date(2012, 1, 20, 20, 46),
            duration: GetDuration(44, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(16, 45) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200, duration: GetDuration(4, 10) },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 500, duration: GetDuration(9, 15) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100, duration: GetDuration(2, 10) },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 500, duration: GetDuration(9, 10) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100, duration: GetDuration(2, 30) }
            ]
        });
        allSessions.push({
            date: new Date(2012, 1, 17, 6, 27),
            duration: GetDuration(51, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(17, 55) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200, duration: GetDuration(4, 40) },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 500, duration: GetDuration(9, 40) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200, duration: GetDuration(4, 40) },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 500, duration: GetDuration(9, 35) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200, duration: GetDuration(4, 20) }
            ]
        });
        allSessions.push({
            date: new Date(2012, 1, 2, 16, 46),
            duration: GetDuration(47, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(17, 30) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200, duration: GetDuration(4, 10) },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(18, 40) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100, duration: GetDuration(2, 10) },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200, duration: GetDuration(3, 25) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50, duration: GetDuration(1, 0) }
            ]
        });
        allSessions.push({
            date: new Date(2012, 0, 30, 21, 26),
            duration: GetDuration(36, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(16, 25) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200, duration: GetDuration(4, 25) },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 500, duration: GetDuration(9, 10) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100, duration: GetDuration(2, 10) },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200, duration: GetDuration(3, 35) }
            ]
        });
        allSessions.push({
            date: new Date(2012, 0, 26, 15, 59),
            duration: GetDuration(45, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(17, 30) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200, duration: GetDuration(4, 15) },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 500, duration: GetDuration(9, 15) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100, duration: GetDuration(2, 10) },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 500, duration: GetDuration(9, 15) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100, duration: GetDuration(2, 25) }
            ]
        });
        allSessions.push({
            date: new Date(2012, 0, 23, 21, 9),
            duration: GetDuration(42, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(17, 10) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200, duration: GetDuration(4, 30) },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(17, 50) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100, duration: GetDuration(2, 20) }
            ]
        });
        allSessions.push({
            date: new Date(2012, 0, 14, 10, 16),
            duration: GetDuration(34, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(18, 25) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 500, duration: GetDuration(9, 0) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2012, 0, 11, 11, 53),
            duration: GetDuration(42, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(16, 40) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200, duration: GetDuration(4, 40) },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 500, duration: GetDuration(8, 35) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 500, duration: GetDuration(9, 30) }
            ]
        });
        allSessions.push({
            date: new Date(2012, 0, 9, 21, 39),
            duration: GetDuration(40, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(16, 58) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 500, duration: GetDuration(8, 30) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 400 }
            ]
        });
        allSessions.push({
            date: new Date(2012, 0, 6, 16, 10),
            duration: GetDuration(39, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(17, 30) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 400 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2012, 0, 4, 21, 11),
            duration: GetDuration(35, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(17, 45) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 500, duration: GetDuration(9, 40) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2011, 11, 29, 7, 29),
            duration: GetDuration(36, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(18, 25) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 500 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2011, 8, 2, 17, 57),
            duration: GetDuration(43, 30),
            sets: [
            { style: SWIMMING_STYLE_OPENWATER, distance: 1900 }
            ]
        });
        allSessions.push({
            date: new Date(2011, 7, 18, 16, 18),
            duration: GetDuration(38, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(18, 55) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 500 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 }
            ]
        });
        allSessions.push({
            date: new Date(2011, 7, 12, 17, 54),
            duration: GetDuration(48, 26),
            sets: [
            { style: SWIMMING_STYLE_OPENWATER, distance: 2376 }
            ]
        });
        allSessions.push({
            date: new Date(2011, 7, 5, 18, 25),
            duration: GetDuration(48, 0),
            sets: [
            { style: SWIMMING_STYLE_OPENWATER, distance: 2323 }
            ]
        });
        allSessions.push({
            date: new Date(2011, 7, 3, 11, 29),
            duration: GetDuration(50, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(18, 35) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 500, duration: GetDuration(9, 50) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 500 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 }
            ]
        });
        allSessions.push({
            date: new Date(2011, 6, 15, 11, 38),
            duration: GetDuration(44, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(18, 35) },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(19, 30) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200, duration: GetDuration(4, 30) },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 100, duration: GetDuration(1, 30) }
            ]
        });
        allSessions.push({
            date: new Date(2011, 6, 13, 12, 5),
            duration: GetDuration(45, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(17, 25) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200, duration: GetDuration(4, 30) },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 500, duration: GetDuration(8, 50) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 500 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2011, 6, 6, 18, 11),
            duration: GetDuration(48, 30),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(18, 25) },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(18, 30) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_MEDLEY, distance: 100 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2011, 6, 1, 17, 22),
            duration: GetDuration(45, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(18, 30) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 500, duration: GetDuration(9, 50) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 400 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2011, 5, 13, 20, 59),
            duration: GetDuration(40, 30),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(18, 10) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 500, duration: GetDuration(9, 25) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 },
            { style: SWIMMING_STYLE_MEDLEY, distance: 100, duration: GetDuration(1, 35) }
            ]
        });
        allSessions.push({
            date: new Date(2011, 5, 7, 17, 57),
            duration: GetDuration(46, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(18, 25) },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(19, 0) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 }
            ]
        });
        allSessions.push({
            date: new Date(2011, 4, 27, 16, 14),
            duration: GetDuration(34, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(17, 30) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 500, duration: GetDuration(9, 10) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_MEDLEY, distance: 100, duration: GetDuration(1, 32) }
            ]
        });
        allSessions.push({
            date: new Date(2011, 4, 23, 21, 33),
            duration: GetDuration(42, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(16, 53) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 500, duration: GetDuration(9, 5) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2011, 4, 13, 21, 3),
            duration: GetDuration(37, 30),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(17, 17) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 500, duration: GetDuration(9, 5) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2011, 4, 11, 21, 22),
            duration: GetDuration(44, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(17, 28) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(19, 0) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 }
            ]
        });
        allSessions.push({
            date: new Date(2011, 3, 28, 15, 31),
            duration: GetDuration(39, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(18, 35) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 500 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2011, 3, 25, 16, 2),
            duration: GetDuration(47, 30),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(18, 30) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 500 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 500 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2011, 3, 21, 16, 55),
            duration: GetDuration(46, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(18, 30) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2011, 3, 13, 21, 9),
            duration: GetDuration(43, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(16, 50) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 500 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 },
            { style: SWIMMING_STYLE_MEDLEY, distance: 100, duration: GetDuration(1, 53) }
            ]
        });
        allSessions.push({
            date: new Date(2011, 2, 28, 11, 52),
            duration: GetDuration(43, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(17, 25) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 500 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2010, 11, 8, 20, 48),
            duration: GetDuration(41, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 500 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 }
            ]
        });
        allSessions.push({
            date: new Date(2010, 10, 5, 12, 46),
            duration: GetDuration(41, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 500 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 }
            ]
        });
        allSessions.push({
            date: new Date(2010, 9, 26, 16, 31),
            duration: GetDuration(38, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(18, 5) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 400 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 }
            ]
        });
        allSessions.push({
            date: new Date(2010, 9, 12, 11, 58),
            duration: GetDuration(43, 45),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(17, 30) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 500 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2010, 9, 7, 21, 0),
            duration: GetDuration(25, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_BACKSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_MEDLEY, distance: 200, duration: GetDuration(3, 50) }
            ]
        });
        allSessions.push({
            date: new Date(2010, 8, 24, 11, 36),
            duration: GetDuration(40, 35),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(18, 15) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 500 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_MEDLEY, distance: 100, duration: GetDuration(1, 36) }
            ]
        });
        allSessions.push({
            date: new Date(2010, 8, 17, 21, 0),
            duration: GetDuration(39, 45),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(17, 50) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 500 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2010, 7, 27, 21, 0),
            duration: GetDuration(20, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 800 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2010, 7, 19, 21, 0),
            duration: GetDuration(30, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(18, 5) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_MEDLEY, distance: 200 },
            { style: SWIMMING_STYLE_MEDLEY, distance: 100, duration: GetDuration(1, 43) }
            ]
        });
        allSessions.push({
            date: new Date(2010, 7, 12, 16, 21),
            duration: GetDuration(32, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000, duration: GetDuration(18, 0) },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 400 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2010, 7, 6, 17, 20),
            duration: GetDuration(32, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_MEDLEY, distance: 200, duration: GetDuration(3, 45) },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 50 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 }
            ]
        });
        allSessions.push({
            date: new Date(2010, 6, 26, 21, 0),
            duration: GetDuration(35, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2010, 6, 8, 21, 0),
            duration: GetDuration(30, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1050 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 150 }
            ]
        });
        allSessions.push({
            date: new Date(2010, 6, 1, 21, 0),
            duration: GetDuration(30, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 400 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 50 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 50 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2010, 4, 26, 21, 0),
            duration: GetDuration(21, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2010, 4, 16, 21, 0),
            duration: GetDuration(25, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 400 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 400 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 }
            ]
        });
        allSessions.push({
            date: new Date(2010, 4, 11, 16, 20),
            duration: GetDuration(30, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 400 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 400 },
            { style: SWIMMING_STYLE_MEDLEY, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2009, 5, 3, 0, 0),
            duration: GetDuration(20, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 400 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2009, 0, 8, 0, 0),
            duration: GetDuration(22, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_MEDLEY, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 100 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2008, 7, 11, 0, 0),
            duration: GetDuration(24, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 400 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BACKSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BACKSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BACKSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BACKSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2008, 5, 24, 0, 0),
            duration: GetDuration(22, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_MEDLEY, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2007, 6, 24, 0, 0),
            duration: GetDuration(40, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 500 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2007, 6, 22, 0, 0),
            duration: GetDuration(18, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 900 }
            ]
        });
        allSessions.push({
            date: new Date(2007, 6, 12, 0, 0),
            duration: GetDuration(50, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 400 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 400 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 400 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 400 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 400 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2007, 6, 4, 0, 0),
            duration: GetDuration(44, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 1000 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 400 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 400 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_MEDLEY, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2007, 5, 28, 0, 0),
            duration: GetDuration(36, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 400 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 400 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 400 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2007, 5, 25, 0, 0),
            duration: GetDuration(32, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 400 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 400 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2007, 5, 21, 0, 0),
            duration: GetDuration(30, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2007, 5, 19, 0, 0),
            duration: GetDuration(24, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 400 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 },
            { style: SWIMMING_STYLE_MEDLEY, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2007, 5, 12, 0, 0),
            duration: GetDuration(22, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 400 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 }
            ]
        });
        allSessions.push({
            date: new Date(2007, 3, 24, 0, 0),
            duration: GetDuration(24, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 400 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 50 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_BACKSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 100 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2007, 3, 12, 0, 0),
            duration: GetDuration(26, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 400 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_MEDLEY, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 100 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2007, 3, 10, 0, 0),
            duration: GetDuration(24, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 400 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2007, 2, 20, 0, 0),
            duration: GetDuration(26, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 400 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_MEDLEY, distance: 200 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2007, 2, 7, 0, 0),
            duration: GetDuration(24, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 400 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_MEDLEY, distance: 200 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 100 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2007, 1, 23, 0, 0),
            duration: GetDuration(22, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 400 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 100 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2007, 0, 15, 0, 0),
            duration: GetDuration(24, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 400 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2007, 0, 9, 0, 0),
            duration: GetDuration(20, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 100 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2006, 9, 30, 0, 0),
            duration: GetDuration(20, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_MEDLEY, distance: 200 }
            ]
        });
        allSessions.push({
            date: new Date(2006, 7, 22, 0, 0),
            duration: GetDuration(24, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 400 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2006, 6, 20, 0, 0),
            duration: GetDuration(25, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 400 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_MEDLEY, distance: 100 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 100 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2006, 6, 7, 0, 0),
            duration: GetDuration(25, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 400 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_MEDLEY, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 50 }
            ]
        });
        allSessions.push({
            date: new Date(2006, 5, 21, 0, 0),
            duration: GetDuration(25, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 400 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 50 },
            { style: SWIMMING_STYLE_BACKSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 },
            { style: SWIMMING_STYLE_MEDLEY, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2006, 5, 15, 0, 0),
            duration: GetDuration(24, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 400 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 50 },
            { style: SWIMMING_STYLE_BACKSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 100 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_MEDLEY, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2006, 5, 9, 0, 0),
            duration: GetDuration(22, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 400 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 25 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 100 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2006, 5, 6, 0, 0),
            duration: GetDuration(22, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 400 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 400 },
            { style: SWIMMING_STYLE_BUTTERFLY, distance: 50 },
            { style: SWIMMING_STYLE_BACKSTROKE, distance: 50 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 100 }
            ]
        });
        allSessions.push({
            date: new Date(2006, 5, 1, 0, 0),
            duration: GetDuration(20, 0),
            sets: [
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 200 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 100 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_FREESTYLE, distance: 200 },
            { style: SWIMMING_STYLE_BREASTSTROKE, distance: 100 },
            { style: SWIMMING_STYLE_MEDLEY, distance: 100 }
            ]
        });

        var sessionIndex = 0;
        var setIndex = -1;
        var sessionId = -1;

        document.getElementById('addSessionStatus').innerText = "Adding session " + sessionIndex + " of " + allSessions.length;
        var insertData = function () {
            if (setIndex < 0) {
                // insert session
                if (sessionIndex < allSessions.length) {
                    var sessionAdded = function (result) {
                        var id = result.id;
                        sessionId = id;
                        setIndex = 0;
                        setTimeout(insertData, 50);
                    };

                    var sessionInZumo = {
                        date: allSessions[sessionIndex].date,
                        duration: allSessions[sessionIndex].duration
                    };

                    zumo.getTable('Session').insert(sessionInZumo).then(sessionAdded, function () {
                        setTimeout(function () { zumo.getTable('Session').insert(sessionInZumo).then(sessionAdded); }, 50);
                    });
                } else {
                    document.getElementById('addSessionStatus').innerText = "Done adding sessions";
                }
            } else {
                var session = allSessions[sessionIndex];
                if (setIndex < session.sets.length) {
                    var setAdded = function (result) {
                        setIndex++;
                        if (setIndex >= allSessions[sessionIndex].sets.length) {
                            setIndex = -1;
                            sessionIndex++;
                        }
                        setTimeout(insertData, 50);
                    };

                    var setInZumo = {
                        order: setIndex,
                        session: sessionId,
                        style: session.sets[setIndex].style,
                        distance: session.sets[setIndex].distance
                    };

                    if (session.sets[setIndex].duration) {
                        setInZumo.duration = session.sets[setIndex].duration;
                    }

                    zumo.getTable('SessionSet').insert(setInZumo).then(setAdded, function () {
                        setTimeout(function () { zumo.getTable('SessionSet').insert(setInZumo).then(setAdded); }, 50);
                    });
                } else {
                    setIndex = -1;
                    sessionIndex++;
                    setTimeout(insertData, 50);
                }
            }
        };

        insertData();
    }
}

function deleteExercises() {
    if (TextValidation()) {
        zumo.getTable("Session").orderBy("_id").read().then(function (sessions) {
            sessions.forEach(function (session) {
                zumo.getTable('Session').del(session);
            });
        }, function (error) {
            var err = error;
        }
        );
        zumo.getTable('SessionSet').orderBy("_id").read().then(function (sets) {
            sets.forEach(function (set) {
                zumo.getTable('SessionSet').del(set);
            });
        });
        //zumo.tables.get('Session').then(function (sessions) {
        //    sessions.forEach(function (session) {
        //        zumo.tables.del('Session', session);
        //    });
        //});
        //zumo.tables.get('SessionSet').then(function (sets) {
        //    sets.forEach(function (set) {
        //        zumo.tables.del('SessionSet', set);
        //    });
        //});
    }
}
