/**
 * Created by horacio on 2/22/16.
 */

define(['ui/popups/popup', 'ui/game/itemgrid', 'jquery-ui'], function (PopUp, ItemGrid) {

    var Comerciar = PopUp.extend({
        init: function (game, acciones) {
            this._super("comerciar");
            this.game = game;
            this.acciones = acciones;

            this.shopGrid = new ItemGrid("comerciarGridComprar",false);
            this.userGrid = new ItemGrid("comerciarGridVender",true);

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
            var self = this;
            this.game.inventario.forEachSlot(
                function (slot) {
                    var numGraf = self.game.assetManager.getNumGraficoFromGrh(slot.grh);
                    self.userGrid.modificarSlot(slot.numero, slot.cantidad, numGraf);
                });
            this.shopGrid.resetSelectedSlot();
            this.userGrid.resetSelectedSlot();
        },

        cambiarSlotCompra: function (Slot, Amount, numGrafico) {
            this.shopGrid.modificarSlot(Slot, Amount, numGrafico);
        },

        cambiarSlotVenta: function (Slot, Amount, numGrafico) {
            this.userGrid.modificarSlot(Slot, Amount, numGrafico);
        },

        borrarSlotCompra: function (slot) {
            this.shopGrid.borrarSlot(slot);
        },
        borrarSlotVenta: function (slot) {
            this.userGrid.borrarSlot(slot);
        },

        initCallbacks: function () {
            var self = this;

            $("#comerciarBotonComprar").click(function () {
                var slot = self.shopGrid.getSelectedSlot();
                if (slot) {
                    var inputCantidad = $("#comerciarInputCantidad").val();
                    if (!isNaN(inputCantidad)) {
                        if (inputCantidad > 0) {
                            self.acciones.comprar(slot, inputCantidad);
                        }
                    }
                }
            });

            $("#comerciarBotonVender").click(function () {
                var slot = self.userGrid.getSelectedSlot();
                if (slot) {
                    var inputCantidad = $("#comerciarInputCantidad").val();
                    if (!isNaN(inputCantidad)) {
                        if (inputCantidad > 0) {
                            self.acciones.vender(slot, inputCantidad);
                        }
                    }
                }
            });

            $("#comerciarBotonCerrar").click(function () {
                self.hide();
                self.acciones.cerrarComerciar();
            });

            this.shopGrid.setSelectionCallback(
                function (slot) {
                    var item = self.game.inventarioShop.getSlot(slot);
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

            this.userGrid.setSelectionCallback(
                function (slot) {
                    var item = self.game.inventario.getSlot(slot);
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
