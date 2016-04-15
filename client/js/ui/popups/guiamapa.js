/**
 * Created by horacio on 4/12/16.
 */

define(['ui/popups/popup'], function (PopUp) {

    var GuiaMapa = PopUp.extend({
        init: function (game, acciones) {
            this._super("popUpMapa");
            this.initCallbacks();
        },

        initCallbacks: function () {
            var self = this;
            $("#mapaBotonCerrar").click(function () {
                self.hide();
            });
            $("#mapaBotonToggle").click(function () {
                $("#popUpMapa").toggleClass("mapaSeccionB");
            });

        },
    });

    return GuiaMapa;
});