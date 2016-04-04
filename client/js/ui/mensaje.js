/**
 * Created by horacio on 4/3/16.
 */

define(['ui/popup'], function (PopUp) {

    var mensaje = PopUp.extend({
        init: function (inputHandler) {
            this._super("mensaje");

            this.game = inputHandler.game;
            this.inputHandler = inputHandler;
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