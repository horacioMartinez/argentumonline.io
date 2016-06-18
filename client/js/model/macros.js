/**
 * Created by horacio on 5/3/16.
 */

define(['enums', 'font', 'lib/pixi'], function (Enums, Font, PIXI) {

    class Macros {
        constructor(game, intervalos, acciones) {
            this.game = game;
            this.intervalos = intervalos;
            this.acciones = acciones;

            acciones.setDesactivarMacrosCallback(this.desactivarMacros.bind(this));

            this.trabajando = false;
            this.lanzandoHechizo = false;
        }

        toggleTrabajar() {
            if (this.trabajando) {
                this.terminarTrabajar();
            } else {
                this.comenzarTrabajar();
            }
        }

        toggleHechizos() {
            if (this.lanzandoHechizo) {
                this.terminarLanzarHechizo();
            } else {
                this.comenzarLanzarHechizo();
            }
        }

        comenzarTrabajar() {
            if (this.trabajando)
                return;
            if (!this.game.gameUI.interfaz.getSelectedSlotInventario()){
                this.game.escribirMsgConsola(Enums.MensajeConsola.MACRO_TABAJO_REQUIERE_EQUIPAR, Font.WARNING);
                return;
            }

            this.game.escribirMsgConsola(Enums.MensajeConsola.MACRO_TRABAJO_ACTIVADO, Font.WARNING);

            PIXI.ticker.shared.add(this._updateTrabajar, this);
            this.trabajando = true;
        }

        terminarTrabajar() {
            if (!this.trabajando)
                return;
            this.game.escribirMsgConsola(Enums.MensajeConsola.MACRO_TRABAJO_DESACTIVADO, Font.WARNING);

            PIXI.ticker.shared.remove(this._updateTrabajar, this);
            this.trabajando = false;
        }

        _updateTrabajar() { // TODO: que no checkee cada vez ? funcion on timer...
            if (!this.intervalos.requestMacroTrabajo(this.game.currentTime))
                return;
            if (this.game.trabajoPendiente) {
                this.acciones.click(true);
            } else {
                this.acciones.usarConU();
            }
        }

        comenzarLanzarHechizo() {
            if (this.lanzandoHechizo)
                return;
            if (!this.game.gameUI.interfaz.getSelectedSlotHechizo()){
                this.game.escribirMsgConsola(Enums.MensajeConsola.MACRO_HECHIZOS_REQUIRE_SELECCIONAR, Font.WARNING);
                return;
            }

            this.game.escribirMsgConsola(Enums.MensajeConsola.MACRO_HECHIZOS_ACTIVADO, Font.WARNING);
            PIXI.ticker.shared.add(this._updateHechizos, this);
            this.lanzandoHechizo = true;
        }

        terminarLanzarHechizo() {
            if (!this.lanzandoHechizo)
                return;
            this.game.escribirMsgConsola(Enums.MensajeConsola.MACRO_HECHIZOS_DESACTIVADO, Font.WARNING);
            PIXI.ticker.shared.remove(this._updateHechizos, this);
            this.lanzandoHechizo = false;
        }

        _updateHechizos() {
            if (!this.intervalos.requestMacroHechizo(this.game.currentTime))
                return;
            if (this.game.trabajoPendiente) {
                this.acciones.click(true);
            } else {
                this.acciones.lanzarHechizo();
            }
        }

        desactivarMacros() {
            this.terminarTrabajar();
            this.terminarLanzarHechizo();
        }

    }
    return Macros;
});
