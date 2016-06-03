/**
 * Created by horacio on 4/9/16.
 */

define(['enums'], function (Enums) {

    class Acciones {
        constructor(game, intervalos) {
            this.game = game;
            this.intervalos = intervalos;
            this.MAX_CANTIDAD_ITEM = 10000;
        }

        agarrar() {

            if (this.game.player.muerto) {
                this.game.escribirMsgConsola(Enums.MensajeConsola.ESTAS_MUERTO);
            }
            else {
                this.game.client.sendPickUp();
            }
        }

        ocultarse() {

            if (this.game.player.muerto) {
                this.game.escribirMsgConsola(Enums.MensajeConsola.ESTAS_MUERTO);
            }
            else {
                this.game.client.sendWork(Enums.Skill.ocultarse);
            }
        }

        requestPosUpdate() {
            if (this.intervalos.requestPosUpdate(this.game.currentTime))
                this.game.client.sendRequestPositionUpdate();
        }

        equiparSelectedItem() {
            var slot = this.game.gameUI.interfaz.getSelectedSlotInventario();
            if (slot)
                this.game.client.sendEquipItem(slot);
        }

        usarConU() {
            var slot = this.game.gameUI.interfaz.getSelectedSlotInventario();
            if (!slot)
                return;
            if (this.intervalos.requestUsarConU(this.game.currentTime)) {
                this.game.client.sendUseItem(slot);
            }
        }

        usarConDobleClick(slot) {
            if (!slot)
                return;
            if (this.intervalos.requestUsarConDobleClick(this.game.currentTime)) {
                this.game.client.sendUseItem(slot);
            }

        }

        atacar() {
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

        }

        caminar(direccion) {
            if (this.game.logeado)
                this.game.player.comenzarCaminar(direccion);
        }

        terminarDeCaminar(direccion) {
            if (this.game.logeado)
                this.game.player.terminarDeCaminar(direccion);
        }

        click() {
            var gridPos = this.game.getMouseGridPosition();
            if (this.game.logeado) {
                if (this.game.trabajoPendiente) {
                    this.game.gameUI.interfaz.setMouseCrosshair(false);
                    this.game.client.sendWorkLeftClick(gridPos.x, gridPos.y, this.game.trabajoPendiente);
                    this.game.trabajoPendiente = null;
                }
                else
                    this.game.client.sendLeftClick(gridPos.x, gridPos.y);
            }
        }

        doubleClick() {
            var gridPos = this.game.getMouseGridPosition();
            if (this.game.logeado) {
                this.game.client.sendDoubleClick(gridPos.x, gridPos.y);
            }
        }

        tratarDeTirarItem() {
            if (this.game.player.muerto) {
                this.game.escribirMsgConsola(Enums.MensajeConsola.ESTAS_MUERTO);
                return;
            }
            var selectedSlot = this.game.gameUI.interfaz.getSelectedSlotInventario();
            if (!selectedSlot)
                return;
            var amount = this.game.inventario.getSlot(selectedSlot).cantidad;
            if (amount === 1)
                this.tirarSelectedItem(1);
            else {
                this.game.gameUI.showTirar();
            }
        }

        lanzarHechizo() { /*todo: slot por parametro*/
            if (!this.intervalos.requestLanzarHechizo(this.game.currentTime))
                return;
            var slot = this.game.gameUI.interfaz.getSelectedSlotHechizo();
            if (!slot)
                return;
            this.game.client.sendCastSpell(slot);
            this.game.client.sendWork(Enums.Skill.magia);
        }

        requestInfoHechizo() {
            var slot = this.game.gameUI.interfaz.getSelectedSlotHechizo();
            if (slot)
                this.game.client.sendSpellInfo(slot);
        }

        comprar(slot, cantidad) {
            this.game.client.sendCommerceBuy(slot, cantidad);
        }

        vender(slot, cantidad) {
            this.game.client.sendCommerceSell(slot, cantidad);
        }

        cerrarComerciar() {
            this.game.client.sendCommerceEnd();
        }

        retirarOro(cantidad) {
            this.game.client.sendBankExtractGold(cantidad);
        }

        depositarOro(cantidad) {
            this.game.client.sendBankDepositGold(cantidad);
        }

        retirarItem(slot, cantidad) {
            this.game.client.sendBankExtractItem(slot, cantidad);
        }

        depositarItem(slot, cantidad) {
            this.game.client.sendBankDeposit(slot, cantidad);
        }

        cerrarBoveda() {
            this.game.client.sendBankEnd();
        }

        tirarSelectedItem(cantidad) {
            var selectedSlot = this.game.gameUI.interfaz.getSelectedSlotInventario();
            if (!selectedSlot)
                return;
            if (cantidad >= this.game.inventario.getSlot(selectedSlot).cantidad) {
                cantidad = this.game.inventario.getSlot(selectedSlot).cantidad;
                this.game.gameUI.interfaz.resetSelectedSlotInventario();
            }
            this.game.client.sendDrop(selectedSlot, cantidad);
        }

        tirarTodoSelectedItem() {
            var selectedSlot = this.game.gameUI.interfaz.getSelectedSlotInventario();
            if (!selectedSlot)
                return;
            this.tirarSelectedItem(this.game.inventario.getSlot(selectedSlot).cantidad);
        }

        tirarOro(cantidad) {
            if (cantidad > (this.game.atributos.oro))
                cantidad = this.game.atributos.oro;
            if (cantidad > this.MAX_CANTIDAD_ITEM)
                cantidad = this.MAX_CANTIDAD_ITEM;
            this.game.client.sendDrop(31, cantidad); // por alguna razon 31 es el "slot" del oro
        }

        tirarTodoOro() {
            this.tirarOro(this.MAX_CANTIDAD_ITEM);
        }

    }

    return Acciones;
});