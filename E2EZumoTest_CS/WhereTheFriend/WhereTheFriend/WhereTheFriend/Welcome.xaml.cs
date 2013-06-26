using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
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
using Windows.Networking.PushNotifications;
using Windows.Foundation.Collections;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Runtime.Serialization;
using Windows.UI.Xaml.Media.Imaging;
using Windows.Storage.Streams;
using Windows.Storage.Pickers;
using Windows.Storage;


// The Blank Page item template is documented at http://go.microsoft.com/fwlink/?LinkId=234238

namespace WhereTheFriend
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class Welcome : Page
    {

        public Welcome()
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
        private void LoadAndBind()
        {
            lblWUsername.Text = "Welcome, [ " + LiveUserInfo.Name + " ]";
            lblUsername.Text = LiveUserInfo.Name;
            imguserImage.Source = new BitmapImage(new Uri(LiveUserInfo.pic));
            
            OperationOnUserLoging();
            GetAllMessage();
            GetAllFreinds();
            GetMyFriend();
            PendingFriendsRequest();


        }
               
        private async void AddFriendRequest(friends friend)
        {
            await App.MobileService.GetTable<friends>().InsertAsync(friend);
            this.Frame.Navigate(typeof(WhereTheFriend.Welcome));
        }
        private async void InsertCurrentUser()
        {
            customers cust = new customers
            {
                name = LiveUserInfo.Name,
                userId = LiveUserInfo.Id,
                createdAt = DateTime.Now.ToUniversalTime(),
                updatedAt = DateTime.Now.ToUniversalTime(),
                userImage = LiveUserInfo.pic,//"http://azmob.blob.core.windows.net/images/" + LiveUserInfo.Name.Replace(' ', '_').ToLower() + ".jpg",
                channeluri = LiveUserInfo.channelUri
            };
            await App.MobileService.GetTable<customers>().InsertAsync(cust);
            this.Frame.Navigate(typeof(WhereTheFriend.Welcome));
        }
        private async void UpdateCurrentUser(List<customers> list)
        {
            customers cust = new customers
            {
                id = Convert.ToInt32(list[0].id),
                name = list[0].name,
                userId = list[0].userId,
                createdAt = list[0].createdAt,
                updatedAt = DateTime.Now.ToUniversalTime(),
                userImage = list[0].userImage,
                channeluri = LiveUserInfo.channelUri
            };
            if (cust.userImage == null)
                cust.userImage = LiveUserInfo.pic;// "http://azmob.blob.core.windows.net/images/" + cust.name.Replace(' ', '_').ToLower() + ".jpg";
            await App.MobileService.GetTable<customers>().UpdateAsync(cust);
        }
        
        private async void OperationOnUserLoging()
        {
            MobileServiceTableQuery<customers> customers = App.MobileService.GetTable<customers>()
                .Where(cust => cust.userId == LiveUserInfo.Id)
                .Select(cust => cust);
            List<customers> list = null;
            try
            {
                list = await customers.ToListAsync();
                if (list.Count != 0)
                    UpdateCurrentUser(list);
                else
                {
                    InsertCurrentUser();
                   
                }
            }
            catch (Exception ex)
            {
                
            }
          

        }
        private async void GetAllMessage()
        {
            try
            {

                IEnumerable<checkins> checkin = await App.MobileService.GetTable<checkins>().ReadAsync();
                List<WhereTheFriend.CollectionStruct.checkins> list = checkin.ToList();
                lvListMessage.ItemsSource = list;
            }
            catch (Exception ex)
            {
            }
        }
        private async void GetAllFreinds()
        {
            try
            {
                IEnumerable<customers> customer = await App.MobileService.GetTable<customers>().ReadAsync();
                List<WhereTheFriend.CollectionStruct.customers> list = customer.ToList();
                lvListAllCustomer.ItemsSource = list;
            }
            catch (Exception ex)
            {
                // If table is empty
            }
        }
        private async void GetMyFriend()
        {

            IEnumerable<friends> friends = await App.MobileService.GetTable<friends>().ReadAsync<friends>(
                from friend in App.MobileService.GetTable<friends>()
                where friend.friendId == LiveUserInfo.Id &&
                      friend.approved == true
                select friend);

            List<friends> list = friends.ToList();
            if (list.Count > 0)
                btnMyFriends.Content = "My friends ( " + list.Count + " )";

        }
        // Pending Friends Request ...
        private async void PendingFriendsRequest()
        {

            IEnumerable<friends> friends = await App.MobileService.GetTable<friends>().ReadAsync<friends>(
               from friend in App.MobileService.GetTable<friends>()
               where friend.friendId == LiveUserInfo.Id &&
                     friend.approved == false
               select friend);

            List<friends> list = friends.ToList();
            if (list.Count > 0)
                btnPendingFriendsRequest.Content = "Friends Request ( " + list.Count + " )";

        }
        private async void DeleteMessage()
        {
            List<object> lists = new List<object>();
            lists = lvListMessage.SelectedItems.ToList();
            if (lists.Count > 0)
            {
                foreach (dynamic list in lists)
                {
                    checkins checkin = new checkins
                    {
                        id = list.id,
                        message = list.message,
                        userId = list.userId,
                        username = list.username,
                        createdAt = list.createdAt,
                        userImage = list.userImage
                    };
                    await App.MobileService.GetTable<checkins>().DeleteAsync(checkin);
                }
            }
            else
                await new Windows.UI.Popups.MessageDialog("Select message from the list and click on the delete button.").ShowAsync();
        }


        private void btnSignout_Click_1(object sender, RoutedEventArgs e)
        {
            App.MobileService.Logout();
            App.liveAuthClient.Logout();
            this.Frame.Navigate(typeof(WhereTheFriend.MainPage));
        }
        private void btnMyFriends_Click_1(object sender, RoutedEventArgs e)
        {
            this.Frame.Navigate(typeof(WhereTheFriend.AllFriends));
        }
        private void btnPendingFriendsRequest_Click_1(object sender, RoutedEventArgs e)
        {
            this.Frame.Navigate(typeof(WhereTheFriend.FriendsRequest));
        }
        private void btnDeleteMessage_Click_1(object sender, RoutedEventArgs e)
        {
            DeleteMessage();
            this.Frame.Navigate(typeof(WhereTheFriend.Welcome));
        }
        private async void btnAddFriendRequest_Click_1(object sender, RoutedEventArgs e)
        {
            List<object> lists = new List<object>();
            lists = lvListAllCustomer.SelectedItems.ToList();
            if (lists.Count > 0)
            {
                foreach (dynamic list in lists)
                {
                    friends friend = new friends
                    {
                        uniqueKey = LiveUserInfo.Id + "_" + list.userId,
                        userId = LiveUserInfo.Id,
                        approved = false,
                        friendId = list.userId,
                        friendName = list.name,
                        createdAt = DateTime.Now.ToUniversalTime(),
                        username = LiveUserInfo.Name,
                        updatedAt = DateTime.Now.ToUniversalTime(),
                        userImage = LiveUserInfo.pic,// "http://azmob.blob.core.windows.net/images/" + LiveUserInfo.Name.Replace(' ', '_').ToLower() + ".jpg",
                        channeluri = LiveUserInfo.channelUri
                    };
                    AddFriendRequest(friend);

                }
            }
            else
                await new Windows.UI.Popups.MessageDialog("Select friends from the friends list before click on add friends").ShowAsync();
            //Navigate the page
            this.Frame.Navigate(typeof(WhereTheFriend.Welcome));

        }
        private async void btnShareMessage_Click_1(object sender, RoutedEventArgs e)
        {

            checkins ch = new checkins
            {
                message = txtShareMessage.Text.Trim(),
                userId = LiveUserInfo.Id,
                username = LiveUserInfo.Name,
                createdAt = DateTime.Now.ToUniversalTime(),
                userImage = LiveUserInfo.pic//"http://azmob.blob.core.windows.net/images/" + LiveUserInfo.Name.Replace(' ', '_').ToLower() + ".jpg"
            };
            await App.MobileService.GetTable<checkins>().InsertAsync(ch);
            //Load the page
            this.Frame.Navigate(typeof(WhereTheFriend.Welcome));
        }

       
       
    }

}
