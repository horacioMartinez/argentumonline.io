/**
 * Created by horacio on 4/14/16.
 */


define(["text!../../../menus/configurarTeclas.html!strip", 'utils/charcodemap', 'ui/popups/popup'], function (DOMdata, CharCodeMap, PopUp) {

    class ConfigurarTeclas extends PopUp {
        constructor(storage, updateKeysCb, showMensajeCb) {
            super(DOMdata);
            this.storage = storage;
            this.initCallbacks();
            this.nuevasKeys = null;
            this.updateKeysCb = updateKeysCb;
            this.showMensajeCb = showMensajeCb;
        }

        show() {
            super.show();
            this.nuevasKeys = jQuery.extend({}, this.storage.getKeys()); // clonar
            this.displayKeys();
        }

        displayKeys() {
            var self = this;
            this.$this.children('input').each(function () {

                var id = ($(this).attr('id'));
                var accion = id.split('_')[1];
                if (!accion || !(self.nuevasKeys[accion])) {
                    log.error("Error con input element!");
                    return;
                }
                $(this).val(CharCodeMap.keys[self.nuevasKeys[accion]]);
            });
        }

        keyRepetida(c) {
            for (var prop in this.nuevasKeys) {
                if (this.nuevasKeys.hasOwnProperty(prop)) {
                    if (this.nuevasKeys[prop] === c) {
                        return true;
                    }
                }
            }
            return false;
        }

        initCallbacks() {
            var self = this;

            $("#configurarTeclasBotonCerrar").click(function () {
                self.hide();
            });

            $("#configurarTeclasCancelar").click(function () {
                self.hide();
            });

            $("#configurarTeclasRestaurarDefault").click(function () {
                self.nuevasKeys = self.storage.getDefaultKeys();
                self.displayKeys();
            });

            $("#configurarTeclasGuardarYSalir").click(function () {
                self.storage.setKeys(self.nuevasKeys);
                self.updateKeysCb(self.nuevasKeys);
                self.hide();
            });

            $('#configurarTeclas').on("keydown", 'input', function (event) {
                var id = ($(this).attr('id'));
                var accion = id.split('_')[1];
                if (!accion || !(self.nuevasKeys[accion])) {
                    log.error("Error con input element!");
                    return;
                }
                var nuevaKey = event.which;
                if (self.keyRepetida(nuevaKey)) {
                    self.showMensajeCb("Esa tecla ya pertenece a otro comando");
                    self.displayKeys();
                    return false;
                }
                self.nuevasKeys[accion] = nuevaKey;
                self.displayKeys();
                return false;
            });

        }
    }

    return ConfigurarTeclas;
});
