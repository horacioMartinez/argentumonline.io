/**
 * Created by horacio on 2/21/16.
 */


define(['ui/comerciar', 'lib/jquery-ui'], function (Comerciar) {

    //TODO: crear los popups en run time con jquery y borrarlos cuando se cierran

    var UIManager = Class.extend({
        init: function (game) {
            this.game = game;
            this.comerciar = new Comerciar(game);
            this._currentPopUp = 0; // mal
            //this.initDOM();
        },

        initDOM: function () {

        },

        hayPopUpActivo: function(){
            return this.comerciar.visible;
        },

        showComerciar: function () {
            this.comerciar.show();
        },

        hideComerciar: function () {
            this.comerciar.hide();
        },

    });

    return UIManager;
});