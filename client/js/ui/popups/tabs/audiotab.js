/**
 * Created by horacio on 11/06/2016.
 */

define([], function () {

    class AudioTab {
        constructor(game, storage) {
            this.game = game;
            this.storage = storage;
        }

        onHide() {
            this.storage.setMusicMuted(!this.game.assetManager.audio.musicEnabled);
            this.storage.setSoundMuted(!this.game.assetManager.audio.soundEnabled);
            this.storage.setMusicVolume(this.game.assetManager.audio.musicVolume);
            this.storage.setSoundVolume(this.game.assetManager.audio.soundVolume);
        }

        onShow() {
            $("#sliderMusica").slider('value', this.storage.getMusicVolume() * 100);
            $("#sliderSonido").slider('value', this.storage.getSoundVolume() * 100);

            $("#checkboxMusica").prop('checked', !this.storage.getMusicMuted());
            $("#checkboxSonido").prop('checked', !this.storage.getSoundMuted());
        }
        
        initCallbacks(){
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