(function(){
    "use strict";

    function AllFriends() {
        zumo.getTable("friends").where({friendId: Helper.Userdetails.UserID, approved: true }).read().then(function(result){
            var item = result;
            for (var i = 0; i < item.length; i++) {
                var friendname = item[i].username;
                if(friendname)
                    item[i].userImage = "http://azmob.blob.core.windows.net/images/" + item[i].username.replace(' ', '_').toLowerCase() + ".jpg";
            }
            var dataList = new WinJS.Binding.List(item);
            var list = document.getElementById('listAllFriends').winControl;
            list.itemDataSource = dataList.dataSource;
        });
    }
    function BindData() {
        AllFriends();
    }
    function ready(element, options) {
        BindData();
        WinJS.Utilities.query('#btnBack').listen("click", GoBack);
    }
    function GoBack() {
        WinJS.Navigation.navigate('html/welcome.html');
    }
    function updateLayout(element, viewState) {
        // TODO: Respond to changes in viewState.
    }
    WinJS.UI.Pages.define("/html/allFriends.html", {
        ready: ready,
        updateLayout: updateLayout
    });
})();