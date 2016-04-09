/**
 * Created by horacio on 2/21/16.
 */


define(['ui/game/keymouselistener','ui/popups/comerciar', 'ui/game/interfaz', 'ui/popups/tirar', 'ui/popups/boveda'], function (KeyMouseListener,Comerciar, Interfaz,Tirar, Boveda) {

    //TODO: crear los popups en run time con jquery y borrarlos cuando se cierran ?

    var GameUI = Class.extend({
        init: function (game,acciones) {
            this.acciones = acciones;
            this.game = game;
            this.comerciar = new Comerciar(game,acciones);
            this.tirar = new Tirar(game,acciones);
            this.boveda = new Boveda(game,acciones);

            this._currentPopUp = 0; // mal
            this.interfaz = new Interfaz(game,acciones);
            this.keyMouseListener = new KeyMouseListener(game,acciones);
            this.initDOM();
        },

        initDOM: function () {
            this.interfaz.inicializar();
            this.keyMouseListener.initListeners();
        },

        resize: function(escala){
            this.game.resize(escala); // todo <- este resize del renderer deberia ir fuera de game
        },

        hayPopUpActivo: function(){
            return (this.comerciar.visible || this.tirar.visible || this.boveda.visible);
        },

        showComerciar: function () {
            this.comerciar.show();
        },

        hideComerciar: function () {
            this.comerciar.hide();
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

        hideTirar: function () {
            this.tirar.hide();
        },
    });

    return GameUI;
});