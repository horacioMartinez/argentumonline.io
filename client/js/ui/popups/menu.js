/**
 * Created by horacio on 07/08/2016.
 */

define(["text!../../../menus/menu.html!strip", 'ui/popups/popup'], function (DOMdata, PopUp) {

    class Menu extends PopUp {
        constructor(game, showMapaCb, showEstadisticasCb, showClanesCb, showOpcionesCb) {
            var options = {
                width: 220,
                height: 300,
                minWidth: 150,
                minHeight: 280
            };
            super(DOMdata, options);
            this.game = game;
            this.showMapaCb = showMapaCb;
            this.showEstadisticasCb = showEstadisticasCb;
            this.showClanesCb = showClanesCb;
            this.showOpcionesCb = showOpcionesCb;

            this._lastClosedTime = 0;
            this.initCallbacks();
        }

        hide(){
            super.hide();
            this._lastClosedTime = Date.now();
        }

        show(fromEscapeKey){
            // fromEscapeKey: fix feo para poder mostrar y ocultar con la tecla esc
            if (fromEscapeKey){
                if (this._lastClosedTime > Date.now() - 20 ){
                    return;
                }
            }
            super.show();
        }

        initCallbacks() {
            var self = this;

            $("#botonMapa1").click(function () {
                self.showMapaCb();
            });

            $("#botonEstadisticas1").click(function () {
                self.showEstadisticasCb();
            });

            $("#botonClanes1").click(function () {
                self.showClanesCb();
            });

            $("#botonParty1").click(function () {
                self.game.client.sendRequestPartyForm();
            });

            $("#botonOpciones1").click(function () {
                self.showOpcionesCb();
            });

            // $("#comerciarBotonComprar").click(function () {
            //     var slot = self.shopGrid.getSelectedSlot();
            //     if (slot) {
            //         var inputCantidad = $("#comerciarInputCantidad").val();
            //         if (!isNaN(inputCantidad)) {
            //             if (inputCantidad > 0) {
            //                 self.acciones.comprar(slot, inputCantidad);
            //             }
            //         }
            //     }
            // });
        }
    }

    return Menu;
});

