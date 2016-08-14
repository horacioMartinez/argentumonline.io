/**
 * Created by horacio on 4/12/16.
 */

define(["text!../../../menus/mapa.html!strip", 'ui/popups/popup'], function (DOMdata, PopUp) {

    class GuiaMapa extends PopUp {
        constructor(game, acciones) {
            var options = {
                width: 610,
                height: 550,
            };
            super(DOMdata, options);
            this.initCallbacks();
        }

        initCallbacks() {
            var self = this;
            $("#mapaBotonCerrar").click(function () {
                self.hide();
            });
            // $("#mapaBotonToggle").click(function () {
            //     $("#popUpMapa").toggleClass("mapaSeccionB");
            // });

        }
    }

    return GuiaMapa;
});