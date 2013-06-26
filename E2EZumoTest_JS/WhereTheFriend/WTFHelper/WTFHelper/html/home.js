(function () {
    "use strict";
    
    var client;
   
    function ready(element, options) {

        //Click on the button
        WinJS.Utilities.query("#btnInsert").listen("click", Insert);
    }
    function TextValidation(appURL,appKey) {
        
        if (appURL == "") {
            document.querySelector('#lblMsg').innerText = "Application URL is missing";
            return false;
        }
        if (appKey == "") {
            document.querySelector('#lblMsg').innerText = "Application Key is missing";
            return false;
        }
        return true;
    }

    function Insert() {
        var appURL = document.getElementById("txtURL").value.trim();
        var appKey = document.getElementById("txtKey").value.trim();
        if (TextValidation(appURL, appKey)) {
            client = new Microsoft.WindowsAzure.MobileServices.MobileServiceClient(appURL, appKey);
            insertData();
            
        }
    }
    function insertData() {
        try {
            client.getTable("customers").insert({ userId: "92837478943", name: "Scott Guthrie", createdAt: new Date(), updatedAt: new Date() });
            client.getTable("customers").insert({ userId: "98243723498", name: "Wade Wegner", createdAt: new Date(), updatedAt: new Date() });
            client.getTable("customers").insert({ userId: "67367328464", name: "Paul Batum", createdAt: new Date(), updatedAt: new Date() });
            client.getTable("checkins").insert({ username: "Scott Guthrie", message: "Working hard", userId: "92837478943", lat: 21.254994, lng: -157.806813, createdAt: new Date() });
            client.getTable("friends").insert({ uniqueKey: "67367328464_92837478943", userId: "92837478943", approved: false, friendId: "67367328464", friendName: "Bill Gates", createdAt: new Date() });
            document.querySelector('#lblMsg').innerText = "All record are inserted successfully!";
        } catch (err) {
            document.querySelector('#lblMsg').innerText = err.message;
            return;
        }
    }
   
    function updateLayout(element, viewState) {
        // TODO: Respond to changes in viewState.
    }
    WinJS.UI.Pages.define("/html/home.html", {
        ready: ready,
        updateLayout: updateLayout
    });
})();