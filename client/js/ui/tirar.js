/**
 * Created by horacio on 3/21/16.
 */

define([], function () {

    var Tirar = Class.extend({
        init: function (game) {
            this.game = game;
            this.visible = false;
            this.DOMid = "tirar";
            this.initCallbacks();
        },

        // TODO: si se crea cada vez que se abre, que no complete los slots vacios
        show: function (tirandoOro) {
            $('#tirar').show();
            $("#tirarInputCantidad").val('');
            this.visible = true;
            this.tirandoOro = tirandoOro;
        },

        hide: function () {
            $('#tirar').hide();
            this.visible = false;
        },

        initCallbacks: function () {
            var self = this;
            $("#tirarBotonTirar").click(function () {
                var cantidad = $("#tirarInputCantidad").val();
                if (!isNaN(cantidad)) {
                    if (cantidad > 0) {
                        if (self.tirandoOro)
                            self.game.tirarOro(cantidad);
                        else
                            self.game.tirarSelectedItem(cantidad);
                    }
                }
                self.hide();
            });

            $("#tirarBotonTirarTodo").click(function () {
                if (self.tirandoOro)
                    self.game.tirarTodoOro();
                else
                self.game.tirarTodoSelectedItem();
                self.hide();
            });
        },
    });

    return Tirar;
});
