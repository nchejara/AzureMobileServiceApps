//insert script
function SendNotifications(item) {
    push.wns.sendToastImageAndText04(item.ChannelURL,
    {
        image1src: "https://cid-6bf93dc2d5ea1eb9.users.storage.live.com/users/0x6bf93dc2d5ea1eb9/myprofile/expressionprofile/profilephoto:UserTileStatic",
         image1alt: 'My Image',
         text1: "Data Inserted into in Table", text2: item.Name, text3: item.id.toString()
    },
    {
         success: function (results) { console.log("Send successfully!"); },
         error: function () { console.log("Sending failed!"); }
    });
    
}

function insert(item, user, context) {
    context.execute(
        {
            success: function () { context.respond(); SendNotifications(item); },
            error: function () { context.respond(500, "Error"); }
        });
}