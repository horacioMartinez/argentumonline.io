/**
 * Created by horacio on 3/21/16.
 */

define(['ui/popup'], function (PopUp) {

    var Tirar = PopUp.extend({
        init: function (inputHandler) {
            this._super("tirar");

            this.game = inputHandler.game;
            this.inputHandler = inputHandler;
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
                            self.inputHandler.tirarOro(cantidad);
                        else
                            self.inputHandler.tirarSelectedItem(cantidad);
                    }
                }
                self.hide();
            });

            $("#tirarBotonTirarTodo").click(function () {
                if (self.tirandoOro)
                    self.inputHandler.tirarTodoOro();
                else
                self.inputHandler.tirarTodoSelectedItem();
                self.hide();
            });
        },
    });

    return Tirar;
});
