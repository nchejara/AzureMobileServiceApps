/// <reference path="///ZumoClient//zumo.js" />

var swimmingStyles = [
    "Butterfly",
    "Backstroke",
    "Breaststroke",
    "Freestyle",
    "Medley",
    "Open Water",
];

var SWIMMING_STYLE_BUTTERFLY = 0;
var SWIMMING_STYLE_BACKSTROKE = 1;
var SWIMMING_STYLE_BREASTSTROKE = 2;
var SWIMMING_STYLE_FREESTYLE = 3;
var SWIMMING_STYLE_MEDLEY = 4;
var SWIMMING_STYLE_OPENWATER = 5;

var zumo = new Microsoft.WindowsAzure.MobileServices.MobileServiceClient("https://naren811test2.zumotcant.antares-test.windows-int.net/", "AATFukYIcCqREPAtnxFrvKiEmBONTY93");
function GetDuration(minutes, seconds) {
    /// <summary>
    /// Returns a duration for an event, in seconds
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

function GetDurationString(durationInSeconds) {
    var minutes = Math.floor(durationInSeconds / 60);
    var seconds = durationInSeconds % 60;
    var result = minutes.toFixed(0) + ":";
    if (seconds < 10) {
        result = result + "0" + seconds.toString();
    } else {
        result = result + seconds.toString();
    }

    return result;
}

function GetYear(date) {
    if (typeof date === 'string') {
        date = new Date(date);
    }

    return date.getFullYear();
}

function GetSetContent(session) {
    var content = "<table class='sessionDetails' border='2'>";
    content += "  <thead>";
    content += "   <tr>";
    content += "    <th>Style</th>";
    content += "    <th>Distance</th>";
    content += "    <th>Duration</th>";
    content += "   </tr>";
    content += "  </thead>";
    content += "  <tbody>";
    for (var i = 0; i < session.sets.length; i++) {
        var set = session.sets[i];
        content += "   <tr>";
        content += "    <td>" + swimmingStyles[set.style] + "</td>";
        content += "    <td>" + set.distance + "</td>";
        content += "    <td>" + (set.duration ? GetDurationString(set.duration) : "") + "</td>";
        content += "   </tr>";
    }
    content += "  </tbody>";
    content += "</table>";
    return content;
}

(function () {
    "use strict";

    var sessionsList = new WinJS.Binding.List();

    var sessionsForYears = [];
    var sessions = [];

    var lightBlueBackground = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8    YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY5h58xUABGsCXQMuL3UAAAAASUVORK5CYII=";

    function loadSessions() {
        return new WinJS.Promise(function (complete, error, progress) {
            // zumo.tables.get('Session', { $orderby: { date: -1 } }).then(function (allSessions) {
            zumo.getTable("Session").orderBy("id").read().then(function (allSessions) {
                zumo.getTable("SessionSet").orderBy("id").read().then(function (allSets) {
                    allSessions.forEach(function (session) {
                        sessions.push(session);
                        var sessionYear = GetYear(session.date);
                        var group = sessionsForYears.filter(function (item) { return item.year == sessionYear });
                        if (group.length == 0) {
                            group = {
                                year: sessionYear,
                                description: 'Sessions for ' + sessionYear,
                                title: sessionYear.toString(),
                                backgroundImage: 'images/' + sessionYear + '.png'
                            };
                            sessionsForYears.push(group);
                        } else {
                            group = group[0];
                        }

                        session.group = group;
                        session.sets = allSets.filter(function (set) { return set.session == session.id; })
                                              .sort(function (set1, set2) { return set1.order - set2.order; });
                        session.totalDistance = session.sets.reduce(function (previousDistance, currentSet) {
                            return previousDistance + currentSet.distance;
                        }, 0);
                    });

                    complete(allSessions);
                });
            });
        });
    }

    function getSessions() {
        loadSessions().then(function (sessions) {
            sessions.forEach(function (session) {
                var group = session.group;
                var date = new Date(session.date);
                sessionsList.push({
                    group: group,
                    key: group.year,
                    title: group.title,
                    date: date.toLocaleDateString(),
                    time: date.toLocaleTimeString(),
                    subtitle: group.description,
                    backgroundImage: lightBlueBackground,
                    sets: session.sets,
                    duration: GetDurationString(session.duration),
                    totalDistance: session.totalDistance,
                    content: GetSetContent(session)
                });
            });
        });

        return sessionsList;
    }
    
    function getGroupedData() {
        return sessionsList.createGrouped(function (item) { return item.group.year; },
            function (item) { return item.group; },
            function (l, r) { return l < r; });
    }

    // This function returns a WinJS.Binding.List containing only the items
    // that belong to the provided group.
    function getItemsFromGroup(group) {
        return list.createFiltered(function (item) { return item.group.year === group.year; });
    }

    var list = getSessions();
    var groupedItems = getGroupedData();

    WinJS.Namespace.define("data", {
        items: groupedItems,
        groups: groupedItems.groups,
        getItemsFromGroup: getItemsFromGroup
    });
})();
