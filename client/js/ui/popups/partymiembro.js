/**
 * Created by horacio on 7/11/16.
 */

define(["text!../../../menus/partyMiembro.html!strip", 'ui/popups/popup'], function (DOMdata, PopUp) {

    class PartyMiembro extends PopUp {
        constructor(game, showMensajeCb) {

            var options = {
                width: 500,
                height: 400,
                minWidth: 250,
                minHeight: 300
            };
            super(DOMdata, options);

            this.game = game;
            this.showMensajeCb = showMensajeCb;

            this.$inputMensaje = $("#partyMiembroMensaje");
            this.$miembrosList = $("#partyMiembroMembersList");
            this.$experienciaTotal = $("#partyMiembroExperienciaTotal");
            this.$botonAbandonar = $("#partyMiembroBotonAbandonar");
            this.$botonCerrar = $("#partyMiembroBotonCerrar");

            this.initCallbacks();
        }

        show(miembros, exp) {
            super.show();

            this.$miembrosList.empty();
            for (var nombre of miembros) {
                var $nuevoMiembro = $("<option>").text(nombre);
                this.$miembrosList.append($nuevoMiembro);
            }
            this.$experienciaTotal.text(exp);
        }

        initCallbacks() {

            this.$botonAbandonar.click(() => {
                this.game.client.sendPartyLeave();
                this.hide();
            });

            this.$botonCerrar.click(() => {
                this.game.client.sendPartyLeave();
                this.hide();
            });

            this.$inputMensaje.keypress((event) => {
                if (event.keyCode == 13 || event.which == 13) {
                    this.game.client.sendPartyMessage(this.$inputMensaje.val());
                    this.$inputMensaje.val('');
                    event.preventDefault();
                }
            });
        }

    }

    return PartyMiembro;
});
