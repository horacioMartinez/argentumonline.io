/**
 * Created by horacio on 5/2/16.
 */

define(["text!../../../menus/opciones.html!strip", 'ui/popups/popup', 'ui/popups/tabs/configurarteclas', 'ui/popups/tabs/audiotab'], function (DOMdata, PopUp, ConfigurarTeclasTab, AudioTab) {

    class Opciones extends PopUp {
        constructor(game, storage, updateKeysCallback, showMensajeCallback) {
            var options = {
                width: 500,
                height: 600,
                minWidth: 250,
                minHeight: 400
            };
            super(DOMdata, options);
            this.configurarTeclasTab = new ConfigurarTeclasTab(storage, updateKeysCallback, showMensajeCallback);
            this.audioTab = new AudioTab(game, storage);
            this.initCallbacks();
            var self = this;
            this.configurarTeclasTab.setCerrarCallback(function () {
                self.hide();
            });
        }

        show() {
            super.show();
            this.audioTab.onShow();
            this.configurarTeclasTab.onShow();
        }

        hide() {
            super.hide();
            this.audioTab.onHide();
            this.configurarTeclasTab.onHide();
        }

        initCallbacks() {
            var self = this;
            $('#opcionesSliderPantalla').slider({
                range: "min",
            });
        }

    }

    return Opciones;
});
