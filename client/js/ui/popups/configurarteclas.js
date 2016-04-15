/**
 * Created by horacio on 4/14/16.
 */


define(['storage/defaultsettings','charcodemap','ui/popups/popup'], function (DefaultSettings, CharCodeMap,PopUp) {

    var ConfigurarTeclas = PopUp.extend({
        init: function (storage, updateKeysCb) {
            this._super("configurarTeclas");
            this.storage = storage;
            this.initCallbacks();
            this.nuevasKeys = null;
            this.updateKeysCb = updateKeysCb;
        },

        show: function(){
            this._super();
            this.nuevasKeys = jQuery.extend({}, this.storage.getKeys()); // clonar
        },

        initCallbacks: function () {
            var self = this;
            $("#configurarTeclasBotonCerrar").click(function () {
                self.hide();
            });

            $("#configurarTeclasBotonCancelar").click(function () {
                self.hide();
            });

            $("#configurarTeclasRestaurarDefault").click(function () {
                self.nuevasKeys = DefaultSettings.keys;
                //todo: actualizar vista
            });

            $("#configurarTeclasGuardarYSalir").click(function () {
                self.storage.setKeys(self.nuevasKeys);
                self.updateKeysCb(self.nuevasKeys);
                self.hide();
            });

            $('#configurarTeclas').on("keydown", 'input', function(event) {
                var id = ($(this).attr('id'));
                var accion = id.split('_')[1];
                if ( !accion || !(self.nuevasKeys[accion])){
                    log.error("Error en cambio de key!");
                    return;
                }
                var charcode = event.which;
                self.nuevasKeys[accion] = charcode;
                $(this).val(CharCodeMap.keys[charcode]);
                return false;
            });

        },
    });

    return ConfigurarTeclas;
});
