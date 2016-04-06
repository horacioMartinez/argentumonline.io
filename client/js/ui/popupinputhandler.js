/**
 * Created by horacio on 3/27/16.
 */

define([], function () {
    var PopUpInputHandler = Class.extend({

        init: function (game) {
            this.game = game;
            this.MAX_CANTIDAD_ITEM = 10000;
        },

        comprar: function (slot, cantidad) {
            this.game.client.sendCommerceBuy(slot, cantidad);
        },

        vender: function (slot, cantidad) {
            this.game.client.sendCommerceSell(slot, cantidad);
        },

        cerrarComerciar: function () {
            this.game.client.sendCommerceEnd();
        },

        retirarOro: function (cantidad) {
            this.game.client.sendBankExtractGold(cantidad);
        },

        depositarOro: function (cantidad) {
            this.game.client.sendBankDepositGold(cantidad);
        },

        retirarItem: function (slot, cantidad) {
            this.game.client.sendBankExtractItem(slot, cantidad);
        },

        depositarItem: function (slot, cantidad) {
            this.game.client.sendBankDeposit(slot, cantidad);
        },

        cerrarBoveda: function () {
            this.game.client.sendBankEnd();
        },

        tirarSelectedItem: function (cantidad) {
            log.error(this.game.started);
            this.game.tirarSelectedItem(cantidad);
        },

        tirarTodoSelectedItem: function () {
            var selectedSlot = this.game.gameUI.interfaz.getSelectedSlotInventario();
            if (!selectedSlot)
                return;
            this.game.tirarSelectedItem(this.game.inventario[selectedSlot].cantidad);
        },

        tirarOro: function (cantidad) {
            if (cantidad > (this.game.player.oro))
                cantidad = this.game.player.oro;
            if (cantidad > 10000)
                cantidad = 10000;
            this.game.client.sendDrop(31, cantidad); // por alguna razon 31 es el "slot" del oro
        },

        tirarTodoOro: function () {
            this.tirarOro(this.MAX_CANTIDAD_ITEM);
        },
    });

    return PopUpInputHandler;
});