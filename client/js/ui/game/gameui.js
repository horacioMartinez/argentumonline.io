/**
 * Created by horacio on 2/21/16.
 */

define(['enums', 'ui/game/keymouselistener', 'ui/popups/popupskills', 'ui/popups/comerciar', 'ui/popups/ingamemensaje', 'ui/game/interfaz', 'ui/popups/tirar', 'ui/popups/boveda', 'ui/popups/guiamapa', 'ui/popups/opciones', 'ui/popups/clanes', 'ui/popups/detallesclan', 'ui/popups/carpinteria', 'ui/popups/herreria'], function (Enums, KeyMouseListener, popUpSkills, Comerciar, InGameMensaje, Interfaz, Tirar, Boveda, GuiaMapa, Opciones, Clanes, DetallesClan, Carpinteria, Herreria) {

    //TODO: crear los popups en run time con jquery y borrarlos cuando se cierran ?

    class GameUI {
        constructor(gameManager, storage) {
            var game = gameManager.game;
            var acciones = gameManager.acciones;
            var comandosChat = gameManager.comandosChat;
            this.acciones = acciones;
            this.game = game;
            this.storage = storage;

            this.inGameMensaje = new InGameMensaje();
            this.comerciar = new Comerciar(game, acciones);
            this.tirar = new Tirar(game, acciones);
            this.boveda = new Boveda(game, acciones);
            this.guiaMapa = new GuiaMapa();

            this.opciones = new Opciones(game, storage, this.updateKeysCallback.bind(this), this.showMensaje.bind(this));
            this.skills = new popUpSkills(game);
            this.detallesClan = new DetallesClan(game);
            this.clanes = new Clanes(game, this.detallesClan, this.showMensaje.bind(this));
            this.carpinteria = new Carpinteria(game);
            this.herreria = new Herreria(game);

            this.interfaz = new Interfaz(game, acciones);
            this.keyMouseListener = new KeyMouseListener(game, acciones, storage.getKeys(), comandosChat);
            this.initDOM();
        }

        initDOM() {
            this.interfaz.inicializar();
            this.keyMouseListener.initListeners();
            var self = this;
            $(window).blur(function () {
                self.keyMouseListener.upKeyTeclasCaminar();
            });
        }

        resize(escala) {
            this.game.resize(escala); // todo <- este resize del renderer deberia ir fuera de game
        }

        updateKeysCallback(keys) { // todo: en otro lado esto y que a gameui solo le llegue keys
            this.keyMouseListener.setKeys(keys);
        }

        hayPopUpActivo() {// TODO: arreglar esto ( ahora dialogs se meten en el body)
            //return !(this.$popUps.children(':visible').length === 0);
        }

        showComerciar() {
            this.comerciar.show();
        }

        hideComerciar(incomingFromServer) {
            this.comerciar.hide(incomingFromServer);
        }

        showMensaje(msj) {
            this.inGameMensaje.show(msj);
        }

        showBoveda() {
            this.boveda.show();
        }

        hideBoveda(incomingFromServer) {
            this.boveda.hide(incomingFromServer);
        }

        showTirar(tirandoOro) {
            this.tirar.show(tirandoOro);
        }

        showSkills() {
            this.skills.show();
        }

        showOpciones() {
            this.opciones.show();
        }

        hideTirar() {
            this.tirar.hide();
        }

        showMapa() {
            this.guiaMapa.show();
        }

        showCarpinteria() {
            this.carpinteria.show();
        }

        showHerreria() {
            this.herreria.show();
        }

        showClanes() {
            this.clanes.show();
        }

        updateSlotUser(numSlot, slot) { //todo: feo todo esto!
            if (slot) {
                var numGrafico = this.game.assetManager.getNumGraficoFromGrh(slot.grh);
                this.interfaz.cambiarSlotInventario(numSlot, slot.cantidad, numGrafico, slot.equipado);
                if (this.comerciar.visible)
                    this.comerciar.cambiarSlotVenta(numSlot, slot.cantidad, numGrafico);
                if (this.boveda.visible)
                    this.boveda.cambiarSlotDepositar(numSlot, slot.cantidad, numGrafico);
            }
            else {
                this.interfaz.borrarSlotInventario(numSlot);
                if (this.comerciar.visible)
                    this.comerciar.borrarSlotVenta(numSlot);
                if (this.boveda.visible)
                    this.boveda.borrarSlotDepositar(numSlot);
            }
        }

        updateSlotShop(numSlot, slot) {
            if (slot) {
                var numGrafico = this.game.assetManager.getNumGraficoFromGrh(slot.grh);
                this.comerciar.cambiarSlotCompra(numSlot, slot.cantidad, numGrafico);
            }
            else {
                this.comerciar.borrarSlotCompra(numSlot);
            }
        }

        updateSlotBank(numSlot, slot) {
            if (slot) {
                var numGrafico = this.game.assetManager.getNumGraficoFromGrh(slot.grh);
                this.boveda.cambiarSlotRetirar(numSlot, slot.cantidad, numGrafico);
            }
            else {
                this.boveda.borrarSlotRetirar(numSlot);
            }
        }

        updateSkillsData(skills) {
            this.skills.updateSkillsData(skills);
        }

    }

    return GameUI;
});