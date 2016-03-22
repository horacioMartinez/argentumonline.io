/**
 * Created by horacio on 3/21/16.
 */
/**
 * Created by horacio on 2/22/16.
 */

define(['ui/itemgrid'], function (ItemGrid) {

    var TirarItem = Class.extend({
        init: function (game) {
            this.game = game;
            this.visible = false;
            this.DOMid = "tirarItem";
            this.initCallbacks();
        },

        // TODO: si se crea cada vez que se abre, que no complete los slots vacios
        show: function () {
            $('#tirarItem').show();
            $("#tirarItemInputCantidad").val('');
            this.visible = true;
        },

        hide: function () {
            $('#tirarItem').hide();
            this.visible = false;
        },

        initCallbacks: function () {
            var self = this;
            $("#tirarItemBotonTirar").click(function () {
                var cantidad = $("#tirarItemInputCantidad").val();
                if (!isNaN(cantidad)) {
                    if (cantidad > 0) {
                        self.game.tirarSelectedItem(cantidad);
                    }
                }
                self.hide();
            });

            $("#tirarItemBotonTirarTodo").click(function () {
                self.game.tirarTodoSelectedItem();
                self.hide();
            });
        },
    });

    return TirarItem;
});
