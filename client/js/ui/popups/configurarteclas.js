/**
 * Created by horacio on 4/14/16.
 */


define(['storage/defaultsettings', 'charcodemap', 'ui/popups/popup'], function (DefaultSettings, CharCodeMap, PopUp) {

    var ConfigurarTeclas = PopUp.extend({
        init: function (storage, updateKeysCb) {
            this._super("configurarTeclas");
            this.storage = storage;
            this.initCallbacks();
            this.nuevasKeys = null;
            this.updateKeysCb = updateKeysCb;
        },

        show: function () {
            this._super();
            this.nuevasKeys = jQuery.extend({}, this.storage.getKeys()); // clonar
            this.displayKeys();
        },

        displayKeys: function () {
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
        },

        keyRepetida: function (c) {
            for(var prop in this.nuevasKeys) {
                if(this.nuevasKeys.hasOwnProperty(prop)) {
                    if(this.nuevasKeys[prop] === c) {
                        return true;
                    }
                }
            }
            return false;
        },

        initCallbacks: function () {
            var self = this;

            $("#configurarTeclasBotonCerrar").click(function () {
                self.hide();
            });

            $("#configurarTeclasCancelar").click(function () {
                self.hide();
            });

            $("#configurarTeclasRestaurarDefault").click(function () {
                self.nuevasKeys = DefaultSettings.keys;
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
                log.error(nuevaKey);
                log.error(self.nuevasKeys.agarrar);
                if (self.keyRepetida(nuevaKey)){
                    alert("Esa tecla ya pertenece a otro comando"); // TODO <<--- no alert, mensaje!!!
                    self.displayKeys();
                    return;
                }
                self.nuevasKeys[accion] = nuevaKey;
                self.displayKeys();
                return false;
            });

        },
    });

    return ConfigurarTeclas;
});
