/**
 * Created by horacio on 2/28/16.
 */

define(['ui/itemgrid'], function (ItemGrid) {

    var Interfaz = Class.extend({
        init: function (game) {
            this.game = game;
            this.inventarioGrid = new ItemGrid("itemsGrid");
        },

        // TODO: si se crea cada vez que se abre, que no complete los slots vacios
        show: function () {

            this.clearInfos();
            $('#comerciar').show();
            this.visible = true;
            for (var i = 1; i < this.game.inventario.length; i++) {
                item = this.game.inventario[i];
                if (item) {
                    var numGraf = this.game.indices[item.grh].grafico;
                    if (numGraf) {
                        this.ventaGrid.modificarSlot(i, item.cantidad, numGraf);
                    }
                }
            }
        },

        inicializar: function () {
            var self = this;

            $("#botonInventario").click(function () {
                $('body').addClass('inventarioActivo');
            });

            $("#botonHechizos").click(function () {
                $('body').removeClass('inventarioActivo');
            });

        },

        cambiarSlotInventario: function (Slot, Amount, numGrafico) {
            this.inventarioGrid.modificarSlot(Slot, Amount, numGrafico);
        },

        borrarSlotInventario: function (slot) {
            this.inventarioGrid.borrarSlot(slot);
        },

        getSelectedSlotHechizo: function () {
            res = $('#hechizos').val();
            if (res) {
                return res[0];
            }
            else
                return 0;
        },

        modificarSlotHechizo: function (slot, texto) {
            var elemento = $('#hechizos option[value=' + slot + ']');
            if (!elemento.length) { // nuevo elemento
                $('#hechizos').append($("<option>").attr('value', slot).text(texto));
            }
            else {
                $(elemento).text(texto);
            }
        },

        _updateBarra: function (cant, max, $barra, $label) {
            //$("#barraHambreUsada").css("width","80%");
            var porcentaje = (100 - Math.floor((cant / max) * 100));
            log.error("PORCENTAJE!: "+porcentaje);
            $barra.css("width", porcentaje + "%");
            $label.text(cant + "/" + max);
        },
        updateBarraEnergia: function (cant, max) {
            this._updateBarra(cant, max, $("#barraEnergiaUsada"), $("#barraEnergiaTexto"));
        },
        updateBarraVida: function (cant, max) {
            this._updateBarra(cant, max, $("#barraSaludUsada"), $("#barraSaludTexto"));
        },
        updateBarraMana: function (cant, max) {
            this._updateBarra(cant, max, $("#barraManaUsada"), $("#barraManaTexto"));
        },
        updateBarraHambre: function (cant, max) {
            log.error(cant+ " " + max);
            this._updateBarra(cant, max, $("#barraHambreUsada"), $("#barraHambreTexto"));
        },
        updateBarraSed: function (cant, max) {
            this._updateBarra(cant, max, $("#barraSedUsada"), $("#barraSedTexto"));
        },

    });

    return Interfaz;
});