/**
 * Created by horacio on 07/08/2016.
 */

// Import HTML template as string (will be handled by Vite)
import DOMdata from '../../../menus/menu.html?raw';
import PopUp from '../../ui/popups/popup.js';



    class Menu extends PopUp {
        constructor(game, showMapaCb, showEstadisticasCb, showClanesCb, showOpcionesCb) {
            var options = {
                width: 220,
                height: 225,
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
            this._callbacksInitialized = false;
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
            
            // Initialize callbacks after dialog is created
            if (!this._callbacksInitialized) {
                this.initCallbacks();
                this._callbacksInitialized = true;
            }
        }

        initCallbacks() {
            var self = this;

            this.$this.find("#botonMapa1").click(function () {
                self.showMapaCb();
            });

            this.$this.find("#botonEstadisticas1").click(function () {
                self.showEstadisticasCb();
            });

            //this.$this.find("#botonClanes1").click(function () {
            //    self.showClanesCb();
            //});

            this.$this.find("#botonParty1").click(function () {
                self.game.client.sendRequestPartyForm();
            });

            this.$this.find("#botonOpciones1").click(function () {
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

    
export default Menu;