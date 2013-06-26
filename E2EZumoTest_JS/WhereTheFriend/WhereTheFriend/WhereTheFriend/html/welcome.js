
(function () {
    "use strict";
    var specificFriend = 0; // search only specific and bind the list view

    //Insert Message
    function InsertMessage(Message) {
        var item = { message: Message, userId: Helper.Userdetails.UserID, username: Helper.Userdetails.Username, createdAt: new Date() };
        //zumo.tables.insert("checkins", item).then();
        zumo.getTable("checkins").insert(item).then();
        
    }
    //Return all message that checkins by user ...
    function GetRecentCheckins() {
        var checkins = null;
     //   zumo.tables.get(zumo.tables.query("checkins").orderByDescending("createdAt")).then(function (results) {
        zumo.getTable("checkins").orderByDescending("createdAt").read().then(function (results) {
            checkins = results;
            for (var i = 0; i < checkins.length; i++) {
                var username = checkins[i].username;
                if (username) {
                    checkins[i].userImage = "http://azmob.blob.core.windows.net/images/" + checkins[i].username.replace(' ', '_').toLowerCase() + ".jpg";
                }
            }
            var dataList = new WinJS.Binding.List(checkins);
            var list = document.getElementById("listCheckins").winControl;
            list.itemDataSource = dataList.dataSource;
            wtf.busy(false);
        }, function (no) {
            wtf.error(no);
        });
    }
    //Serach all the friends...
    function searchFriend() {
        //Identify user search specific friend
        if (specificFriend == 0) {
            var friends = null;
            //zumo.tables.get(zumo.tables.query("customers").take(10).select("name", "createdAt")).then(function (results) {
            zumo.getTable("customers").take(10).select("userId","name","createdAt").read().then(function (results) {
                friends = results;
                if (friends.length < 0)
                    return;

                for (var i = 0; i < friends.length; i++) {
                    var username = friends[i].name;
                    if (username)
                        friends[i].userImage = "http://azmob.blob.core.windows.net/images/" + friends[i].name.replace(' ', '_').toLowerCase() + ".jpg";
                }
                var dataList = new WinJS.Binding.List(friends);
                var list = document.getElementById("friendList").winControl;
                list.itemDataSource = dataList.dataSource;


            }, function (no) {
                wtf.error(no);

            });
        }
        else {
            var name = Windows.Storage.ApplicationData.current.localSettings.values["SpecificFriend"];
            
          //  zumo.query("customers", { $query: { name: name }, $select: { name: true, createdAt: true } }).then(function (results) {
             zumo.getTable("customers").where({ name: name }).select("userId","name","CreatedAt").read().then(function (results) {
                friends = results;
                if (friends.length < 0)
                    return;

                for (var i = 0; i < friends.length; i++) {
                    var username = friends[i].username;
                    if (username)
                        friends[i].userImage = "http://azmob.blob.core.windows.net/images/" + friends[i].username.replace(' ', '_').toLowerCase() + ".jpg";
                }
                var dataList = new WinJS.Binding.List(friends);
                var list = document.getElementById("friendList").winControl;
                list.itemDataSource = dataList.dataSource;


            }, function (no) {
                wtf.error(no);

            });
            specificFriend = 0;
        }
    }
    //Store the specific search keyword or name and reload the page and bind it again
    function SearchSpecificFriend() {
        var searchText = document.getElementById("txtSearchFriend").value;
        if (searchText.length > 0) {
            specificFriend = 1;
            Windows.Storage.ApplicationData.current.localSettings.values["SpecificFriend"] = searchText;
        }
        loadPageAgain();
    }
    // Bind Data when page load
    function BindData() {

        wtf.busy(true);
        document.querySelector('#profileName').innerText = document.querySelector('#lblUsername').innerText = Helper.Userdetails.Username;
        GetRecentCheckins(); //get all recent checking list
        searchFriend();
        TotalPendingRequest();
        AllFriends();
        wtf.busy(false);
        //document.querySelector('#userImageLogo').innerText = "http://azmob.blob.core.windows.net/images/" + Helper.Userdetails.Username.replace(' ', '_').toLowerCase() + ".jpg";

    }
    function TotalPendingRequest() {

       // zumo.tables.get(zumo.tables.query("friends").where({ friendId: Helper.Userdetails.UserID, approved: false })).then(function (results) {
        zumo.getTable("friends").where({ friendId: Helper.Userdetails.UserID, approved: false }).read().then(function (results) {
            if (results.length > 0)
                document.querySelector('#lblrequestNumber').innerText = "[ " + results.length + " ]";
        }, function (no) {
            wtf.error(no);
        });

    }
    function AllFriends() {
        //zumo.tables.get(zumo.tables.query("friends").where({ friendId: Helper.Userdetails.UserID, approved: true })).then(function(result){
        zumo.getTable("friends").where({ friendId: Helper.Userdetails.UserID, approved: true }).read().then(function (results) {
            if (results.length > 0)
                document.querySelector('#lblAllFriends').innerText = "[ " + results.length + " ]";
        });
    }
    // This function is called whenever a user navigates to this page. It
    // populates the page elements with the app's data.
    function ready(element, options) {
        // TODO: Initialize the fragment here.
        BindData();
        WinJS.Utilities.query("#btnShareMessage").listen("click", AddMessage);
        //WinJS.Utilities.query("#lnkPendingRequest").listen("click", friednRequest);
        WinJS.Utilities.query("#btnSearchFriend").listen("click", SearchSpecificFriend);
        WinJS.Utilities.query('#btnDel').listen("click", DeleteMessage);
        WinJS.Utilities.query('#btnAddRequest').listen("click", AddFriendRequest);
        WinJS.Utilities.query('#btnPendingRequest').listen("click", NavigateToFriendRequst);
        WinJS.Utilities.query('#btnAllFriends').listen("click", NavigateToAllFriends);
        
        
        
    }
   
    function NavigateToFriendRequst() {
        WinJS.Navigation.navigate('html/friendRequest.html');
    }
    function NavigateToAllFriends() {
        WinJS.Navigation.navigate('html/allFriends.html');
    }
    function AddMessage() {
        wtf.busy(true);
        var text = document.getElementById("txtMessage").value;
        if (text.length <= 0)
            return;
        InsertMessage(text);
        BindData();
        wtf.busy(false);
    }
    function AddFriendRequest() {

        var listview = document.getElementById('friendList').winControl;
        listview.selection.getItems().then(function (items) {
            var newfriend = items;
            if (newfriend.length == 0)
                new Windows.UI.Popups.MessageDialog("Select friend from friend list and then press Add Friend Request!").showAsync();

            for (var i = 0; i < newfriend.length; i++) {
                var item = {
                    uniqueKey: newfriend[i].data.userId + "_" + Helper.Userdetails.UserID,
                    userId: Helper.Userdetails.UserID,
                    approved: false,
                    friendId: newfriend[i].data.userId,
                    friendName: newfriend[i].data.name,
                    createdAt: new Date(),
                    username: Helper.Userdetails.Username,
                    updatedAt: new Date(),
                    userImage: "http://azmob.blob.core.windows.net/images/" + Helper.Userdetails.Username.replace(' ', '_').toLowerCase() + ".jpg"
                }
                zumo.getTable("friends").insert(item).then(function (result) {
                   // new Windows.UI.Popups.MessageDialog("Friedn request submit successfully!").showAsync();
                    loadPageAgain();
                });

            }
            
        });

       
    }
    

    function DeleteMessage() {
        var listView = document.getElementById('listCheckins').winControl;
        listView.selection.getItems().then(function (items) {
            var item = items;
            for (var i = 0; i < items.length; i++) {
                if (Helper.Userdetails.UserID == items[i].data.userId) {
                    zumo.getTable("checkins").del({ id: items[i].data.id }).then(function (result) {
                        loadPageAgain();
                    });
                }
                else {
                    new Windows.UI.Popups.MessageDialog("You can not delete Message which shared by other. Access Denied!").showAsync();

                }
            }
            if (item.length == 0)
                new Windows.UI.Popups.MessageDialog("Select Message before press delete!").showAsync();
        });
    }
    function loadPageAgain() {
        WinJS.Navigation.navigate('html/welcome.html');
    }
    function updateLayout(element, viewState) {
        // TODO: Respond to changes in viewState.
    }

    WinJS.UI.Pages.define("/html/welcome.html", {
        ready: ready,
        updateLayout: updateLayout
    });
})();
