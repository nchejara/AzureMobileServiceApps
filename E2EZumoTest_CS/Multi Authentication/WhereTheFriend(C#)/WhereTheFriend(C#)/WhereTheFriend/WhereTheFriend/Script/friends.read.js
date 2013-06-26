function SendNotifications(userId) {
    tables.getTable("friends").where({ friendId: userId, approved: false }).read({
        success: function (results) {
            console.log("Data read success");
            results.forEach(function (channel) {
                //Send toast
                push.wns.sendToastImageAndText04(channel.ChannelURI,
                {
                    image1src: channel.userImage,
                    image1alt: 'Your friend',
                    text1: "You get a friend request!",
                    text2: "from " + channel.friendName,
                    text3: ""
                },
                {
                    success: function (results) { console.log("Send successfully!"); },
                    error: function () { console.log("Sending failed!"); }
                });
                //Send tile
                push.wns.sendTileSquarePeekImageAndText01(channel.ChannelURI,
                {
                    image1src: channel.userImage,
                    image1alt: 'Your friend',
                    text1: "You get a friend request!",
                    text2: "from " + channel.friendName,
                    text3: ""
                },
                {
                    success: function (results) { console.log("Tile Send successfully!"); },
                    error: function () { console.log("Sending failed!"); }
                });

                //Send Badge
                // for more details: http://msdn.microsoft.com/en-us/library/windows/apps/br212849.aspx
                push.wns.sendBadge(channel.ChannelURI, "newMessage",
                {
                    success: function (results) { console.log("Badge Send successfully! "); },
                    error: function () { console.log("Sending failed!"); }
                });
            });
        },
        error: function () { console.log("Data reading error"); }
    });
}
function read(query, user, request) {
    request.execute({
        success: function () {
            request.respond();
            SendNotifications(user.userId);
        },
        error: function () {
            request.respond(500, "Error");
        }
    });
}