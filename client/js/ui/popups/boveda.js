/**
 * Created by horacio on 3/24/16.
 */

define(["text!../../../menus/boveda.html!strip", 'ui/popups/popup', 'ui/game/itemgrid'], function (DOMdata, PopUp, ItemGrid) {

    class Boveda extends PopUp {
        constructor(game, acciones) {
            var options = {
                width: 500,
                height: 400,
                minWidth: 250,
                minHeight: 300
            };
            super(DOMdata, options);
            this.game = game;
            this.acciones = acciones;

            this.shopGrid = new ItemGrid("bovedaGridComprar");
            this.userGrid = new ItemGrid("bovedaGridVender");
            this.initCallbacks();
        }

        show() {
            super.show();
            var self = this;

            this.game.inventario.forEachSlot(
                function (slot) {
                    var numGraf = self.game.assetManager.getNumGraficoFromGrh(slot.grh);
                    self.userGrid.modificarSlot(slot.numero, slot.cantidad, numGraf);
                });

            this.shopGrid.deselect();
            this.userGrid.deselect();
        }

        hide(incomingFromServer) {
            super.hide();
            if (!incomingFromServer) {
                this.acciones.cerrarBoveda();
            }
        }

        cambiarSlotRetirar(Slot, Amount, numGrafico) {
            this.shopGrid.modificarSlot(Slot, Amount, numGrafico);
        }

        cambiarSlotDepositar(Slot, Amount, numGrafico) {
            this.userGrid.modificarSlot(Slot, Amount, numGrafico);
        }

        borrarSlotRetirar(slot) {
            this.shopGrid.borrarSlot(slot);
        }

        borrarSlotDepositar(slot) {
            this.userGrid.borrarSlot(slot);
        }

        setOroDisponible(oro) {
            $("#bovedaOroDisponibleLabel").text("ORO DISPONIBLE");
            $("#bovedaOroDisponibleVal").text(oro);
        }

        initCallbacks() {
            var self = this;

            $("#bovedaBotonRetirarOro").click(function () {
                var inputCantidad = $("#bovedaInputCantidadOro").val();
                if (!isNaN(inputCantidad)) {
                    if (inputCantidad > 0) {
                        self.acciones.retirarOro(inputCantidad);
                    }
                }
            });

            $("#bovedaBotonDepositarOro").click(function () {
                var inputCantidad = $("#bovedaInputCantidadOro").val();
                if (!isNaN(inputCantidad)) {
                    if (inputCantidad > 0) {
                        self.acciones.depositarOro(inputCantidad);
                    }
                }
            });

            $("#bovedaBotonRetirarItem").click(function () {
                var slot = self.shopGrid.getSelectedSlot();
                if (slot) {
                    var inputCantidad = $("#bovedaInputCantidadItem").val();
                    if (isNaN(inputCantidad) || (inputCantidad < 0) || !inputCantidad) {
                        inputCantidad = 1;
                    }
                    self.acciones.retirarItem(slot, inputCantidad);
                }
            });

            $("#bovedaBotonDepositarItem").click(function () {
                var slot = self.userGrid.getSelectedSlot();
                if (slot) {
                    var inputCantidad = $("#bovedaInputCantidadItem").val();
                    if (isNaN(inputCantidad) || (inputCantidad < 0) || !inputCantidad) {
                        inputCantidad = 1;
                    }
                    self.acciones.depositarItem(slot, inputCantidad);
                }
            });

            this.shopGrid.setSelectionCallback(
                function (slot) {
                    var item = self.game.inventarioShop.getSlot(slot);
                    self.displayItemData(item);
                });

            this.userGrid.setSelectionCallback(
                function (slot) {
                    var item = self.game.inventario.getSlot(slot);
                    self.displayItemData(item);
                });
        }

        displayItemData(item) {
            var minLabel = "";
            var maxLabel = "";

            if (item.minDef) {
                minLabel = "MIN DEFENSA";
            }
            if (item.minHit) {
                minLabel = "MIN GOLPE";
            }

            if (item.maxDef) {
                maxLabel = "MAX DEFENSA";
            }
            if (item.maxHit) {
                maxLabel = "MAX GOLPE";
            }

            var minVal = item.minDef || item.minHit;
            var maxVal = item.maxDef || item.maxHit;

            this.completarLabels(item.objName.toUpperCase(), minLabel, minVal, maxLabel, maxVal);
        }

        completarLabels(nombreVal, minLabel, minVal, maxLabel, maxVal) {
            if (!minLabel) {
                minVal = "";
            }
            if (!maxLabel) {
                maxVal = "";
            }

            $('#bovedaNombreLabel').text("NOMBRE");
            $('#bovedaNombreVal').text(nombreVal);
            $('#bovedaMinLabel').text(minLabel);
            $('#bovedaMinVal').text(minVal);
            $('#bovedaMaxLabel').text(maxLabel);
            $('#bovedaMaxVal').text(maxVal);
        }
    }

    return Boveda;
});