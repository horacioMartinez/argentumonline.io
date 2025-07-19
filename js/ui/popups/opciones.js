/**
 * Created by horacio on 5/2/16.
 */

// Import HTML template as string (will be handled by Vite)
import DOMdata from '../../../menus/opciones.html?raw';
import PopUp from '../../ui/popups/popup.js';
import ConfigurarTeclasTab from '../../ui/popups/tabs/configurarteclas.js';
import AudioTab from '../../ui/popups/tabs/audiotab.js';
import Screenfull from 'screenfull';



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
            this._callbacksInitialized = false;
            var self = this;
            this.configurarTeclasTab.setCerrarCallback(function () {
                self.hide();
            });
        }

        show() {
            super.show();
            
            if (!this._callbacksInitialized) {
                this.initCallbacks();
                this._initFullScreenListener();
                this._callbacksInitialized = true;
            }
            
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

    
export default Opciones;