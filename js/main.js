
import $ from 'jquery';
import App from './app.js';
import AssetManager from './assets/assetmanager.js';
import UIManager from './ui/uimanager.js';
import Settings from './storage/settings.js';
import _ from 'lodash';
import './lib/stacktrace.js';
import './utils/log.js';
import './detect.js';

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
                }, 800);
            },
            (porcentajeCargado) => {
                uiManager.introUI.updateLoadingBar(porcentajeCargado);
            });
    });
};

initApp();
