/**
 * Created by horacio on 3/21/16.
 */

define(['ui/popups/popup'], function (PopUp) {

    var Tirar = PopUp.extend({
        init: function (game,acciones) {
            this._super("tirar");

            this.game = game;
            this.acciones = acciones;
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
                            self.acciones.tirarOro(cantidad);
                        else
                            self.acciones.tirarSelectedItem(cantidad);
                    }
                }
                self.hide();
            });

            $("#tirarBotonTirarTodo").click(function () {
                if (self.tirandoOro)
                    self.acciones.tirarTodoOro();
                else
                self.acciones.tirarTodoSelectedItem();
                self.hide();
            });
        },
    });

    return Tirar;
});
