/**
 * Created by horacio on 7/7/16.
 */

define([], function () {

    class SolicitudesClan {
        constructor(game, showMensajeCb) {
            this.game = game;
            this.showMensajeCb = showMensajeCb;
            
            this.$solicitantesNameList = $("#clanesMembershipRequestList");
            this.initCallbacks();
        }

        _getSolicitudSeleccionada(){
            return  this.$solicitantesNameList.find('option:selected').text();
        }

        setNombresSolicitantes(nombresSolicitantes) {
            for (var nombre of nombresSolicitantes) {
                var $nuevoSolicitante = $("<option>").text(nombre);
                this.$solicitantesNameList.append($nuevoSolicitante);
            }
        }

        initCallbacks() {
            var self = this;
            // this.$botonDetallesClan.click(function () {
            //     var clanSeleccionado = self._getClanSeleccionado();
            //     if (!clanSeleccionado) {
            //         self.showMensajeCb("Debes seleccionar un clan");
            //     } else {
            //         self.detallesClan.show(clanSeleccionado);
            //     }
            // });
        }
    }

    return SolicitudesClan;
});