/**
 * Created by horacio on 3/21/16.
 */

define(['ui/popups/popup'], function (PopUp) {

    var Tirar = PopUp.extend({
        init: function (inputHandler) {
            this._super("tirar");

            this.game = inputHandler.game;
            this.popUpInputHandler = inputHandler;
            this.initCallbacks();
        },


        show: function (tirandoOro) {
            this._super();
            this.tirandoOro = tirandoOro;
        },

        initCallbacks: function () {
            var self = this;
            $("#tirarBotonTirar").click(function () {
                var cantidad = $("#tirarInputCantidad").val();
                if (!isNaN(cantidad)) {
                    if (cantidad > 0) {
                        if (self.tirandoOro)
                            self.popUpInputHandler.tirarOro(cantidad);
                        else
                            self.popUpInputHandler.tirarSelectedItem(cantidad);
                    }
                }
                self.hide();
            });

            $("#tirarBotonTirarTodo").click(function () {
                if (self.tirandoOro)
                    self.popUpInputHandler.tirarTodoOro();
                else
                self.popUpInputHandler.tirarTodoSelectedItem();
                self.hide();
            });
        },
    });

    return Tirar;
});
