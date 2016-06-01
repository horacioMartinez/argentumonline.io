/**
 * Created by horacio on 2/21/16.
 */


define(['enums', 'ui/game/keymouselistener', 'ui/popups/popupskills', 'ui/popups/comerciar', 'ui/popups/ingamemensaje', 'ui/game/interfaz', 'ui/popups/tirar', 'ui/popups/boveda', 'ui/popups/guiamapa', 'ui/popups/configurarteclas', 'ui/popups/opciones'], function (Enums, KeyMouseListener, popUpSkills, Comerciar, InGameMensaje, Interfaz, Tirar, Boveda, GuiaMapa, ConfigurarTeclas, Opciones) {

    //TODO: crear los popups en run time con jquery y borrarlos cuando se cierran ?

    class GameUI {
        constructor(gameManager, storage) {
            var game = gameManager.game;
            var acciones = gameManager.acciones;
            this.acciones = acciones;
            this.game = game;
            this.storage = storage;

            this.inGameMensaje = new InGameMensaje();
            this.comerciar = new Comerciar(game, acciones);
            this.tirar = new Tirar(game, acciones);
            this.boveda = new Boveda(game, acciones);
            this.guiaMapa = new GuiaMapa();
            this.configurarTeclas = new ConfigurarTeclas(storage, this.updateKeysCallback.bind(this), this.showMensaje.bind(this));
            this.opciones = new Opciones(game, storage, this.configurarTeclas);
            this.skills = new popUpSkills(game);

            this._currentPopUp = 0; // mal
            this.interfaz = new Interfaz(game, gameManager.macros, acciones);
            this.keyMouseListener = new KeyMouseListener(game, acciones, storage.getKeys());
            this.initDOM();
            this.$popUps = $("#popUpsJuego");
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

        hayPopUpActivo() {
            return !(this.$popUps.children(':visible').length === 0);
        }

        showComerciar() {
            this.comerciar.show();
        }

        hideComerciar() {
            this.comerciar.hide();
        }

        showMensaje(msj) {
            this.inGameMensaje.show(msj);
        }

        showBoveda() {
            this.boveda.show();
        }

        hideBoveda() {
            this.boveda.hide();
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
                this.boveda.cambiarSlotRetirar(numSlot, slot.cantidad, numGrafico);
            }
            else {
                this.comerciar.borrarSlotCompra(numSlot);
                this.boveda.borrarSlotRetirar(numSlot);
            }
        }

        updateSkillsData(skills) {
            this.skills.updateSkillsData(skills);
        }

    }

    return GameUI;
});