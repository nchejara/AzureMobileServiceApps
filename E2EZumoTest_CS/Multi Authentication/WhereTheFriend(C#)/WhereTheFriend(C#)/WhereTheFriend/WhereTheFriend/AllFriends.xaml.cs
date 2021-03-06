﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.WindowsAzure.MobileServices;
using WhereTheFriend.CollectionStruct;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

// The Blank Page item template is documented at http://go.microsoft.com/fwlink/?LinkId=234238

namespace WhereTheFriend
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class AllFriends : Page
    {
        
        public AllFriends()
        {
            this.InitializeComponent();
           
            BindLV();
        }

        /// <summary>
        /// Invoked when this page is about to be displayed in a Frame.
        /// </summary>
        /// <param name="e">Event data that describes how this page was reached.  The Parameter
        /// property is typically used to configure the page.</param>
        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
            
        }

        private async void BindLV()
        {
            IEnumerable<friends> friends = await App.MobileService.GetTable<friends>().ReadAsync<friends>(
                from friend in App.MobileService.GetTable<friends>()
                where friend.friendId == LiveUserInfo.Id &&
                      friend.approved == true
                select friend);

            List<friends> list = friends.ToList();
            lvListAllFriends.ItemsSource = list;
        }
        private async void hyplnkDelete_Click_1(object sender, RoutedEventArgs e)
        {
            List<object> lists = new List<object>();
            lists = lvListAllFriends.SelectedItems.ToList();
            if (lists.Count > 0)
            {
                foreach (dynamic list in lists)
                {
                    friends friend = new friends
                    {
                        id = list.id,
                        uniqueKey = list.uniqueKey,
                        userId = list.userId,
                        approved = list.approved,
                        friendId = list.friendId,
                        friendName = list.friendName,
                        createdAt = list.createdAt,
                        username = list.username,
                        updatedAt = list.updatedAt,
                        userImage = list.userImage
                    };
                    await App.MobileService.GetTable<friends>().DeleteAsync(friend);
                }
            }
            else
                await new Windows.UI.Popups.MessageDialog("Select a friend and try again").ShowAsync();

            this.Frame.Navigate(typeof(WhereTheFriend.AllFriends));
        }

        private void hyplnkBack_Click_1(object sender, RoutedEventArgs e)
        {
            this.Frame.Navigate(typeof(WhereTheFriend.Welcome));
        }
    }
}
