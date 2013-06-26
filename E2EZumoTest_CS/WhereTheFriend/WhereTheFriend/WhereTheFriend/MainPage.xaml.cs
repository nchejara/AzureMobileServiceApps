﻿using System;
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
                            if (meResult.first_name != null &&
                                meResult.last_name != null)
                            {
                                infoTextBlock.Text = "Welcome, " + meResult.name;
                                //initiliazed user LiveUserInfo properties
                                LiveUserInfo.Id = user.UserId;//meResult.id; // user.UserId; //generated by Zumo
                                LiveUserInfo.Name = meResult.name;
                                LiveUserInfo.FirstName = meResult.first_name;
                                LiveUserInfo.LastName = meResult.last_name;
                                PushNotificationChannel channel = await PushNotificationChannelManager.CreatePushNotificationChannelForApplicationAsync();
                                LiveUserInfo.channelUri = channel.Uri;
                                LiveUserInfo.pic = pic.Result.location;
                                this.Frame.Navigate(typeof(WhereTheFriend.Welcome));

                            }
                            else
                            {
                                infoTextBlock.Text = "Welcome, Guest!";
                            }
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
    }
}