/**
 * @license
 * Copyright (C) Horacio Martinez - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Horacio Martinez <hmk142@hotmail.com>, May 2016
 *
 */

define(['app', 'assets/assetmanager', 'ui/uimanager', 'storage/storage', 'lib/lodash', 'lib/stacktrace', 'utils/log', 'detect'], function (App, AssetManager, UIManager, Storage, __globals__) {
    var app, uiManager, assetManager, storage;

    function setupAudio(audio, storage) {
        audio.setSoundMuted(storage.getSoundMuted());
        audio.setMusicMuted(storage.getMusicMuted());
        audio.setMusicVolume(storage.getMusicVolume());
        audio.setSoundVolume(storage.getSoundVolume());
        audio.setMusic("intro");
    }

    var initApp = function () {
        $(document).ready(function () {

            storage = new Storage();
            assetManager = new AssetManager();
            setupAudio(assetManager.audio, storage);

            uiManager = new UIManager(assetManager);
            app = new App(assetManager, uiManager, storage);
            uiManager.initDOM();

            assetManager.preload(
                () => {
                    // TODO: sacar timeout ... ?
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
