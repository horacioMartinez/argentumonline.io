/**
 * Created by horacio on 4/8/16.
 */


define([], function () {
    var KeyMouseInput = Class.extend({
        init: function (game,acciones) {
            this.acciones = acciones;
            this.game = game;
            this.caminarKeys = [Enums.Keys.LEFT, Enums.Keys.KEYPAD_4, Enums.Keys.RIGHT, Enums.Keys.KEYPAD_6, Enums.Keys.UP, Enums.Keys.KEYPAD_8, Enums.Keys.DOWN, Enums.Keys.KEYPAD_2];
        },

        isCaminarKey: function (key) {
            return this.caminarKeys.indexOf(key) > -1;
        },

        click: function () {
            if ((!this.game.started) || (this.game.isPaused))
                return;
            this.acciones.click();
        },

        doubleClick: function () {

            if ((!this.game.started) || (this.game.isPaused))
                return;
            this.acciones.doubleClick();
        },

        keyUp: function (key) {
            var game = this.game;
            var acciones = this.acciones;

            if (!game.started)
                return;
            switch (key) {
                case Enums.Keys.LEFT:
                case Enums.Keys.KEYPAD_4:
                    acciones.terminarDeCaminar(Enums.Heading.oeste);
                    break;
                case Enums.Keys.RIGHT:
                case Enums.Keys.KEYPAD_6:
                    acciones.terminarDeCaminar(Enums.Heading.este);
                    break;
                case Enums.Keys.UP:
                case Enums.Keys.KEYPAD_8:
                    acciones.terminarDeCaminar(Enums.Heading.norte);
                    break;
                case Enums.Keys.DOWN:
                case Enums.Keys.KEYPAD_2:
                    acciones.terminarDeCaminar(Enums.Heading.sur);
                    break;
                default:
                    break;

            }
        },

        keyDown: function (key) {
            var game = this.game;
            var acciones = this.acciones;

            if (!game.started)
                return;

            switch (key) {
                case Enums.Keys.LEFT:
                case Enums.Keys.KEYPAD_4:
                    acciones.caminar(Enums.Heading.oeste);
                    break;
                case Enums.Keys.RIGHT:
                case Enums.Keys.KEYPAD_6:
                    acciones.caminar(Enums.Heading.este);
                    break;
                case Enums.Keys.UP:
                case Enums.Keys.KEYPAD_8:
                    acciones.caminar(Enums.Heading.norte);
                    break;
                case Enums.Keys.DOWN:
                case Enums.Keys.KEYPAD_2:
                    acciones.caminar(Enums.Heading.sur);
                    break;
                case Enums.Keys.A:
                    acciones.agarrar();
                    break;
                case Enums.Keys.O:
                    acciones.ocultarse();
                    break;
                case Enums.Keys.L:
                    acciones.requestPosUpdate();
                    break;
                case Enums.Keys.E:
                    acciones.equiparSelectedItem();
                    break;
                case Enums.Keys.U:
                    acciones.usarConU();
                    break;
                case Enums.Keys.CONTROL:
                    acciones.atacar();
                    break;
                case Enums.Keys.T:
                    acciones.tratarDeTirarItem();
                    break;
                default:
                    continuar = true;
                    break;
            }

        },
    });

    return KeyMouseInput;
});