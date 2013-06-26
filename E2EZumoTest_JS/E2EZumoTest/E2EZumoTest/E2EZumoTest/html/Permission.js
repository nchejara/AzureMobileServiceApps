(function () {
    "use strict";
    function ready(element, options) {
    }
  
    function PermissionEveryOne() {
        Cleanup();
        if (TextValidation()) {
            MobileService = new Microsoft.WindowsAzure.MobileServices.MobileServiceClient(appURL);
            ZumoCRUD(10, "EveryOne", "Pass");
        }
    }
    function PermissionApplicationOnly() {
        Cleanup();
        if (TextValidation()) {
            MobileService = new Microsoft.WindowsAzure.MobileServices.MobileServiceClient(appURL, appKey);
            ZumoCRUD(10, "ApplicationOnly", "Pass");
        }
    }
    function PermissionAuthenticationOnly() {
        Cleanup();
        if (TextValidation()) {
            MobileService = new Microsoft.WindowsAzure.MobileServices.MobileServiceClient(appURL);
            ZumoCRUD(10, "AuthenticationUser", "Pass");
        }
    }
    function PermissionScript() {
        Cleanup();
        if (TextValidation()) {
            MobileService = new Microsoft.WindowsAzure.MobileServices.MobileServiceClient(appURL);
            ZumoCRUD(10, "Admin&Script", "Pass");
        }
    }

    function ZumoCRUD(Id, PermissionType, ExpectedResult) {

        CRUDOperation(Id + 1, PermissionType, ExpectedResult, "Insert");
        CRUDOperation(Id + 2, PermissionType, ExpectedResult, "Read");
        CRUDOperation(Id + 3, PermissionType, ExpectedResult, "Update");
        CRUDOperation(Id + 4, PermissionType, ExpectedResult, "Delete");

    }
    function Handle() {
        WinJS.xhr({
            url: appURL + "tables/Person",
            headers: { "x-zumo-master": "zOIZWaTSBvSzdXhMoCEfHvLtKvlrvK77" }
        }).done(function Complete(result) {
            return result;
        });

    }
   
    function CRUDOperation(Id, currentPermission, ExpectedResult, Operation) {

        var dataItems = { "Id": Id, "Name": currentPermission + " [ " + Operation + " ]", "Value": Operation, "GetValue": "", "ActualResult": "", "ExpectedResult": ExpectedResult, "Result": "" };
        var exceptionDataitem = { "Name": currentPermission, "ExceptionDetails": "" };
        switch (Operation) {

            case "Insert":
                if (currentPermission == "Admin&Script") {
                    var item = { name: "Naren Chejara", Kids: 0, Married: false, DateOfBirth: new Date(1986, 1, 14) };
                    MobileService.withFilter(Handle).getTable("Person").insert(item).then(
                        function (results) {
                            dataItems.GetValue = "Inserted";
                            PassFail("Pass", dataItems.ExpectedResult, dataItems)
                            allItems.push(dataItems);
                            BindData(allItems, allExceptionItem);
                        },
                        function (error) {
                            PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems)
                            exceptionDataitem.ExceptionDetails = error.responseText;
                            allExceptionItem.push(exceptionDataitem);
                            allItems.push(dataItems);
                            BindData(allItems, allExceptionItem);
                        }
                   );
                }
                else {
                    var item = { name: "Naren Chejara", Kids: 0, Married: false, DateOfBirth: new Date(1986, 1, 14) };
                    MobileService.getTable("Person").insert(item).then(
                        function (results) {
                            dataItems.GetValue = "Inserted";
                            PassFail("Pass", dataItems.ExpectedResult, dataItems)
                            allItems.push(dataItems);
                            BindData(allItems, allExceptionItem);
                        },
                        function (error) {
                            PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems)
                            exceptionDataitem.ExceptionDetails = error.responseText;
                            allExceptionItem.push(exceptionDataitem);
                            allItems.push(dataItems);
                            BindData(allItems, allExceptionItem);
                        }
                    );

                }

                break;
            case "Read":
                if (currentPermission == "Admin&Script") {
                }
                else {
                    MobileService.getTable("Person").select(name).read().then(
                        function (results) {
                            dataItems.GetValue = results.length + " Result Found";
                            PassFail("Pass", dataItems.ExpectedResult, dataItems)
                            allItems.push(dataItems);
                            BindData(allItems, allExceptionItem);
                        },
                        function (error) {
                            PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems)
                            exceptionDataitem.ExceptionDetails = error.responseText;
                            allExceptionItem.push(exceptionDataitem);
                            allItems.push(dataItems);
                            BindData(allItems, allExceptionItem);
                        }
                    );
                }
                break;

            case "Update":
                if (currentPermission == "Admin&Script") {
                }
                else {
                    MobileService.getTable("Person").where({ Name: "Naren Chejara" }).read().then(
                       function (results) {
                           MobileService.getTable("Person").update({ id: results[0].id, name: "Naren" }).then(
                               function (data) {
                                   dataItems.GetValue = "Id: " + results[0].id + " Updated";
                                   PassFail("Pass", dataItems.ExpectedResult, dataItems)
                                   allItems.push(dataItems);
                                   BindData(allItems, allExceptionItem);
                               },
                               function (error) {
                                   PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems)
                                   exceptionDataitem.ExceptionDetails = error.responseText;
                                   allExceptionItem.push(exceptionDataitem);
                                   allItems.push(dataItems);
                                   BindData(allItems, allExceptionItem);
                               }
                           );
                       },
                       function (error) {
                           PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems)
                           exceptionDataitem.ExceptionDetails = error.responseText;
                           allExceptionItem.push(exceptionDataitem);
                           allItems.push(dataItems);
                           BindData(allItems, allExceptionItem);
                       }
                    );

                }
                break;
            case "Delete":
                if (currentPermission == "Admin&Script") {
                }
                else {
                    MobileService.getTable("Person").where({ Name: "Naren Chejara" }).read().then(
                       function (results) { // get id
                           MobileService.getTable("Person").del({ id: results[0].id }).then(
                                function (data) {
                                    dataItems.GetValue = "Id: " + results[0].id + " Deleted";
                                    PassFail("Pass", dataItems.ExpectedResult, dataItems)
                                    allItems.push(dataItems);
                                    BindData(allItems, allExceptionItem);
                                },
                                function (error) {
                                    PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems)
                                    exceptionDataitem.ExceptionDetails = error.responseText;
                                    allExceptionItem.push(exceptionDataitem);
                                    allItems.push(dataItems);
                                    BindData(allItems, allExceptionItem);
                                }
                            );
                       },
                       function (error) {
                           PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems)
                           exceptionDataitem.ExceptionDetails = error.responseText;
                           allExceptionItem.push(exceptionDataitem);
                           allItems.push(dataItems);
                           BindData(allItems, allExceptionItem);
                       }
                    );

                }
                break;
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