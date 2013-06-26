using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Live;
using Microsoft.Live.Controls;
using Microsoft.WindowsAzure.MobileServices;
using Windows.Data.Json;
using System.IO;

namespace E2EZumoTests
{
    public class E2EZumoHelper
    {
        public static string AppMasterKey = "";
        public static int recordIdToUpdate = 0;
        public static int recordIdToDelete = 0;
        public static string username { get; set; }


        public static void PassFail(string actual, string Expected, Data data)
        {

            if (string.Equals(actual, Expected))
            {
                data.ActualResult = actual;
                data.ExpectedResult = Expected;
                data.Result = "Pass";
                data.Colors = "Green";
            }
            else
            {
                data.ActualResult = actual;
                data.ExpectedResult = Expected;
                data.Result = "Fail";
                data.Colors = "Red";
            }
        }
        public static async Task ZumoLogin(string redirectURL)
        {
            LiveAuthClient liveAuthClient;
            LiveLoginResult liveLoginResult;
            liveAuthClient = new LiveAuthClient(redirectURL);
            liveLoginResult = await liveAuthClient.LoginAsync(new string[] { "wl.signin", "wl.basic" });

            if (liveLoginResult.Session != null && liveLoginResult.Status == LiveConnectSessionStatus.Connected)
            {
                await App.MobileService.LoginAsync(liveLoginResult.Session.AuthenticationToken);
                LiveConnectClient client = new LiveConnectClient(liveLoginResult.Session);
                LiveOperationResult operationResult = await client.GetAsync("me");
                dynamic results = operationResult.Result;
                username = results.name;
            }
            else
                throw new Exception();

        }
        public static void ZumoLogout(string redirectURL)
        {
            //signout from zumo
            App.MobileService.Logout();
            new LiveAuthClient(redirectURL).Logout();
        }
        public static async Task ZumoCRUD(int id, string currentPermission, string Expected, string tableName)
        {
            await CRUDOperation(id + 1, currentPermission, Expected, "Insert", tableName);
            await CRUDOperation(id + 2, currentPermission, Expected, "Read", tableName);
            await CRUDOperation(id + 3, currentPermission, Expected, "Update", tableName);
            await CRUDOperation(id + 4, currentPermission, Expected, "Delete", tableName);
        }
        public static void AddExceptionDetail(Data data, string details, bool isDefaultPassFailMethord = true)
        {
            if(isDefaultPassFailMethord == true)
                PassFail("Failed by Exception", data.ExpectedResult, data);
            else
                PassFail("Failed by Exception", "Failed by Exception", data);
            MainPage.allExceptionResult.Add(new ExceptionData{Name = data.Name, ExceptionDetails = details});
        }
        
        /// <summary>
        /// Do all CRUD operation
        /// </summary>
        /// <param name="id"> Scenario ID</param>
        /// <param name="currentPermission">Permission type</param>
        /// <param name="expected"></param>
        /// <param name="Operation">[ Insert, delete, read, update ]</param>
        /// <param name="tableName">table name string</param>
        /// <returns></returns>
        public static async Task CRUDOperation(int id, string currentPermission, string Expected, string Operation, string tableName)
        {
            Data data = new Data { 
                    Id = id, 
                    Name = currentPermission + " [ " + Operation + " ] ",
                    Value = Operation,
                    ActualResult = "",
                    ExpectedResult = Expected
            };
            switch (Operation)
            {
                case "Insert":
                    try
                    {
                       
                        if (currentPermission == ZumoPermissions.ScriptsAndAdmins.ToString())
                        {
                            await App.MobileService.WithFilter((new AddMasterKeyFilter())).GetTable(tableName).InsertAsync
                                (JsonObject.Parse("{\"Name\":\"Naren Chejara\", \"Kids\":0, \"Married\":false, \"DateOfBirth\":\"2012-05-03T00:06:00.638Z\"}"));
                        }
                        else
                        {
                            await App.MobileService.GetTable(tableName).InsertAsync
                                (JsonObject.Parse("{\"Name\":\"Naren Chejara\", \"Kids\":0, \"Married\":false, \"DateOfBirth\":\"1986-01-04T00:06:00.123\"}"));
                            await App.MobileService.GetTable(tableName).InsertAsync
                                (JsonObject.Parse("{\"Name\":\"Surendra Chejara\", \"Kids\":2, \"Married\":true, \"DateOfBirth\":\"1983-02-03T00:06:00.456\"}"));
                        }

                        data.GetValue = "Inserted";
                        PassFail("Pass", data.ExpectedResult, data);
                        
                    }
                    catch (MobileServiceInvalidOperationException MSIOE)
                    {
                        if (MSIOE.Response.StatusCode == 401)
                            AddExceptionDetail(data, "Please set Authentication User permission in Person table and try again :: " + MSIOE.Response.Content);
                        else
                            AddExceptionDetail(data, MSIOE.Response.Content);

                    }
                    catch (Exception ex)
                    {
                        AddExceptionDetail(data, ex.Message);
                       
                    }
                    break;
                case "Update":
                    try
                    {
                        //Initialized recordIdToUpdate and recordIdToDelete variables
                        await InitializedID(currentPermission, tableName);

                        if (currentPermission == ZumoPermissions.ScriptsAndAdmins.ToString())
                        {
                            await App.MobileService.WithFilter((new AddMasterKeyFilter())).GetTable(tableName).UpdateAsync
                                (JsonObject.Parse(String.Format("{{\"id\":{0}, \"DateOfBirth\":\"{1:yyyy-MM-dd}T00:00:00.000\"}}", recordIdToUpdate, DateTime.Now)));
                                //(new Person { id = recordIdToUpdate, DateOfBirth = DateTime.Now });
                        }
                        else
                        {
                            await App.MobileService.GetTable(tableName).UpdateAsync
                                (JsonObject.Parse(String.Format("{{\"id\":{0}, \"DateOfBirth\":\"{1:yyyy-MM-dd}T00:00:00.000\"}}", recordIdToUpdate, DateTime.Now)));
                        }
                       
                        data.GetValue = "Id " + recordIdToUpdate + " Updated";
                        PassFail("Pass", data.ExpectedResult, data);
                    }
                    catch (MobileServiceInvalidOperationException MSIOE)
                    {
                        if (MSIOE.Response.StatusCode == 401)
                            AddExceptionDetail(data, "Please set Authentication User permission in Person table and try again :: " + MSIOE.Response.Content);
                        else
                            AddExceptionDetail(data, MSIOE.Response.Content);

                    }
                    catch (Exception ex)
                    {
                        AddExceptionDetail(data, ex.Message);
                    }
                    break;
                case "Read":
                    try
                    {
                       
                        IEnumerable<Person> lists = null;
                        if (currentPermission == ZumoPermissions.ScriptsAndAdmins.ToString())
                        {
                            //lists = await App.MobileService.WithFilter((new AddMasterKeyFilter())).GetTable(tableName).ReadAsync(
                            //   from listValue in App.MobileService.GetTable<Person>()
                            //   select listValue);
                            IJsonValue x = await App.MobileService.WithFilter((new AddMasterKeyFilter())).GetTable(tableName).ReadAsync(null);
                            lists = x.GetArray().Select(MobileServiceTableSerializer.Deserialize<Person>);
                        }
                        else
                        {
                            IJsonValue x = await App.MobileService.GetTable(tableName).ReadAsync(null);
                            lists = x.GetArray().Select(MobileServiceTableSerializer.Deserialize<Person>);
                            //lists = await App.MobileService.GetTable(tableName).ReadAsync(null);
                            //   from listValue in App.MobileService.GetTable<Person>()
                            //   select listValue);
                        }
                        List<Person> list = lists.ToList();
                       
                        data.GetValue = "Found " + list.Count + " results";
                        PassFail("Pass", data.ExpectedResult, data);
                    }
                    catch (MobileServiceInvalidOperationException MSIOE)
                    {
                        if (MSIOE.Response.StatusCode == 401)
                            AddExceptionDetail(data, "Please set Authentication User permission in Person table and try again :: " + MSIOE.Response.Content);
                        else
                            AddExceptionDetail(data, MSIOE.Response.Content);

                    }
                    catch (Exception ex)
                    {
                        AddExceptionDetail(data, ex.Message);
                    }
                    break;

                case "Delete":
                    try
                    {
                        
                        if (currentPermission == ZumoPermissions.ScriptsAndAdmins.ToString())
                        {
                            await App.MobileService.WithFilter((new AddMasterKeyFilter())).GetTable(tableName).DeleteAsync
                                //(new Person { id = recordIdToDelete });
                                (JsonObject.Parse(String.Format("{{\"id\":{0}}}", recordIdToDelete)));
                        }
                        else
                        {
                            await App.MobileService.GetTable(tableName).DeleteAsync
                                (JsonObject.Parse(String.Format("{{\"id\":{0}}}", recordIdToDelete)));
                        }


                        data.GetValue = "Id " + recordIdToDelete + " Deleted";
                        PassFail("Pass", data.ExpectedResult, data);
                        

                    }
                    catch (MobileServiceInvalidOperationException MSIOE)
                    {
                        if (MSIOE.Response.StatusCode == 401)
                           AddExceptionDetail(data, "Please set Authentication User permission in Person table and try again :: " + MSIOE.Response.Content);
                        else if (MSIOE.Response.StatusCode == 404)
                            AddExceptionDetail(data, "No Result found please click on Insert button in order to insert one record :: " + MSIOE.Response.Content);
                        else
                            AddExceptionDetail(data, MSIOE.Response.Content);

                    }
                    catch (Exception ex)
                    {
                        AddExceptionDetail(data, ex.Message);
                    }
                    break;
            }

            MainPage.allResult.Add(data);
        }

        public static async Task InitializedID(string currentPermission, string tableName="Person")
        {
            IEnumerable<Person> lists = null;
            if (currentPermission == ZumoPermissions.ScriptsAndAdmins.ToString())
            {
                IJsonValue x = await App.MobileService.WithFilter((new AddMasterKeyFilter())).GetTable(tableName).ReadAsync("$filter=name eq 'Naren Chejara'");
                lists = x.GetArray().Select(MobileServiceTableSerializer.Deserialize<Person>);
                //lists = await App.MobileService.WithFilter((new AddMasterKeyFilter())).GetTable<Person>().ReadAsync(
                //             from listValue in App.MobileService.GetTable<Person>()
                //             where listValue.Name == "Naren Chejara"
                //             select listValue);
            }
            else
            {
                IJsonValue x = await App.MobileService.GetTable(tableName).ReadAsync("$filter=name eq 'Naren Chejara'");
                lists = x.GetArray().Select(MobileServiceTableSerializer.Deserialize<Person>);
                //lists = await App.MobileService.GetTable<Person>().ReadAsync<Person>(
                //             from listValue in App.MobileService.GetTable<Person>()
                //             where listValue.Name == "Naren Chejara"
                //             select listValue);
            }

            List<Person> list = lists.ToList();
            if (list.Count > 0)
            {
                for (int i = 0; i < list.Count; i++)
                {
                    recordIdToUpdate = list[i].id;
                    recordIdToDelete = list[i].id;
                }
            }

        }
        public static async Task ScriptOperation(int id, string ScenarioName, string Operation)
        {
            Data data = new Data
            {
                Id = id,
                Name = ScenarioName,
                Value = Operation,
                ActualResult = "",
                ExpectedResult = "Verify it, Manually",
                Result = "Verify it, Manually"
            };
            switch (Operation)
            {
                case "Insert":
                    try
                    {
                        await App.MobileService.GetTable<Person>().InsertAsync
                               (new Person { Name = "Naren Chejara", Kids = 0, Married = false, DateOfBirth = new DateTime(1986, 01, 14) });
                        data.GetValue = "Inserted";
                        data.ActualResult = "Pass";
                    }
                    catch (MobileServiceInvalidOperationException MSIOE)
                    {
                        data.ActualResult = "Failed by exception";
                        if (MSIOE.Response.StatusCode == 401)
                            AddExceptionDetail(data, "Please set Authentication User permission in Person table and try again :: " + MSIOE.Response.Content);
                        else
                            AddExceptionDetail(data, MSIOE.Response.Content);

                    }
                    catch (Exception ex)
                    {
                        data.ActualResult = "Failed by exception";
                        AddExceptionDetail(data, ex.Message);
                    }
                    break;
                case "Update":
                    try
                    {

                        //Initialized recordIdToUpdate and recordIdToDelete variables
                        await InitializedID("ScriptsAndAdmins");
                        await App.MobileService.GetTable<Person>().UpdateAsync
                                (new Person { id = recordIdToUpdate, DateOfBirth = new DateTime() });

                        data.GetValue = "Id " + recordIdToUpdate + " Updated";
                        data.ActualResult = "Pass";

                    }
                    catch (MobileServiceInvalidOperationException MSIOE)
                    {
                        data.ActualResult = "Failed by exception";
                        if (MSIOE.Response.StatusCode == 401)
                            AddExceptionDetail(data, "Please set Authentication User permission in Person table and try again :: " + MSIOE.Response.Content);
                        else
                            AddExceptionDetail(data, MSIOE.Response.Content);

                    }
                    catch (Exception ex)
                    {
                        data.ActualResult = "Failed by exception";
                        AddExceptionDetail(data, ex.Message);
                    }
                    break;
                case "Read":
                    try
                    {

                        IEnumerable<Person> lists = await App.MobileService.GetTable<Person>().ReadAsync(
                               from listValue in App.MobileService.GetTable<Person>()
                               select listValue);

                        List<Person> list = lists.ToList();
                        data.GetValue = "Found " + list.Count + " results";
                        data.ActualResult = "Pass";

                    }
                    catch (MobileServiceInvalidOperationException MSIOE)
                    {
                        data.ActualResult = "Failed by exception";
                        if (MSIOE.Response.StatusCode == 401)
                            AddExceptionDetail(data, "Please set Authentication User permission in Person table and try again :: " + MSIOE.Response.Content);
                        else
                            AddExceptionDetail(data, MSIOE.Response.Content);

                    }
                    catch (Exception ex)
                    {
                        data.ActualResult = "Failed by exception";
                        AddExceptionDetail(data, ex.Message);
                    }
                    break;

                case "Delete":
                    try
                    {
                        //Initialized recordIdToUpdate and recordIdToDelete variables
                        await InitializedID("ScriptsAndAdmins");
                        await App.MobileService.GetTable<Person>().DeleteAsync
                            (new Person { id = recordIdToDelete });
                        data.GetValue = "Id " + recordIdToDelete + " Deleted";
                        data.ActualResult = "Pass";


                    }
                    catch (MobileServiceInvalidOperationException MSIOE)
                    {
                        data.ActualResult = "Failed by exception";
                        if (MSIOE.Response.StatusCode == 401)
                            AddExceptionDetail(data, "Please set Authentication User permission in Person table and try again :: " + MSIOE.Response.Content);
                        else if (MSIOE.Response.StatusCode == 404)
                            AddExceptionDetail(data, "No Result found please click on Insert button in order to insert one record :: " + MSIOE.Response.Content);
                        else
                            AddExceptionDetail(data, MSIOE.Response.Content);

                    }
                    catch (Exception ex)
                    {
                        data.ActualResult = "Failed by exception";
                        AddExceptionDetail(data, ex.Message);
                    }
                    break;
            }
            MainPage.allResult.Add(data);
        }

        public static async Task VerifySchema(int id, string ScenarioName, string schemaColumn, string Expected)
        {
            JsonObject jObj = JsonObject.Parse("{" + schemaColumn + "}");
            Data data = new Data { Id = id, Name = ScenarioName, ActualResult = "", GetValue = "", Value = "Add Schema", ExpectedResult = Expected };
            try
            {
                IJsonValue inserted = await App.MobileService.GetTable("TodoItem").InsertAsync(jObj);
                data.GetValue = "Schema Added";
                PassFail("Pass", data.ExpectedResult, data);
            }
            catch (MobileServiceInvalidOperationException MSIOE)
            {
                if (MSIOE.Response.StatusCode == 400)
                    AddExceptionDetail(data, MSIOE.Response.Content, false);
                else
                    AddExceptionDetail(data, MSIOE.Response.Content);
            }
            catch (Exception ex)
            {
                AddExceptionDetail(data, ex.Message);
                
            }
            MainPage.allResult.Add(data);

        }

       
    }

}
