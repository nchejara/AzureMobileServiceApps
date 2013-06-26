using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;
using Microsoft.WindowsAzure.MobileServices;
using Windows.Data.Json;
using System.Threading.Tasks;
using Microsoft.Live;
using Microsoft.Live.Controls;
using Windows.Storage;
using Windows.Networking.PushNotifications;
using Windows.ApplicationModel.Background;


// The Blank Page item template is documented at http://go.microsoft.com/fwlink/?LinkId=234238

namespace E2EZumoTests
{
    enum ZumoPermissions
    {
        EveryOne,
        ApplicationKey,
        Authenticated,
        ScriptsAndAdmins
    }
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainPage : Page
    {
        public static ObservableCollection<Data> allResult = new ObservableCollection<Data>();
        public static ObservableCollection<ExceptionData> allExceptionResult = new ObservableCollection<ExceptionData>();
        ApplicationDataContainer localSettings = ApplicationData.Current.LocalSettings;
        public string redirectURL = "";
        public int top = 0; // Use in Run Query 
        public int skip = 0;// Use in Run Query
        public string loginStatus = "logout";
        public MainPage()
        {
            this.InitializeComponent();
            top = Convert.ToInt32(txtTop.Text);
            skip = Convert.ToInt32(txtSkip.Text);
            LoadPortalInfo();

            //txtURL.Text = "https://xinqiutestpreview2.zumotcantbay.antares-test.windows-int.net/";
            //txtKey.Text = "vqHrhUftRIaCkHOLdWzcEDJYXvouxL90";
            //txtMasterKey.Text = "sgiQYqmjkWIpPIREeocbAFbRHJuLFK92";


        }
        /// <summary>
        /// Invoked when this page is about to be displayed in a Frame.
        /// </summary>
        /// <param name="e">Event data that describes how this page was reached.  The Parameter
        /// property is typically used to configure the page.</param>
        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
        }

        #region Text validation functions
        /// <summary>
        /// Check empty validation on Application URL and Application Key textbox
        /// </summary>
        /// <returns></returns>
        private bool TextValidation()
        {
            if (this.txtURL.Text.Trim() == "")
            {
                lblOutput.Text = "[Hint]: Application URL should not be empty";
                return false;
            }
            else if (this.txtKey.Text.Trim() == "")
            {
                lblOutput.Text = "[Hint]: Application Key should not be empty";
                return false;
            }

            try
            {
                if (txtSkip.Text.Trim() == "")
                    skip = 0;
                else
                    skip = Convert.ToInt32(txtSkip.Text.Trim());
                top = Convert.ToInt32(txtTop.Text.Trim());
            }
            catch (Exception ex)
            {
                lblMsg.Text = "[Hint]: Top and skip should be an integer value!";
                return false;
            }

            // Just check user login or not
            App.MobileService = new MobileServiceClient(txtURL.Text.Trim(), txtKey.Text.Trim());
            redirectURL = txtURL.Text.Trim().Replace("windows-", "");
            SavePortalInfo();
            return true;
        }
        private bool PermissionTextValidation(double scenarioID)
        {
            if (scenarioID == 3.1 || scenarioID == 3.2)
            {
                if (txtURL.Text.Trim() == "")
                {
                    lblOutput.Text = "[Hint]: Application URL should not be empty";
                    return false;
                }
            }
            else if (scenarioID == 3.3)
            {
                if (txtURL.Text.Trim() == "")
                {
                    lblOutput.Text = "[Hint]: Application URL should not be empty";
                    return false;
                }
            }
            else if (scenarioID == 3.4)
            {
                if (txtURL.Text.Trim() == "")
                {
                    lblOutput.Text = "[Hint]: Application URL should not be empty";
                    return false;
                }
                if (this.txtMasterKey.Text.Trim() == "")
                {
                    lblOutput.Text = "[Hint]: Master Key should not be empty";
                    return false;
                }
            }
            E2EZumoHelper.AppMasterKey = txtMasterKey.Text.Trim();
            redirectURL = txtURL.Text.Trim().Replace("windows-", "");
            SavePortalInfo();
            return true;
        }
        private bool ScriptTextValidation(double scenarioID)
        {
            if (this.txtURL.Text.Trim() == "")
            {
                lblOutput.Text = "[Hint]: Application URL should not be empty";
                return false;
            }
            else if (this.txtMasterKey.Text.Trim() == "")
            {
                lblOutput.Text = "[Hint]: Master Key should not be empty";
                return false;
            }
            App.MobileService = new MobileServiceClient(txtURL.Text.Trim());
            redirectURL = txtURL.Text.Trim().Replace("windows-", "");
            SavePortalInfo();
            return true;

        }
        /// <summary>
        /// locally save all data which provide by user first time. such as Application URL , Key 
        /// </summary>
        private void SavePortalInfo()
        {
            localSettings.Values["ApplicationUrl"] = txtURL.Text.Trim();
            localSettings.Values["ApplicationKey"] = txtKey.Text.Trim();
            localSettings.Values["MasterKey"] = txtMasterKey.Text.Trim();

        }
        /// <summary>
        /// Load all data which was locally store
        /// </summary>
        private void LoadPortalInfo()
        {
            if (localSettings.Values["ApplicationUrl"] != null)
                txtURL.Text = localSettings.Values["ApplicationUrl"].ToString();
            if (localSettings.Values["ApplicationKey"] != null)
                txtKey.Text = localSettings.Values["ApplicationKey"].ToString();
            if (localSettings.Values["MasterKey"] != null)
                txtMasterKey.Text = localSettings.Values["MasterKey"].ToString();

        }
        /// <summary>
        /// show Panels based on Scenarios Numbere
        /// </summary>
        /// <param name="ScenarioNumber">It should be a floating numbers such as 1.1,2.1,2.2</param>
        private void HideShowPanel(double ScenarioNumber)
        {

            HideAllPanel(); // Hide all panel first
            if (ScenarioNumber == 1.1 || ScenarioNumber == 3.1 || ScenarioNumber == 3.2 || ScenarioNumber == 5.1 || ScenarioNumber == 6.1 || ScenarioNumber == 6.2 || ScenarioNumber == 6.3)
            {
                // 1. scenario Panels
                pnlInsert.Visibility = Visibility.Visible;
                ItemData.Visibility = Visibility.Visible;
                pnlInsertExceptiondetails.Visibility = Visibility.Visible;
                ItemExceptionData.Visibility = Visibility.Visible;
                ItemHelpData.Visibility = Visibility.Collapsed;

            }
            if (ScenarioNumber == 2.1)
            {
                pnlInsert.Visibility = Visibility.Visible;
                ItemData.Visibility = Visibility.Visible;
                pnlInsertExceptiondetails.Visibility = Visibility.Visible;
                ItemExceptionData.Visibility = Visibility.Visible;
                pnlTopSkip.Visibility = Visibility.Visible;
                ItemHelpData.Visibility = Visibility.Collapsed;
            }
            if (ScenarioNumber == 3.3 || ScenarioNumber == 3.4)
            {
                pnlInsert.Visibility = Visibility.Visible;
                ItemData.Visibility = Visibility.Visible;
                pnlInsertExceptiondetails.Visibility = Visibility.Visible;
                ItemExceptionData.Visibility = Visibility.Visible;
                //pnlLogin.Visibility = Visibility.Visible; // Just Disable it
                ItemHelpData.Visibility = Visibility.Collapsed;
                //stkpnlMultiAutentication.Visibility = Visibility.Visible;
            }
            if (ScenarioNumber == 3.4)
            {
                pnlInsert.Visibility = Visibility.Visible;
                ItemData.Visibility = Visibility.Visible;
                pnlInsertExceptiondetails.Visibility = Visibility.Visible;
                ItemExceptionData.Visibility = Visibility.Visible;
                pnlPermission.Visibility = Visibility.Visible;
              //  pnlLogin.Visibility = Visibility.Visible;
                ItemHelpData.Visibility = Visibility.Collapsed;
            }

            if (ScenarioNumber == 4.1 || ScenarioNumber == 4.2 || ScenarioNumber == 4.3 || ScenarioNumber == 4.4)
            {
                pnlInsert.Visibility = Visibility.Visible;
                ItemData.Visibility = Visibility.Visible;
                pnlInsertExceptiondetails.Visibility = Visibility.Visible;
                ItemExceptionData.Visibility = Visibility.Visible;
                // pnlPermission.Visibility = Visibility.Visible;
                pnlLogin.Visibility = Visibility.Visible;
                ItemHelpData.Visibility = Visibility.Collapsed;
            }

            if (ScenarioNumber == 1.0 || ScenarioNumber == 2.0 || ScenarioNumber == 3.0 || ScenarioNumber == 4.0 || ScenarioNumber == 5.0 || ScenarioNumber == 6.0)
            {
                ItemHelpData.Visibility = Visibility.Visible;
            }
        }
        /// <summary>
        /// Hide All panel by default ...
        /// </summary>
        private void HideAllPanel()
        {
            // Cleare label Inforamtion
            lblOutput.Text = "";

            lblMsg.Text = "";
            allResult.Clear(); // Clear all data if have some
            allExceptionResult.Clear();

            // Scenario 1.1 Panels
            pnlInsert.Visibility = Visibility.Collapsed;
            ItemData.Visibility = Visibility.Collapsed;
            pnlInsertExceptiondetails.Visibility = Visibility.Collapsed;
            ItemExceptionData.Visibility = Visibility.Collapsed;
            pnlPermission.Visibility = Visibility.Collapsed;
            pnlTopSkip.Visibility = Visibility.Collapsed;
            // pnlLogin.Visibility = Visibility.Collapsed;
           // stkpnlMultiAutentication.Visibility = Visibility.Collapsed;


        }
        #endregion

        #region  User guide function
        private void btnInsertAndVerifyHelp_Click_1(object sender, RoutedEventArgs e)
        {
            HideShowPanel(1.0);
            HelpData helpData = new HelpData();
            helpData.Title = "How to use Insert and Verification scenario";
            helpData.ScenarioName = "1.1 RoundTripDataType";
            helpData.Details = "1. Create an application on Windows azure portal.\n" +
            "2. Create TodoItem table in portal.\n" +
            "3. Add Valid Application URL and Application Key.\n" +
            "4. Click on the '1.1 RoundTripDataType' button.\n" +
            "5. Make sure all the scenario are passed.\n";
            ObservableCollection<HelpData> Help = new ObservableCollection<HelpData>();
            Help.Add(helpData);
            ItemHelpData.ItemsSource = Help;
        }
        private void btnQueryHelp_Click_1(object sender, RoutedEventArgs e)
        {
            HideShowPanel(2.0);
            HelpData helpData = new HelpData();
            helpData.Title = "How to use query scenario";
            helpData.ScenarioName = "2.1 Run Query";
            helpData.Details = "1. Create an application on Windows azure portal.\n" +
            "2. Create TodoItem table in portal.\n" +
            "3. Add Valid Application URL and Application Key.\n" +
            "4. Click on the '1.1 RoundTripDataType' button.\n" +
            "5. Click on the '2.1 Run Query' button.\n" +
            "6. Make sure all the scenario are passed.\n\n\n\n" +
            "[Note]: Date scenario failed because I have not implemented it. so please ignore date scenario\n";
            ObservableCollection<HelpData> Help = new ObservableCollection<HelpData>();
            Help.Add(helpData);
            ItemHelpData.ItemsSource = Help;
        }
        private void btnPermissionHelp_Click_1(object sender, RoutedEventArgs e)
        {
            HideShowPanel(3.0);
            ObservableCollection<HelpData> Help = new ObservableCollection<HelpData>();
            HelpData helpData1 = new HelpData();
            helpData1.Title = "How to use Permission scenario";
            helpData1.ScenarioName = "3.1 Every one";
            helpData1.Details = "1. Create an application on Windows azure portal.\n" +
            "2. Create PersonPublic table in portal [if you haven't have one] and set 'Every one' permission.\n" +
            "3. Add Valid Application URL and Application Key.\n" +
            "4. Click on the '3.1 Every one' button.\n" +
            "5. Make sure all the scenario are passed.";
            Help.Add(helpData1);

            HelpData helpData2 = new HelpData();
            helpData2.ScenarioName = "3.2 Application Key";
            helpData2.Details = "1. Create an application on Windows azure portal.\n" +
            "2. Create PersonApplication table in portal [if you haven't have one] and set 'Application key' permission.\n" +
            "3. Click on the '3.2 Application Key' button.\n" +
            "4. Make sure all the scenario are passed.";
            Help.Add(helpData2);

            HelpData helpData3 = new HelpData();
            helpData3.ScenarioName = "3.3 Authenticate user";
            helpData3.Details = "1. Create an application on Windows azure portal.\n" +
            "2. Create PersonUser table in portal [if you haven't have one] and set 'Authenticate user' permission.\n" +
            "3. Register your application on Live Dashboard[ ref: http://www.c-sharpcorner.com/UploadFile/0926bc/register-metro-style-application-on-live-dashboard/ ]\n" +
            "4. Click on the '3.3 Authenticate user' button.\n" +
            "5. Click on Sign in button if Live aPI does not called.\n" +
            "4. Make sure all the scenario are passed.";
            Help.Add(helpData3);

            HelpData helpData4 = new HelpData();
            helpData4.ScenarioName = "3.4 Script and Admin";
            helpData4.Details = "1. Create an application on Windows azure portal.\n" +
            "2. Create PersonAdmin table in portal [if you haven't have one] and set 'Script and admin' permission.\n" +
            "3. Copy master key from portal and paste it into in application.\n" +
            "4. Click on the '3.4 Script and Admin' button.\n" +
            "5. Make sure all the scenario are passed.";
            Help.Add(helpData4);

            ItemHelpData.ItemsSource = Help;
        }
        private void btnScriptHelp_Click_1(object sender, RoutedEventArgs e)
        {
            HideShowPanel(4.0);
            HelpData helpData = new HelpData();
            helpData.Title = "How to use script scenario";
            helpData.ScenarioName = "4 Script Scenario";
            helpData.Details = "We have to test script scenario manually, E2EZumotest apps cannot test script scenario autometically. Follow below steps in order to test script scenario.\n\n" +
                "1. Add Script (insert, update, delete and read) in person table on portal.\n" +
                "2. Click on the Script scenario from the application.\n" +
                "3. Verify log manually\n";
            ObservableCollection<HelpData> Help = new ObservableCollection<HelpData>();
            Help.Add(helpData);
            ItemHelpData.ItemsSource = Help;
        }
        private void btnDynamicSchemaHelp_Click_1(object sender, RoutedEventArgs e)
        {
            HideShowPanel(5.0);
            HelpData helpData = new HelpData();
            helpData.Title = "How to use Dynamic Schema scenario";
            helpData.ScenarioName = "5.1 Verify Schema";
            helpData.Details = "1. Create an application on Windows azure portal.\n" +
            "2. Create TodoItem table in portal.\n" +
            "3. Enable dynamic schema in portal.\n" +
            "4. Add Valid Application URL and Application Key.\n" +
            "5. Click on '5.1 Verify Schema' Button.\n" +
            "6. Make sure all the scenario are pass.\n" +
            "7. Move to portal disable dynamic schema.\n" +
            "8. Run the scenario again make sure scenario fail this time.\n";

            ObservableCollection<HelpData> Help = new ObservableCollection<HelpData>();
            Help.Add(helpData);
            ItemHelpData.ItemsSource = Help;
        }
        private void btnPushNotificationHelp_Click_1(object sender, RoutedEventArgs e)
        {
            HideShowPanel(6.0);
            HelpData helpData = new HelpData();
            helpData.Title = "How to use Pudh notification scenario";
            helpData.ScenarioName = "6. Push notification";
            helpData.Details = "This scenario help you to push notification by using mobile service, follow below steps in order to do push notification.\n\n" +
                "1. Create a 'Channels' table in portal with default permission.\n" +
                "2. Copy all script from application(you can find all script under in script folder in E2EZumoTest application) and paste it in script tab.\n" +
                "3. Register your application on Live dashboard and add client secrat and SID in portal.\n" +
                "4. Run the application and execute push notification scenario one by one\n";
            ObservableCollection<HelpData> Help = new ObservableCollection<HelpData>();
            Help.Add(helpData);
            ItemHelpData.ItemsSource = Help;
        }
        #endregion

        #region RoundTripDataType and Run Query Scenario
        private async void btnRoundTripDataTypes_Click_1(object sender, RoutedEventArgs e)
        {
            if (TextValidation())
            {
                HideShowPanel(1.1);
                // o scenarios is for testing null for all datatypes
                string str = "{\"string1\":null,\"date1\":null,\"bool1\":null,\"number\":null,\"setindex\":null}";
                await VerifyNull(0, "Null Value", str, "Failed by Exception");

                try
                {
                    // insert dummy data for creating dynamic schema ...
                    await App.MobileService.GetTable<TodoItem>().InsertAsync(new TodoItem { string1 = "test", date1 = new DateTime(2011, 11, 11), bool1 = false, number = -1, setindex = "setindex" });
                }
                catch (Exception ex)
                {
                    lblOutput.Text = "Make sure TodoItem table created by you";
                }

                VerifyRoundTripDataTypes<string>(1, "Empty string", "", "Pass", 1);
                VerifyRoundTripDataTypes<string>(2, "Simple String", "Naren", "Pass", 1);
                VerifyRoundTripDataTypes<string>(3, "string(1000 char)", "Hi".PadRight(1000, '*'), "Pass", 1);
                VerifyRoundTripDataTypes<string>(4, "string(10000 char)", "Hi".PadRight(10000, '*'), "Pass", 1);
                // Date scenarios
                VerifyRoundTripDataTypes<string>(5, "Date by DateTime()", DateTime.Now.ToString(), "Pass", 2);
                VerifyRoundTripDataTypes<string>(6, "Date by DateTime(yy,mm,DD)", new DateTime(2012, 12, 12).ToString(), "Pass", 2);
                VerifyRoundTripDataTypes<string>(7, "Date by string", "2012-05-03T00:06:00.638Z", "Pass", 2);
                VerifyRoundTripDataTypes<string>(8, "Pass date as null", "null", "Pass", 2);
                VerifyRoundTripDataTypes<string>(9, " new Date()", new DateTime().ToString(), "Pass", 2);
                // Number Scenarios
                VerifyRoundTripDataTypes<double>(10, "Positive Number", 100, "Pass", 3);
                VerifyRoundTripDataTypes<double>(11, "Nagative Number", -100, "Pass", 3);
                VerifyRoundTripDataTypes<double>(12, "Zero", 0, "Pass", 3);
                VerifyRoundTripDataTypes<double>(13, "Double Min Number", Double.MinValue, "Pass", 3);
                VerifyRoundTripDataTypes<double>(14, "Double Max Number", Double.MaxValue, "Pass", 3);
                // Bool Scenarios
                VerifyRoundTripDataTypes<bool>(15, "True", true, "Pass", 4);
                VerifyRoundTripDataTypes<bool>(16, "False", false, "Pass", 4);
                VerifyRoundTripDataTypes<int>(17, "Int Max Number", int.MaxValue, "Pass", 5);
                VerifyRoundTripDataTypes<int>(18, "Int Min Number", int.MinValue, "Pass", 5);
                VerifyRoundTripDataTypes<long>(19, "Long Max Number", long.MaxValue, "Failed by Exception", 6);
                VerifyRoundTripDataTypes<long>(20, "Long Min Number", long.MinValue, "Pass", 6);

                VerifyRoundTripDataTypes<long>(21, "Long try int.MaxValue", (long)int.MaxValue, "Pass", 6);
                VerifyRoundTripDataTypes<long>(22, "Long try int.MinValue", (long)int.MinValue, "Pass", 6);
                VerifyRoundTripDataTypes<long>(23, "Long try int.MaxValue + 1", (long)int.MaxValue + 1, "Pass", 6);
                VerifyRoundTripDataTypes<long>(24, "Long try int.MinValue - 1", (long)int.MinValue - 1, "Pass", 6);

                VerifyRoundTripDataTypes<long>(25, "Long negative Boundary Number + 1", 0 - 9007199254740991, "Pass", 6);
                VerifyRoundTripDataTypes<long>(26, "Long negative Boundary Number", 0 - 9007199254740992, "Pass", 6); //0xFFE0000000000000, -9,007,199,254,740,992
                VerifyRoundTripDataTypes<long>(27, "Long negative Boundary Number - 1", 0 - 9007199254740993, "Failed by Exception", 6); //double here will loose precision and cannot be roundtripped

                VerifyRoundTripDataTypes<long>(28, "Long positive Boundary Number - 1", 9007199254740991, "Pass", 6);
                VerifyRoundTripDataTypes<long>(29, "Long positive Boundary Number", 9007199254740992, "Pass", 6);     //0x0020000000000000,  9,007,199,254,740,992
                VerifyRoundTripDataTypes<long>(30, "Long positive Boundary Number + 1", 9007199254740993, "Failed by Exception", 6); //double here will loose precision and cannot be roundtripped

                //string longString = "";
                ////for (int i = 0; i < 1024 * 1024 + 10; i++)
                ////    longString += "*";

                //VerifyRoundTripDataTypes<string>(31, "Insert Data > 1MB", longString, "Pass", 1);

                //Binding Data
                ItemData.ItemsSource = allResult;
                ItemExceptionData.ItemsSource = allExceptionResult;

            }
        }
        private void btnRunQuery_Click_1(object sender, RoutedEventArgs e)
        {
            if (TextValidation())
            {
                HideShowPanel(2.1); // hide the unwanted panles

                VerifyQuery(1, "Get all null from String1.", "null", "Pass");
                VerifyQuery(2, "Get all true from bool1.", "bool", "Pass");
                VerifyQuery(3, "Get all > 0 from number.", "number", "Pass");
                VerifyQuery(4, "Get all Date(2012,12,12) from date1", "date", "Pass");
                VerifyQuery(5, "Get all top " + top + " from table", "topskip", "Pass");
                top = 10; //set global variable
                VerifyQuery(6, "Get top 10 results whare name = 'Naren'", "wherewithtopskip", "Pass");
                top = 50; // reset global variable with default value.

                // Use int.MaxValue for skip
                skip = int.MaxValue - 50;
                VerifyQuery(7, "Skip Max value of integer", "maxskip", "Pass");
                skip = 0;
                VerifyQuery(8, "Order by", "orderdby", "Pass");
                VerifyQuery(9, "Lookup Id", "lookupid", "Pass");
                VerifyQuery(10, "toCollectionView", "toCollectionView", "Pass");
                VerifyQuery(11, "RefreshAsync", "refreshAsync", "Pass");
                VerifyQuery(12, "ReadAsync With String Query", "readAsyncWithQuery", "Pass");
                VerifyQuery(13, "Filtering on where with Date", "filtering1", "Pass");
                VerifyQuery(14, "Filtering with Equality operator", "filterring2", "Pass");
                VerifyQuery(15, "Filtering with all filter function", "filtering3", "Pass");
                VerifyQuery(16, "Filtering with primitive type", "filtering4", "Pass");
                VerifyQuery(17, "Projections1", "projections1", "Pass");
                VerifyQuery(18, "Projections2", "projections2", "Pass");
                VerifyQuery(19, "String.Contains()", "Contains", "Pass");
                VerifyQuery(20, "Del without passing id", "delWithoutId", "Failed by Exception");
                VerifyQuery(21, "Update without passing id", "updateWithoutId", "Failed by Exception");
                VerifyQuery(22, "Insert with passing id", "insertWithId", "Failed by Exception");
                VerifyQuery(23, "Verify Count Property", "countProperty", "Pass");
                VerifyQuery(24, "Verify Query by id:0", "queryById0", "Failed by Exception");
                VerifyQuery(25, "Verify Query by id:-1", "queryById-1", "Failed by Exception");
                VerifyQuery(26, "Insert data > 456 char on setindex column", "insertDataOnSetIndex", "Failed by Exception");
               // VerifyQuery(27, "Look up by Id", "lookupByIdInIMobileServiceTable", "Pass");

                //Binding Data
                ItemData.ItemsSource = allResult;
                ItemExceptionData.ItemsSource = allExceptionResult;
            }
        }
        //just do local conversation and initialize class property..
        private TodoItem LocalConversion<T>(int datatypeNumber, T inputString, TodoItem t1)
        {
            //Identify which Data type are pass 
            try
            {

                if (datatypeNumber == 1)
                    t1.string1 = inputString.ToString();
                else if (datatypeNumber == 2)
                {
                    if (string.Equals(inputString, "null"))
                        t1.date1 = null;
                    else
                        t1.date1 = Convert.ToDateTime(inputString);
                }
                else if (datatypeNumber == 3)
                    t1.number = Convert.ToDouble(inputString);
                else if (datatypeNumber == 4)
                    t1.bool1 = Convert.ToBoolean(inputString);
                else if (datatypeNumber == 5)
                    t1.intnum = Convert.ToInt32(inputString);
                else
                    t1.longnum = long.Parse(inputString.ToString());

                return t1;
            }
            catch (Exception ex)
            {
                lblOutput.Text = "make sure you are pass correct Value ";
                return null;
            }
        }
        private async void VerifyRoundTripDataTypes<T>(int id, string scenarioName, T inputString, string Expected, int datatypeNumber)
        {
            Data data = new Data { Id = id, Name = scenarioName, Value = inputString.ToString(), ActualResult = "", ExpectedResult = Expected };
            TodoItem t1 = LocalConversion<T>(datatypeNumber, inputString, new TodoItem());

            try
            {
                //Insert value
                await App.MobileService.GetTable<TodoItem>().InsertAsync(t1);
                List<TodoItem> item = new List<TodoItem>();
                item.Add(await App.MobileService.GetTable<TodoItem>().LookupAsync(t1.id));

                if (datatypeNumber == 1 && string.Equals(item[0].string1, inputString))
                {
                    data.GetValue = item[0].string1;
                    data.ActualResult = "Pass";
                }
                else if (datatypeNumber == 2)
                {
                    if (item[0].date1 == null && string.Equals(inputString, "null"))
                    {
                        data.GetValue = "null";
                        data.ActualResult = "Pass";
                    }
                    else if (item[0].date1 == Convert.ToDateTime(inputString))
                    {
                        data.GetValue = item[0].date1.ToString();
                        data.ActualResult = "Pass";
                    }
                    else
                    {
                        data.GetValue = item[0].date1.ToString();
                        data.ActualResult = "Fail";
                    }

                }
                else if (datatypeNumber == 3 && Object.Equals(item[0].number, inputString))
                {
                    data.GetValue = item[0].number.ToString();
                    data.ActualResult = "Pass";
                }
                else if (datatypeNumber == 4 && Object.Equals(item[0].bool1, inputString))
                {
                    data.GetValue = item[0].bool1.ToString();
                    data.ActualResult = "Pass";
                }
                else if (datatypeNumber == 5 && Object.Equals(item[0].intnum, inputString))
                {
                    data.GetValue = item[0].intnum.ToString();
                    data.ActualResult = "Pass";
                }
                else if (datatypeNumber == 6 && Object.Equals(item[0].longnum, inputString))
                {
                    data.GetValue = item[0].longnum.ToString();
                    data.ActualResult = "Pass";
                }
                else
                    data.ActualResult = "Fail";
                E2EZumoHelper.PassFail(data.ActualResult, data.ExpectedResult, data);

            }
            catch (ArgumentOutOfRangeException AOOREx)
            {
                if (data.ExpectedResult == "Failed by Exception")
                {
                    data.ActualResult = "Pass";
                    E2EZumoHelper.AddExceptionDetail(data, AOOREx.Message);
                }
                else
                {
                    data.ActualResult = "Fail";
                    E2EZumoHelper.AddExceptionDetail(data, AOOREx.Message);
                }
            }
            catch (Exception ex)
            {
                E2EZumoHelper.AddExceptionDetail(data, ex.Message);

            }

            allResult.Add(data);

        }
        private async Task VerifyNull(int id, string ScenarioName, string str, string Expected)
        {
            JsonObject jObj = JsonObject.Parse(str);
            Data data = new Data { Id = id, Name = ScenarioName, ActualResult = "", GetValue = "", Value = null, ExpectedResult = Expected };
            try
            {
                IJsonValue inserted = await App.MobileService.GetTable("TodoItem").InsertAsync(jObj);
                data.ExpectedResult = "Pass"; // Second time this scenario will be pass
                E2EZumoHelper.PassFail("Pass", data.ExpectedResult, data);

            }
            catch (MobileServiceInvalidOperationException MSIOEx)
            {
                if (MSIOEx.Response.StatusCode == 400 && MSIOEx.Response.Content.Contains("Unable to insert a null value for new property"))
                {
                    E2EZumoHelper.AddExceptionDetail(data, MSIOEx.Response.Content);
                }
                else
                {
                    data.ExpectedResult = "Fail";
                    E2EZumoHelper.AddExceptionDetail(data, MSIOEx.Response.Content);
                }
            }
            catch (Exception ex)
            {
                data.ExpectedResult = "Fail";
                E2EZumoHelper.AddExceptionDetail(data, ex.Message);

            }
            allResult.Add(data);


        }
        private async void VerifyQuery(int id, string scenarioName, string inputString, string Expected)
        {
            Data data = new Data { Id = id, Name = scenarioName, Value = "", ActualResult = "", ExpectedResult = Expected };
            try
            {

                IEnumerable<TodoItem> lists = null;
                if (inputString == "null")
                {
                    data.Value = "null";
                    lists = await App.MobileService.GetTable<TodoItem>().ReadAsync<TodoItem>(
                      from listValue in App.MobileService.GetTable<TodoItem>()
                      where listValue.string1 == null
                      select listValue);
                }
                if (inputString == "bool")
                {
                    data.Value = "true";
                    lists = await App.MobileService.GetTable<TodoItem>().ReadAsync<TodoItem>(
                      from listValue in App.MobileService.GetTable<TodoItem>()
                      where listValue.bool1 == true
                      select listValue);
                }
                if (inputString == "number")
                {
                    data.Value = "> 0";
                    lists = await App.MobileService.GetTable<TodoItem>().ReadAsync<TodoItem>(
                      from listValue in App.MobileService.GetTable<TodoItem>()
                      where listValue.number > 0
                      select listValue);
                }
                if (inputString == "date")
                {
                    data.Value = "new Date(2012,12,12)";
                    lists = await App.MobileService.GetTable<TodoItem>().ReadAsync<TodoItem>(
                      from listValue in App.MobileService.GetTable<TodoItem>()
                      where listValue.date1 == new DateTime(2012, 12, 12)
                      select listValue);

                }
                if (inputString == "topskip")
                {
                    // top and skip are the globel variable
                    data.Value = "Top = " + top + " and Skip = " + skip;
                    lists = await App.MobileService.GetTable<TodoItem>().ReadAsync<TodoItem>(
                      (from listValue in App.MobileService.GetTable<TodoItem>()
                       select listValue).Take(top).Skip(skip));

                }
                if (inputString == "wherewithtopskip")
                {
                    // top and skip are the globel variable
                    data.Value = "Top = " + top + " and Skip = " + skip;
                    lists = await App.MobileService.GetTable<TodoItem>().ReadAsync<TodoItem>(
                      (from listValue in App.MobileService.GetTable<TodoItem>()
                       where listValue.string1 == "Naren"
                       select listValue).Take(top).Skip(skip));
                }
                if (inputString == "Contains")
                {

                    data.Value = "String.Contains()";
                    lists = await App.MobileService.GetTable<TodoItem>().Where(c => c.string1.Contains("ren")).ToEnumerableAsync();

                }

                if (inputString == "maxskip")
                {
                    // top and skip are the globel variable
                    data.Value = "Top = " + top + " and Skip = " + skip;
                    lists = await App.MobileService.GetTable<TodoItem>().ReadAsync<TodoItem>(
                      (from listValue in App.MobileService.GetTable<TodoItem>()
                       select listValue).Take(top).Skip(skip));
                }
                if (inputString == "orderdby")
                {
                    data.Value = "Orderd by";
                    lists = await App.MobileService.GetTable<TodoItem>().ReadAsync<TodoItem>(
                      (from listValue in App.MobileService.GetTable<TodoItem>()
                       select listValue).OrderBy(O => O.id));
                }
                //Lookup ID
                if (inputString == "lookupid")
                {
                    List<TodoItem> Items = new List<TodoItem>();
                    data.Value = "Loookup Id";
                    Items.Add(await App.MobileService.GetTable<TodoItem>().LookupAsync(5));
                    if (Items.Count > 0)
                    {
                        data.GetValue = "Found " + Items.Count + " results.";
                        E2EZumoHelper.PassFail("Pass", data.ExpectedResult, data);
                    }
                    else
                    {
                        E2EZumoHelper.PassFail("Fail", data.ExpectedResult, data);
                        lblOutput.Text = "Make sure table is not empty!";
                    }

                }
                // Look up Id in  IMobileServcie Table
                if (inputString == "lookupByIdInIMobileServiceTable")
                {
                    //data.Value = "Loookup Id in IMobileService Table";
                    //IMobileServiceTable todoTable = App.MobileService.GetTable("TodoItem");
                    //IJsonValue json = await todoTable.LookupAsync(5);
                    //if ((int)JsonObject.Parse(json.Stringify())["id"].GetNumber() == 5)
                    //{
                    //    data.GetValue = "Found 1 results.";
                    //    E2EZumoHelper.PassFail("Pass", data.ExpectedResult, data);
                    //}
                    //else
                    //{
                    //    E2EZumoHelper.PassFail("Fail", data.ExpectedResult, data);
                    //    lblOutput.Text = "Make sure table is not empty!";
                    //}

                }
                if (inputString == "readAsyncWithQuery")
                {
                    data.Value = "ReadAsync With Query";
                    //get the Json string
                    IJsonValue json = await App.MobileService.GetTable<TodoItem>().ReadAsync("$filter= id eq 1 &$orderby=string1");
                    string str = json.Stringify();
                    JsonArray jsonObj = JsonArray.Parse(str);
                    foreach (var jsonStr in jsonObj)
                    {
                        var lid = (int) JsonObject.Parse(jsonStr.Stringify())["id"].GetNumber();
                        var name = JsonObject.Parse(jsonStr.Stringify())["string1"].GetString();
                        if (lid == 1 && name == "test")
                        {
                            data.GetValue = "Found 1 result";
                            E2EZumoHelper.PassFail("Pass", data.ExpectedResult, data);
                        }
                        else
                            E2EZumoHelper.PassFail("Fail", data.ExpectedResult, data);
                    }


                }
                if (inputString == "refreshAsync")
                {
                    data.Value = "RefreshAsync";
                    await App.MobileService.GetTable<TodoItem>().RefreshAsync(new TodoItem { id = 1 });
                    E2EZumoHelper.PassFail("Pass", data.ExpectedResult, data);
                }
                if (inputString == "toCollectionView")
                {
                    data.Value = "ToCollectionView";
                    MobileServiceCollectionView<TodoItem> view = App.MobileService.GetTable<TodoItem>().ToCollectionView();
                    data.GetValue = "Found " + view.Count + " results.";
                    E2EZumoHelper.PassFail("Pass", data.ExpectedResult, data);

                }

                if (inputString == "filtering1")
                {
                    data.Value = "Filtering1 [On where with Date ]";
                    lists = await App.MobileService.GetTable<TodoItem>().Where(t => t.date1 == DateTime.Now).ToEnumerableAsync();

                }

                if (inputString == "filterring2")
                {
                    data.Value = "Filtering 2 [with Equality operator]";
                    lists = await App.MobileService.GetTable<TodoItem>().Where(
                        t => t.bool1 == false || t.id > 1 || t.id < 1 || t.id >= 1 || t.id <= 1 || t.id != 1).ToEnumerableAsync();//|| !(t.bool1)).ToEnumerableAsync();
                }

                if (inputString == "filtering3")
                {
                    data.Value = "filtering3 [with all filter function]";
                    lists = await App.MobileService.GetTable<TodoItem>()
                        .Where(t => (t.id >= 1) && (t.id <= 10))
                        .Where(t => t.date1 == null)
                        .Where(t => !(t.bool1 == true))
                        .Where(t => t.bool1 == false || t.id == 1 && t.date1 == DateTime.Now)
                        .Where(t => t.date1 > DateTime.Now)
                        .OrderBy(t => t.id)
                        .OrderByDescending(t => t.string1)
                        .ThenByDescending(t => t.id)
                        .ThenBy(t => t.string1)
                        .Select(t => t)
                        .Skip(1)
                        .Take(10).ToEnumerableAsync();

                }

                //where with all primitive types                         
                //you will run into this bug http://bung/Dev11/Search.aspx?q=466610 

                if (inputString == "filtering4")
                {
                    data.Value = "Filtering [ Primitive Types ]";
                    short x = 2;
                    float f = (float)2.1;
                    double d = (double)3.1;
                    lists = await App.MobileService.GetTable<TodoItem>()
                        .Where(t => t.id == x && t.id < f && t.id < d).ToEnumerableAsync();
                }
                if (inputString == "projections1")
                {
                    data.Value = "Projections1";
                    var itemLists = (from t in App.MobileService.GetTable<TodoItem>()
                                     orderby t.id ascending
                                     select new { Name = t.id + ":" + t.string1, id = t.id });
                    data.GetValue = "Executed";
                    E2EZumoHelper.PassFail("Pass", data.ExpectedResult, data);
                }
                if (inputString == "projections2")
                {
                    data.Value = "Projections2";
                    var itemLists = (from t in App.MobileService.GetTable<TodoItem>()
                                     orderby t.id ascending
                                     select new { Name = t.string1.ToUpper(), Id = t.id });
                    data.GetValue = "Executed";
                    E2EZumoHelper.PassFail("Pass", data.ExpectedResult, data);
                }

                if (inputString == "delWithoutId")
                {
                    data.Value = "Del without passing ID";
                    try
                    {
                        await App.MobileService.GetTable<TodoItem>().DeleteAsync(new TodoItem() { bool1 = true, date1 = new DateTime() });
                        data.GetValue = "Deleted";
                        E2EZumoHelper.PassFail("Pass", data.ExpectedResult, data);
                    }
                    catch (Exception ex)
                    {
                        if (ex.Message.Contains("Expected id member not found."))
                            E2EZumoHelper.AddExceptionDetail(data, ex.Message);
                        else
                        {
                            data.ExpectedResult = "Fail";
                            E2EZumoHelper.AddExceptionDetail(data, ex.Message);
                        }
                    }

                }
                if (inputString == "updateWithoutId")
                {
                    data.Value = "Update without passing ID";
                    try
                    {
                        await App.MobileService.GetTable<TodoItem>().UpdateAsync(new TodoItem() { bool1 = true, date1 = new DateTime() });
                        data.GetValue = "Updated";
                        E2EZumoHelper.PassFail("Pass", data.ExpectedResult, data);
                    }
                    catch (Exception ex) // Check exception message and handle it here only
                    {
                        if (ex.Message.Contains("Expected id member not found."))
                            E2EZumoHelper.AddExceptionDetail(data, ex.Message);
                        else
                        {
                            data.ExpectedResult = "Fail";
                            E2EZumoHelper.AddExceptionDetail(data, ex.Message);
                        }
                    }
                }
                if (inputString == "insertWithId")
                {
                    data.Value = "Insert with passing ID";
                    try
                    {
                        await App.MobileService.GetTable<TodoItem>().InsertAsync(new TodoItem() { id = 1000, bool1 = true, date1 = new DateTime() });
                        data.GetValue = "Insert ID";
                        E2EZumoHelper.PassFail("Pass", data.ExpectedResult, data);
                    }
                    catch (Exception ex)
                    {
                        if (ex.Message.Contains("Cannot insert if the id member is already set."))
                            E2EZumoHelper.AddExceptionDetail(data, ex.Message);
                        else
                        {
                            data.ExpectedResult = "Fail";
                            E2EZumoHelper.AddExceptionDetail(data, ex.Message);
                        }
                    }
                }

                if (inputString == "countProperty")
                {
                    data.Value = "Count property";
                    MobileServiceCollectionView<TodoItem> dataSource = App.MobileService.GetTable<TodoItem>().Take(5).IncludeTotalCount().ToCollectionView();
                    while (dataSource.Count <= 0)
                    {
                        // Just wait till we are not get count value
                        await System.Threading.Tasks.Task.Delay(500);
                    }
                    if (dataSource.Count == 5)
                    {
                        data.GetValue = "Found " + dataSource.Count + " Results.";
                        E2EZumoHelper.PassFail("Pass", data.ExpectedResult, data);
                    }
                    else
                    {
                        data.GetValue = "Found " + dataSource.Count + " Results.";
                        E2EZumoHelper.PassFail("Failed", data.ExpectedResult, data);
                    }

                }
                if (inputString == "queryById0")
                {
                    data.Value = "Query by id : 0";
                    List<TodoItem> Items = new List<TodoItem>();
                    try
                    {
                        Items.Add(await App.MobileService.GetTable<TodoItem>().LookupAsync(0));
                        if (Items.Count > 0)
                        {
                            data.GetValue = "Found " + Items.Count + " results.";
                            E2EZumoHelper.PassFail("Pass", data.ExpectedResult, data);
                        }
                        else
                        {
                            E2EZumoHelper.PassFail("Failed", data.ExpectedResult, data);
                            lblOutput.Text = "Make sure table is not empty!";
                        }
                    }
                    catch (MobileServiceInvalidOperationException MSIOEInner) // Need to verify statusCode and message so handle it here
                    {
                        if (MSIOEInner.Response.StatusCode == 404 && MSIOEInner.Response.Content.Contains("An item with id '0' does not exist"))
                            data.ExpectedResult = "Failed by Exception";
                        else
                        {
                            data.ExpectedResult = "Fail"; // if we are not get 404 exception then fail this scenario
                            lblOutput.Text += "\n Scenario '" + inputString + "' failed because exception message doesn't contain 404 status code";
                        }
                        throw MSIOEInner;
                    }
                    catch (Exception ex)
                    {
                        data.ExpectedResult = "Fail"; // if we are not get 404 exception then fail this scenario
                        lblOutput.Text += "\n Scenario '" + inputString + "' failed because exception message doesn't contain 404 status code";
                        throw ex;
                    }


                }
                if (inputString == "queryById-1")
                {
                    data.Value = "Query by id : -1";
                    List<TodoItem> Items = new List<TodoItem>();
                    try
                    {
                        Items.Add(await App.MobileService.GetTable<TodoItem>().LookupAsync(-1));
                        if (Items.Count > 0)
                        {
                            data.GetValue = "Found " + Items.Count + " results.";
                            E2EZumoHelper.PassFail("Pass", data.ExpectedResult, data);
                        }
                        else
                        {
                            E2EZumoHelper.PassFail("Failed", data.ExpectedResult, data);
                            lblOutput.Text = "Make sure table is not empty!";
                        }
                    }
                    catch (MobileServiceInvalidOperationException MSIOEInner) // Need to verify statusCode and message so handle it here
                    {
                        if (MSIOEInner.Response.StatusCode == 404 && MSIOEInner.Response.Content.Contains("An item with id '-1' does not exist"))
                            data.ExpectedResult = "Failed by Exception";
                        else
                        {
                            data.ExpectedResult = "Fail"; // if we are not get 404 exception then fail this scenario
                            lblOutput.Text += "\n Scenario '" + inputString + "' failed because exception message doesn't contain 404 status code";
                        }
                        throw MSIOEInner;
                    }
                    catch (Exception ex)
                    {
                        data.ExpectedResult = "Fail"; // if we are not get 404 exception then fail this scenario
                        lblOutput.Text += "\n Scenario '" + inputString + "' failed because exception message doesn't contain 404 status code";
                        throw ex;
                    }

                }
                if (inputString == "insertDataOnSetIndex")
                {
                    data.Value = "insert > 450 char";
                    string longString = "";
                    for (int i = 0; i <= 450; i++)
                        longString += "*";
                    try
                    {
                        // Set index first on setindex coulmn from the protal and run this scenarion. this scenario throw 400 bad request exception
                        await App.MobileService.GetTable<TodoItem>().InsertAsync(new TodoItem { setindex = longString });
                        data.GetValue = longString;
                        E2EZumoHelper.PassFail("Pass", data.ExpectedResult, data);
                        lblOutput.Text += "\n Scenario '" + inputString + "' failed because you didn't Set index on 'setindex' column in 'TodoItem' table";
                    }
                    catch (MobileServiceInvalidOperationException MSIOEx)
                    {
                        if (MSIOEx.Response.StatusCode == 400)
                            E2EZumoHelper.AddExceptionDetail(data, MSIOEx.Response.Content, false);
                        else
                        {
                            data.ExpectedResult = "Fail";
                            E2EZumoHelper.AddExceptionDetail(data, MSIOEx.Response.Content, true);
                            lblOutput.Text += "\n Scenario '" + inputString + "' failed because exception message doesn't contain 400 status code";
                        }
                    }
                    catch (Exception ex)
                    {
                        data.ExpectedResult = "Fail";
                        E2EZumoHelper.AddExceptionDetail(data, ex.Message, true);
                        lblOutput.Text += "\n Scenario '" + inputString + "' failed because exception message doesn't contain 400 status code";
                    }

                }
                // Common code
                if (lists != null)
                {
                    List<TodoItem> list = lists.ToList();
                    if (list.Count >= 0)
                    {
                        data.GetValue = "Found " + list.Count + " results.";
                        E2EZumoHelper.PassFail("Pass", data.ExpectedResult, data);
                    }
                }
            }
            catch (MobileServiceInvalidOperationException MSIOE) // Common exception handling for all the scenario
            {
                if (MSIOE.Response.StatusCode == 404)
                    E2EZumoHelper.AddExceptionDetail(data, MSIOE.Response.Content, false);
                //E2EZumoHelper.PassFail("Failed by Exception", "Failed by Exception", data);
                else
                    E2EZumoHelper.AddExceptionDetail(data, MSIOE.Response.Content);

            }
            catch (Exception ex)
            {
                string message = "";
                if (ex.Message.Contains("A method was called at an unexpected time."))
                    message = "[Hint]: Please delete TodoItem table from portal and re-create it and try again!";

                E2EZumoHelper.AddExceptionDetail(data, message + ex.Message);
            }

            allResult.Add(data);

        }

        #endregion

        #region Permission Scenarios
        private async void btnEveryOne_Click_1(object sender, RoutedEventArgs e)
        {
            HideAllPanel();
            HideShowPanel(3.2);
            if (PermissionTextValidation(3.1))
            {

                App.MobileService = new MobileServiceClient(txtURL.Text.Trim());
                await E2EZumoHelper.ZumoCRUD(30, ZumoPermissions.EveryOne.ToString(), "Pass", "PermissionPublic");
            }

            //Binding Data
            ItemData.ItemsSource = allResult;
            ItemExceptionData.ItemsSource = allExceptionResult;
        }
        private async void btnApplicationKey_Click_1(object sender, RoutedEventArgs e)
        {
            HideAllPanel();
            HideShowPanel(3.1);
            if (PermissionTextValidation(3.2))
            {
                App.MobileService = new MobileServiceClient(txtURL.Text.Trim(), txtKey.Text.Trim());
                await E2EZumoHelper.ZumoCRUD(10, ZumoPermissions.ApplicationKey.ToString(), "Pass", "PermissionApplication");
                App.MobileService = new MobileServiceClient(txtURL.Text.Trim());
                await E2EZumoHelper.ZumoCRUD(20, "Without Key", "Failed by Exception", "PermissionApplication");
            }
            //Binding Data
            ItemData.ItemsSource = allResult;
            ItemExceptionData.ItemsSource = allExceptionResult;
        }
        
        private async void btnScript_Click_1(object sender, RoutedEventArgs e)
        {
            HideAllPanel();
            HideShowPanel(3.4);
            if (PermissionTextValidation(3.4))
            {

                try
                {
                    App.MobileService = new MobileServiceClient(txtURL.Text.Trim());
                    await E2EZumoHelper.ZumoCRUD(50, ZumoPermissions.ScriptsAndAdmins.ToString(), "Pass", "PermissionAdmin");
                    await E2EZumoHelper.ZumoLogin(redirectURL);
                    lblWelcome.Text = "Welcome, " + E2EZumoHelper.username;
                    btnSignin.Content = "Signout";
                    await E2EZumoHelper.ZumoCRUD(60, ZumoPermissions.Authenticated.ToString(), "Failed by Exception", "PermissionAdmin");
                    // E2EZumoHelper.ZumoLogout(txtRedirectURL.Text.Trim());
                }
                catch (Exception ex)
                {
                    lblOutput.Text = "[Hint]: Exception Occur while connecting live sdk : " + ex.Message;
                }
                //Binding Data
                ItemData.ItemsSource = allResult;
                ItemExceptionData.ItemsSource = allExceptionResult;
            }
        }
        private async void btnSignin_Click_1(object sender, RoutedEventArgs e)
        {
            if (btnSignin.Content.ToString() == "Sign in (live SDK)")
            {
                HideAllPanel();
                HideShowPanel(3.3);
                try
                {
                    if (PermissionTextValidation(3.3))
                    {
                        App.MobileService = new MobileServiceClient(txtURL.Text.Trim());
                        await E2EZumoHelper.ZumoLogin(redirectURL);
                        loginStatus = "login";
                        btnSignin.Content = "Signout";
                        lblWelcome.Text = E2EZumoHelper.username;
                    }
                   
                }
                catch (Exception ex)
                {
                    lblOutput.Text = "[Hint]: Exception Occur while connecting live sdk : " + ex.Message;

                }
            }
            else
            {
                try
                {
                    if (TextValidation())
                    {
                        E2EZumoHelper.ZumoLogout(redirectURL);
                        btnSignin.Content = "Sign in (live SDK)";
                        loginStatus = "logout";
                        lblWelcome.Text = "";
                    }
                }
                catch (Exception ex)
                {
                    lblOutput.Text = "[Hint]: Exception Occur while connecting live sdk : " + ex.Message;
                }
            }
        }


        private void btnLiveSDK_Click_1(object sender, RoutedEventArgs e)
        {
            try
            {
                AuthenticationPermission("LiveSDK");
            }
            catch (Exception ex)
            {
                lblOutput.Text = "[Hint]: Exception Occur while connecting live sdk : " + ex.Message;
            }
        }
        private void btnMicrosoft_Click_1(object sender, RoutedEventArgs e)
        {
            try
            {
                AuthenticationPermission("Microsoft");
            }
            catch (Exception ex)
            {
                lblOutput.Text = "[Hint]: Exception Occur while connecting live sdk : " + ex.Message;
            }
        }
        private void btnTwitter_Click_1(object sender, RoutedEventArgs e)
        {
            try
            {
                AuthenticationPermission("Twitter");
            }
            catch (Exception ex)
            {
                lblOutput.Text = "[Hint]: Exception Occur while connecting Twitter sdk : " + ex.Message;
            }
        }
        private void btnFacebook_Click_1(object sender, RoutedEventArgs e)
        {
            try
            {
                AuthenticationPermission("Facebook");
            }
            catch (Exception ex)
            {
                lblOutput.Text = "[Hint]: Exception Occur while connecting Facebook : " + ex.Message;
            }
        }
        private void btnGoogle_Click_1(object sender, RoutedEventArgs e)
        {
            try
            {
                AuthenticationPermission("Google");
            }
            catch (Exception ex)
            {
                lblOutput.Text = "[Hint]: Exception Occur while connecting Google : " + ex.Message;
            }
        }
        private void AuthenticationPermission(string provider)
        {
            HideAllPanel();
            HideShowPanel(3.3);
            if (PermissionTextValidation(3.3))
            {
                App.MobileService = new MobileServiceClient(txtURL.Text.Trim());
                AuthenticationPermissionScenario(provider);

            }
        }
        private async void AuthenticationPermissionScenario(string provider)
        {
            HideAllPanel();
            HideShowPanel(3.3);
            if (PermissionTextValidation(3.3))
            {
                try
                {
                    if (provider.Equals("LiveSDK"))
                    {
                        await E2EZumoHelper.ZumoLogin(redirectURL);
                        await E2EZumoHelper.ZumoCRUD(40, ZumoPermissions.Authenticated.ToString(), "Pass", "PermissionUser");
                        lblWelcome.Text = "Welcome, " + E2EZumoHelper.username;
                        btnSignin.Content = "Signout";

                    }
                    else if (provider.Equals("Microsoft"))
                    {
                        var task = App.MobileService.LoginAsync(MobileServiceAuthenticationProvider.MicrosoftAccount);
                        var user = await task;
                        if (!user.UserId.Equals(""))
                        {
                            await E2EZumoHelper.ZumoCRUD(0, "Web " + ZumoPermissions.Authenticated.ToString(), "Pass", "PermissionUser");

                            // Initialized UserAccess instance with the UserId
                            UserAccess userAccess = new UserAccess { userId = user.UserId };
                            await App.MobileService.GetTable<UserAccess>().InsertAsync(userAccess);

                            App.MobileService.Logout(); // Log out the Web loging
                            if (userAccess != null)
                            {
                               
                                //Just get the live authentication code by using the live sdk
                                Microsoft.Live.LiveAuthClient live = new Microsoft.Live.LiveAuthClient(redirectURL);
                                var liveLoginResult = await live.LoginAsync(new string[] { "wl.signin", "wl.basic" });
                                
                                JsonObject jobj = new JsonObject();
                                jobj.Add("authenticationToken", JsonValue.CreateStringValue(liveLoginResult.Session.AuthenticationToken));
                                
                                await App.MobileService.LoginAsync(MobileServiceAuthenticationProvider.MicrosoftAccount, jobj);
                                await E2EZumoHelper.ZumoCRUD(4, "Token " + ZumoPermissions.Authenticated.ToString(), "Pass", "PermissionUser");
                                App.MobileService.Logout();
                            }
                            else
                            {
                                lblOutput.Text = "[Hint]: App unable to get User Id, Make sure add insert script in userAccess table on the portal.";
                                return;
                            }

                        }
                    }
                    else if (provider.Equals("Twitter"))
                    {
                        var task = App.MobileService.LoginAsync(MobileServiceAuthenticationProvider.Twitter);
                        var user = await task;
                        if (!user.UserId.Equals(""))
                        {
                            await E2EZumoHelper.ZumoCRUD(0, "Web " + ZumoPermissions.Authenticated.ToString(), "Pass", "PermissionUser");

                            // Initialized UserAccess instance with the UserId
                            UserAccess userAccess = new UserAccess { userId = user.UserId };
                            await App.MobileService.GetTable<UserAccess>().InsertAsync(userAccess);

                            App.MobileService.Logout(); // Log out the Web loging

                            //**** Twitter is not implemented on server side  *******************
                            lblOutput.Text = "Twitter is not implemented on the server side, yet";
                        }
                    }
                    else if (provider.Equals("Google"))
                    {
                        var task = App.MobileService.LoginAsync(MobileServiceAuthenticationProvider.Google);
                        var user = await task;
                        if (!user.UserId.Equals(""))
                        {
                            await E2EZumoHelper.ZumoCRUD(0, "Web " + ZumoPermissions.Authenticated.ToString(), "Pass", "PermissionUser");

                            // Initialized UserAccess instance with the UserId
                            UserAccess userAccess = new UserAccess { userId = user.UserId };
                            await App.MobileService.GetTable<UserAccess>().InsertAsync(userAccess);

                            App.MobileService.Logout(); // Log out the Web loging
                            if (userAccess != null)
                            {
                                JsonObject jobj = new JsonObject();
                                jobj.Add("access_token", JsonValue.CreateStringValue(userAccess.identities));
                                // login again with access token
                                await App.MobileService.LoginAsync(MobileServiceAuthenticationProvider.Google, jobj);
                                await E2EZumoHelper.ZumoCRUD(4, "Token " + ZumoPermissions.Authenticated.ToString(), "Pass", "PermissionUser");

                                App.MobileService.Logout();
                            }
                            else
                            {
                                lblOutput.Text = "[Hint]: App unable to get User Id, Make sure add insert script in userAccess table on the portal.";
                                return;
                            }

                        }
                    }
                    else
                    {
                        var task = App.MobileService.LoginAsync(MobileServiceAuthenticationProvider.Facebook);
                        var user = await task;
                        if (!user.UserId.Equals(""))
                        {
                            await E2EZumoHelper.ZumoCRUD(0, "Web " + ZumoPermissions.Authenticated.ToString(), "Pass", "PermissionUser");

                            // Initialized UserAccess instance with the UserId
                            UserAccess userAccess = new UserAccess { userId = user.UserId };
                            await App.MobileService.GetTable<UserAccess>().InsertAsync(userAccess);

                            App.MobileService.Logout(); // Log out the Web loging
                            if (userAccess != null)
                            {
                                JsonObject jobj = new JsonObject();
                                jobj.Add("access_token", JsonValue.CreateStringValue(userAccess.identities));
                                // login again with access token
                                await App.MobileService.LoginAsync(MobileServiceAuthenticationProvider.Facebook, jobj);
                                await E2EZumoHelper.ZumoCRUD(4, "Token " + ZumoPermissions.Authenticated.ToString(), "Pass", "PermissionUser");

                                App.MobileService.Logout();
                            }
                            else
                            {
                                lblOutput.Text = "[Hint]: App unable to get User Id, Make sure add insert script in userAccess table on the portal.";
                                return;
                            }

                        }
                    }
                }
                catch (Exception ex)
                {
                    lblOutput.Text = ex.Message;

                }
                //Binding Data
                ItemData.ItemsSource = allResult;
                ItemExceptionData.ItemsSource = allExceptionResult;
            }
        }
        #endregion

        #region Script Scenario
        private async void btnScriptInsert_Click_1(object sender, RoutedEventArgs e)
        {
            HideAllPanel();
            HideShowPanel(4.1);
            if (TextValidation())
            {
                if (loginStatus == "login")
                {
                    App.MobileService = new MobileServiceClient(txtURL.Text.Trim());
                    await E2EZumoHelper.ZumoLogin(redirectURL);
                }
                await E2EZumoHelper.ScriptOperation(1, "Insert", "Insert");
            }
            //Binding Data
            ItemData.ItemsSource = allResult;
            ItemExceptionData.ItemsSource = allExceptionResult;
        }
        private async void btnScriptUpdate_Click_1(object sender, RoutedEventArgs e)
        {
            HideAllPanel();
            HideShowPanel(4.1);
            if (TextValidation())
            {
                if (loginStatus == "login")
                {
                    App.MobileService = new MobileServiceClient(txtURL.Text.Trim());
                    await E2EZumoHelper.ZumoLogin(redirectURL);
                }
                await E2EZumoHelper.ScriptOperation(1, "Update", "Update");
            }
            //Binding Data
            ItemData.ItemsSource = allResult;
            ItemExceptionData.ItemsSource = allExceptionResult;

        }
        private async void btnScriptRead_Click_1(object sender, RoutedEventArgs e)
        {
            HideAllPanel();
            HideShowPanel(4.1);
            if (TextValidation())
            {
                if (loginStatus == "login")
                {
                    App.MobileService = new MobileServiceClient(txtURL.Text.Trim());
                    await E2EZumoHelper.ZumoLogin(redirectURL);
                }
                await E2EZumoHelper.ScriptOperation(1, "Read", "Read");
            }
            //Binding Data
            ItemData.ItemsSource = allResult;
            ItemExceptionData.ItemsSource = allExceptionResult;

        }
        private async void btnScriptDelete_Click_1(object sender, RoutedEventArgs e)
        {
            HideAllPanel();
            HideShowPanel(4.1);
            if (TextValidation())
            {
                if (loginStatus == "login")
                {
                    App.MobileService = new MobileServiceClient(txtURL.Text.Trim());
                    await E2EZumoHelper.ZumoLogin(redirectURL);
                }
                await E2EZumoHelper.ScriptOperation(1, "Delete", "Delete");
            }
            //Binding Data
            ItemData.ItemsSource = allResult;
            ItemExceptionData.ItemsSource = allExceptionResult;

        }
        #endregion

        #region Dynamic schema and Push Notification Scenarios

        private async void btnVerifySchema_Click_1(object sender, RoutedEventArgs e)
        {
            HideAllPanel();
            HideShowPanel(5.1);
            if (TextValidation())
            {

                string newGuid = Guid.NewGuid().ToString().Replace('-', '_');
                string schemaColumn = "\"Col" + newGuid + "\":\"Val" + newGuid + "\"";
                await E2EZumoHelper.VerifySchema(1, "Dynamic Schema Enabled", schemaColumn, "Pass");
                //Binding Data
                ItemData.ItemsSource = allResult;
                ItemExceptionData.ItemsSource = allExceptionResult;
            }

        }
        private async void btnPushNotificationInsert_Click_1(object sender, RoutedEventArgs e)
        {
            HideAllPanel();
            HideShowPanel(6.1);
            if (TextValidation())
            {

                await PushNotificationOperation(1, "PushNotification", "Insert", "Pass");

                //Binding Data
                ItemData.ItemsSource = allResult;
                ItemExceptionData.ItemsSource = allExceptionResult;
            }
        }
        private async void btnPushNotificationUpdate_Click_1(object sender, RoutedEventArgs e)
        {
            HideAllPanel();
            HideShowPanel(6.2);
            if (TextValidation())
            {

                await PushNotificationOperation(1, "PushNotification", "Update", "Pass");
                //Binding Data
                ItemData.ItemsSource = allResult;
                ItemExceptionData.ItemsSource = allExceptionResult;
            }
        }
        private async void btnPushNotificationDelete_Click_1(object sender, RoutedEventArgs e)
        {
            HideAllPanel();
            HideShowPanel(6.3);
            if (TextValidation())
            {

                await PushNotificationOperation(1, "PushNotification", "Delete", "Pass");
                //Binding Data
                ItemData.ItemsSource = allResult;
                ItemExceptionData.ItemsSource = allExceptionResult;
            }
        }
        private async void btnPushNotificationSendRaw_Click_1(object sender, RoutedEventArgs e)
        {
            HideAllPanel();
            HideShowPanel(6.3);
            if (TextValidation())
            {
                PushNotificationChannel rawChannel = await PushNotificationChannelManager.CreatePushNotificationChannelForApplicationAsync();
                await App.MobileService.GetTable<Channels>().InsertAsync
                            (new Channels { Name = "Naren Chejara", ChannelURL = rawChannel.Uri });
            }
        }
        // Send Push notification
        private async Task PushNotificationOperation(int id, string ScenarioName, string Operation, string ExpectedResult)
        {
            Data data = new Data
            {
                Id = id,
                Name = ScenarioName + " [ " + Operation + " ] ",
                Value = Operation,
                ActualResult = "",
                ExpectedResult = ExpectedResult
            };
            switch (Operation)
            {
                case "Insert":
                    string channelURI = await GetChannelURI();
                    if (channelURI == "")
                    {
                        lblOutput.Text = "[Hint] : Unable to get Channels URI from 'PushNotificationChannelManager.CreatePushNotificationChannelForApplicationAsync()'";
                        return;
                    }
                    try
                    {
                        await App.MobileService.GetTable<Channels>().InsertAsync
                            (new Channels { Name = "Naren Chejara", ChannelURL = channelURI });
                        data.GetValue = "Inserted";
                        E2EZumoHelper.PassFail("Pass", data.ExpectedResult, data);
                        lblOutput.Text = "[Hint] : If you are not able to get toast message then please check below steps\n" +
                        "1. Make sure toast setting in Package.appxManifest file is correct.\n" +
                        "2. Make sure you added all required script in Channels table.\n" +
                        "3. Make sure you added Client Secret and package SID in portal.";
                    }
                    catch (Exception ex)
                    {
                        E2EZumoHelper.PassFail("Fail by Exception", data.ExpectedResult, data);
                        allExceptionResult.Add(new ExceptionData { Name = data.Name, ExceptionDetails = ex.Message });
                    }
                    break;

                case "Update":

                    try
                    {
                        // Reading dat from the tables
                        IEnumerable<Channels> lists = await App.MobileService.GetTable<Channels>().ReadAsync<Channels>
                            (from listValue in App.MobileService.GetTable<Channels>()
                             where listValue.Name == "Naren Chejara"
                             select listValue);

                        List<Channels> list = lists.ToList();
                        if (list.Count > 0)
                        {
                            //Updating data in table ...
                            await App.MobileService.GetTable<Channels>().UpdateAsync
                                (new Channels { id = list[0].id, Name = "Naren Chejara", ChannelURL = list[0].ChannelURL });
                            data.GetValue = "Updated";
                            E2EZumoHelper.PassFail("Pass", data.ExpectedResult, data);
                        }
                        else
                        {
                            lblOutput.Text = "[Hint] : 'Naren Chejara' does not exists in Channels table, in order to insert it Click on Insert in Push Notification";
                            throw new Exception("Table does not have data or 'Naren Chejara' doesn't exist in table");
                        }
                    }
                    catch (Exception ex)
                    {
                        E2EZumoHelper.PassFail("Fail by Exception", data.ExpectedResult, data);
                        allExceptionResult.Add(new ExceptionData { Name = data.Name, ExceptionDetails = ex.Message });
                    }
                    break;

                case "Delete":
                    try
                    {
                        // Reading dat from the tables
                        IEnumerable<Channels> lists = await App.MobileService.GetTable<Channels>().ReadAsync<Channels>
                            (from listValue in App.MobileService.GetTable<Channels>()
                             where listValue.Name == "Naren Chejara"
                             select listValue);

                        List<Channels> list = lists.ToList();
                        if (list.Count > 0)
                        {

                            //Deleteing data from the table
                            await App.MobileService.GetTable<Channels>().DeleteAsync
                            (new Channels { id = list[0].id });
                            data.GetValue = "Deleted";
                            E2EZumoHelper.PassFail("Pass", data.ExpectedResult, data);

                        }
                        else
                        {
                            lblOutput.Text = "[Hint] : 'Naren Chejara' does not exists in Channels table, in order to insert it Click on Insert in Push Notification";
                            throw new Exception("Table does not have data or 'Naren Chejara' doesn't exist in table");
                        }
                    }
                    catch (Exception ex)
                    {
                        E2EZumoHelper.PassFail("Fail by Exception", data.ExpectedResult, data);
                        allExceptionResult.Add(new ExceptionData { Name = data.Name, ExceptionDetails = ex.Message });
                    }
                    break;
            }
            allResult.Add(data);
        }
        private async Task<string> GetChannelURI()
        {
            //Using Windows.Networking.PushNotifications
            PushNotificationChannel channel = null;
            try
            {
                channel = await PushNotificationChannelManager.CreatePushNotificationChannelForApplicationAsync();
                return channel.Uri;
            }
            catch (Exception ex)
            {
                return "";
            }
        }
        #endregion

    }
}
