/**
 * Created by horacio on 2/22/16.
 */

define(['ui/popups/popup','ui/itemgrid','jquery-ui'], function (PopUp,ItemGrid) {

    var Comerciar = PopUp.extend({
        init: function (inputHandler) {
            this._super("comerciar");
            this.game = inputHandler.game;
            this.popUpInputHandler = inputHandler;

            this.compraGrid = new ItemGrid("comerciarGridComprar");
            this.ventaGrid = new ItemGrid("comerciarGridVender");

            /*$("#comerciarGridComprar").$( "#droppable" ).droppable({ // <-- TODO: grid dropeables
                activeClass: "ui-state-default",
                hoverClass: "ui-state-hover",
                drop: function( event, ui ) {
                    $( this )
                        .addClass( "ui-state-highlight" )
                        .find( "p" )
                        .html( "Dropped!" );
                }
            });*/


            this.initCallbacks();
        },

        show: function () {
            this._super();
            for (var i = 1; i < this.game.inventario.length; i++) {
                item = this.game.inventario[i];
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

        initCallbacks: function () {
            var self = this;

            $("#comerciarBotonComprar").click(function () {
                var slot = self.compraGrid.getSelectedSlot();
                if (slot) {
                    var inputCantidad = $("#comerciarInputCantidad").val();
                    if (!isNaN(inputCantidad)) {
                        if (inputCantidad > 0) {
                            self.popUpInputHandler.comprar(slot, inputCantidad);
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
                            self.popUpInputHandler.vender(slot, inputCantidad);
                        }
                    }
                }
            });

            $("#comerciarBotonCerrar").click(function () {
                self.hide();
                self.popUpInputHandler.cerrarComerciar();
            });

            this.compraGrid.setSelectionCallback(
                function (slot) {
                    var item = self.game.inventarioCompra[slot];
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
                    var item = self.game.inventario[slot];
                    $('#comerciarNombre').text(item.objName);

                    if (item.precioVenta)
                        $('#comerciarPrecio').text("Precio: " + item.precioVenta);
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
        },
    });

    return Comerciar;
});
