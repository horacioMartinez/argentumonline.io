/**
 * Created by horacio on 7/7/16.
 */

define([], function () {

    class MiembrosClan {
        constructor(game, detallesClan, showMensajeCb, solicitudClanCb) {
            this.game = game;

            this.$miembrosNameList = $("#clanesMembersList");
            this.initCallbacks();
        }

        setNombresMiembros(nombresMiembros) {
            for (var nombre of nombresMiembros) {
                var $nuevoMiembro = $("<option>").text(nombre);
                this.$miembrosNameList.append($nuevoMiembro);
            }
        }

        _getMiembroSeleccionado(){
            return  this.$miembrosNameList.find('option:selected').text();
        }

        initCallbacks() {
            var self = this;
        }
    }

    return MiembrosClan;
});