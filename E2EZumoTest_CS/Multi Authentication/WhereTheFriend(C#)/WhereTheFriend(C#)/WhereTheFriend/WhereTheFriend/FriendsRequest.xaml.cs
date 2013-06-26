using System;
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
    public sealed partial class FriendsRequest : Page
    {
        
        public FriendsRequest()
        {
            this.InitializeComponent();
            LoadAndBind();
        }

        /// <summary>
        /// Invoked when this page is about to be displayed in a Frame.
        /// </summary>
        /// <param name="e">Event data that describes how this page was reached.  The Parameter
        /// property is typically used to configure the page.</param>
        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
        }
        private async void LoadAndBind()
        {
            IEnumerable<friends> friends = await App.MobileService.GetTable<friends>().ReadAsync<friends>(
               from friend in App.MobileService.GetTable<friends>()
               where friend.friendId == LiveUserInfo.Id &&
                     friend.approved == false
               select friend);

            List<friends> list = friends.ToList();
            lvListPendingRequest.ItemsSource = list;
        }
        
        private void hyplnkBack_Click_1(object sender, RoutedEventArgs e)
        {
            this.Frame.Navigate(typeof(WhereTheFriend.Welcome));
        }
        private void hyplnkReject_Click_1(object sender, RoutedEventArgs e)
        {
            DeleteFriendsRequest();
            // Reload the page so change can be visible
            this.Frame.Navigate(typeof(WhereTheFriend.Welcome));
        }
        private  void hyplnkApproved_Click_1(object sender, RoutedEventArgs e)
        {
            ApprovedFriendRequest();
            // Reload the page so change can be visible
            this.Frame.Navigate(typeof(WhereTheFriend.Welcome));
        }
        private async void DeleteFriendsRequest()
        {
            List<object> lists = new List<object>();
            lists = lvListPendingRequest.SelectedItems.ToList();
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
               await new Windows.UI.Popups.MessageDialog("Select items and then click on the Reject button").ShowAsync();
            
        }
        private async void ApprovedFriendRequest()
        {
            List<object> lists = new List<object>();
            lists = lvListPendingRequest.SelectedItems.ToList();
            if (lists.Count > 0)
            {
                foreach (dynamic list in lists)
                {
                    friends friend = new friends
                    {
                        id = list.id,
                        uniqueKey = list.uniqueKey,
                        userId = list.userId,
                        approved = true,
                        friendId = list.friendId,
                        friendName = list.friendName,
                        createdAt = list.createdAt,
                        username = list.username,
                        updatedAt = list.updatedAt,
                        userImage = list.userImage
                    };
                    await App.MobileService.GetTable<friends>().UpdateAsync(friend);

                }

            }
            else
                await new Windows.UI.Popups.MessageDialog("Select friends from the friends list before click on Approved button").ShowAsync();
            
        }
        
    }
}
