/**
 * Created by horacio on 4/14/16.
 */


define(['utils/charcodemap', 'ui/popups/popup'], function (CharCodeMap, PopUp) {

    class ConfigurarTeclas {
        constructor(settings, updateKeysCb, showMensajeCb) {
            this.settings = settings;
            this.nuevasKeys = null;
            this.updateKeysCb = updateKeysCb;
            this.showMensajeCb = showMensajeCb;
            this.initCallbacks();
        }

        onShow() {
            this.nuevasKeys = $.extend(true,{}, this.settings.getKeys()); // clonar
            this.displayKeys();
        }

        onHide() {

        }

        setCerrarCallback(cerrarCallback) {
            this._cerrarCallback = cerrarCallback;
        }

        displayKeys() {
            var self = this;
            $('#configurarTeclas').find('input').each(function () {
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
                self._cerrarCallback();
            });

            $("#configurarTeclasCancelar").click(function () {
                self._cerrarCallback();
            });

            $("#configurarTeclasRestaurarDefault").click(function () {
                self.nuevasKeys = self.settings.getDefaultKeys();
                self.displayKeys();
            });

            $("#configurarTeclasGuardarYSalir").click(function () {
                self.settings.setKeys(self.nuevasKeys);
                self.updateKeysCb(self.nuevasKeys);
                self._cerrarCallback();
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
