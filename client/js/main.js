/* Copyright (C) Horacio Martinez - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Horacio Martinez <hmk142@hotmail.com>, May 2016
 */

define(['app', 'assets/assetmanager', 'ui/uimanager', 'storage/storage'], function (App, AssetManager, UIManager, Storage) {
    var app, uiManager, assetManager, storage;

    var setupAudio = function (audio, storage) {
        audio.setSoundMuted(storage.getSoundMuted());
        audio.setMusicMuted(storage.getMusicMuted());
        audio.setMusicVolume(storage.getMusicVolume());
        audio.setSoundVolume(storage.getSoundVolume());
        audio.setMusic("intro");
    };

    var initApp = function () {
        $(document).ready(function () {

            /*$(function() {
             $( "#progressbar" ).progressbar({
             value: 37
             });
             });*/

            storage = new Storage();
            assetManager = new AssetManager();
            setupAudio(assetManager.audio, storage);

            uiManager = new UIManager(assetManager);
            app = new App(assetManager, uiManager, storage);
            uiManager.resizeUi();
            uiManager.initDOM();

            assetManager.preload(function () {
                app.start();
            });
        });
    };

    initApp();

});
