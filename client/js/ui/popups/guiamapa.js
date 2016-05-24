/**
 * Created by horacio on 4/12/16.
 */

define(["text!../../../menus/mapa.html!strip", 'ui/popups/popup'], function (DOMdata, PopUp) {

    var GuiaMapa = PopUp.extend({
        init: function (game, acciones) {
            this._super(DOMdata);
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