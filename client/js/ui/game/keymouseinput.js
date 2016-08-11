/**
 * Created by horacio on 4/8/16.
 */


define(['enums', 'utils/charcodemap'], function (Enums, CharcodeMap) {
    class KeyMouseInput {
        constructor(game, acciones) {
            this.acciones = acciones;
            this.game = game;
            this.keys = null;
        }

        setKeys(keys) {
            this.keys = keys;
        }

        isCaminarKey(key) {
            return ( (key === this.keys.caminarEste) || (key === this.keys.caminarOeste) || (key === this.keys.caminarNorte) || (key === this.keys.caminarSur));
        }

        getTeclasCaminar() {
            return [this.keys.caminarEste, this.keys.caminarOeste, this.keys.caminarNorte, this.keys.caminarSur];
        }

        click() {
            if ((!this.game.started) || (this.game.isPaused)) {
                return;
            }
            this.acciones.click();
        }

        doubleClick() {

            if ((!this.game.started) || (this.game.isPaused)) {
                return;
            }
            this.acciones.doubleClick();
        }

        keyUp(key) {
            var game = this.game;
            var acciones = this.acciones;
            var keys = this.keys;

            if (!game.started) {
                return;
            }
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
        }

        keyDown(key) {
            var game = this.game;
            var acciones = this.acciones;
            var keys = this.keys;

            if (!game.started) {
                return;
            }

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
                case keys.meditar:
                    acciones.meditar();
                    break;
                case keys.macroHechizos:
                    acciones.toggleMacroHechizos();
                    break;
                case keys.macroTrabajo:
                    acciones.toggleMacroTrabajo();
                    break;
                case keys.domar:
                    acciones.domar();
                    break;
                case keys.robar:
                    acciones.robar();
                    break;
                case keys.mostrarMenu:
                    acciones.mostrarMenu();
                    continuar = true;
                    break;
                default:
                    continuar = true;
                    break;
            }
            return continuar;
        }

        ignoredKey(key) {
            //si la tecla corresponde a alguna accion no ignorarla
            for (var accionKey in this.keys) {
                if (this.keys.hasOwnProperty(accionKey)){
                    if (this.keys[accionKey] === key) {
                        return false;
                    }
                }
            }

            // si la tecla es algun F1...F12 ignorarla
            if ((key >= CharcodeMap.keys.indexOf("F1")) && key <= CharcodeMap.keys.indexOf("F12")) {
                return true;
            }
        }
    }

    return KeyMouseInput;
});