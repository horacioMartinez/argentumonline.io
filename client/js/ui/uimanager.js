/**
 * Created by horacio on 2/21/16.
 */


define(['ui/comerciar', 'ui/interfaz', 'ui/tirar'], function (Comerciar, Interfaz,Tirar) {

    //TODO: crear los popups en run time con jquery y borrarlos cuando se cierran

    var UIManager = Class.extend({
        init: function (game) {
            this.game = game;
            this.comerciar = new Comerciar(game);
            this.tirar = new Tirar(game);
            this._currentPopUp = 0; // mal
            this.interfaz = new Interfaz(game);
            this.initDOM();
        },

        initDOM: function () {
            this.interfaz.inicializar();
        },

        hayPopUpActivo: function(){
            return (this.comerciar.visible || this.tirar.visible);
        },

        showComerciar: function () {
            this.comerciar.show();
        },

        hideComerciar: function () {
            this.comerciar.hide();
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