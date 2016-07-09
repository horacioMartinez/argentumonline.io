/**
 * Created by horacio on 7/9/16.
 */

define([], function () {

    class SettingsClan {
        constructor() {
            this.initCallbacks();
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

    return SettingsClan;
});
