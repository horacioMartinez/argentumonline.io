/**
 * Created by horacio on 2/21/16.
 */


define(['dominputhandler','ui/comerciar', 'ui/interfaz', 'ui/tirar', 'ui/boveda'], function (DomInputHandler, Comerciar, Interfaz,Tirar, Boveda) {

    //TODO: crear los popups en run time con jquery y borrarlos cuando se cierran

    var UIManager = Class.extend({
        init: function (game) {
            this.game = game;
            this.inputHandler = new DomInputHandler(this.game);
            this.comerciar = new Comerciar(this.inputHandler);
            this.tirar = new Tirar(this.inputHandler);
            this.boveda = new Boveda(this.inputHandler);

            this._currentPopUp = 0; // mal
            this.interfaz = new Interfaz(game);
            this.initDOM();
        },

        initDOM: function () {
            this.interfaz.inicializar();
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

    return UIManager;
});