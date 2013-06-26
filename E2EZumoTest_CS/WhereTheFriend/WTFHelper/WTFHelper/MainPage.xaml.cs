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

// The Blank Page item template is documented at http://go.microsoft.com/fwlink/?LinkId=234238

namespace WTFHelper
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainPage : Page
    {
       // public string ApplicationURL = "";
       // public string ApplicationKey = "";
        public static ObservableCollection<Data> Results = new ObservableCollection<Data>();
        public MobileServiceClient Client = null;
        public MainPage()
        {
            this.InitializeComponent();
        }

        /// <summary>
        /// Invoked when this page is about to be displayed in a Frame.
        /// </summary>
        /// <param name="e">Event data that describes how this page was reached.  The Parameter
        /// property is typically used to configure the page.</param>
        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
        }

        private void btnInsert_Click_1(object sender, RoutedEventArgs e)
        {
            if (txtURL.Text.Trim() == "")
            {
                lblErrorMsg.Text = "Application url is missing!";
                return;
            }
            if (txtKey.Text.Trim() == "")
            {
                lblErrorMsg.Text = "Application Key is missing!";
                return;
            }
            // Initialized mobile services
            Client = new MobileServiceClient(txtURL.Text.Trim(), txtKey.Text.Trim());

            // Insert data in Customers tables
            string str = "{\"userId\":\"92837478943\",\"name\":\"Scott Guthrie\",\"createdAt\":\"" + new DateTime() + "\",\"updatedAt\":\"" + new DateTime() + "\",\"userImage\":\"http://azmob.blob.core.windows.net/images/scott_guthrie.jpg\",\"ChannelURI\":\"\"}";
            InsertData(1,"customers",str);
            str = "{\"userId\":\"98243723498\",\"name\":\"Wade Wegner\",\"createdAt\":\"" + new DateTime() + "\",\"updatedAt\":\"" + new DateTime() + "\",\"userImage\":\"http://azmob.blob.core.windows.net/images/wade_wegner.jpg\",\"ChannelURI\":\"\"}";
            InsertData(2, "customers", str);
            str = "{\"userId\":\"67367328464\",\"name\":\"Paul Batum\",\"createdAt\":\"" + new DateTime() + "\",\"updatedAt\":\"" + new DateTime() + "\",\"userImage\":\"http://azmob.blob.core.windows.net/images/paul_batum.jpg\",\"ChannelURI\":\"\"}";
            InsertData(3, "customers", str);

            //Insert data in Checkins tables
            str = "{\"username\":\"Scott Guthrie\",\"message\":\"working hard\",\"userId\":\"92837478943\",\"lat\":21.254994, \"lng\":-157.806813,\"createdAt\":\"" + new DateTime() + "\",\"userImage\":\"http://azmob.blob.core.windows.net/images/scott_guthrie.jpg\"}";
            InsertData(4, "checkins", str);

            //Insert data in Friends tables
            str = "{\"uniqueKey\":\"67367328464_92837478943\",\"userId\":\"92837478943\",\"approved\":false,\"friendId\":\"67367328464\", \"friendName\":\"Bill Gates\",\"createdAt\":\"" + new DateTime() + "\",\"ChannelURI\":\"\"}";
            InsertData(5, "friends", str);

            ItemData.ItemsSource = Results;
            ItemExceptionData.ItemsSource = Results;
            Results.Clear();
        
        }
        private async void InsertData(int id,string tableName, string str)
        {
            JsonObject jObj = JsonObject.Parse(str);
            Data data = new Data { ID = id, Details = "", ExceptionDetails = "" };
            try
            {
                IJsonValue inserted = await Client.GetTable(tableName).InsertAsync(jObj);
                data.Details = "Data inserted in " + tableName;
            }
            catch (Exception ex)
            {
                data.Details = "Exception occur while inserting data, please see the exception details";
                data.ExceptionDetails = ex.Message;
            }

            Results.Add(data);
        }
    }
}
