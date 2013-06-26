
(function () {
    "use strict";
    
    function getAllPendingFriendRequest() {
        var request = null;
        zumo.getTable("friends").where({ friendId: Helper.Userdetails.UserID, approved: false }).read().then(function (results){
            request = results;
            if (request.length == 0)
                return;
            for (var i = 0; i < request.length; i++) {
                var username = request[i].username;
                if (username) {
                    request[i].userImage = "http://azmob.blob.core.windows.net/images/" + request[i].username.replace(' ', '_').toLowerCase() + ".jpg";
                }
            }
            var dataList = new WinJS.Binding.List(request);
            var listView = document.getElementById("listApproved").winControl;
            listView.itemDataSource = dataList.dataSource;

        }, function (no) {
            wtf.error(no);
        });
    }
    function BindData() {

        wtf.busy(true);
        getAllPendingFriendRequest();
        wtf.busy(false);
        

    }
    // This function is called whenever a user navigates to this page. It
    // populates the page elements with the app's data.
    function ready(element, options) {
        // TODO: Initialize the fragment here.
        BindData();
        WinJS.Utilities.query("#btnBack").listen("click", GoBack);
        WinJS.Utilities.query("#btnReject").listen("click", Reject);
        WinJS.Utilities.query("#btnApproved").listen("click", Approved);
   
    }
    function GoBack() {
        WinJS.Navigation.navigate('html/Welcome.html');
    }
    function Reject() {
        var listview = document.getElementById('listApproved').winControl;
        listview.selection.getItems().then(function (items) {
            var item = items;
            for (var i = 0; i < item.length; i++) {
                zumo.getTable("friends").del({ id: item[i].data.id }).then(function (result) {
                    WinJS.Navigation.navigate('html/welcome.html');
                });
            } 
            if (item.length == 0)
                new Windows.UI.Popups.MessageDialog("Select item from list and then press reject button!").showAsync();
        });
    }
    function Approved() {
        var listview = document.getElementById('listApproved').winControl;
        listview.selection.getItems().then(function (items) {
            var item = items;
            for (var i = 0; i < item.length; i++) {
                zumo.getTable("friends").update({ id: item[i].data.id, approved: true }).then(function (result) {
                    WinJS.Navigation.navigate('html/welcome.html');
                });
            }
            if (item.length == 0)
                new Windows.UI.Popups.MessageDialog("Select item from list and then press approved button!").showAsync();
        });
    }
   
    function LoadPageAgain() {
        WinJS.Navigation.navigate('html/friendRequest.html');
    }
    function updateLayout(element, viewState) {
        // TODO: Respond to changes in viewState.
    }

    WinJS.UI.Pages.define("/html/friendRequest.html", {
        ready: ready,
        updateLayout: updateLayout
    });
})();
