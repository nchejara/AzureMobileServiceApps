function insert(item, user, request) {
    request.execute({
        success: function () {
            // Write to the response and then send the raw notification in the background
            request.respond();
            push.wns.sendRaw(item.ChannelURL, item.Name, {
                success: function (pushResponse) {
                    console.log("Sent push:", pushResponse);
                }
            });
        }
    });
}
