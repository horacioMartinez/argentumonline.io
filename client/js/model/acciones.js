/**
 * Created by horacio on 4/9/16.
 */

define(['model/intervalos'], function (Intervalos) {

    var Acciones = Class.extend({
        init: function (game) {
            this.game = game;
            this.intervalos = new Intervalos(0);
            this.MAX_CANTIDAD_ITEM = 10000;
        },

        agarrar: function () {

            if (this.game.player.muerto) {
                this.game.escribirMsgConsola(Enums.MensajeConsola.ESTAS_MUERTO);
            }
            else {
                this.game.client.sendPickUp();
            }
        },

        ocultarse: function () {

            if (this.game.player.muerto) {
                this.game.escribirMsgConsola(Enums.MensajeConsola.ESTAS_MUERTO);
            }
            else {
                this.game.client.sendWork(Enums.Skill.ocultarse);
            }
        },

        requestPosUpdate: function () {
            if (this.intervalos.requestPosUpdate(this.game.currentTime))
                this.game.client.sendRequestPositionUpdate();
        },

        equiparSelectedItem: function () {
            var slot = this.game.gameUI.interfaz.getSelectedSlotInventario();
            if (slot)
                this.game.client.sendEquipItem(slot);
        },

        usarConU: function () {
            var slot = this.game.gameUI.interfaz.getSelectedSlotInventario();
            if (!slot)
                return;
            if (this.intervalos.requestUsarConU(this.game.currentTime)) {
                this.game.client.sendUseItem(slot);
            }
        },

        usarConDobleClick: function (slot) {
            if (!slot)
                return;
            if (this.intervalos.requestUsarConDobleClick(this.game.currentTime)) {
                this.game.client.sendUseItem(slot);
            }

        },

        atacar: function () {
            if (this.intervalos.requestAtacar(this.game.currentTime)) {
                this.game.client.sendAttack();
                switch (this.game.player.heading) { // todo: hacerlo con el arco y con hechizos tambien
                    case  Enums.Heading.oeste:
                        this.game.player.lastAttackedTarget = this.game.entityGrid[this.game.player.gridX - 1][this.game.player.gridY][1];
                        break;
                    case  Enums.Heading.este:
                        this.game.player.lastAttackedTarget = this.game.entityGrid[this.game.player.gridX + 1][this.game.player.gridY][1];
                        break;
                    case  Enums.Heading.norte:
                        this.game.player.lastAttackedTarget = this.game.entityGrid[this.game.player.gridX][this.game.player.gridY - 1][1];
                        break;
                    case  Enums.Heading.sur:
                        this.game.player.lastAttackedTarget = this.game.entityGrid[this.game.player.gridX][this.game.player.gridY + 1][1];
                        break;
                    default:
                        log.error(" Direccion de player invalida!");
                }
            }

        },

        caminar: function (direccion) {
            if (this.game.logeado)
                this.game.player.comenzarCaminar(direccion);
        },

        terminarDeCaminar: function (direccion) {
            if (this.game.logeado)
                this.game.player.terminarDeCaminar(direccion);
        },

        click: function () {
            var gridPos = this.game.getMouseGridPosition();
            if (this.game.logeado) {
                if (this.game.trabajoPendiente) {
                    this.game.gameUI.interfaz.setMouseCrosshair(false);
                    this.game.client.sendWorkLeftClick(gridPos.x, gridPos.y, this.game.trabajoPendiente);
                    this.game.trabajoPendiente = false;
                }
                else
                    this.game.client.sendLeftClick(gridPos.x, gridPos.y);
            }
        },

        doubleClick: function () {
            var gridPos = this.game.getMouseGridPosition();
            if (this.game.logeado)
                this.game.client.sendDoubleClick(gridPos.x, gridPos.y);
        },

        tratarDeTirarItem: function () {
            if (this.game.player.muerto) {
                this.game.escribirMsgConsola(Enums.MensajeConsola.ESTAS_MUERTO);
                return;
            }
            var selectedSlot = this.game.gameUI.interfaz.getSelectedSlotInventario();
            if (!selectedSlot)
                return;
            var amount = this.game.inventario[selectedSlot].cantidad;
            if (amount === 1)
                this.game.tirarSelectedItem(1);
            else {
                this.game.gameUI.showTirar();
            }
        },

        lanzarHechizo: function () { /*todo: slot por parametro*/
            if (!this.intervalos.requestLanzarHechizo(this.game.currentTime))
                return;
            var slot = this.game.gameUI.interfaz.getSelectedSlotHechizo();
            if (!slot)
                return;
            this.game.client.sendCastSpell(slot);
            this.game.client.sendWork(Enums.Skill.magia);
        },

        requestInfoHechizo: function () {
            var slot = this.game.gameUI.interfaz.getSelectedSlotHechizo();
            if (slot)
                this.game.client.sendSpellInfo(slot);
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

    return Acciones;
});