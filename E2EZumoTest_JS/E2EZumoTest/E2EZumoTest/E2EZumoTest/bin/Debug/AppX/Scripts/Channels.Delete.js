function del(id, user, context) {
    tables.getTable("channels").where({ id: id }).read({
        success: function (result) {
            console.log("Read Success" + result[0].ChannelURL);
            push.wns.sendToastText04(result[0].ChannelURL,
            {
                text1: "Data deleted successfully!",
                text2: result[0].Name,
                text3: id.toString()
            },
            {
                success: function (data) {
                    console.log("Send Successfully!");
                    context.execute();
                },
                error: function () { console.log("Toast sending error!"); }
            }
            );
        },
        error: function () {
            console.log("There was an error reading channels table");
        }
    }); // read close 

}