/**
 * Created by horacio on 2/28/16.
 */

define(['utils/charcodemap','ui/game/itemgrid'], function (CharCodeMap,ItemGrid) {

    var Interfaz = Class.extend({
        init: function (game, macros, acciones) {
            this.acciones = acciones;
            this.macros = macros;
            this.game = game;
            this.inventarioGrid = new ItemGrid("itemsGrid", true);
            var self = this;
            this.inventarioGrid.setDobleClickCallback(function (slot) {
                self.acciones.usarConDobleClick(slot);
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
                self.acciones.lanzarHechizo();
            });

            $("#botonInfo").click(function () {
                self.acciones.requestInfoHechizo();
            });

            $("#botonTirarOro").click(function () {
                self.game.gameUI.showTirar(true);
            });

            $("#botonAsignarSkills").click(function () {
                self.game.gameUI.showSkills();
            });

            $("#botonSeguroResucitar").dblclick(function () {
                self.game.toggleSeguroResucitar();
            });

            $("#botonSeguroAtacar").dblclick(function () {
                self.game.toggleSeguroAtacar();
            });

            $("#botonMacroHechizos").click(function () {
                self.macros.comenzarLanzarHechizo();
            });

            $("#botonMacroTrabajo").click(function () {
                self.macros.comenzarTrabajar();
            });

            $("#botonMapa").click(function () {
                self.game.gameUI.showMapa();
            });

            $("#botonOpciones").click(function () {
                self.game.gameUI.showOpciones();
            });

            //FIX bug firefox que no previene movimiento scroll hehcizos
            if (Detect.isFirefox()) {
                self.setHechizosScrollFirefoxFix(self);
            }
        },

        cambiarSlotInventario: function (numSlot, Amount, numGrafico, equiped) {
            this.inventarioGrid.modificarSlot(numSlot, Amount, numGrafico, equiped);
        },

        borrarSlotInventario: function (slot) {
            this.inventarioGrid.borrarSlot(slot);
        },

        resetSelectedSlotInventario: function () {
            this.inventarioGrid.resetSelectedSlot();
        },

        getSelectedSlotInventario: function () {
            var slot = this.inventarioGrid.getSelectedSlot();
            if (slot > 0)
                return slot;
        },

        getSelectedSlotHechizo: function () {
            res = $('#hechizos').val();
            if (res) {
                return res;
            }
            else
                return 0;
        },

        modificarSlotHechizo: function (slot, texto) {
            var elemento = $('#hechizos option[value=' + slot + ']');
            if (!elemento.length) { // nuevo elemento
                var $nuevoHechizo = $("<option>").attr('value', slot).text(texto);
                $('#hechizos').append($nuevoHechizo);
            }
            else {
                $(elemento).text(texto);
            }
        },

        updateAgilidad: function (agi) {
            $("#indicadorAgilidad").text(agi);
        },

        updateFuerza: function (fuerza) {
            $("#indicadorFuerza").text(fuerza);
        },

        updateOro: function (oro) {
            $("#indicadorOro").text(oro);
        },

        _updateBarra: function (cant, max, $barra, $label, invertida) {
            var porcentaje = 100;
            if (max) {
                if (invertida)
                    porcentaje = 100 - Math.floor((cant / max) * 100);
                else
                    porcentaje = Math.floor((cant / max) * 100);
            }
            $barra.css("width", porcentaje + "%");
            $label.text(cant + "/" + max);
        },

        updateBarraEnergia: function (cant, max) {
            this._updateBarra(cant, max, $("#barraEnergiaUsada"), $("#barraEnergiaTexto"), true);
        },
        updateBarraVida: function (cant, max) {
            this._updateBarra(cant, max, $("#barraSaludUsada"), $("#barraSaludTexto"), true);
        },
        updateBarraMana: function (cant, max) {
            this._updateBarra(cant, max, $("#barraManaUsada"), $("#barraManaTexto"), true);
        },
        updateBarraHambre: function (cant, max) {
            this._updateBarra(cant, max, $("#barraHambreUsada"), $("#barraHambreTexto"), true);
        },
        updateBarraSed: function (cant, max) {
            this._updateBarra(cant, max, $("#barraSedUsada"), $("#barraSedTexto"), true);
        },
        updateBarraExp: function (cant, max) {
            this._updateBarra(cant, max, $("#barraExpUsada"), $("#barraExpTexto"));
        },
        updateNivel: function (nivel) {
            $("#indicadorNivel").text("Nivel " + nivel);
        },

        updateIndicadorPosMapa: function (mapa, x, y) {
            $("#indicadorMapa").text("Mapa " + mapa + "  X: " + x + " Y: " + y);
        },

        setMouseCrosshair: function (visible) {
            if (visible) {
                $("#gamecanvas").addClass("crosshair");
            }
            else
                $("#gamecanvas").removeClass("crosshair");
        },

        setSeguroResucitacion: function (activado) {
            if (!activado)
                $("#botonSeguroResucitar").addClass("seguroOff");
            else
                $("#botonSeguroResucitar").removeClass("seguroOff");
        },

        setSeguroAtacar: function (activado) {
            if (!activado)
                $("#botonSeguroAtacar").addClass("seguroOff");
            else
                $("#botonSeguroAtacar").removeClass("seguroOff");
        },

        setHechizosScrollFirefoxFix: function (self) {
            var $hechizos = $("#hechizos");
            self.hechizos_realSelectedSlot = 1;

            $hechizos.click(function () {
                self.hechizos_realSelectedSlot = $hechizos.val();
                $hechizos.blur();
            });

            var up = CharCodeMap.keys.indexOf("UP");
            var down = CharCodeMap.keys.indexOf("DOWN");
            var left = CharCodeMap.keys.indexOf("LEFT");
            var right = CharCodeMap.keys.indexOf("RIGHT");

            $hechizos.change(function(){
                $hechizos.blur();
                //setTimeout(function () {
                //    $hechizos.val(self.hechizos_realSelectedSlot);
                //},50);
            });
            //$hechizos.keydown(function (e) {
            //    var key = e.which;
            //    switch (key) {
            //        case up:
            //        case down:
            //        case left:
            //        case right:
            //            $hechizos.blur();
            //            setTimeout(function () {
            //                $hechizos.val(self.hechizos_realSelectedSlot);
            //            });
            //            break;
            //    }
            //});

        }

    });

    return Interfaz;
});