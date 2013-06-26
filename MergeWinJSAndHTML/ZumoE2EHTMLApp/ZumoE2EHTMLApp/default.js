﻿
var isBrowserIe = false;
if (typeof alert === 'undefined') {
    alert = function (text) {
        new alert(text);
    }
}

function updateTestListHeight() {
    var tableScroll = document.getElementById('table-scroll');
    var tableHead = document.getElementById('tblTestsHead');
    var tableHeight = document.getElementById('testGroupsTableCell').getBoundingClientRect().height;
    var padding = 30;
    var headerHeight = tableHead.getBoundingClientRect().height;
    var bodyHeight = tableHeight - headerHeight - padding;
    tableScroll.style.height = bodyHeight + "px";
}

//updateTestListHeight();

function setDefaultButtonEventHandler() {
    var buttons = document.getElementsByTagName('button');
    for (var i = 0; i < buttons.length; i++) {
        var btn = buttons[i];
        btn.onclick = function (evt) {
            var name = evt.target.innerText;
            alert('Operation ' + name + ' not implemented');
        }
    }
}

setDefaultButtonEventHandler();

function saveLastUsedAppInfo() {
    var state = {
        lastAppUrl: document.getElementById('txtAppUrl').value,
        lastAppKey: document.getElementById('txtAppKey').value,
        lastUploadUrl: document.getElementById('txtSendLogsUrl').value
    };
}

function getTestDisplayColor(test) {
    if (test.status === zumo.TSFailed) {
        return 'Red';
    } else if (test.status == zumo.TSPassed) {
        return 'Lime';
    } else if (test.status == zumo.TSRunning) {
        return 'Gray';
    } else {
        return 'White';
    }
}

document.getElementById('btnRunTests').onclick = function (evt) {
    if (zumo.currentGroup < 0) {
        alert('Please select a test group to run');
        return;
    }

    var currentGroup = zumo.testGroups[zumo.currentGroup];
    var appUrl = document.getElementById('txtAppUrl').value;
    var appKey = document.getElementById('txtAppKey').value;
    if (zumo.initializeClient(appUrl, appKey)) {

        saveLastUsedAppInfo();

        var groupDone = function (testsPassed, testsFailed) {
            var logs = 'Test group finished';
            logs = logs + '\n=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\n';
            logs = logs + 'Tests passed: ' + testsPassed + '\n';
            logs = logs + 'Tests failed: ' + testsFailed;
            alert(logs);
        }
        var updateTest = function (test, index) {
            var tblTests = document.getElementById('tblTestsBody');
            var tr = tblTests.childNodes[index];
            var td = tr.firstChild;
            td.style.color = getTestDisplayColor(test);
            if (isBrowserIe) {
                td.innerText = "" + (index + 1) + ". " + test.displayText();
            }
            else {
                td.textContent = "" + (index + 1) + ". " + test.displayText();
            }
        }
        var testFinished = updateTest;
        var testStarted = updateTest;
        currentGroup.runTests(testStarted, testFinished, groupDone);
    }
}

document.getElementById('btnResetTests').onclick = function (evt) {
    //zumo.currentGroup = zumo.tests.roundTrip;
    if (zumo.currentGroup < 0) {
        alert('Please select a test group to reset its tests');
        return;
    }

    var currentGroup = zumo.testGroups[zumo.currentGroup];
    var tests = currentGroup.tests;
    var tblTests = document.getElementById('tblTestsBody');

    jQuery.each(tests, function (index, test) {
        test.reset();
        var tr = tblTests.childNodes[index];
        var td = tr.firstChild;
        td.style.color = getTestDisplayColor(test);
        if (isBrowserIe) {
            td.innerText = "" + (index + 1) + ". " + test.displayText();
        }
        else {
            td.textContent = "" + (index + 1) + ". " + test.displayText();
        }
    });
}

document.getElementById('btnSendLogs').onclick = function (evt) {
    if (zumo.currentGroup < 0) {
        alert('Please select a test group to upload the logs for');
        return;
    }

    var uploadUrl = document.getElementById('txtSendLogsUrl').value;
    if (uploadUrl.trim() == '') {
        alert('Please enter a valid upload url');
        return;
    }

    var currentGroup = zumo.testGroups[zumo.currentGroup];
    var logs = currentGroup.getLogs();
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            saveLastUsedAppInfo();
            alert(xhr.responseText);
        }
    }
    xhr.open('POST', uploadUrl, true);
    xhr.setRequestHeader('content-type', 'text/plain');
    xhr.send(logs);
}

var testGroups = zumo.testGroups;

function highlightSelectedGroup(groupIndex) {
    var testsGroupBody = document.getElementById('tblTestsGroupBody');
    for (var i = 0; i < testsGroupBody.children.length; i++) {
        var tr = testsGroupBody.children[i];
        var td = tr.firstElementChild;
        //td.style.fontWeight = i == groupIndex ? 'bold' : 'normal';
    }
}

function testGroupSelected(index) {
    highlightSelectedGroup(index);
    var group = testGroups[index];
    zumo.currentGroup = index;
    if (isBrowserIe) {
        document.getElementById('testsTitle').innerText = 'Tests for group: ' + group.name;
    }
    else {
        document.getElementById('testsTitle').textContent = 'Tests for group: ' + group.name;
    }
    var tblTests = document.getElementById('tblTestsBody');
    for (var i = tblTests.childElementCount - 1; i >= 0; i--) {
        tblTests.removeChild(tblTests.children[i]);
    }

    function viewTestLogs(groupIndex, testIndex) {
        var test = zumo.testGroups[groupIndex].tests[testIndex];
        var logs = test.getLogs();
        alert(logs);
    }
    jQuery.each(group.tests, function (index, test) {
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        if (isBrowserIe) {
            td.innerText = "" + (index + 1) + ". " + test.displayText();
        }
        else {
            td.textContent = "" + (index + 1) + ". " + test.displayText();
        }
        tr.appendChild(td);
        td.style.color = getTestDisplayColor(test);
        td.ondblclick = function () {
            viewTestLogs(zumo.currentGroup, index);
        }
        tblTests.appendChild(tr);
    });
}

function addAttribute(element, name, value) {
    var attr = document.createAttribute(name);
    attr.value = value.toString();
    element.attributes.setNamedItem(attr);
}

function addTestGroups() {

    var tblTestsGroup = document.getElementById('tblTestsGroupBody');
    jQuery.each(testGroups, function (index, item) {
        var name = "" + (index + 1) + ". " + item.name + " tests";
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        tr.appendChild(td);
        var a = document.createElement('a');
        td.appendChild(a);
        addAttribute(a, 'href', '#');
        addAttribute(a, 'class', 'testGroupItem');

        if (a.attachEvent) {
            isBrowserIe = true;
            a.attachEvent('onclick', function () {
                testGroupSelected(index);
            });
            a.innerText = toStaticHTML(name);
        }
        else {
            a.addEventListener('click', function () {
                testGroupSelected(index);
            }, false);
            a.textContent = name;
        }

        tblTestsGroup.appendChild(tr);
    });          
}
addTestGroups();
