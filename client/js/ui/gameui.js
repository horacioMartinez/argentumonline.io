/**
 * Created by horacio on 2/21/16.
 */


define(['ui/gameinputhandler','ui/popupinputhandler','ui/popups/comerciar', 'ui/interfaz', 'ui/popups/tirar', 'ui/popups/boveda'], function (GameInputHandler, PopUpInputHandler, Comerciar, Interfaz,Tirar, Boveda) {

    //TODO: crear los popups en run time con jquery y borrarlos cuando se cierran ?

    var GameUI = Class.extend({
        init: function (game) {
            this.game = game;
            this.popUpInputHandler = new PopUpInputHandler(this.game);
            this.comerciar = new Comerciar(this.popUpInputHandler);
            this.tirar = new Tirar(this.popUpInputHandler);
            this.boveda = new Boveda(this.popUpInputHandler);

            this._currentPopUp = 0; // mal
            this.interfaz = new Interfaz(game);
            this.gameInputHandler = new GameInputHandler(game);
            this.initDOM();
        },

        initDOM: function () {
            this.interfaz.inicializar();
            this.gameInputHandler.initGameDom();
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