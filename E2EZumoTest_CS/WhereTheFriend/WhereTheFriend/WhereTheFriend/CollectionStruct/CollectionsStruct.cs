using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.UI.Xaml.Media.Imaging;

namespace WhereTheFriend.CollectionStruct
{
    public class checkins
    {
        public int id { set; get; }
        public string message { set; get; }
        public string userId { set; get; }
        public string username { set; get; }
        public DateTime createdAt { set; get; }
        public string userImage { get; set; }
    }

    public class customers
    {
        public int id { set; get; }
        public string userId { set; get; }
        public string name { set; get; }
        public DateTime createdAt { set; get; }
        public DateTime updatedAt { get; set; }
        public string userImage { get; set; }
        public string channeluri { get; set; }
       
    }
    public class friends
    {
        public int id { set; get; }
        public string uniqueKey { set; get; }
        public string userId { set; get; }
        public bool approved { set; get; }
        public string friendId { set; get; }
        public string friendName { set; get; }
        public DateTime createdAt { set; get; }
        public string username { set; get; }
        public DateTime updatedAt { set; get; }
        public string userImage { set; get; }
        public string channeluri { get; set; }
    }

   

    
}
