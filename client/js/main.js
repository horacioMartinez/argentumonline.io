
define(['app', 'assets/assetmanager', 'ui/uimanager', 'storage/settings', 'lib/lodash', 'lib/stacktrace', 'utils/log', 'detect'], function (App, AssetManager, UIManager, Settings, __globals__) {
    var app, uiManager, assetManager, settings;

    function setupAudio(audio, settings) {
        audio.setSoundMuted(settings.getSoundMuted());
        audio.setMusicMuted(settings.getMusicMuted());
        audio.setMusicVolume(settings.getMusicVolume());
        audio.setSoundVolume(settings.getSoundVolume());
        audio.setMusic("intro");
    }

    var initApp = function () {
        $(document).ready(function () {

            settings = new Settings();
            assetManager = new AssetManager();
            setupAudio(assetManager.audio, settings);

            uiManager = new UIManager(assetManager);
            app = new App(assetManager, uiManager, settings);
            uiManager.initDOM();

            assetManager.preload(
                () => {
                    setTimeout(function () {
                        app.start();
                    }, 1200);
                },
                (porcentajeCargado) => {
                    uiManager.introUI.updateLoadingBar(porcentajeCargado);
                });
        });
    };

    initApp();

});
