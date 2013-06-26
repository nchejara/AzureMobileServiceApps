using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.Live;
using Microsoft.Live.Controls;
using Microsoft.WindowsAzure.MobileServices;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;
using Windows.Networking.PushNotifications;
using System.Net;
using System.Text;
using System.Dynamic;
using Windows.Data.Json;
using System.Threading.Tasks;
using System.Net.Http;


// The Blank Page item template is documented at http://go.microsoft.com/fwlink/?LinkId=234238

namespace WhereTheFriend
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainPage : Page
    {
        private LiveConnectClient client;
        public string redirectURL = "";
        public string currentLoginType = "";//Facebook, Googole, Microsoft and tiwitter
        Facebook.FacebookClient fb = new Facebook.FacebookClient();
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
        private bool TextValidation()
        {
            if (txtApplicationURL.Text.Trim() == "")
            {
                lblMsg.Text = "[Hint]: Application URL is missing";
                return false;
            }
           
            App.MobileService = new MobileServiceClient(txtApplicationURL.Text.Trim());
            redirectURL = txtApplicationURL.Text.Trim().Replace("windows-", "");
            return true;
        }
        private async void btnSignin_SessionChanged_2(object sender, LiveConnectSessionChangedEventArgs e)
        {
            currentLoginType = "Microsoft";
            if (TextValidation())
            {
                lblMsg.Text = "";
                App.liveAuthClient = new LiveAuthClient(redirectURL);
                LiveLoginResult liveLoginResult = await App.liveAuthClient.LoginAsync(new string[] { "wl.signin", "wl.basic" });
                if (liveLoginResult.Session != null && liveLoginResult.Status == LiveConnectSessionStatus.Connected)
                {
                    client = new LiveConnectClient(liveLoginResult.Session);
                    LiveOperationResult operationResult = await client.GetAsync("me");
                    dynamic pic = await client.GetAsync("me/picture");
                    try
                    {
                        MobileServiceUser user = await App.MobileService.LoginAsync(client.Session.AuthenticationToken);
                        if (!String.IsNullOrEmpty(user.UserId))
                        {
                            dynamic meResult = operationResult.Result;
                            if (meResult.first_name != null && meResult.last_name != null)
                                //initiliazed user LiveUserInfo properties
                                SetUserDetails(user.UserId, meResult.name, meResult.first_name, meResult.last_name, pic.Result.location);
                            else
                                infoTextBlock.Text = "Welcome, Guest!";
                        }
                    }
                    catch (LiveConnectException exception)
                    {
                        this.infoTextBlock.Text = "Error calling API: " +
                            exception.Message;
                    }
                }
            }
        }
        private async void btnFaceBookWV_Click_1(object sender, RoutedEventArgs e)
        {
            if (TextValidation())
            {
                lblMsg.Text = "";
                var task = App.MobileService.LoginAsync(MobileServiceAuthenticationProvider.Facebook);
                var user = await task;
                if (!user.UserId.Equals(""))
                {
                    UserAccess userAccess = await InsertData(user.UserId);
                    if (userAccess != null)
                    {
                        JsonObject jo = JsonObject.Parse(userAccess.identities);
                        if (jo.ContainsKey("facebook"))
                        {
                            string token = jo["facebook"].GetObject()["accessToken"].GetString();
                            HttpClient http = new HttpClient();
                            var response = await http.GetAsync("https://graph.facebook.com/me?access_token=" + token);
                            JsonObject getData = JsonObject.Parse(await response.Content.ReadAsStringAsync());
                            string url = string.Format("https://graph.facebook.com/{0}/picture?type={1}&access_token={2}", userAccess.userId, "square", token);
                            var res = await http.GetAsync(url);
                            string picURL = res.RequestMessage.RequestUri.ToString();
                            SetUserDetails(user.UserId, getData["name"].GetString(), getData["first_name"].GetString(), getData["last_name"].GetString(), picURL);

                        }
                        else
                        {
                            infoTextBlock.Text = "[Hint]:Unable to insert facebook user Information.";
                            return;
                        }
                    }
                    else
                    {
                        infoTextBlock.Text = "[Hint]: App unable to get User Id, Make sure add insert script in userAccess table on the portal.";
                        return;
                    }
                    
                }
            }
        }
        private async void btnGoogle_Click_1(object sender, RoutedEventArgs e)
        {
            if (TextValidation())
            {
                lblMsg.Text = "";
                var task = App.MobileService.LoginAsync(MobileServiceAuthenticationProvider.Google);
                var user = await task;
                if (!user.UserId.Equals(""))
                {
                    UserAccess userAccess = await InsertData(user.UserId);
                    if (userAccess != null)
                    {
                        JsonObject jo = JsonObject.Parse(userAccess.identities);
                        if (jo.ContainsKey("google"))
                        {
                            
                        }
                        else
                        {
                            infoTextBlock.Text = "[Hint]:Unable to insert facebook user Information.";
                            return;
                        }
                    }
                    else
                    {
                        infoTextBlock.Text = "[Hint]: App unable to get User Id, Make sure add insert script in userAccess table on the portal.";
                        return;
                    }

                }
            }
        }
        private async void btnTwitter_Click_1(object sender, RoutedEventArgs e)
        {
            if (TextValidation())
            {
                lblMsg.Text = "";
                var task = App.MobileService.LoginAsync(MobileServiceAuthenticationProvider.Twitter);
                var user = await task;
                if (!user.UserId.Equals(""))
                {
                    UserAccess userAccess = await InsertData(user.UserId);
                    if (userAccess != null)
                    {
                    }
                    else
                    {
                        infoTextBlock.Text = "[Hint]: App unable to get User Id, Make sure add insert script in userAccess table on the portal.";
                        return;
                    }

                }
            }
        }
        private async void btnMicrosoft_Click_1(object sender, RoutedEventArgs e)
        {
            if (TextValidation())
            {
                lblMsg.Text = "";
                var task = App.MobileService.LoginAsync(MobileServiceAuthenticationProvider.MicrosoftAccount);
                var user = await task;
                if (!user.UserId.Equals(""))
                {
                    UserAccess userAccess = await InsertData(user.UserId);
                    if (userAccess != null)
                    {
                        JsonObject jo = JsonObject.Parse(userAccess.identities);
                        if (jo.ContainsKey("microsoft"))
                        {
                            string token = jo["microsoft"].GetObject()["accessToken"].GetString();
                            HttpClient http = new HttpClient();
                            var response = await http.GetAsync("https://apis.live.net/v5.0/me/?method=GET&access_token=" + token);
                            JsonObject getData = JsonObject.Parse(await response.Content.ReadAsStringAsync());
                            string url = string.Format("https://apis.live.net/v5.0/me/picture/?method=GET&access_token=" + token);
                            var res = await http.GetAsync(url);
                            string picURL = res.RequestMessage.RequestUri.ToString();
                            SetUserDetails(user.UserId, getData["name"].GetString(), getData["first_name"].GetString(), getData["last_name"].GetString(), picURL);

                        }   
                    }
                    else
                    {
                        infoTextBlock.Text = "[Hint]: App unable to get User Id, Make sure add insert script in userAccess table on the portal.";
                        return;
                    }

                }
            }
        }
        private async Task<UserAccess> InsertData(string userId)
        {
            string[] id = userId.Split(':');
            var item = new UserAccess { userId = id[1],};
            var userAccessTable = App.MobileService.GetTable<UserAccess>();
            // read existing data from the table
            IEnumerable<UserAccess> lists = await userAccessTable.ReadAsync<UserAccess>(
                      (from listValue in userAccessTable
                       where listValue.userId == id[1]
                       select listValue));
            List<UserAccess> list = lists.ToList();
            try
            {

                if (list.Count == 0)//If userId is not exist in the table then insert userId and ites identities
                    await userAccessTable.InsertAsync(item);
                else
                    item.identities = list[0].identities;
                return item;
            }
            catch (Exception ex)
            {
                return null;
            }
            
        }
        private async void  SetUserDetails(string id, string name, string firstName, string lastName, string pic)
        {
            LiveUserInfo.Id = id;
            LiveUserInfo.Name = name;
            LiveUserInfo.FirstName = firstName;
            LiveUserInfo.LastName = lastName;
            PushNotificationChannel channel = await PushNotificationChannelManager.CreatePushNotificationChannelForApplicationAsync();
            LiveUserInfo.channelUri = channel.Uri;
            LiveUserInfo.pic = pic;

            infoTextBlock.Text = "Welcome, " + name;
            this.Frame.Navigate(typeof(WhereTheFriend.Welcome));
        }

        

       

        
        
    }
}
