/**
 * Created by horacio on 4/8/16.
 */


define(['enums'], function (Enums) {
    var KeyMouseInput = Class.extend({
        init: function (game,acciones) {
            this.acciones = acciones;
            this.game = game;
            this.keys = null;
        },

        setKeys: function(keys){
            this.keys = keys;
        },

        isCaminarKey: function (key) {
            return ( (key === this.keys.caminarEste) || (key === this.keys.caminarOeste) || (key === this.keys.caminarNorte) || (key === this.keys.caminarSur));
        },

        getTeclasCaminar: function(){
            return [this.keys.caminarEste,this.keys.caminarOeste,this.keys.caminarNorte,this.keys.caminarSur];
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
            var keys = this.keys;

            if (!game.started)
                return;
            switch (key) {
                case keys.caminarOeste:
                    acciones.terminarDeCaminar(Enums.Heading.oeste);
                    break;
                case keys.caminarEste:
                    acciones.terminarDeCaminar(Enums.Heading.este);
                    break;
                case keys.caminarNorte:
                    acciones.terminarDeCaminar(Enums.Heading.norte);
                    break;
                case keys.caminarSur:
                    acciones.terminarDeCaminar(Enums.Heading.sur);
                    break;
                default:
                    break;

            }
        },

        keyDown: function (key) {
            var game = this.game;
            var acciones = this.acciones;
            var keys = this.keys;

            if (!game.started)
                return;

            var continuar = false;
            switch (key) {
                case keys.caminarOeste:
                    acciones.caminar(Enums.Heading.oeste);
                    break;
                case keys.caminarEste:
                    acciones.caminar(Enums.Heading.este);
                    break;
                case keys.caminarNorte:
                    acciones.caminar(Enums.Heading.norte);
                    break;
                case keys.caminarSur:
                    acciones.caminar(Enums.Heading.sur);
                    break;
                case keys.agarrar:
                    acciones.agarrar();
                    break;
                case keys.ocultarse:
                    acciones.ocultarse();
                    break;
                case keys.deslagear:
                    acciones.requestPosUpdate();
                    break;
                case keys.equipar:
                    acciones.equiparSelectedItem();
                    break;
                case keys.usar:
                    acciones.usarConU();
                    break;
                case keys.atacar:
                    acciones.atacar();
                    break;
                case keys.tirar:
                    acciones.tratarDeTirarItem();
                    break;
                default:
                    continuar = true;
                    break;
            }
            return continuar;
        },
    });

    return KeyMouseInput;
});