/**
 * Created by horacio on 4/3/16.
 */

define(["text!../../../menus/mensajeGlobal.html!strip", 'ui/popups/popup'], function (DOMdata, PopUp) {

    class Mensaje extends PopUp {
        constructor() {
            var options = {
                width: 300,
                height: 280,
                minWidth: 200,
                minHeight: 150
            };
            super(DOMdata, options, true, true);
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