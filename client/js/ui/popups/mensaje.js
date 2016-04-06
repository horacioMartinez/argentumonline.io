/**
 * Created by horacio on 4/3/16.
 */

define(['ui/popups/popup'], function (PopUp) {

    var mensaje = PopUp.extend({
        init: function () {
            this._super("mensaje");
            this.initCallbacks();
        },


        show: function (mensaje) {
            this._super();
            $("#mensajeContenido").text(mensaje);
        },

        initCallbacks: function () {
            var self = this;
            $("#mensajeBotonCerrar").click(function () {
                self.hide();
            });
        },
    });

    return mensaje;
});