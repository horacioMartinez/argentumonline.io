/**
 * Created by horacio on 4/3/16.
 */

// Import HTML template as string (will be handled by Vite)
import htmlData from '../../../menus/mensajeGlobal.html?raw';
import PopUp from '../../ui/popups/popup.js';

// Extract content from body tag (similar to RequireJS text!strip)
const parser = new DOMParser();
const doc = parser.parseFromString(htmlData, 'text/html');
const DOMdata = doc.body.innerHTML;


    class Mensaje extends PopUp {
        constructor() {
            var options = {
                width: 300,
                height: 280,
                minWidth: 200,
                minHeight: 150
            };
            super(DOMdata, options, true, true);
            this._callbacksInitialized = false;
        }

        show(mensaje) {
            super.show();
            
            if (!this._callbacksInitialized) {
                this.initCallbacks();
                this._callbacksInitialized = true;
            }
            
            this.$this.find("#mensajeContenido").text(mensaje);
            this.$this.find("#mensajeBotonOk").focus();
        }

        initCallbacks() {
            var self = this;
            this.$this.find("#mensajeBotonOk").click(function () {
                self.hide();
            });
        }
    }

    
export default Mensaje;