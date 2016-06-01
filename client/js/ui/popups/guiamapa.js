/**
 * Created by horacio on 4/12/16.
 */

define(["text!../../../menus/mapa.html!strip", 'ui/popups/popup'], function (DOMdata, PopUp) {

    class GuiaMapa extends PopUp {
        constructor(game, acciones) {
            super(DOMdata);
            this.initCallbacks();
        }

        initCallbacks() {
            var self = this;
            $("#mapaBotonCerrar").click(function () {
                self.hide();
            });
            $("#mapaBotonToggle").click(function () {
                $("#popUpMapa").toggleClass("mapaSeccionB");
            });

        }
    }

    return GuiaMapa;
});