/**
 * Created by horacio on 4/12/16.
 */

// Import HTML template as string (will be handled by Vite)
import DOMdata from '../../../menus/mapa.html?raw';
import PopUp from '../../ui/popups/popup.js';



    class GuiaMapa extends PopUp {
        constructor(game, acciones) {
            var options = {
                width: 610,
                height: 550,
            };
            super(DOMdata, options);
            this.initCallbacks();
        }

        initCallbacks() {
            var self = this;
            $("#mapaBotonCerrar").click(function () {
                self.hide();
            });
            // $("#mapaBotonToggle").click(function () {
            //     $("#popUpMapa").toggleClass("mapaSeccionB");
            // });

        }
    }

    
export default GuiaMapa;