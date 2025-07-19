/**
 * Created by horacio on 4/19/16.
 */

// Import HTML template as string (will be handled by Vite)
import DOMdata from '../../../menus/inGameMensaje.html?raw';
import PopUp from '../../ui/popups/popup.js';



    class InGameMensaje extends PopUp {
        constructor() {
            var options = {
                width: 300,
                height: 280,
                minWidth: 200,
                minHeight: 150
            };
            super(DOMdata, options);
            this.initCallbacks();
        }

        show(mensaje) {
            super.show();
            $("#inGameMensajeContenido").text(mensaje);
            $("#inGameMensajeBotonOk").focus();
        }

        initCallbacks() {
            var self = this;
            $("#inGameMensajeBotonOk").click(function () {
                self.hide();
            });
        }
    }

    
export default InGameMensaje;