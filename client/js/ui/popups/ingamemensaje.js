/**
 * Created by horacio on 4/19/16.
 */

define(['ui/popups/popup'], function (PopUp) {

    var InGameMensaje = PopUp.extend({
        init: function () {
            this._super("inGameMensaje");
            this.initCallbacks();
        },


        show: function (mensaje) {
            this._super();
            $("#inGameMensajeContenido").text(mensaje);
            $("#inGameMensajeBotonCerrar").focus();
        },

        initCallbacks: function () {
            var self = this;
            $("#inGameMensajeBotonCerrar").click(function () {
                self.hide();
            });
        },
    });

    return InGameMensaje;
});