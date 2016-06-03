/**
 * Created by horacio on 4/3/16.
 */

define(["text!../../../menus/mensajeGlobal.html!strip", 'ui/popups/popup'], function (DOMdata, PopUp) {

    class Mensaje extends PopUp {
        constructor() {
            super(DOMdata, true);
            this.initCallbacks();
        }

        show(mensaje) {
            super.show();
            $("#mensajeContenido").text(mensaje);
            $("#mensajeBotonOk").focus();
        }

        initCallbacks() {
            var self = this;
            $("#mensajeBotonOk").click(function () {
                self.hide();
            });
        }
    }

    return Mensaje;
});