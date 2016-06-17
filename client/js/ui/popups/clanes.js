/**
 * Created by horacio on 6/16/16.
 */

define(["text!../../../menus/clanes.html!strip", 'ui/popups/popup'], function (DOMdata, PopUp) {

    class Clanes extends PopUp {
        constructor(game,detallesClan,showMensajeCb) {

            var options = {
                width:500,
                height:400,
                minWidth:250,
                minHeight:300
            };
            super(DOMdata,options);

            this.game = game;
            this.detallesClan = detallesClan;
            this.showMensajeCb = showMensajeCb;

            this.initCallbacks();
            this.$clanesNameList = $("#clanesNameList");
            this.$miembrosNameList = $("#clanesMembersList");
            this.$solicitantesNameList = $("#clanesMembershipRequestList");
        }

        show() {
            super.show();
            this.game.client.sendRequestGuildLeaderInfo();
        }

        setNombresClanes(nombresClanes){
            for (var nombre of nombresClanes) {
                var $nuevoClan = $("<option>").text(nombre);
                this.$clanesNameList.append($nuevoClan);
            }
        }

        setNombresMiembros(nombresMiembros){
            for (var nombre of nombresMiembros){
                var $nuevoMiembro = $("<option>").text(nombre);
                this.$miembrosNameList.append($nuevoMiembro);
            }
        }

        setNombresSolicitantes(nombresSolicitantes){
            for (var nombre of nombresSolicitantes){
                var $nuevoSolicitante = $("<option>").text(nombre);
                this.$solicitantesNameList.append($nuevoSolicitante);
            }
        }

        hide(incomingFromServer) {
            super.hide();
        }

        initCallbacks() {
            var self = this;
            $("#clanesBotonDetallesClan").click(function () {
                var clanSeleccionado = self.$clanesNameList.find('option:selected').text();
                if (!clanSeleccionado){
                    self.showMensajeCb("Debes seleccionar un clan");
                } else {
                    self.detallesClan.show(clanSeleccionado);
                }
            });
        }

        clearDom() {
            super.clearDom();
        }
    }

    return Clanes;
});
