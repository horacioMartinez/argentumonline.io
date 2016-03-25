/**
 * Created by horacio on 2/22/16.
 */

define(['ui/itemgrid'], function (ItemGrid) {

    var Comerciar = Class.extend({
        init: function (game) {
            this.game = game;
            this.visible = false;
            this.DOMid = "comerciar";
            this.compraGrid = new ItemGrid("comerciarGridComprar");
            this.ventaGrid = new ItemGrid("comerciarGridVender");
            this.initCallbacks();
        },

        show: function () {
            this.clearInfos();
            $('#comerciar').show();
            this.visible = true;
            for (var i = 1; i < this.game.inventario.length; i++) {
                item = this.game.inventario[i];
                if (item) {
                    var numGraf = this.game.renderer.getNumGraficoFromGrh(item.grh);
                    if (numGraf) {
                        this.ventaGrid.modificarSlot(i, item.cantidad, numGraf);
                    }
                }
            }
        },

        hide: function () {
            $('#comerciar').hide();
            this.visible = false;
        },

        cambiarSlotCompra: function (Slot, Amount, numGrafico) {
            this.compraGrid.modificarSlot(Slot, Amount, numGrafico);
        },

        cambiarSlotVenta: function (Slot, Amount, numGrafico) {
            this.ventaGrid.modificarSlot(Slot, Amount, numGrafico);
        },

        borrarSlotCompra: function (slot) {
            this.compraGrid.borrarSlot(slot);
        },
        borrarSlotVenta: function (slot) {
            this.ventaGrid.borrarSlot(slot);
        },

        clearInfos: function () {
            $('#comerciar span').text('');
            $('#comerciar input').val('');
        },

        initCallbacks: function () {
            var self = this;

            $("#comerciarBotonComprar").click(function () {
                var slot = self.compraGrid.getSelectedSlot();
                if (slot) {
                    var inputCantidad = $("#comerciarInputCantidad").val();
                    if (!isNaN(inputCantidad)) {
                        if (inputCantidad > 0) {
                            self.game.comprar(slot, inputCantidad);
                        }
                    }
                }
            });

            $("#comerciarBotonVender").click(function () {
                var slot = self.ventaGrid.getSelectedSlot();
                if (slot) {
                    var inputCantidad = $("#comerciarInputCantidad").val();
                    if (!isNaN(inputCantidad)) {
                        if (inputCantidad > 0) {
                            self.game.vender(slot, inputCantidad);
                        }
                    }
                }
            });

            $("#comerciarBotonCerrar").click(function () {
                self.hide();
                self.game.cerrarComerciar();
            });

            this.compraGrid.setSelectionCallback(
                function (slot) {
                    item = self.game.inventarioCompra[slot];
                    $('#comerciarNombre').text(item.objName);
                    if (item.precio)
                        $('#comerciarPrecio').text("Precio: " + item.precio);
                    else
                        $('#comerciarPrecio').text("");

                    if (item.minDef)
                        $('#comerciarMin').text("Mín Defensa: " + item.minDef);
                    else {
                        if (item.minHit)
                            $('#comerciarMin').text("Mín Golpe: " + item.minHit);
                        else
                            $('#comerciarMin').text("");
                    }
                    if (item.maxDef)
                        $('#comerciarMax').text("Máx Defensa: " + item.maxDef);
                    else {
                        if (item.maxHit)
                            $('#comerciarMax').text("Máx Golpe: " + item.maxHit);
                        else
                            $('#comerciarMax').text("");
                    }
                });

            this.ventaGrid.setSelectionCallback(
                function (slot) {
                    item = self.game.inventario[slot];
                    $('#comerciarNombre').text(item.objName);
                    $('#comerciarPrecio').text("");
                    if (item.minDef)
                        $('#comerciarMin').text("Mín Defensa: " + item.minDef);
                    else {
                        if (item.minHit)
                            $('#comerciarMin').text("Mín Golpe: " + item.minHit);
                        else
                            $('#comerciarMin').text("");
                    }

                    if (item.maxDef)
                        $('#comerciarMax').text("Máx Defensa: " + item.maxDef);
                    else {
                        if (item.maxHit)
                            $('#comerciarMax').text("Máx Golpe: " + item.maxHit);
                        else
                            $('#comerciarMax').text("");
                    }
                });
        },
    });

    return Comerciar;
});
