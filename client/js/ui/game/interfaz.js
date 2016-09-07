/**
 * Created by horacio on 2/28/16.
 */

define(['utils/charcodemap', 'ui/game/itemgrid'], function (CharCodeMap, ItemGrid) {

    class Interfaz {
        constructor(game, acciones) {
            this.acciones = acciones;
            this.game = game;
            this.inventarioGrid = new ItemGrid("itemsGrid", 20, true);
            var self = this;
            this.inventarioGrid.setDobleClickCallback(function (slot) {
                self.acciones.usarConDobleClick(slot);
            });
        }

        inicializar() {
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

            $("#botonSeguroResucitar").click(function () {
                self.game.toggleSeguroResucitar();
            });

            $("#botonSeguroAtacar").click(function () {
                self.game.toggleSeguroAtacar();
            });

            $("#botonMacroHechizos").click(function () {
                self.acciones.toggleMacroHechizos();
            });

            $("#botonMacroTrabajo").click(function () {
                self.acciones.toggleMacroTrabajo();
            });

            $("#menuJuegoBotonMenu").click(function () {
                self.game.gameUI.showMenu();
            });

            $("#botonMoverHechizoArriba").click(function () {
                let slot = self.game.gameUI.interfaz.getSelectedSlotHechizo();
                if (!slot || slot === 1) {
                    return;
                }
                self.game.client.sendMoveSpell(true, slot);
                self.game.swapSlotHechizos(slot, slot - 1);
                self.setSelectedSlotHechizo(slot - 1);
            });

            $("#botonMoverHechizoAbajo").click(function () {
                let slot = self.game.gameUI.interfaz.getSelectedSlotHechizo();
                if (!slot) { // TODO: checkear que no sea el ultimo!!!
                    return;
                }
                self.game.client.sendMoveSpell(false, slot);
                self.game.swapSlotHechizos(slot, slot + 1);
                self.setSelectedSlotHechizo(slot + 1);
            });

            //FIX bug firefox que no previene movimiento scroll hehcizos
            if (Detect.isFirefox()) {
                self.setHechizosScrollFirefoxFix(self);
            }
        }

        cambiarSlotInventario(numSlot, Amount, numGrafico, equiped) {
            this.inventarioGrid.modificarSlot(numSlot, Amount, numGrafico, equiped);
        }

        borrarSlotInventario(slot) {
            this.inventarioGrid.borrarItem(slot);
        }

        resetSelectedSlotInventario() {
            this.inventarioGrid.deselect();
        }

        getSelectedSlotInventario() {
            var slot = this.inventarioGrid.getSelectedSlot();
            if (slot > 0) {
                return slot;
            }
        }

        getSelectedSlotHechizo() {
            var res = parseInt($('#hechizos').val());
            if (res) {
                return res;
            }
            else {
                return 0;
            }
        }

        setSelectedSlotHechizo(slot) {
            $('#hechizos').val(parseInt(slot));
        }

        modificarSlotHechizo(slot, texto) {
            var elemento = $('#hechizos option[value=' + slot + ']');
            if (!elemento.length) { // nuevo elemento
                var $nuevoHechizo = $("<option>").attr('value', slot).text(texto);
                $('#hechizos').append($nuevoHechizo);
            }
            else {
                $(elemento).text(texto);
            }
        }

        updateAgilidad(agi) {
            $("#indicadorAgilidad").text("A: " + agi);
        }

        updateFuerza(fuerza) {
            $("#indicadorFuerza").text("F: " + fuerza);
        }

        updateOro(oro) {
            $("#indicadorOro").text(oro);
        }

        _updateBarra(cant, max, $barra, $label, noInvertida) {
            var porcentaje = 100;
            if (max) {
                if (noInvertida) {
                    porcentaje = Math.floor((cant / max) * 100);
                } else {
                    porcentaje = 100 - Math.floor((cant / max) * 100);
                }
            }
            $barra.css("width", porcentaje + "%");
            $label.text(cant + "/" + max);
        }

        updateBarraEnergia(cant, max) {
            this._updateBarra(cant, max, $("#barraEnergiaUsada"), $("#barraEnergiaTexto"));
        }

        updateBarraVida(cant, max) {
            this._updateBarra(cant, max, $("#barraSaludUsada"), $("#barraSaludTexto"));
        }

        updateBarraMana(cant, max) {
            this._updateBarra(cant, max, $("#barraManaUsada"), $("#barraManaTexto"));
        }

        updateBarraHambre(cant, max) {
            this._updateBarra(cant, max, $("#barraHambreUsada"), $("#barraHambreTexto"));
        }

        updateBarraSed(cant, max) {
            this._updateBarra(cant, max, $("#barraSedUsada"), $("#barraSedTexto"));
        }

        updateBarraExp(cant, max) {
            this._updateBarra(cant, max, $("#barraExpUsada"), $("#barraExpTexto"));
        }

        updateNivel(nivel) {
            $("#indicadorNivel").text("Nivel " + nivel);
        }

        setMouseCrosshair(visible) {
            if (visible) {
                $("#gamecanvas").addClass("crosshair");
            }
            else {
                $("#gamecanvas").removeClass("crosshair");
            }
        }

        setSeguroResucitacion(activado) {
            if (!activado) {
                $("#botonSeguroResucitar").addClass("seguroOff");
            } else {
                $("#botonSeguroResucitar").removeClass("seguroOff");
            }
        }

        setSeguroAtacar(activado) {
            if (!activado) {
                $("#botonSeguroAtacar").addClass("seguroOff");
            } else {
                $("#botonSeguroAtacar").removeClass("seguroOff");
            }
        }

        setMacroTrabajo(activado) {
            if (activado) {
                $("#botonMacroTrabajo").addClass("macroActivado");
            } else {
                $("#botonMacroTrabajo").removeClass("macroActivado");
            }
        }

        setMacroHechizos(activado) {
            if (activado) {
                $("#botonMacroHechizos").addClass("macroActivado");
            } else {
                $("#botonMacroHechizos").removeClass("macroActivado");
            }
        }

        setHechizosScrollFirefoxFix(self) {
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

            $hechizos.change(function () {
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

    }

    return Interfaz;
});