/**
 * Created by horacio on 3/24/16.
 */

define(['ui/popups/popup','ui/game/itemgrid'], function (PopUp,ItemGrid) {

    var Boveda = PopUp.extend({
        init: function (game,acciones) {
            this._super("boveda");
            this.game = game;
            this.acciones = acciones;

            this.shopGrid = new ItemGrid("bovedaGridComprar",true);
            this.userGrid = new ItemGrid("bovedaGridVender",true);
            this.initCallbacks();
        },

        show: function () {
            this._super();
            var self = this;

            this.game.inventario.forEachSlot(
                function (slot) {
                    var numGraf = self.game.assetManager.getNumGraficoFromGrh(slot.grh);
                    self.userGrid.modificarSlot(slot.numero, slot.cantidad, numGraf);
                });

            this.shopGrid.resetSelectedSlot();
            this.userGrid.resetSelectedSlot();
        },

        cambiarSlotRetirar: function (Slot, Amount, numGrafico) {
            this.shopGrid.modificarSlot(Slot, Amount, numGrafico);
        },

        cambiarSlotDepositar: function (Slot, Amount, numGrafico) {
            this.userGrid.modificarSlot(Slot, Amount, numGrafico);
        },

        borrarSlotRetirar: function (slot) {
            this.shopGrid.borrarSlot(slot);
        },
        borrarSlotDepositar: function (slot) {
            this.userGrid.borrarSlot(slot);
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
                    if (isNaN(inputCantidad) || (inputCantidad < 0) || !inputCantidad)
                        inputCantidad = 1;
                    self.acciones.retirarItem(slot, inputCantidad);
                }
            });

            $("#bovedaBotonDepositarItem").click(function () {
                var slot = self.userGrid.getSelectedSlot();
                if (slot) {
                    var inputCantidad = $("#bovedaInputCantidadItem").val();
                    if (isNaN(inputCantidad) || (inputCantidad < 0) || !inputCantidad)
                        inputCantidad = 1;
                    self.acciones.depositarItem(slot, inputCantidad);
                }
            });

            $("#bovedaBotonCerrar").click(function () {
                self.hide();
                self.acciones.cerrarBoveda();
            });

            this.shopGrid.setSelectionCallback(
                function (slot) {
                    var item = self.game.inventarioShop.getSlot(slot);
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

            this.userGrid.setSelectionCallback(
                function (slot) {
                    var item = self.game.inventario.getSlot(slot);
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