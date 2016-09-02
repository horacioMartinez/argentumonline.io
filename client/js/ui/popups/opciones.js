/**
 * Created by horacio on 5/2/16.
 */

define(["text!../../../menus/opciones.html!strip", 'ui/popups/popup', 'ui/popups/tabs/configurarteclas', 'ui/popups/tabs/audiotab', 'lib/screenfull'],
    function (DOMdata, PopUp, ConfigurarTeclasTab, AudioTab, Screenfull) {

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
            this._initFullScreenListener();
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

        _initFullScreenListener(){
            if (Screenfull.enabled) {
                document.addEventListener(Screenfull.raw.fullscreenchange, () => {
                    $("#opcionesCheckboxFullscreen").prop('checked', Screenfull.isFullscreen);
                });
            }
        }

        initCallbacks() {
            var self = this;

            $("#opcionesCheckboxFullscreen").change(function () {
                if (!Screenfull.enabled) {
                    alert("No es posible jugar en pantalla completa");
                    this.checked = false;
                    return;
                }
                if (this.checked) {
                    Screenfull.request();
                } else {
                    Screenfull.exit();
                }
            });

            $('#opcionesSliderPantalla').slider({
                range: "min",
            });
        }

    }

    return Opciones;
});
