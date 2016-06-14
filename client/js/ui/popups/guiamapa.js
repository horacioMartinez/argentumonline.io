/**
 * Created by horacio on 4/12/16.
 */

define(["text!../../../menus/mapa.html!strip", 'ui/popups/popup'], function (DOMdata, PopUp) {

    class GuiaMapa extends PopUp {
        constructor(game, acciones) {
            var options = {
                width:700,
                height:700,
                minWidth:700,
                minHeight:700
            };
            super(DOMdata,options);
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