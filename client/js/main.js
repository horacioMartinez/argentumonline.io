define(['app', 'assetmanager', 'ui/uimanager'], function (App, AssetManager, UIManager) {
    var app, uiManager, assetManager;

    var initApp = function () {
        $(document).ready(function () {

            /*$(function() {
             $( "#progressbar" ).progressbar({
             value: 37
             });
             });*/

            assetManager = new AssetManager();
            uiManager = new UIManager();
            app = new App(assetManager, uiManager);
            uiManager.resizeUi();
            uiManager.initDOM(); // <<<<-- uimanager
            //app.center();

            assetManager.preload(function () {
                app.start();
            });
        });
    };

    initApp();

});
