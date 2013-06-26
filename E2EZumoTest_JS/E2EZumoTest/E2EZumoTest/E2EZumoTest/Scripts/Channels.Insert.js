//insert script
function SendNotifications(item) {
    push.wns.sendToastText04(item.ChannelURL,
    { text1: "Data Inserted into in Table", text2: item.Name, text3: item.id.toString() },
    {
        success: function (data) { console.log(data); },
        error: function (error) { console.error(error); }
    });
}

function insert(item, user, context) {
    context.execute(
        {
            success: function () { context.respond(); SendNotifications(item); },
            error: function () { context.respond(500, "Error"); }
        });
}