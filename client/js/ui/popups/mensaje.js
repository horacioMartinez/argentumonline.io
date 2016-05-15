/**
 * Created by horacio on 4/3/16.
 */

define(['ui/popups/popup'], function (PopUp) {

    var Mensaje = PopUp.extend({
        init: function () {
            this._super("mensajeGlobal",true);
            this.initCallbacks();
        },


        show: function (mensaje) {
            this._super();
            $("#mensajeContenido").text(mensaje);
            $("#mensajeBotonCerrar").focus();
        },

        initCallbacks: function () {
            var self = this;
            $("#mensajeBotonCerrar").click(function () {
                self.hide();
            });
        },
    });

    return Mensaje;
});