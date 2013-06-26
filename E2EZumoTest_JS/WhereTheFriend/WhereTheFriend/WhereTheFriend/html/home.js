// For an introduction to the HTML Fragment template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";
    var appURL = "https://naren904test1.zumotcant.antares-test.windows-int.net/";
    var redirectURL = appURL.replace("windows-","");
    function linkClickEventHandler(eventInfo) {
        eventInfo.preventDefault();
        var link = eventInfo.target;
        WinJS.Navigation.navigate(link.href);
    }
    
    // This function is called whenever a user navigates to this page. It
    // populates the page elements with the app's data.
    function ready(element, options) {
        
        // LOGIN CODE HERE
        //var zumo = new Microsoft.WindowsAzure.MobileServices.MobileServiceClient('http://wtftestjs1.zumodevant.antares-test.windows-int.net/');
        // handle windows live login event
        // zumo is declared in default.JS file as a global variable
        zumo = new Microsoft.WindowsAzure.MobileServices.MobileServiceClient(appURL);
        WL.Event.subscribe("auth.login", function (response) {
            wtf.busy(true);

            // call the api to get some information about the user
            WL.api(
                {
                    path: "me",
                    method: "get"
                }, function (wlUser) {
                    Helper.Userdetails.Username = wlUser.name;
                    Windows.Networking.PushNotifications.PushNotificationChannelManager.createPushNotificationChannelForApplicationAsync().then(function (channel) {
                        // TODO - get a ZUMO token and upsert the customer into ZUMO storage along with his device id
                        zumo.login(response.session.authentication_token).then(function (user) {
                            Helper.Userdetails.UserID = user.userId; //wlUser.id
                            upsert("customers", user.userId, wlUser.name);
                            wtf.busy(false);

                        }, function (error) {
                            debugger;
                        }).done(navigateToWelcome);
                    }, function (error) {
                        debugger;
                    });
                });
        });

        WL.init({
            redirect_uri: redirectURL,
            scope: ["wl.signin", "wl.basic"]

        });

        WL.ui({
            name: "signin",
            element: "signin"
        });
    }

    function updateLayout(element, viewState) {
        // TODO: Respond to changes in viewState.
    }

    function navigateToWelcome() {
        WinJS.Navigation.navigate("html/welcome.html");
    }

    function postLogin(user) {
        user.deviceId = Notifications.channelUri;
        zumo.racyUpsert("customers", user, "userId").then(function (yeah) {

        }, function (no) {
            wtf.error(no);
            wtf.busy(false);
        });
    }

    function upsert(collectionName, userId, Username) {
        zumo.getTable(collectionName).where({ userId: userId }).read().then(function (result) {
            if (result.toString().length != 0) {
                zumo.getTable(collectionName).update({ id: result[0].id, updatedAt: new Date() }).then(
                     function (item) { },
                    function (error) { }
                    );

            }
            else {
                var item = { userId: userId, name: Username, createdAt: new Date(), updatedAt: new Date() };
                zumo.getTable(collectionName).insert(item).then(
                    function (item) { },
                    function (error) { }
                    );
            }
            
        });

        
    }

    WinJS.UI.Pages.define("/html/home.html", {
        ready: ready,
        updateLayout: updateLayout
    });
})();
