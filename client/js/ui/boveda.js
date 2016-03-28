/**
 * Created by horacio on 3/24/16.
 */

define(['ui/popup','ui/itemgrid'], function (PopUp,ItemGrid) {

    var Boveda = PopUp.extend({
        init: function (inputHandler) {
            this._super("boveda");
            this.game = inputHandler.game;
            this.inputHandler = inputHandler;

            this.compraGrid = new ItemGrid("bovedaGridComprar");
            this.ventaGrid = new ItemGrid("bovedaGridVender");
            this.initCallbacks();
        },

        show: function () {
            this._super();
            for (var i = 1; i < this.game.inventario.length; i++) {
                var item = this.game.inventario[i];
                if (item) {
                    var numGraf = this.game.renderer.getNumGraficoFromGrh(item.grh);
                    if (numGraf) {
                        this.ventaGrid.modificarSlot(i, item.cantidad, numGraf);
                    }
                }
            }
            this.compraGrid.resetSelectedSlot();
            this.ventaGrid.resetSelectedSlot();
        },

        cambiarSlotRetirar: function (Slot, Amount, numGrafico) {
            this.compraGrid.modificarSlot(Slot, Amount, numGrafico);
        },

        cambiarSlotDepositar: function (Slot, Amount, numGrafico) {
            this.ventaGrid.modificarSlot(Slot, Amount, numGrafico);
        },

        borrarSlotRetirar: function (slot) {
            this.compraGrid.borrarSlot(slot);
        },
        borrarSlotDepositar: function (slot) {
            this.ventaGrid.borrarSlot(slot);
        },

        setOroDisponible: function (oro) {
            $("#bovedaOroDisponible").text(oro);
        },

        initCallbacks: function () {
            var self = this;

            $("#bovedaBotonRetirarOro").click(function () {
                var inputCantidad = $("#bovedaInputCantidadOro").val();
                if (!isNaN(inputCantidad)) {
                    if (inputCantidad > 0) {
                        self.inputHandler.retirarOro(inputCantidad);
                    }
                }
            });

            $("#bovedaBotonDepositarOro").click(function () {
                var inputCantidad = $("#bovedaInputCantidadOro").val();
                if (!isNaN(inputCantidad)) {
                    if (inputCantidad > 0) {
                        self.inputHandler.depositarOro(inputCantidad);
                    }
                }
            });

            $("#bovedaBotonRetirarItem").click(function () {
                var slot = self.compraGrid.getSelectedSlot();
                if (slot) {
                    var inputCantidad = $("#bovedaInputCantidadItem").val();
                    if (isNaN(inputCantidad) || (inputCantidad < 0) || !inputCantidad)
                        inputCantidad = 1;
                    self.inputHandler.retirarItem(slot, inputCantidad);
                }
            });

            $("#bovedaBotonDepositarItem").click(function () {
                var slot = self.ventaGrid.getSelectedSlot();
                if (slot) {
                    var inputCantidad = $("#bovedaInputCantidadItem").val();
                    if (isNaN(inputCantidad) || (inputCantidad < 0) || !inputCantidad)
                        inputCantidad = 1;
                    self.inputHandler.depositarItem(slot, inputCantidad);
                }
            });

            $("#bovedaBotonCerrar").click(function () {
                self.hide();
                self.inputHandler.cerrarBoveda();
            });

            this.compraGrid.setSelectionCallback(
                function (slot) {
                    var item = self.game.inventarioBoveda[slot];
                    $('#bovedaNombre').text(item.objName);
                    if (item.minDef)
                        $('#bovedaMin').text("Mín Defensa: " + item.minDef);
                    else {
                        if (item.minHit)
                            $('#bovedaMin').text("Mín Golpe: " + item.minHit);
                        else
                            $('#bovedaMin').text("");
                    }
                    if (item.maxDef)
                        $('#bovedaMax').text("Máx Defensa: " + item.maxDef);
                    else {
                        if (item.maxHit)
                            $('#bovedaMax').text("Máx Golpe: " + item.maxHit);
                        else
                            $('#bovedaMax').text("");
                    }
                });

            this.ventaGrid.setSelectionCallback(
                function (slot) {
                    var item = self.game.inventario[slot];
                    $('#bovedaNombre').text(item.objName);
                    if (item.minDef)
                        $('#bovedaMin').text("Mín Defensa: " + item.minDef);
                    else {
                        if (item.minHit)
                            $('#bovedaMin').text("Mín Golpe: " + item.minHit);
                        else
                            $('#bovedaMin').text("");
                    }

                    if (item.maxDef)
                        $('#bovedaMax').text("Máx Defensa: " + item.maxDef);
                    else {
                        if (item.maxHit)
                            $('#bovedaMax').text("Máx Golpe: " + item.maxHit);
                        else
                            $('#bovedaMax').text("");
                    }
                });
        },
    });

    return Boveda;
});