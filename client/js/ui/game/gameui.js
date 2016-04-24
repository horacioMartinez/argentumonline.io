/**
 * Created by horacio on 2/21/16.
 */


define(['ui/game/keymouselistener', 'ui/popups/skills', 'ui/popups/comerciar', 'ui/popups/ingamemensaje', 'ui/game/interfaz', 'ui/popups/tirar', 'ui/popups/boveda', 'ui/popups/guiamapa', 'ui/popups/configurarteclas'], function (KeyMouseListener, Skills, Comerciar, InGameMensaje, Interfaz, Tirar, Boveda, GuiaMapa, ConfigurarTeclas) {

    //TODO: crear los popups en run time con jquery y borrarlos cuando se cierran ?

    var GameUI = Class.extend({
        init: function (game, acciones, storage) {
            this.acciones = acciones;
            this.game = game;
            this.storage = storage; // no deberia venir aca, ver funcion setkeys

            this.inGameMensaje = new InGameMensaje();
            this.comerciar = new Comerciar(game, acciones);
            this.tirar = new Tirar(game, acciones);
            this.boveda = new Boveda(game, acciones);
            this.guiaMapa = new GuiaMapa();
            this.configurarTeclas = new ConfigurarTeclas(storage, this.updateKeysCallback.bind(this), this.showMensaje.bind(this));
            this.skills = new Skills(game);

            this._currentPopUp = 0; // mal
            this.interfaz = new Interfaz(game, acciones);
            this.keyMouseListener = new KeyMouseListener(game, acciones, storage.getKeys());
            this.initDOM();
            this.$popUps = $("#popUpsJuego");
        },

        initDOM: function () {
            this.interfaz.inicializar();
            this.keyMouseListener.initListeners();
        },

        resize: function (escala) {
            this.game.resize(escala); // todo <- este resize del renderer deberia ir fuera de game
        },

        updateKeysCallback: function (keys) { // todo: en otro lado esto y que a gameui solo le llegue keys
            this.keyMouseListener.setKeys(keys);
        },

        hayPopUpActivo: function () {
            return !(this.$popUps.children(':visible').length === 0);
        },

        showComerciar: function () {
            this.comerciar.show();
        },

        hideComerciar: function () {
            this.comerciar.hide();
        },

        showMensaje: function (msj) {
            this.inGameMensaje.show(msj);
        },

        showBoveda: function () {
            this.boveda.show();
        },

        hideBoveda: function () {
            this.boveda.hide();
        },

        showTirar: function (tirandoOro) {
            this.tirar.show(tirandoOro);
        },

        showSkills: function () {
            this.skills.show();
        },

        hideTirar: function () {
            this.tirar.hide();
        },

        showMapa: function () {
            this.guiaMapa.show();
        },

        showConfigurarTeclas: function () {
            this.configurarTeclas.show();
        },

        updateSlotUser: function (numSlot, slot) { //todo: feo todo esto!
            if (slot) {
                var numGrafico = this.game.renderer.getNumGraficoFromGrh(slot.grh);
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
        },

        updateSlotShop: function (numSlot, slot) {
            if (slot) {
                var numGrafico = this.game.renderer.getNumGraficoFromGrh(slot.grh);
                this.comerciar.cambiarSlotCompra(numSlot, slot.cantidad, numGrafico);
                this.boveda.cambiarSlotRetirar(numSlot, slot.cantidad, numGrafico);
            }
            else {
                this.comerciar.borrarSlotCompra(numSlot);
                this.boveda.borrarSlotRetirar(numSlot);
            }
        },

        updateSkillsData: function (skills){
          this.skills.updateSkillsData(skills);
        },

    });

    return GameUI;
});