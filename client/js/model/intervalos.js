/**
 * Created by horacio on 2/9/16.
 */
define(['enums'], function (Enums) {

    class Intervalos {
        constructor(time) {
            time = time || 0;
            this.times = {
                ataque: time,
                ataqueConArco: time,
                hechizo: time,
                ataqueHechizo: time,
                hechizoAtaque: time,
                usarItemConU: time,
                usarItemConDobleClick: time,
                requestPostionUpdate: time,
                macroTrabajo: time,
                macroHechizo: time,
                domar: time,
                robar: time
            };

            this.INTERVALO_MACRO_TRABAJO = Math.floor(Enums.Intervalo.usarItemConU / 2) + 75; // dividido 2 porque la mitad en usar u la otra en clickear
            this.INTERVALO_MACRO_HECHIZO = Math.floor(Enums.Intervalo.hechizo / 2) + 75;
        }

        requestMacroTrabajo(time) {
            if (time > ( this.times.macroTrabajo + this.INTERVALO_MACRO_TRABAJO)) {
                this.times.macroTrabajo = time;
                return true;
            }
            return false;
        }

        requestMacroHechizo(time) {
            if (time > ( this.times.macroHechizo + this.INTERVALO_MACRO_HECHIZO)) {
                this.times.macroHechizo = time;
                return true;
            }
            return false;
        }

        requestPosUpdate(time) {
            if (time > ( this.times.requestPostionUpdate + Enums.Intervalo.requestPostionUpdate)) {
                this.times.requestPostionUpdate = time;
                return true;
            }
            return false;
        }

        requestAtacar(time) {
            if (time > ( this.times.ataqueConArco + Enums.Intervalo.ataqueConArco)) {
                if (time > ( this.times.hechizoAtaque + Enums.Intervalo.hechizoAtaque)) {
                    if (time > ( this.times.ataque + Enums.Intervalo.ataque)) {
                        this.times.ataque = time;
                        this.times.ataqueHechizo = time;
                        return true;
                    }
                }
            }
            return false;
        }

        requestLanzarHechizo(time) {
            if (time > ( this.times.ataqueConArco + Enums.Intervalo.ataqueConArco)) {
                if (time > ( this.times.ataqueHechizo + Enums.Intervalo.ataqueHechizo)) {
                    if (time > ( this.times.hechizo + Enums.Intervalo.hechizo)) {
                        this.times.hechizo = time;
                        this.times.hechizoAtaque = time;
                        return true;
                    }
                }
            }
            return false;
        }

        requestAtacarConArco(time) {
            if (time > ( this.times.ataqueConArco + Enums.Intervalo.ataqueConArco)) {
                this.times.ataqueConArco = time;
                return true;
            }
            return false;
        }

        requestUsarConU(time) {
            if (time > ( this.times.usarItemConU + Enums.Intervalo.usarItemConU)) {
                this.times.usarItemConU = time;
                return true;
            }
            return false;
        }

        requestUsarConDobleClick(time) {
            if (time > ( this.times.usarItemConDobleClick + Enums.Intervalo.usarItemConDobleClick)) {
                this.times.usarItemConDobleClick = time;
                return true;
            }
            return false;
        }

        requestDomar(time) {
            if (time > ( this.times.domar + Enums.Intervalo.domar)) {
                this.times.domar = time;
                return true;
            }
            return false;
        }

        requestRobar(time) {
            if (time > ( this.times.robar + Enums.Intervalo.robar)) {
                this.times.robar = time;
                return true;
            }
            return false;
        }

    }

    return Intervalos;
});