/**
 * Created by horacio on 7/6/16.
 */

define(["text!../../../menus/solicitudClan.html!strip", 'ui/popups/popup'], function (DOMdata, PopUp) {

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

    return SolictudClan;
});