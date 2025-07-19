/**
 * Created by horacio on 7/6/16.
 */

// Import HTML template as string (will be handled by Vite)
import DOMdata from '../../../menus/solicitudClan.html?raw';
import PopUp from '../../ui/popups/popup.js';



    class SolictudClan extends PopUp {
        constructor(game) {

            var options = {
                width: 500,
                height: 400,
                minWidth: 250,
                minHeight: 300
            };
            super(DOMdata, options);

            this.game = game;
            this.clan = "";

            this.$botonCancelar = $("#solicitudClanBotonCancelar");
            this.$botonEnviar = $("#solicitudClanBotonEnviar");

            this.initCallbacks();
        }

        show(targetClan) {
            super.show();
            this.clan = targetClan;
        }

        initCallbacks() {
            var self = this;

            this.$botonCancelar.click(function(){
               self.hide();
            });

            this.$botonEnviar.click(function(){
                var textoSolicitud = $("#detallesClanInputSolicitud").val();
                self.game.client.sendGuildRequestMembership(self.clan, textoSolicitud);
                self.hide();
            });

        }

    }

    
export default SolictudClan;