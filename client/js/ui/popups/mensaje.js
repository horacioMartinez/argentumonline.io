/**
 * Created by horacio on 4/3/16.
 */

define(["text!../../../menus/mensajeGlobal.html!strip",'ui/popups/popup'], function (DOMdata,PopUp) {

    var Mensaje = PopUp.extend({
        init: function () {
            this._super(DOMdata,true);
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