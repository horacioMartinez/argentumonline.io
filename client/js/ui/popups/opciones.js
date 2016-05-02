/**
 * Created by horacio on 5/2/16.
 */

define(['ui/popups/popup'], function (PopUp) {

    var Opciones = PopUp.extend({
        init: function (game, storage, configurarTeclas) {
            this._super("popUpOpciones");
            this.game = game;
            this.storage = storage;
            this.configurarTeclasPopUp = configurarTeclas;

            this.initCallbacks();
        },

        show: function () {
            this._super();

            $("#sliderMusica").slider('value', this.storage.getMusicVolume() * 100);
            $("#sliderSonido").slider('value', this.storage.getSoundVolume() * 100);

            $("#checkboxMusica").prop('checked', !this.storage.getMusicMuted());
            $("#checkboxSonido").prop('checked', !this.storage.getSoundMuted());
        },

        hide: function () {
            this._super();
            this.storage.setMusicMuted(!this.game.assetManager.audio.musicEnabled);
            this.storage.setSoundMuted(!this.game.assetManager.audio.soundEnabled);
            this.storage.setMusicVolume(this.game.assetManager.audio.musicVolume);
            this.storage.setSoundVolume(this.game.assetManager.audio.soundVolume);
        },

        initCallbacks: function () {
            var self = this;

            $("#sliderMusica").slider({
                slide: function (event, ui) {
                    self.game.assetManager.audio.setMusicVolume(ui.value / 100);
                }
            });
            $("#sliderSonido").slider({
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

            $("#opcionesConfigurarTeclas").click(function () {
                self.configurarTeclasPopUp.show();
            });

            $("#opcionesBotonCerrar").click(function () {
                self.hide();
            });

        },

    });

    return Opciones;
});
