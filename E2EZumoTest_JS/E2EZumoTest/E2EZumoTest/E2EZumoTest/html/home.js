(function () {
    "use strict";
    var allItems = [];
    var allExceptionItem = [];
    var MobileService;
    var appURL = "";
    var appKey = "";
    var appMasterKey = "";
    var redirectURL = "";
    var top = 50;
    var skip = 0;
    var flag = false;




    function ready(element, options) {

        //Click on RoundTripDataTypes button
        WinJS.Utilities.query("#btnRoundTripDataTypes").listen("click", RoundTrinDataTypes);
        WinJS.Utilities.query("#btnRunQuery").listen("click", RunQuery);

        //Permission
        WinJS.Utilities.query("#btnEveryOnePermission").listen("click", PermissionEveryOne);
        WinJS.Utilities.query("#btnApplicationOnly").listen("click", PermissionApplicationOnly);
        WinJS.Utilities.query("#btnAuthenticationOnly").listen("click", PermissionAuthenticationOnly);

        //multi authentication with web
        WinJS.Utilities.query('#btnAuthFacebook').listen("click", AuthFacebook);
        WinJS.Utilities.query('#btnAuthGoogle').listen("click", AuthGoogle);
        WinJS.Utilities.query('#btnAuthTwitter').listen("click", AuthTwitter);
        WinJS.Utilities.query('#btnAuthMicrosoft').listen("click", AuthMicrosoft);

        //multi authentication with Token
        WinJS.Utilities.query('#btnAuthMicrosoftToken').listen("click", AuthMicrosoftToken);
        WinJS.Utilities.query('#btnAuthFacebookToken').listen("click", AuthFacebookToken);
        WinJS.Utilities.query('#btnAuthTwitterToken').listen("click", AuthTwitterToken);
        WinJS.Utilities.query('#btnAuthGoogleToken').listen("click", AuthGoogleToken);
        WinJS.Utilities.query("#btnScript").listen("click", PermissionScript);

        //Dynamic schema
        WinJS.Utilities.query("#btnDynamicSchema").listen("click", btnDynamicSchema);

        // Script
        WinJS.Utilities.query("#btnScriptInsert").listen("click", ScriptInsert);
        WinJS.Utilities.query("#btnScriptUpdate").listen("click", ScriptUpdate);
        WinJS.Utilities.query("#btnScriptDelete").listen("click", ScriptDelete);
        WinJS.Utilities.query("#btnScriptRead").listen("click", ScriptRead);

        //Push Notification
        WinJS.Utilities.query("#btnPushInsert").listen("click", PushInsert);
        WinJS.Utilities.query("#btnPushUpdate").listen("click", PushUpdate);
        WinJS.Utilities.query("#btnPushDelete").listen("click", PushDelete);

        //Raw push notification
        WinJS.Utilities.query('#btnRawPushInsert').listen("click", RawPushInsert);

        //preset url
        document.getElementById("txtURL").value = "https://zumotestapp1030.azure-mobile.net/";
        document.getElementById("txtKey").value = "tZNHnEpeEdIpSwxgQwwqwmlqIytwhl19";
        document.getElementById("txtMasterKey").value = "";
    }
    // helper function
    function InsertDefaultData() {

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
                exceptionDataitem.ExceptionDetails = error.message;
                allExceptionItem.push(exceptionDataitem);
                allItems.push(dataItems);
                BindData(allItems, allExceptionItem);
            }
        );
        var item = { name: "Surendra Chejara", Kids: 2, Married: true, DateOfBirth: new Date(1983, 1, 26) };
        MobileService.getTable("Person").insert(item).then(
            function (results) {
                dataItems.GetValue = "Inserted";
                PassFail("Pass", dataItems.ExpectedResult, dataItems)
                allItems.push(dataItems);
                BindData(allItems, allExceptionItem);
            },
            function (error) {
                PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems)
                exceptionDataitem.ExceptionDetails = error.message;
                allExceptionItem.push(exceptionDataitem);
                allItems.push(dataItems);
                BindData(allItems, allExceptionItem);
            }
        );
    }
    function TextValidation() {
        Cleanup();
        appURL = document.getElementById("txtURL").value.trim();
        appKey = document.getElementById("txtKey").value.trim();
        redirectURL = document.getElementById("txtURL").value.trim().replace("windows-", "");

        if (appURL == "") {
            document.querySelector('#lblMsg').innerText = "[Hint]: Application URL is missing";
            return false;
        }
        if (appKey == "") {
            document.querySelector('#lblMsg').innerText = "[Hint]: Application Key is missing";
            return false;
        }

        return true;
    }
    function TextMsterKeyValidation() {
        Cleanup();
        appURL = document.getElementById("txtURL").value.trim();
        appKey = document.getElementById("txtKey").value.trim();
        redirectURL = document.getElementById("txtURL").value.trim().replace("windows-", "");
        appMasterKey = document.getElementById("txtMasterKey").value.trim();
        if (appURL == "") {
            document.querySelector('#lblMsg').innerText = "[Hint]: Application URL should not be empty!";
            return false;
        }
        if (appKey == "") {
            document.querySelector('#lblMsg').innerText = "[Hint]: Application Key should not be empty!";
            return false;
        }
        if (appMasterKey == "") {
            document.querySelector('#lblMsg').innerText = "[Hint]: Master Key should not be empty!";
            return false;
        }

        return true;
    }
    function Cleanup() {
        //clear message
        document.querySelector('#lblMsg').innerText = "";
        allItems = [];
        allExceptionItem = [];
        MobileService == null;
    }
    function PassFail(actual, expected, dataItems) {
        if (actual == expected) {
            dataItems.Result = "Pass";
            dataItems.ActualResult = actual;
            dataItems.ExpectedResult = expected;
        }
        else {
            dataItems.Result = "Fail";
            dataItems.ActualResult = actual;
            dataItems.ExpectedResult = expected;
        }
    }
    function BindData(allItems, allExceptionItem) {
        //Binding Items
        var DataList = new WinJS.Binding.List(allItems);
        var list = document.getElementById("Data").winControl;
        list.itemDataSource = DataList.dataSource;

        var DataList1 = new WinJS.Binding.List(allExceptionItem);
        var list1 = document.getElementById("Exception").winControl;
        list1.itemDataSource = DataList1.dataSource;
    }

    // Round Data type test scenario
    function RoundTrinDataTypes() {

        //var appURL = "http://test33.zumotcant.antares-test.windows-int.net/";//document.getElementById("txtURL").value.trim();
        //var appKey = "MMVZQDLfCNXJwYoppsgsskZtdNTcPC65"; //document.getElementById("txtKey").value.trim();
        if (TextValidation()) {
            MobileService = new Microsoft.WindowsAzure.MobileServices.MobileServiceClient(appURL, appKey);
            VerifyRoundTrinDataTypes(1, "String Null", "", "Failed by Exception", { String1: null }, 1);
            VerifyRoundTrinDataTypes(2, "Empty string", "", "Pass", { String1: "" }, 1);
            VerifyRoundTrinDataTypes(3, "simple string", "Naren", "Pass", { String1: "Naren" }, 1);
            var strlong = "Hi";
            for (var i = 0; i < 10000; i++)
                strlong = strlong + "*";
            VerifyRoundTrinDataTypes(4, "string (10000 char)", strlong, "Pass", { String1: strlong }, 1);

            //date scenarios

            VerifyRoundTrinDataTypes(5, "Date()", new Date(), "Pass", { Date1: new Date() }, 2);
            VerifyRoundTrinDataTypes(6, "Date(YYYY,mm,dd)", new Date(2012, 12, 12), "Pass", { Date1: new Date(2012, 12, 12) }, 2);
            VerifyRoundTrinDataTypes(7, "Date as string", "2012-05-03T00:06:00.638Z", "Pass", { Date1: "2012-05-03T00:06:00.638Z" }, 2);
            //verify(17, "Date(9,09,2012)", new Date(9, 09, 2012), "Pass", { Date1: new Date(9, 09, 2012) }, 2);
            //Number

            VerifyRoundTrinDataTypes(8, "Zero", 0, "Pass", { Number: 0 }, 3);
            var longnumber = 999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999;
            VerifyRoundTrinDataTypes(9, "Min Number", -longnumber, "Pass", { Number: -longnumber }, 3);
            VerifyRoundTrinDataTypes(10, "Max Number", longnumber, "Pass", { Number: longnumber }, 3);

            // Bool Scenarios

            VerifyRoundTrinDataTypes(11, "True", true, "Pass", { Bool1: true }, 4);
            VerifyRoundTrinDataTypes(12, "False", false, "Pass", { Bool1: false }, 4);
            //Just add setindex column to verify the column limit which was set as index
            VerifyRoundTrinDataTypes(13, "Add SetIndex column ", "Add Column", "Pass", { setindex: "SetIndex" }, 5);


        }
    }
    function VerifyRoundTrinDataTypes(Id, Name, Value, Expected, item, datatypenumber) {
        var dataitems = { "Id": Id, "Name": Name, "Value": Value, "GetValue": "", "ActualResult": "", "ExpectedResult": Expected, "Result": "" };
        var exceptionDataitem = { "Name": Name, "ExceptionDetails": "" };
        MobileService.getTable("TodoItem").insert(item).done
            (
                function (item) {

                    if (datatypenumber == 1) {
                        dataitems.GetValue = item.String1;
                        //for null value
                        if (item.String1 == null || item.String1 == "")
                            dataitems.ExpectedResult = "Pass";
                    }
                    else if (datatypenumber == 2) {
                        dataitems.GetValue = item.Date1;
                        //for null value
                        if (item.Date1 == null || item.Date1 == "")
                            dataitems.ExpectedResult = "Pass";
                    }
                    else if (datatypenumber == 3) {
                        dataitems.GetValue = item.Number;
                        //for null value
                        if (item.Number == null || item.Number == "")
                            dataitems.ExpectedResult = "Pass";
                    }
                    else if (datatypenumber == 4) {
                        dataitems.GetValue = item.Bool1;
                        //for null value
                        if (item.Bool1 == null || item.Bool1 == "")
                            dataitems.ExpectedResult = "Pass";
                    }

                    dataitems.ActualResult = "Pass";
                    if (dataitems.ExpectedResult == "Pass")
                        dataitems.Result = "Pass";
                    else
                        dataitems.Result = "Fail";


                    allItems.push(dataitems);

                    var DataList = new WinJS.Binding.List(allItems);
                    var list = document.getElementById("Data").winControl;
                    list.itemDataSource = DataList.dataSource;

                },
                function (error) {
                    //push data item details
                    dataitems.ActualResult = "Failed By Exception";
                    dataitems.Result = "Fail";
                    allItems.push(dataitems);

                    var DataList = new WinJS.Binding.List(allItems);
                    var list = document.getElementById("Data").winControl;
                    list.itemDataSource = DataList.dataSource;

                    // push exception details
                    exceptionDataitem.ExceptionDetails = error.message;
                    allExceptionItem.push(exceptionDataitem);

                    var DataList1 = new WinJS.Binding.List(allExceptionItem);
                    var list1 = document.getElementById("Exception").winControl;
                    list1.itemDataSource = DataList1.dataSource;
                }
            );

    }

    // Run Query scenario
    function RunQuery() {
        if (TextValidation()) {
            MobileService = new Microsoft.WindowsAzure.MobileServices.MobileServiceClient(appURL, appKey);
            VerifyQuery(1, "Get all null from String1.", "null", "Pass");
            VerifyQuery(2, "Get all true from bool1.", "bool", "Pass");
            VerifyQuery(3, "Get all > 0 from number.", "number", "Pass");
            VerifyQuery(4, "Get all Date(2012,12,12) from date1", "date", "Pass");
            VerifyQuery(5, "Get all top from table", "topskip", "Pass");
            top = 10; //set global variable
            VerifyQuery(6, "Get top 10 results whare name = 'Naren'", "wherewithtopskip", "Pass");
            top = 50; // reset global variable with default value.
            // Use int.MaxValue for skip
            skip = 2147483647;
            VerifyQuery(7, "Skip Max value of integer", "maxskip", "Failed by Exception");
            skip = 0;
            VerifyQuery(8, "Order by", "orderdby", "Pass");
            //Read all data
            VerifyQuery(9, "Read All Data", "readall", "Pass");
            // Projection
            VerifyQuery(10, "Read Projection", "projection", "Pass");
            // Complex Qurey
            VerifyQuery(11, "Complex Query", "query", "Pass");
            // Insert a date. Search for this record by id, read the date and search the record by date.
            VerifyQuery(12, "Read Date", "readdate", "Pass");
            //OData
            VerifyQuery(13, "Filter OData", "odata", "Pass");
            VerifyQuery(14, "String.Contains()", "contains", "Pass");
            VerifyQuery(15, "Del without passing id", "delWithoutId", "Failed by Exception");
            VerifyQuery(16, "Update without passing id", "updateWithoutId", "Failed by Exception");
            VerifyQuery(17, "Insert with passing id", "insertWithId", "Failed by Exception");
            VerifyQuery(18, "Query by id: 0", "queryById:0", "Pass");
            VerifyQuery(19, "Query by id: -1", "queryById:-1", "Pass");
            VerifyQuery(20, "Total Count", "totalCountProperty", "Pass");
            VerifyQuery(21, "Insert > 250 char", "Setindex", "Failed by Exception");
            //Current MSI not supported Lookup method if you have new MSI which sopport it then please uncomment this
            //VerifyQuery(22, "Lookup(2)", "lookup", "Pass");

        }
    }
    function VerifyQuery(Id, ScenarioName, InputString, Expected) {
        var dataItems = { "Id": Id, "Name": ScenarioName, "Value": "", "GetValue": "", "ActualResult": "", "ExpectedResult": Expected, "Result": "" };
        var exceptionDataitem = { "Name": ScenarioName, "ExceptionDetails": "" };
        if (InputString == "null") {
            MobileService.getTable("TodoItem").where({ string1: null }).read().then(
                function (results) {
                    var result = results;
                    dataItems.Value = "Null";
                    dataItems.GetValue = result.length + " results found";
                    PassFail("Pass", dataItems.ExpectedResult, dataItems);
                    allItems.push(dataItems);
                    BindData(allItems, allExceptionItem);

                },
                function (error) {
                    //push data item details
                    PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems);
                    exceptionDataitem.ExceptionDetails = error.request.response;
                    allExceptionItem.push(exceptionDataitem);
                    allExceptionItem.push(exceptionDataitem);
                    BindData(allItems, allExceptionItem);
                }
            );
        }
        if (InputString == "number") {

            MobileService.getTable("TodoItem").where(function () { return this.number > 0 }).read().then(
                function (results) {
                    var result = results;
                    dataItems.Value = "> 0";
                    dataItems.GetValue = result.length + " results found";
                    PassFail("Pass", dataItems.ExpectedResult, dataItems);
                    allItems.push(dataItems);
                    BindData(allItems, allExceptionItem);
                },
                function (error) {
                    //push data item details
                    PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems);
                    exceptionDataitem.ExceptionDetails = error.request.response;
                    allExceptionItem.push(exceptionDataitem);
                    allExceptionItem.push(exceptionDataitem);
                    BindData(allItems, allExceptionItem);
                }
           );

        }
        if (InputString == "bool") {
            MobileService.getTable("TodoItem").where({ bool1: true }).read().then(
                function (results) {
                    var result = results;
                    dataItems.Value = "True";
                    dataItems.GetValue = result.length + " results found";
                    PassFail("Pass", dataItems.ExpectedResult, dataItems);
                    allItems.push(dataItems);
                    BindData(allItems, allExceptionItem);
                },
                function (error) {
                    //push data item details
                    PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems);
                    exceptionDataitem.ExceptionDetails = error.request.response;
                    allExceptionItem.push(exceptionDataitem);
                    allExceptionItem.push(exceptionDataitem);
                    BindData(allItems, allExceptionItem);
                }
           );
        }
        if (InputString == "date") {
            MobileService.getTable("TodoItem").where({ date1: new Date(2012, 12, 12) }).read().then(
                function (results) {
                    var result = results;
                    dataItems.Value = "Date(2012,12,12)";
                    dataItems.GetValue = result.length + " results found";
                    PassFail("Pass", dataItems.ExpectedResult, dataItems);
                    allItems.push(dataItems);
                    BindData(allItems, allExceptionItem);
                },
                function (error) {
                    //push data item details
                    PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems);
                    exceptionDataitem.ExceptionDetails = error.request.response;
                    allExceptionItem.push(exceptionDataitem);
                    allItems.push(dataItems);
                    BindData(allItems, allExceptionItem);
                }
           );
        }
        if (InputString == "topskip") {
            MobileService.getTable("TodoItem").take(top).skip(skip).read().then(
                function (results) {
                    var result = results;
                    dataItems.Value = "Top and skip default";
                    dataItems.GetValue = result.length + " results found";
                    PassFail("Pass", dataItems.ExpectedResult, dataItems);
                    allItems.push(dataItems);
                    BindData(allItems, allExceptionItem);
                },
                function (error) {
                    //push data item details
                    PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems);
                    exceptionDataitem.ExceptionDetails = error.request.response;
                    allExceptionItem.push(exceptionDataitem);
                    allItems.push(dataItems);
                    BindData(allItems, allExceptionItem);
                }
           );


        }
        if (InputString == "wherewithtopskip") {
            MobileService.getTable("TodoItem").where({ string1: "Naren" }).take(top).skip(skip).read().then(
                function (results) {
                    var result = results;
                    dataItems.Value = "Naren";
                    dataItems.GetValue = result.length + " results found";
                    PassFail("Pass", dataItems.ExpectedResult, dataItems);
                    allItems.push(dataItems);
                    BindData(allItems, allExceptionItem);
                },
                function (error) {
                    //push data item details
                    PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems);
                    exceptionDataitem.ExceptionDetails = error.request.response;
                    allExceptionItem.push(exceptionDataitem);
                    allItems.push(dataItems);
                    BindData(allItems, allExceptionItem);
                }
           );
        }
        if (InputString == "maxskip") {
            MobileService.getTable("TodoItem").take(top).skip(skip).read().then(
                function (results) {
                    var result = results;
                    dataItems.Value = "int.MaxValue";
                    dataItems.GetValue = result.length + " results found";
                    PassFail("Pass", dataItems.ExpectedResult, dataItems);
                    allItems.push(dataItems);
                    BindData(allItems, allExceptionItem);
                },
                function (error) {
                    //push data item details
                    PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems);
                    exceptionDataitem.ExceptionDetails = error.request.response;
                    allExceptionItem.push(exceptionDataitem);
                    allItems.push(dataItems);
                    BindData(allItems, allExceptionItem);
                }
            );
        }
        if (InputString == "orderdby") {
            MobileService.getTable("TodoItem").orderBy("id").read().then(
                function (results) {
                    var result = results;
                    dataItems.Value = "Orderdby";
                    dataItems.GetValue = result.length + " results found";
                    PassFail("Pass", dataItems.ExpectedResult, dataItems);
                    allItems.push(dataItems);
                    BindData(allItems, allExceptionItem);
                },
                function (error) {
                    //push data item details
                    PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems);
                    exceptionDataitem.ExceptionDetails = error.request.response;
                    allExceptionItem.push(exceptionDataitem);
                    allItems.push(dataItems);
                    BindData(allItems, allExceptionItem);
                }
            );
        }
        if (InputString == "readall") {
            MobileService.getTable("TodoItem").read().then(
                function (results) {
                    var result = results;
                    dataItems.Value = "Read All";
                    dataItems.GetValue = result.length + " results found";
                    PassFail("Pass", dataItems.ExpectedResult, dataItems);
                    allItems.push(dataItems);
                    BindData(allItems, allExceptionItem);
                },
                function (error) {
                    //push data item details
                    PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems);
                    exceptionDataitem.ExceptionDetails = error.request.response;
                    allExceptionItem.push(exceptionDataitem);
                    allItems.push(dataItems);
                    BindData(allItems, allExceptionItem);
                }
          );
        }
        if (InputString == "projection") {
            MobileService.getTable("TodoItem").select('id,String1,Bool1,Date1,Number').read().then(
                 function (results) {
                     var result = results;
                     dataItems.Value = "Read Projection";
                     dataItems.GetValue = result.length + " results found";
                     PassFail("Pass", dataItems.ExpectedResult, dataItems);
                     allItems.push(dataItems);
                     BindData(allItems, allExceptionItem);
                 },
                function (error) {
                    //push data item details
                    PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems);
                    exceptionDataitem.ExceptionDetails = error.request.response;
                    allExceptionItem.push(exceptionDataitem);
                    allItems.push(dataItems);
                    BindData(allItems, allExceptionItem);
                }
          );
        }
        if (InputString == "query") {
            MobileService.getTable("TodoItem").where(function (Text, Text1) { return this.id != Text && this.Bool1 == Text1; }, 3, null)
                .take(1).skip(1).orderBy("id").orderByDescending("String1").read().done(
                function (results) {
                    var result = results;
                    dataItems.Value = "Read Projection";
                    dataItems.GetValue = result.length + " results found";
                    //if (result[0].id == 11) {
                    PassFail("Pass", dataItems.ExpectedResult, dataItems);
                    allItems.push(dataItems);
                    BindData(allItems, allExceptionItem);
                    //}
                    //else {
                    //    PassFail("Fail", dataItems.ExpectedResult, dataItems);
                    //    allItems.push(dataItems);
                    //    BindData(allItems, allExceptionItem);
                    //}
                },
                function (error) {
                    //push data item details
                    PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems);
                    exceptionDataitem.ExceptionDetails = error.request.response;
                    allExceptionItem.push(exceptionDataitem);
                    allItems.push(dataItems);
                    BindData(allItems, allExceptionItem);
                }

            );
        }
        if (InputString == "readdate") {
            MobileService.getTable("TodoItem").where({ id: 4 }).read().done(
                function (results) {
                    MobileService.getTable("TodoItem").where({ Date1: results[0].Date1 }).read().done(
                        function (results) {
                            var result = results;
                            dataItems.Value = "Read Projection";
                            dataItems.GetValue = result.length + " results found";
                            //if (result[0].id == 4) {
                            PassFail("Pass", dataItems.ExpectedResult, dataItems);
                            allItems.push(dataItems);
                            BindData(allItems, allExceptionItem);
                            //}
                            //else {
                            //    PassFail("Fail", dataItems.ExpectedResult, dataItems);
                            //    allItems.push(dataItems);
                            //    BindData(allItems, allExceptionItem);
                            //}
                        },
                       function (error) {
                           //push data item details
                           PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems);
                           exceptionDataitem.ExceptionDetails = error.message;
                           allExceptionItem.push(exceptionDataitem);
                           allItems.push(dataItems);
                           BindData(allItems, allExceptionItem);
                       }
                    );
                },
                function (error) {
                    //push data item details
                    PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems);
                    exceptionDataitem.ExceptionDetails = error.request.response;
                    allExceptionItem.push(exceptionDataitem);
                    allItems.push(dataItems);
                    BindData(allItems, allExceptionItem);
                }
            );
        }
        if (InputString == "odata") {
            MobileService.getTable("TodoItem").read("$filter=(id gt 10)").done(
                function (results) {
                    var result = results;
                    dataItems.Value = "Read Data by filter";
                    dataItems.GetValue = result.length + " results found";
                    PassFail("Pass", dataItems.ExpectedResult, dataItems);
                    allItems.push(dataItems);
                    BindData(allItems, allExceptionItem);
                },
                function (error) {
                    //push data item details
                    PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems);
                    exceptionDataitem.ExceptionDetails = error.request.response;
                    allExceptionItem.push(exceptionDataitem);
                    allItems.push(dataItems);
                    BindData(allItems, allExceptionItem);
                }
            );
        }
        if (InputString == "contains") {
            MobileService.getTable("TodoItem").where({ string1: "Naren".substring(2, 4) }).read().then(
                function (results) {
                    var result = results;
                    dataItems.Value = "String.Contains()";
                    dataItems.GetValue = result.length + " results found";
                    PassFail("Pass", dataItems.ExpectedResult, dataItems);
                    allItems.push(dataItems);
                    BindData(allItems, allExceptionItem);

                },
                function (error) {
                    //push data item details
                    PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems);
                    exceptionDataitem.ExceptionDetails = error.request.response;
                    allExceptionItem.push(exceptionDataitem);
                    allItems.push(dataItems);
                    BindData(allItems, allExceptionItem);
                });
        }
        if (InputString == "delWithoutId") {
            MobileService.getTable("TodoItem").del({ bool1: true }).then(
                function (results) {
                    var result = results;
                    dataItems.Value = "Del Without passing Id";
                    dataItems.GetValue = result.length + " results found";
                    PassFail("Pass", dataItems.ExpectedResult, dataItems);
                    allItems.push(dataItems);
                    BindData(allItems, allExceptionItem);

                },
                function (error) {
                    //push data item details
                    PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems);
                    exceptionDataitem.ExceptionDetails = error.message;
                    allExceptionItem.push(exceptionDataitem);
                    allItems.push(dataItems);
                    BindData(allItems, allExceptionItem);
                });
        }
        if (InputString == "updateWithoutId") {
            MobileService.getTable("TodoItem").update({ bool1: true }).then(
                function (results) {
                    var result = results;
                    dataItems.Value = "Update Without passing Id";
                    dataItems.GetValue = result.length + " results found";
                    PassFail("Pass", dataItems.ExpectedResult, dataItems);
                    allItems.push(dataItems);
                    BindData(allItems, allExceptionItem);

                },
                function (error) {
                    //push data item details
                    PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems);
                    exceptionDataitem.ExceptionDetails = error.message;
                    allExceptionItem.push(exceptionDataitem);
                    allItems.push(dataItems);
                    BindData(allItems, allExceptionItem);
                });
        }
        if (InputString == "insertWithId") {
            MobileService.getTable("TodoItem").insert({ id: 15, bool1: true, string1: "Naren" }).then(
                function (results) {
                    var result = results;
                    dataItems.Value = "Del Without passing Id";
                    dataItems.GetValue = result.length + " results found";
                    PassFail("Pass", dataItems.ExpectedResult, dataItems);
                    allItems.push(dataItems);
                    BindData(allItems, allExceptionItem);

                },
                function (error) {
                    //push data item details
                    PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems);
                    exceptionDataitem.ExceptionDetails = error.message;
                    allExceptionItem.push(exceptionDataitem);
                    allItems.push(dataItems);
                    BindData(allItems, allExceptionItem);
                });
        }
        if (InputString == "queryById:0") {
            MobileService.getTable("TodoItem").where({ id: 0 }).read().then(
                function (results) {
                    var result = results;
                    dataItems.Value = "Query by id: 0";
                    dataItems.GetValue = result.length + " results found";
                    PassFail("Pass", dataItems.ExpectedResult, dataItems);
                    allItems.push(dataItems);
                    BindData(allItems, allExceptionItem);

                },
                function (error) { //[ToDo]: Pending to verify Exception status code
                    //push data item details
                    PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems);
                    exceptionDataitem.ExceptionDetails = error.message;
                    allExceptionItem.push(exceptionDataitem);
                    allItems.push(dataItems);
                    BindData(allItems, allExceptionItem);
                });
        }
        if (InputString == "queryById:-1") {
            MobileService.getTable("TodoItem").where({ id: -1 }).read().then(
                function (results) {
                    var result = results;
                    dataItems.Value = "Query by id: -1";
                    dataItems.GetValue = result.length + " results found";
                    PassFail("Pass", dataItems.ExpectedResult, dataItems);
                    allItems.push(dataItems);
                    BindData(allItems, allExceptionItem);

                },
                function (error) {//[ToDo]: Pending to verify Exception status code
                    //push data item details
                    PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems);
                    exceptionDataitem.ExceptionDetails = error.message;
                    allExceptionItem.push(exceptionDataitem);
                    allItems.push(dataItems);
                    BindData(allItems, allExceptionItem);
                });
        }
        if (InputString == "totalCountProperty") {
            MobileService.getTable("TodoItem").take(5).includeTotalCount().read().then(
               function (results) {
                   var result = results;
                   dataItems.Value = "Include Total Count";
                   dataItems.GetValue = result.length + " results found";
                   PassFail("Pass", dataItems.ExpectedResult, dataItems);
                   allItems.push(dataItems);
                   BindData(allItems, allExceptionItem);

               },
               function (error) {
                   //push data item details
                   PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems);
                   exceptionDataitem.ExceptionDetails = error.message;
                   allExceptionItem.push(exceptionDataitem);
                   allItems.push(dataItems);
                   BindData(allItems, allExceptionItem);
               });
        }
        if (InputString == "Setindex") {
            var str450 = "";
            for (var i = 0; i <= 450; i++)
                str450 += "*";
            MobileService.getTable("TodoItem").insert({ setindex: str450 }).done(
                function (results) {
                    var result = results;
                    dataItems.Value = "morethan 450 char Inserted";
                    dataItems.GetValue = result.setindex;
                    PassFail("Pass", dataItems.ExpectedResult, dataItems);
                    allItems.push(dataItems);
                    BindData(allItems, allExceptionItem);

                },
               function (error) {
                   //push data item details
                   if (error.request.status == 400) {
                       exceptionDataitem.ExceptionDetails = error.request.response.toString();
                   }
                   else {
                       dataItems.ExpectedResult = "Fail";
                       exceptionDataitem.ExceptionDetails = error.request.response.toString();
                   }
                   PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems);
                   allExceptionItem.push(exceptionDataitem);
                   allItems.push(dataItems);
                   BindData(allItems, allExceptionItem);
               });
        }
        //Lookup property is in under development ...
        if (InputString == "lookup") {
            MobileService.getTable("TodoItem").lookup(2).then(
                 function (results) {
                     if (results.id == 2) {
                         var result = results;
                         dataItems.Value = "Look up Method";
                         dataItems.GetValue = "id: " + result.id + " found";
                         PassFail("Pass", dataItems.ExpectedResult, dataItems);
                         allItems.push(dataItems);
                         BindData(allItems, allExceptionItem);
                     }
                     else {
                         //push data item details
                         PassFail("Failed", dataItems.ExpectedResult, dataItems);
                         exceptionDataitem.ExceptionDetails = error.message;
                         allExceptionItem.push(exceptionDataitem);
                         allItems.push(dataItems);
                         BindData(allItems, allExceptionItem);
                     }
                 },
               function (error) {
                   //push data item details
                   PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems);
                   exceptionDataitem.ExceptionDetails = error.message;
                   allExceptionItem.push(exceptionDataitem);
                   allItems.push(dataItems);
                   BindData(allItems, allExceptionItem);
               });
        }

    }

    // Permission scenario
    function PermissionEveryOne() {
        if (TextValidation()) {
            MobileService = new Microsoft.WindowsAzure.MobileServices.MobileServiceClient(appURL);
            ZumoCRUD(10, "EveryOne", "Pass", "PermissionPublic");
        }
    }
    function PermissionApplicationOnly() {
        if (TextValidation()) {
            MobileService = new Microsoft.WindowsAzure.MobileServices.MobileServiceClient(appURL, appKey);
            ZumoCRUD(10, "ApplicationOnly", "Pass", "PermissionApplication")

        }
    }
    function PermissionAuthenticationOnly() {
        if (TextValidation()) {
            MobileService = new Microsoft.WindowsAzure.MobileServices.MobileServiceClient(appURL);
            //LiveLogin().done();

        }
    }

    // Multi authentication with web based
    function AuthFacebook() {
        if (TextValidation()) {
            MobileService = new Microsoft.WindowsAzure.MobileServices.MobileServiceClient(appURL, appKey);
            AuthenticationPermissionScenario("Facebook");
        }
    }
    function AuthGoogle() {
        if (TextValidation()) {
            MobileService = new Microsoft.WindowsAzure.MobileServices.MobileServiceClient(appURL);
            AuthenticationPermissionScenario("Google");
        }
    }
    function AuthMicrosoft() {
        if (TextValidation()) {
            MobileService = new Microsoft.WindowsAzure.MobileServices.MobileServiceClient(appURL);
            AuthenticationPermissionScenario("MicrosoftAccount");
        }
    }
    function AuthTwitter() {
        if (TextValidation()) {
            MobileService = new Microsoft.WindowsAzure.MobileServices.MobileServiceClient(appURL);
            AuthenticationPermissionScenario("Twitter");
        }
    }
    function AuthenticationPermissionScenario(provider) {

        if (provider == "Facebook") {
            MobileService.login(provider).done(
                function (user) {
                    var result = user.userId;
                    ZumoCRUD(10, "AuthenticationUser", "Pass", "PermissionUser");
                },
                function (error) {
                });
        }
        if (provider == "Google") {
            MobileService.login(provider).done(
                function (user) {
                    var result = user.userId;
                    ZumoCRUD(10, "AuthenticationUser", "Pass", "PermissionUser");
                },
                function (error) {
                });
        }
        if (provider == "Twitter") {
            MobileService.login(provider).done(
                function (user) {
                    var result = user.userId;
                    ZumoCRUD(10, "AuthenticationUser", "Pass", "PermissionUser");

                },
                function (error) {
                });
        }
        if (provider == "MicrosoftAccount") {
            // LiveLogin().done();
            MobileService.login(provider).done(
                function (user) {
                    var result = user.userId;
                    ZumoCRUD(10, "AuthenticationUser", "Pass", "PermissionUser");

                },
                function (error) {
                });
        }
    }

    // Multi authentication with token
    function AuthMicrosoftToken() {
        if (TextValidation()) {
            MobileService = new Microsoft.WindowsAzure.MobileServices.MobileServiceClient(appURL);
            AuthenticationTokenPermissionScenario("MicrosoftAccount");
        }
    }
    function AuthFacebookToken() {
        if (TextValidation()) {
            MobileService = new Microsoft.WindowsAzure.MobileServices.MobileServiceClient(appURL);
            AuthenticationTokenPermissionScenario("Facebook");
        }
    }
    function AuthTwitterToken() {
        if (TextValidation()) {
            MobileService = new Microsoft.WindowsAzure.MobileServices.MobileServiceClient(appURL);
            AuthenticationTokenPermissionScenario("Twitter");
        }
    }
    function AuthGoogleToken() {
        if (TextValidation()) {
            MobileService = new Microsoft.WindowsAzure.MobileServices.MobileServiceClient(appURL);
            AuthenticationTokenPermissionScenario("Google");
        }
    }
    function AuthenticationTokenPermissionScenario(provider) {
        if (provider == "MicrosoftAccount") {
            //MobileService.login(provider).done(

            LiveLogin().done(
                function (user) {
                    var result = user.userId;
                    //insert access token into in UserAccess table
                    InsertData(user, provider);
                },
                function (error) {
                    document.querySelector('#lblMsg').innerText = error.message;
                });
        }
        if (provider == "Facebook") {
            MobileService.login(provider).done(
                function (user) {
                    var result = user.userId;
                    //insert access token into in UserAccess table
                    InsertData(user, provider);
                },
                function (error) {
                    document.querySelector('#lblMsg').innerText = error.message;
                });
        }
        if (provider == "Google") {
            MobileService.login(provider).done(
                function (user) {
                    var result = user.userId;
                    //insert access token into in UserAccess table
                    InsertData(user, provider);
                },
                function (error) {
                    document.querySelector('#lblMsg').innerText = error.message;
                });
        }
        if (provider == "Twitter") {
            MobileService.login(provider).done(
                function (user) {
                    var result = user.userId;
                    //insert access token into in UserAccess table
                    InsertData(user, provider);
                },
                function (error) {
                    document.querySelector('#lblMsg').innerText = error.message;
                });
        }

    }

    function InsertData(user, provider) {
        MobileService.getTable("userAccess").insert({ userId: user.userId }).then(
            function (user) {
                MobileService.logout();
                MobileService.login(provider, { access_token: user.identities }).done(
                    function (success) {
                        ZumoCRUD(10, "AuthenticationUser", "Pass", "PermissionUser");
                    },
                    function (error) {
                        document.querySelector('#lblMsg').innerText = error.message;
                    });
            });
    }

    function PermissionScript() {
        if (TextMsterKeyValidation()) {
            MobileService = new Microsoft.WindowsAzure.MobileServices.MobileServiceClient(appURL);
            ZumoCRUD(10, "Admin&Script", "Pass", "PermissionAdmin");

        }
    }
    function LiveLogin() {
        return new WinJS.Promise(function (complete) {
            WL.Event.subscribe("auth.login", function (response) {
                WL.api({
                    path: "me",
                    method: "get"
                },
                    function (wlUser) {
                        var str = wlUser.name;
                        ZumoCRUD(10, "AuthenticationUser", "Pass", "PermissionUser");
                    },
                    function (error) {
                        debugger;
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
        });
    }

    function ZumoCRUD(Id, PermissionType, ExpectedResult, tableName) {
        CRUDOperation(Id, PermissionType, ExpectedResult, "Insert", tableName);

    }
    function AddMasterKeyFilter(MaterKey) {
        var servicefilter = function (req, next, callback) {
            req.headers = { "x-zumo-master": MaterKey };
            next(req, function (err, rsp) {
                callback(err, rsp);
            });
        }
        return servicefilter;
    }
    function CRUDOperation(Id, currentPermission, ExpectedResult, Operation, tableName) {

        var dataItems = { "Id": Id, "Name": currentPermission + " [ " + Operation + " ]", "Value": Operation, "GetValue": "", "ActualResult": "", "ExpectedResult": ExpectedResult, "Result": "" };
        var exceptionDataitem = { "Name": currentPermission, "ExceptionDetails": "" };

        switch (Operation) {

            case "Insert":
                if (currentPermission == "Admin&Script") {
                    // add additional record for update and delete, so we can use different id for update and delete
                    var item = { name: "Surendra Chejara", Kids: 2, Married: true, DateOfBirth: new Date(1983, 1, 14) };
                    MobileService.withFilter(AddMasterKeyFilter(appMasterKey)).getTable(tableName).insert(item).then();

                    item = { name: "Naren Chejara", Kids: 0, Married: false, DateOfBirth: new Date(1986, 1, 14) };
                    MobileService.withFilter(AddMasterKeyFilter(appMasterKey)).getTable(tableName).insert(item).then(
                        function (results) {
                            dataItems.GetValue = "Inserted";
                            PassFail("Pass", dataItems.ExpectedResult, dataItems)
                            allItems.push(dataItems);
                            BindData(allItems, allExceptionItem);
                            CRUDOperation(Id + 1, currentPermission, ExpectedResult, "Read", tableName);
                        },
                        function (error) {
                            PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems)
                            exceptionDataitem.ExceptionDetails = error.request.response;
                            allExceptionItem.push(exceptionDataitem);
                            allItems.push(dataItems);
                            BindData(allItems, allExceptionItem);

                            CRUDOperation(Id + 1, currentPermission, ExpectedResult, "Read", tableName);
                        }
                    );
                }
                else {
                    // add additional record for update and delete, so we can use different id for update and delete
                    var item = { name: "Surendra Chejara", Kids: 2, Married: true, DateOfBirth: new Date(1983, 1, 14) };
                    MobileService.getTable(tableName).insert(item).then();

                    item = { name: "Naren Chejara", Kids: 0, Married: false, DateOfBirth: new Date(1986, 1, 14) };
                    MobileService.getTable(tableName).insert(item).then(
                        function (results) {
                            dataItems.GetValue = "Inserted";
                            PassFail("Pass", dataItems.ExpectedResult, dataItems)
                            allItems.push(dataItems);
                            BindData(allItems, allExceptionItem);
                            CRUDOperation(Id + 1, currentPermission, ExpectedResult, "Read", tableName);
                        },
                        function (error) {
                            PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems)
                            exceptionDataitem.ExceptionDetails = error.request.response;
                            allExceptionItem.push(exceptionDataitem);
                            allItems.push(dataItems);
                            BindData(allItems, allExceptionItem);

                            CRUDOperation(Id + 1, currentPermission, ExpectedResult, "Read", tableName);
                        }
                    );

                }

                break;
            case "Read":
                if (currentPermission == "Admin&Script") {
                    MobileService.withFilter(AddMasterKeyFilter(appMasterKey)).getTable(tableName).select(name).read().then(
                        function (results) {
                            dataItems.GetValue = results.length + " Result Found";
                            PassFail("Pass", dataItems.ExpectedResult, dataItems)
                            allItems.push(dataItems);
                            BindData(allItems, allExceptionItem);
                            CRUDOperation(Id + 1, currentPermission, ExpectedResult, "Update", tableName);
                        },
                        function (error) {
                            PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems)
                            exceptionDataitem.ExceptionDetails = error.request.response;
                            allExceptionItem.push(exceptionDataitem);
                            allItems.push(dataItems);
                            BindData(allItems, allExceptionItem);
                            CRUDOperation(Id + 1, currentPermission, ExpectedResult, "Update", tableName);
                        }
                    );
                }
                else {
                    MobileService.getTable(tableName).select(name).read().then(
                        function (results) {
                            dataItems.GetValue = results.length + " Result Found";
                            PassFail("Pass", dataItems.ExpectedResult, dataItems)
                            allItems.push(dataItems);
                            BindData(allItems, allExceptionItem);
                            CRUDOperation(Id + 1, currentPermission, ExpectedResult, "Update", tableName);
                        },
                        function (error) {
                            PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems)
                            exceptionDataitem.ExceptionDetails = error.request.response;
                            allExceptionItem.push(exceptionDataitem);
                            allItems.push(dataItems);
                            BindData(allItems, allExceptionItem);
                            CRUDOperation(Id + 1, currentPermission, ExpectedResult, "Update", tableName);
                        }
                    );
                }
                break;

            case "Update":
                if (currentPermission == "Admin&Script") {
                    MobileService.withFilter(AddMasterKeyFilter(appMasterKey)).getTable(tableName).where({ Name: "Naren Chejara" }).read().then(
                        function (results) {
                            MobileService.withFilter(AddMasterKeyFilter(appMasterKey)).getTable(tableName).update({ id: results[0].id, name: "Naren" }).then(
                               function (data) {
                                   dataItems.GetValue = "Id: " + results[0].id + " Updated";
                                   PassFail("Pass", dataItems.ExpectedResult, dataItems)
                                   allItems.push(dataItems);
                                   BindData(allItems, allExceptionItem);
                                   CRUDOperation(Id + 1, currentPermission, ExpectedResult, "Delete", tableName)
                               },
                               function (error) {
                                   PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems)
                                   exceptionDataitem.ExceptionDetails = error.request.response;
                                   allExceptionItem.push(exceptionDataitem);
                                   allItems.push(dataItems);
                                   BindData(allItems, allExceptionItem);
                                   CRUDOperation(Id + 1, currentPermission, ExpectedResult, "Delete", tableName)
                               }
                           );
                        },
                        function (error) {
                            PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems)
                            exceptionDataitem.ExceptionDetails = error.request.response;
                            allExceptionItem.push(exceptionDataitem);
                            allItems.push(dataItems);
                            BindData(allItems, allExceptionItem);
                            CRUDOperation(Id + 4, currentPermission, ExpectedResult, "Delete", tableName)
                        }
                    );
                }
                else {
                    MobileService.getTable(tableName).where({ Name: "Naren Chejara" }).read().then(
                       function (results) {
                           MobileService.getTable(tableName).update({ id: results[0].id, name: "Naren" }).then(
                               function (data) {
                                   dataItems.GetValue = "Id: " + results[0].id + " Updated";
                                   PassFail("Pass", dataItems.ExpectedResult, dataItems)
                                   allItems.push(dataItems);
                                   BindData(allItems, allExceptionItem);
                                   CRUDOperation(Id + 1, currentPermission, ExpectedResult, "Delete", tableName)
                               },
                               function (error) {
                                   PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems)
                                   exceptionDataitem.ExceptionDetails = error.request.response;
                                   allExceptionItem.push(exceptionDataitem);
                                   allItems.push(dataItems);
                                   BindData(allItems, allExceptionItem);
                                   CRUDOperation(Id + 1, currentPermission, ExpectedResult, "Delete", tableName)
                               }
                           );
                       },
                       function (error) {
                           PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems)
                           exceptionDataitem.ExceptionDetails = error.request.response;
                           allExceptionItem.push(exceptionDataitem);
                           allItems.push(dataItems);
                           BindData(allItems, allExceptionItem);
                           CRUDOperation(Id + 4, currentPermission, ExpectedResult, "Delete", tableName)
                       }
                    );

                }
                break;
            case "Delete":
                if (currentPermission == "Admin&Script") {
                    MobileService.withFilter(AddMasterKeyFilter(appMasterKey)).getTable(tableName).where({ Name: "Surendra Chejara" }).read().then(
                         function (results) { // get id
                             MobileService.withFilter(AddMasterKeyFilter(appMasterKey)).getTable(tableName).del({ id: results[0].id }).then(
                                  function (data) {
                                      dataItems.GetValue = "Id: " + results[0].id + " Deleted";
                                      PassFail("Pass", dataItems.ExpectedResult, dataItems)
                                      allItems.push(dataItems);
                                      BindData(allItems, allExceptionItem);
                                      MobileService = new Microsoft.WindowsAzure.MobileServices.MobileServiceClient(appURL);
                                      NegativeCRUDOperation(20, "EveryOne", "Pass", "Insert", tableName);
                                  },
                                  function (error) {
                                      PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems)
                                      exceptionDataitem.ExceptionDetails = error.request.response;
                                      allExceptionItem.push(exceptionDataitem);
                                      allItems.push(dataItems);
                                      BindData(allItems, allExceptionItem);
                                      MobileService = new Microsoft.WindowsAzure.MobileServices.MobileServiceClient(appURL);
                                      NegativeCRUDOperation(20, "EveryOne", "Pass", "Insert", tableName);
                                  }
                              );
                         },
                       function (error) {
                           PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems)
                           exceptionDataitem.ExceptionDetails = error.request.response;
                           allExceptionItem.push(exceptionDataitem);
                           allItems.push(dataItems);
                           BindData(allItems, allExceptionItem);
                           MobileService = new Microsoft.WindowsAzure.MobileServices.MobileServiceClient(appURL);
                           NegativeCRUDOperation(20, "EveryOne", "Pass", "Insert", tableName);
                       }
                     );

                }
                else {
                    MobileService.getTable(tableName).where({ Name: "Surendra Chejara" }).read().then(
                       function (results) { // get id
                           MobileService.getTable(tableName).del({ id: results[0].id }).then(
                                function (data) {
                                    dataItems.GetValue = "Id: " + results[0].id + " Deleted";
                                    PassFail("Pass", dataItems.ExpectedResult, dataItems)
                                    allItems.push(dataItems);
                                    BindData(allItems, allExceptionItem);
                                    if (currentPermission != "EveryOne") { // Try to perform CURD operation with other permission which is not set in portal
                                        MobileService = new Microsoft.WindowsAzure.MobileServices.MobileServiceClient(appURL);
                                        NegativeCRUDOperation(20, "EveryOne", "Pass", "Insert", tableName);
                                    }
                                },
                                function (error) {
                                    PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems)
                                    exceptionDataitem.ExceptionDetails = error.request.response;
                                    allExceptionItem.push(exceptionDataitem);
                                    allItems.push(dataItems);
                                    BindData(allItems, allExceptionItem);
                                    if (currentPermission != "EveryOne") {// Try to perform CURD operation with other permission which is not set in portal
                                        MobileService = new Microsoft.WindowsAzure.MobileServices.MobileServiceClient(appURL);
                                        NegativeCRUDOperation(20, "EveryOne", "Pass", "Insert", tableName);
                                    }
                                }
                            );
                       },
                       function (error) {
                           PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems)
                           exceptionDataitem.ExceptionDetails = error.request.response;
                           allExceptionItem.push(exceptionDataitem);
                           allItems.push(dataItems);
                           BindData(allItems, allExceptionItem);
                           if (currentPermission != "EveryOne") {// Try to perform CURD operation with other permission which is not set in portal
                               MobileService = new Microsoft.WindowsAzure.MobileServices.MobileServiceClient(appURL);
                               NegativeCRUDOperation(20, "EveryOne", "Pass", "Insert", tableName);
                           }
                       }
                    );

                }
                break;
        }


    }

    //Use check other permission which is not set in portal
    function NegativeCRUDOperation(Id, currentPermission, ExpectedResult, Operation, tableName) {

        var dataItems = { "Id": Id, "Name": currentPermission + " [ " + Operation + " ]", "Value": Operation, "GetValue": "", "ActualResult": "", "ExpectedResult": ExpectedResult, "Result": "" };
        var exceptionDataitem = { "Name": currentPermission, "ExceptionDetails": "" };

        switch (Operation) {

            case "Insert":
                if (currentPermission == "Admin&Script") {

                    var item = { name: "Naren Chejara", Kids: 0, Married: false, DateOfBirth: new Date(1986, 1, 14) };
                    MobileService.withFilter(AddMasterKeyFilter(appMasterKey)).getTable(tableName).insert(item).then(
                        function (results) {
                            dataItems.GetValue = "Inserted";
                            PassFail("Pass", dataItems.ExpectedResult, dataItems)
                            allItems.push(dataItems);
                            BindData(allItems, allExceptionItem);
                            NegativeCRUDOperation(Id + 1, currentPermission, ExpectedResult, "Read", tableName);
                        },
                        function (error) {
                            PassFail("Failed by Exception", "Failed by Exception", dataItems)
                            exceptionDataitem.ExceptionDetails = error.request.response;
                            allExceptionItem.push(exceptionDataitem);
                            allItems.push(dataItems);
                            BindData(allItems, allExceptionItem);
                            NegativeCRUDOperation(Id + 1, currentPermission, ExpectedResult, "Read", tableName);
                        }
                    );
                }
                else {

                    var item = { name: "Naren Chejara", Kids: 0, Married: false, DateOfBirth: new Date(1986, 1, 14) };
                    MobileService.getTable(tableName).insert(item).then(
                        function (results) {
                            dataItems.GetValue = "Inserted";
                            PassFail("Pass", dataItems.ExpectedResult, dataItems)
                            allItems.push(dataItems);
                            BindData(allItems, allExceptionItem);
                            NegativeCRUDOperation(Id + 1, currentPermission, ExpectedResult, "Read", tableName);
                        },
                        function (error) {
                            PassFail("Failed by Exception", "Failed by Exception", dataItems)
                            exceptionDataitem.ExceptionDetails = error.request.response;
                            allExceptionItem.push(exceptionDataitem);
                            allItems.push(dataItems);
                            BindData(allItems, allExceptionItem);

                            NegativeCRUDOperation(Id + 1, currentPermission, ExpectedResult, "Read", tableName);
                        }
                    );

                }

                break;
            case "Read":
                if (currentPermission == "Admin&Script") {
                    MobileService.withFilter(AddMasterKeyFilter(appMasterKey)).getTable(tableName).select(name).read().then(
                        function (results) {
                            dataItems.GetValue = results.length + " Result Found";
                            PassFail("Pass", dataItems.ExpectedResult, dataItems)
                            allItems.push(dataItems);
                            BindData(allItems, allExceptionItem);
                            NegativeCRUDOperation(Id + 1, currentPermission, ExpectedResult, "Update", tableName);
                        },
                        function (error) {
                            PassFail("Failed by Exception", "Failed by Exception", dataItems)
                            exceptionDataitem.ExceptionDetails = error.request.response;
                            allExceptionItem.push(exceptionDataitem);
                            allItems.push(dataItems);
                            BindData(allItems, allExceptionItem);
                            NegativeCRUDOperation(Id + 1, currentPermission, ExpectedResult, "Update", tableName);
                        }
                    );
                }
                else {
                    MobileService.getTable(tableName).select(name).read().then(
                        function (results) {
                            dataItems.GetValue = results.length + " Result Found";
                            PassFail("Pass", dataItems.ExpectedResult, dataItems)
                            allItems.push(dataItems);
                            BindData(allItems, allExceptionItem);
                            NegativeCRUDOperation(Id + 1, currentPermission, ExpectedResult, "Update", tableName);
                        },
                        function (error) {
                            PassFail("Failed by Exception", "Failed by Exception", dataItems)
                            exceptionDataitem.ExceptionDetails = error.request.response;
                            allExceptionItem.push(exceptionDataitem);
                            allItems.push(dataItems);
                            BindData(allItems, allExceptionItem);
                            NegativeCRUDOperation(Id + 1, currentPermission, ExpectedResult, "Update", tableName);
                        }
                    );
                }
                break;

            case "Update":
                if (currentPermission == "Admin&Script") {
                    MobileService.withFilter(AddMasterKeyFilter(appMasterKey)).getTable(tableName).where({ Name: "Naren Chejara" }).read().then(
                        function (results) {
                            MobileService.withFilter(AddMasterKeyFilter(appMasterKey)).getTable(tableName).update({ id: results[0].id, name: "Naren" }).then(
                               function (data) {
                                   dataItems.GetValue = "Id: " + results[0].id + " Updated";
                                   PassFail("Pass", dataItems.ExpectedResult, dataItems)
                                   allItems.push(dataItems);
                                   BindData(allItems, allExceptionItem);
                                   NegativeCRUDOperation(Id + 1, currentPermission, ExpectedResult, "Delete", tableName)
                               },
                               function (error) {
                                   PassFail("Failed by Exception", "Failed by Exception", dataItems)
                                   exceptionDataitem.ExceptionDetails = error.request.response;
                                   allExceptionItem.push(exceptionDataitem);
                                   allItems.push(dataItems);
                                   BindData(allItems, allExceptionItem);
                                   NegativeCRUDOperation(Id + 1, currentPermission, ExpectedResult, "Delete", tableName)
                               }
                           );
                        },
                        function (error) {
                            PassFail("Failed by Exception", "Failed by Exception", dataItems)
                            exceptionDataitem.ExceptionDetails = error.request.response;
                            allExceptionItem.push(exceptionDataitem);
                            allItems.push(dataItems);
                            BindData(allItems, allExceptionItem);
                            NegativeCRUDOperation(Id + 4, currentPermission, ExpectedResult, "Delete", tableName)
                        }
                    );
                }
                else {
                    //CurdOperation method already update 'Naren Chejara' to 'Naren'
                    MobileService.getTable(tableName).where({ Name: "Naren" }).read().then(
                       function (results) {
                           MobileService.getTable(tableName).update({ id: results[0].id, name: "Naren" }).then(
                               function (data) {
                                   dataItems.GetValue = "Id: " + results[0].id + " Updated";
                                   PassFail("Pass", dataItems.ExpectedResult, dataItems)
                                   allItems.push(dataItems);
                                   BindData(allItems, allExceptionItem);
                                   NegativeCRUDOperation(Id + 1, currentPermission, ExpectedResult, "Delete", tableName)
                               },
                               function (error) {
                                   PassFail("Failed by Exception", "Failed by Exception", dataItems)
                                   exceptionDataitem.ExceptionDetails = error.request.response;
                                   allExceptionItem.push(exceptionDataitem);
                                   allItems.push(dataItems);
                                   BindData(allItems, allExceptionItem);
                                   NegativeCRUDOperation(Id + 1, currentPermission, ExpectedResult, "Delete", tableName)
                               }
                           );
                       },
                       function (error) {
                           PassFail("Failed by Exception", "Failed by Exception", dataItems)
                           exceptionDataitem.ExceptionDetails = error.request.response;
                           allExceptionItem.push(exceptionDataitem);
                           allItems.push(dataItems);
                           BindData(allItems, allExceptionItem);
                           NegativeCRUDOperation(Id + 4, currentPermission, ExpectedResult, "Delete", tableName)
                       }
                    );

                }
                break;
            case "Delete":
                if (currentPermission == "Admin&Script") {
                    MobileService.withFilter(AddMasterKeyFilter(appMasterKey)).getTable(tableName).where({ Name: "Naren" }).read().then(
                         function (results) { // get id
                             MobileService.withFilter(AddMasterKeyFilter(appMasterKey)).getTable(tableName).del({ id: results[0].id }).then(
                                  function (data) {
                                      dataItems.GetValue = "Id: " + results[0].id + " Deleted";
                                      PassFail("Pass", dataItems.ExpectedResult, dataItems)
                                      allItems.push(dataItems);
                                      BindData(allItems, allExceptionItem);

                                  },
                                  function (error) {
                                      PassFail("Failed by Exception", "Failed by Exception", dataItems)
                                      exceptionDataitem.ExceptionDetails = error.request.response;
                                      allExceptionItem.push(exceptionDataitem);
                                      allItems.push(dataItems);
                                      BindData(allItems, allExceptionItem);
                                  }
                              );
                         },
                       function (error) {
                           PassFail("Failed by Exception", "Failed by Exception", dataItems)
                           exceptionDataitem.ExceptionDetails = error.request.response;
                           allExceptionItem.push(exceptionDataitem);
                           allItems.push(dataItems);
                           BindData(allItems, allExceptionItem);
                       }
                     );

                }
                else {
                    MobileService.getTable(tableName).where({ Name: "Surendra Chejara" }).read().then(
                       function (results) { // get id
                           MobileService.getTable(tableName).del({ id: results[0].id }).then(
                                function (data) {
                                    dataItems.GetValue = "Id: " + results[0].id + " Deleted";
                                    PassFail("Pass", dataItems.ExpectedResult, dataItems)
                                    allItems.push(dataItems);
                                    BindData(allItems, allExceptionItem);

                                },
                                function (error) {
                                    PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems)
                                    exceptionDataitem.ExceptionDetails = error.request.response;
                                    allExceptionItem.push(exceptionDataitem);
                                    allItems.push(dataItems);
                                    BindData(allItems, allExceptionItem);

                                }
                            );
                       },
                       function (error) {
                           PassFail("Failed by Exception", "Failed by Exception", dataItems)
                           exceptionDataitem.ExceptionDetails = error.request.response;
                           allExceptionItem.push(exceptionDataitem);
                           allItems.push(dataItems);
                           BindData(allItems, allExceptionItem);
                       }
                    );

                }
                break;
        }


    }

    //Dynamic schema scenario
    function btnDynamicSchema() {
        if (TextValidation()) {
            var schemaColumn = new Object;
            MobileService = new Microsoft.WindowsAzure.MobileServices.MobileServiceClient(appURL, appKey);
            // get a rendom number
            var rendomNumber = Math.floor(Math.random() * 10000);

            schemaColumn["col" + rendomNumber.toString()] = "val" + rendomNumber.toString();
            DynamicSchema(1, "Dynamic schema enabled", schemaColumn, "Pass");
        }
    }
    function DynamicSchema(Id, ScenarioName, schemaColumn, Expected) {
        var dataItems = { "Id": Id, "Name": ScenarioName, "Value": "Insert", "GetValue": "", "ActualResult": "", "ExpectedResult": Expected, "Result": "" };
        var exceptionDataitem = { "Name": ScenarioName, "ExceptionDetails": "" };
        MobileService.getTable("TodoItem").insert(schemaColumn).done(
            function (results) {
                dataItems.GetValue = "Inserted";
                PassFail("Pass", dataItems.ExpectedResult, dataItems);
                allItems.push(dataItems);
                BindData(allItems, allExceptionItem);
            },
            function (error) {
                PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems);
                exceptionDataitem.ExceptionDetails = error.request.response;
                allExceptionItem.push(exceptionDataitem);
                allExceptionItem.push(exceptionDataitem);
                BindData(allItems, allExceptionItem);
            }
        );
    }

    // Script Scenario
    function ScriptInsert() {
        if (TextValidation()) {
            MobileService = new Microsoft.WindowsAzure.MobileServices.MobileServiceClient(appURL, appKey);
            ScriotOperation(1, "Script [Insert]", "Insert");
        }
    }
    function ScriptUpdate() {
        if (TextValidation()) {
            MobileService = new Microsoft.WindowsAzure.MobileServices.MobileServiceClient(appURL, appKey);
            ScriotOperation(1, "Script [Update]", "Update");
        }
    }
    function ScriptDelete() {
        if (TextValidation()) {
            MobileService = new Microsoft.WindowsAzure.MobileServices.MobileServiceClient(appURL, appKey);
            ScriotOperation(1, "Script [Delete]", "Delete");
        }
    }
    function ScriptRead() {
        if (TextValidation()) {
            MobileService = new Microsoft.WindowsAzure.MobileServices.MobileServiceClient(appURL, appKey);
            ScriotOperation(1, "Script [Read]", "Read");
        }
    }
    function ScriotOperation(Id, ScenarioName, Operation) {
        var dataItems = { "Id": Id, "Name": ScenarioName, "Value": Operation, "GetValue": "", "ActualResult": "", "ExpectedResult": "Verifyit, Manually", "Result": "Verifyit, Manually" };
        var exceptionDataitem = { "Name": ScenarioName, "ExceptionDetails": "" };
        switch (Operation) {
            case "Insert":
                var item = { name: "Naren Chejara", Kids: 0, Married: false, DateOfBirth: new Date(1986, 1, 14) };
                MobileService.getTable("Person").insert(item).then(
                    function (results) {
                        dataItems.GetValue = "Inserted";
                        //PassFail("Pass", "Pass", dataItems);
                        dataItems.ActualResult = "Pass";
                        allItems.push(dataItems);
                        BindData(allItems, allExceptionItem);

                    },
                    function (error) {
                        dataItems.ActualResult = "Failed by Exception";
                        //PassFail("Failed by Exception", "Pass", dataItems)
                        exceptionDataitem.ExceptionDetails = error.request.response;
                        allExceptionItem.push(exceptionDataitem);
                        allItems.push(dataItems);
                        BindData(allItems, allExceptionItem);

                    }
                );
                break;
            case "Update":
                MobileService.getTable("Person").where({ Name: "Naren Chejara" }).read().then(
                      function (results) {
                          MobileService.getTable("Person").update({ id: results[0].id, name: "Naren" }).then(
                              function (data) {
                                  dataItems.GetValue = "Id: " + results[0].id + " Updated";
                                  //PassFail("Pass", "Pass", dataItems);
                                  dataItems.ActualResult = "Pass";
                                  allItems.push(dataItems);
                                  BindData(allItems, allExceptionItem);

                              },
                              function (error) {
                                  dataItems.ActualResult = "Failed by Exception";
                                  //PassFail("Failed by Exception", "Pass", dataItems)
                                  exceptionDataitem.ExceptionDetails = error.request.response;
                                  allExceptionItem.push(exceptionDataitem);
                                  allItems.push(dataItems);
                                  BindData(allItems, allExceptionItem);
                              }
                          );
                      },
                      function (error) {
                          dataItems.ActualResult = "Failed by Exception";
                          //PassFail("Failed by Exception", "Pass", dataItems)
                          exceptionDataitem.ExceptionDetails = error.request.response;
                          allExceptionItem.push(exceptionDataitem);
                          allItems.push(dataItems);
                          BindData(allItems, allExceptionItem);
                      }
                   );
                break;
            case "Delete":
                MobileService.getTable("Person").where({ Name: "Naren" }).read().then(
                       function (results) { // get id
                           MobileService.getTable("Person").del({ id: results[0].id }).then(
                                function (data) {
                                    dataItems.GetValue = "Id: " + results[0].id + " Deleted";
                                    dataItems.ActualResult = "Pass";
                                    //PassFail("Pass", "Pass", dataItems)
                                    allItems.push(dataItems);
                                    BindData(allItems, allExceptionItem);
                                },
                                function (error) {
                                    dataItems.ActualResult = "Failed by Exception";
                                    //PassFail("Failed by Exception", "Pass", dataItems)
                                    exceptionDataitem.ExceptionDetails = error.request.response;
                                    allExceptionItem.push(exceptionDataitem);
                                    allItems.push(dataItems);
                                    BindData(allItems, allExceptionItem);
                                }
                            );
                       },
                       function (error) {
                           dataItems.ActualResult = "Failed by Exception";
                           //PassFail("Failed by Exception", "Pass", dataItems)
                           exceptionDataitem.ExceptionDetails = error.request.response;
                           allExceptionItem.push(exceptionDataitem);
                           allItems.push(dataItems);
                           BindData(allItems, allExceptionItem);
                       }
                    );
                break;
            case "Read":
                MobileService.getTable("Person").select(name).read().then(
                        function (results) {
                            dataItems.GetValue = results.length + " Result Found";
                            dataItems.ActualResult = "Pass";
                            //PassFail("Pass", "Pass", dataItems)
                            allItems.push(dataItems);
                            BindData(allItems, allExceptionItem);

                        },
                        function (error) {
                            dataItems.ActualResult = "Failed by Exception";
                            //PassFail("Failed by Exception", "Pass", dataItems)
                            exceptionDataitem.ExceptionDetails = error.request.response;
                            allExceptionItem.push(exceptionDataitem);
                            allItems.push(dataItems);
                            BindData(allItems, allExceptionItem);

                        }
                    );
                break;
        }
    }

    //Push Notification
    function PushInsert() {
        if (TextValidation()) {
            MobileService = new Microsoft.WindowsAzure.MobileServices.MobileServiceClient(appURL, appKey);
            PushOperation(1, "Push [Insert]", "Insert");
        }
    }
    function PushUpdate() {
        if (TextValidation()) {
            MobileService = new Microsoft.WindowsAzure.MobileServices.MobileServiceClient(appURL, appKey);
            PushOperation(1, "Push [Update]", "Update");
        }
    }
    function PushDelete() {
        if (TextValidation()) {
            MobileService = new Microsoft.WindowsAzure.MobileServices.MobileServiceClient(appURL, appKey);
            PushOperation(1, "Push [Delete]", "Delete");
        }
    }
    function PushOperation(Id, ScenarioName, Operation) {
        var dataItems = { "Id": Id, "Name": ScenarioName, "Value": Operation, "GetValue": "", "ActualResult": "", "ExpectedResult": "Pass", "Result": "" };
        var exceptionDataitem = { "Name": ScenarioName, "ExceptionDetails": "" };
        switch (Operation) {
            case "Insert":
                Windows.Networking.PushNotifications.PushNotificationChannelManager.createPushNotificationChannelForApplicationAsync().then(function (channel) {
                    var item = { Name: "Naren Chejara", ChannelURL: channel.uri };
                    MobileService.getTable("Channels").insert(item).then(
                        function (results) {
                            dataItems.GetValue = "Inserted";
                            PassFail("Pass", dataItems.ExpectedResult, dataItems);
                            allItems.push(dataItems);
                            BindData(allItems, allExceptionItem);

                        },
                        function (error) {
                            PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems)
                            exceptionDataitem.ExceptionDetails = error.request.response;
                            allExceptionItem.push(exceptionDataitem);
                            allItems.push(dataItems);
                            BindData(allItems, allExceptionItem);

                        }
                    );
                },
                function (error) {
                    exceptionDataitem.ExceptionDetails = error.request.response;
                    allExceptionItem.push(exceptionDataitem);
                    allItems.push(dataItems);
                    BindData(allItems, allExceptionItem);
                });
                break;
            case "Update":
                MobileService.getTable("Channels").where({ Name: "Naren Chejara" }).read().then(
                      function (results) {
                          MobileService.getTable("Channels").update({ id: results[0].id, Name: "Naren", ChannelURL: results[0].ChannelURL }).then(
                              function (data) {
                                  dataItems.GetValue = "Id: " + results[0].id + " Updated";
                                  //PassFail("Pass", "Pass", dataItems);
                                  dataItems.ActualResult = "Pass";
                                  allItems.push(dataItems);
                                  BindData(allItems, allExceptionItem);

                              },
                              function (error) {
                                  dataItems.ActualResult = "Failed by Exception";
                                  //PassFail("Failed by Exception", "Pass", dataItems)
                                  exceptionDataitem.ExceptionDetails = error.request.response;
                                  allExceptionItem.push(exceptionDataitem);
                                  allItems.push(dataItems);
                                  BindData(allItems, allExceptionItem);
                              }
                          );
                      },
                      function (error) {
                          dataItems.ActualResult = "Failed by Exception";
                          //PassFail("Failed by Exception", "Pass", dataItems)
                          exceptionDataitem.ExceptionDetails = error.request.response;
                          allExceptionItem.push(exceptionDataitem);
                          allItems.push(dataItems);
                          BindData(allItems, allExceptionItem);
                      }
                   );
                break;
            case "Delete":
                MobileService.getTable("Channels").where({ Name: "Naren" }).read().then(
                       function (results) { // get id
                           MobileService.getTable("Channels").del({ id: results[0].id }).then(
                                function (data) {
                                    dataItems.GetValue = "Id: " + results[0].id + " Deleted";
                                    dataItems.ActualResult = "Pass";
                                    //PassFail("Pass", "Pass", dataItems)
                                    allItems.push(dataItems);
                                    BindData(allItems, allExceptionItem);
                                },
                                function (error) {
                                    dataItems.ActualResult = "Failed by Exception";
                                    //PassFail("Failed by Exception", "Pass", dataItems)
                                    exceptionDataitem.ExceptionDetails = error.request.response;
                                    allExceptionItem.push(exceptionDataitem);
                                    allItems.push(dataItems);
                                    BindData(allItems, allExceptionItem);
                                }
                            );
                       },
                       function (error) {
                           dataItems.ActualResult = "Failed by Exception";
                           //PassFail("Failed by Exception", "Pass", dataItems)
                           exceptionDataitem.ExceptionDetails = error.request.response;
                           allExceptionItem.push(exceptionDataitem);
                           allItems.push(dataItems);
                           BindData(allItems, allExceptionItem);
                       }
                    );
                break;
        }
    }

    //Raw Push Notification
    function RawPushInsert() {
        if (TextValidation()) {
            MobileService = new Microsoft.WindowsAzure.MobileServices.MobileServiceClient(appURL, appKey);
            RawPushOperation(1, "Raw Push [Insert]", "Insert");
        }
    }
    function RawPushOperation(Id, ScenarioName, Operation) {
        var dataItems = { "Id": Id, "Name": ScenarioName, "Value": Operation, "GetValue": "", "ActualResult": "", "ExpectedResult": "Pass", "Result": "" };
        var exceptionDataitem = { "Name": ScenarioName, "ExceptionDetails": "" };
        switch (Operation) {
            case "Insert":
                Windows.Networking.PushNotifications.PushNotificationChannelManager.createPushNotificationChannelForApplicationAsync().then(function (channel) {
                    var item = { Name: "My Raw push notification", ChannelURL: channel.uri };
                    //Add event listener
                    channel.addEventListener("pushnotificationreceived",
                    //callback event
                        function onPushNotification(e) {
                            if (e.notificationType === Windows.Networking.PushNotifications.PushNotificationType.raw) {
                                if (item.Name == e.rawNotification.content) {
                                    dataItems.GetValue = e.rawNotification.content;
                                    PassFail("Pass", dataItems.ExpectedResult, dataItems);
                                    allItems.push(dataItems);
                                    BindData(allItems, allExceptionItem);
                                    // Prevents the notification from being delivered to the background task 
                                    e.cancel = true;
                                }
                                else {
                                    PassFail("Fail", dataItems.ExpectedResult, dataItems)
                                    exceptionDataitem.ExceptionDetails = "Received notification content doesn't match";
                                    allExceptionItem.push(exceptionDataitem);
                                    allItems.push(dataItems);
                                    BindData(allItems, allExceptionItem);
                                }
                            }
                        }, false);

                    //Insert data
                    MobileService.getTable("Channels").insert(item).then(
                          function (results) {
                              //insert
                          },
                          function (error) {
                              PassFail("Failed by Exception", dataItems.ExpectedResult, dataItems)
                              exceptionDataitem.ExceptionDetails = error.request.response;
                              allExceptionItem.push(exceptionDataitem);
                              allItems.push(dataItems);
                              BindData(allItems, allExceptionItem);

                          }
                    );
                },
                function (error) {
                    exceptionDataitem.ExceptionDetails = error.request.response;
                    allExceptionItem.push(exceptionDataitem);
                    allItems.push(dataItems);
                    BindData(allItems, allExceptionItem);
                });
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