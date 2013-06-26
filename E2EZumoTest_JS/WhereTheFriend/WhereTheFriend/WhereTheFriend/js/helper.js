(function () {
    "use strict";
    // define a helper namespace 
    WinJS.Namespace.define("Helper", {
        // This class can store the user information when he logged in
        Userdetails:
            WinJS.Class.define(

            function () {
                // default constructor
            },

            {
                // membar function and  property
                // Add New user into customer DB.
                AddUser: function (collectionName, item) {
                    
                    zumo.insert(collectionName, item).then(success, error);
                },
                UpdateUser: function (collectionName, ID) {
                    zumo.update(collectionName, { id: ID, updatedAt: new Date() }).then(success, error);
                },
                GetCollectionData: function (collectionName) {
                    zumo.query(collectionName).then(function (result) { return result;   });
                }

            },
            {
                //static member function and property
                _userName: null,
                Username:
                {
                    set: function (value) { this._userName = value; },
                    get: function () { return this._userName; }
                },
                _userID: null,
                UserID:
            {
                set: function (value) { this._userID = value; },
                get: function () { return this._userID; }
            }
            })
    }); // End of user namespace;
    
})();