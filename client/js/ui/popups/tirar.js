/**
 * Created by horacio on 3/21/16.
 */

define(["text!../../../menus/tirar.html!strip", 'ui/popups/popup', 'ui/popups/popup'], function (DOMdata, PopUp) {

    class Tirar extends PopUp {
        constructor(game, acciones) {
            super(DOMdata);

            this.game = game;
            this.acciones = acciones;
            this.initCallbacks();
        }

        show(tirandoOro) {
            super.show();
            this.tirandoOro = tirandoOro;
        }

        initCallbacks() {
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
        }
    }

    return Tirar;
});
