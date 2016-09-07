/**
 * Created by horacio on 11/06/2016.
 */

define([], function () {

    class AudioTab {
        constructor(game, settings) {
            this.game = game;
            this.settings = settings;
            this.initCallbacks();
        }

        onHide() {
            this.settings.setMusicMuted(!this.game.assetManager.audio.musicEnabled);
            this.settings.setSoundMuted(!this.game.assetManager.audio.soundEnabled);
            this.settings.setMusicVolume(this.game.assetManager.audio.musicVolume);
            this.settings.setSoundVolume(this.game.assetManager.audio.soundVolume);
        }

        onShow() {
            $("#sliderMusica").slider('value', this.settings.getMusicVolume() * 100);
            $("#sliderSonido").slider('value', this.settings.getSoundVolume() * 100);

            $("#checkboxMusica").prop('checked', !this.settings.getMusicMuted());
            $("#checkboxSonido").prop('checked', !this.settings.getSoundMuted());
        }

        initCallbacks() {
            var self = this;

            $("#sliderMusica").slider({
                range: "min",
                slide: function (event, ui) {
                    self.game.assetManager.audio.setMusicVolume(ui.value / 100);
                }
            });
            $("#sliderSonido").slider({
                range: "min",
                slide: function (event, ui) {
                    self.game.assetManager.audio.setSoundVolume(ui.value / 100);
                }
            });

            $("#checkboxMusica").change(function () {
                if (this.checked) {
                    self.game.assetManager.audio.setMusicMuted(false);
                } else {
                    self.game.assetManager.audio.setMusicMuted(true);
                }
            });

            $("#checkboxSonido").change(function () {
                if (this.checked) {
                    self.game.assetManager.audio.setSoundMuted(false);
                } else {
                    self.game.assetManager.audio.setSoundMuted(true);
                }
            });

        }

    }
    return AudioTab;
});