// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
var zumo = null;
(function () {
    "use strict";
    var zumo;
    var app = WinJS.Application;
    app.onactivated = function (eventObject) {
        if (eventObject.detail.kind === Windows.ApplicationModel.Activation.ActivationKind.launch) {
            if (eventObject.detail.previousExecutionState !== Windows.ApplicationModel.Activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize 
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension. 
                // Restore application state here.
            }
            WinJS.UI.processAll();
            
      }
    };

    var w = {};

    w.debug = function (msg, args) {
        var s = "";
        for (var i = 0; i < args.length; i++) {
            s += args[i] + ", ";
        }
        return (msg + ": " + s);
    };

    w.error = function (exc) {
        var message = "Oh no, bad things.   " + exc.toString() + "   " + JSON.stringify(exc);
        w.alert(JSON.stringify(message));
    };

    w.alert = function (msg) {
        return new WinJS.Promise(function (error, success, progress) {
            //new Windows.UI.Popups.MessageDialog(msg).showAsync().then(function (command) {
            //    console.log("pressed: " + command.label);
            //    success();
            //});
        });
    };

    w.busy = function (val) {
        var busyDiv = document.getElementById('busyScreen');
        val ? busyDiv.style.visibility = 'visible' :
    busyDiv.style.visibility = 'hidden';
    }
    
    WinJS.Namespace.define("wtf", w);
   


    app.oncheckpoint = function (eventObject) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the 
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // eventObject.setPromise(). 
    };

    app.start();
})();
