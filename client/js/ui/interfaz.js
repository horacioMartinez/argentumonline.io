/**
 * Created by horacio on 2/28/16.
 */

define(['ui/itemgrid'], function (ItemGrid) {

    var Interfaz = Class.extend({
        init: function (game) {
            this.game = game;
            this.inventarioGrid = new ItemGrid("itemsGrid");
            var self = this;
            this.inventarioGrid.setDobleClickCallback(function(slot){
                self.game.usarConDobleClick(slot);
            });
        },

        inicializar: function () {
            var self = this;

            $("#botonInventario").click(function () {
                $('body').addClass('inventarioActivo');
            });

            $("#botonHechizos").click(function () {
                $('body').removeClass('inventarioActivo');
            });

            $("#botonLanzar").click(function () {
                self.game.lanzarHechizo();
            });

        },

        cambiarSlotInventario: function (Slot, Amount, numGrafico, equiped) {
            this.inventarioGrid.modificarSlot(Slot, Amount, numGrafico, equiped);
        },

        borrarSlotInventario: function (slot) {
            this.inventarioGrid.borrarSlot(slot);
        },

        getSelectedSlotInventario: function () {
            var slot = this.inventarioGrid.getSelectedSlot();
            if (!this.game.inventario[slot] || !this.game.inventario[slot].cantidad)
                return null;
            return slot;
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

        _updateBarra: function (cant, max, $barra, $label, invertida) {
            var porcentaje = 100;
            if (max) {
                if (invertida)
                    porcentaje = 100 -Math.floor((cant / max) * 100);
                else
                    porcentaje = Math.floor((cant / max) * 100);
            }
            $barra.css("width", porcentaje + "%");
            $label.text(cant + "/" + max);
        },

        updateBarraEnergia: function (cant, max) {
            this._updateBarra(cant, max, $("#barraEnergiaUsada"), $("#barraEnergiaTexto"),true);
        },
        updateBarraVida: function (cant, max) {
            this._updateBarra(cant, max, $("#barraSaludUsada"), $("#barraSaludTexto"),true);
        },
        updateBarraMana: function (cant, max) {
            this._updateBarra(cant, max, $("#barraManaUsada"), $("#barraManaTexto"),true);
        },
        updateBarraHambre: function (cant, max) {
            this._updateBarra(cant, max, $("#barraHambreUsada"), $("#barraHambreTexto"),true);
        },
        updateBarraSed: function (cant, max) {
            this._updateBarra(cant, max, $("#barraSedUsada"), $("#barraSedTexto"),true);
        },
        updateBarraExp: function(cant,max){
            this._updateBarra(cant, max, $("#barraExpUsada"), $("#barraExpTexto"));
        },

        setMouseCrosshair: function(visible){
            if (visible) {
                $("#gamecanvas").addClass("crosshair");
            }
            else
                $("#gamecanvas").removeClass("crosshair");
        },
    });

    return Interfaz;
});