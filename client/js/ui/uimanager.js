/**
 * Created by horacio on 2/21/16.
 */


define(['ui/comerciar', 'ui/interfaz', 'ui/tiraritem'], function (Comerciar, Interfaz,TirarItem) {

    //TODO: crear los popups en run time con jquery y borrarlos cuando se cierran

    var UIManager = Class.extend({
        init: function (game) {
            this.game = game;
            this.comerciar = new Comerciar(game);
            this.tirarItem = new TirarItem(game);
            this._currentPopUp = 0; // mal
            this.interfaz = new Interfaz(game);
            this.initDOM();
        },

        initDOM: function () {
            this.interfaz.inicializar();
        },

        hayPopUpActivo: function(){
            return (this.comerciar.visible || this.tirarItem.visible);
        },

        showComerciar: function () {
            this.comerciar.show();
        },

        hideComerciar: function () {
            this.comerciar.hide();
        },

        showTirarItem: function () {
            this.tirarItem.show();
        },

        hideTirarItem: function () {
            this.tirarItem.hide();
        },

    });

    return UIManager;
});