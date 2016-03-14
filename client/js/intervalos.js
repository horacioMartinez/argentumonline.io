/**
 * Created by horacio on 2/9/16.
 */
define(['enums'], function () {

    var Intervalos = Class.extend({
        init: function (time) {
            time = time || 0;
            this.times = {
                macroHechizos: time,
                macroTrabajo: time,
                ataque: time,
                ataqueConArco: time,
                hechizo: time,
                ataqueHechizo: time,
                hechizoAtaque: time,
                trabajar: time,
                usarItemConU: time,
                usarItemConDobleClick: time,
                requestPostionUpdate: time
            }
        },

        requestPosUpdate: function (time) {
            if (time > ( this.times.requestPostionUpdate + Enums.Intervalo.requestPostionUpdate)) {
                this.times.requestPostionUpdate = time;
                return true;
            }
            return false;
        },

        requestAtacar: function (time) {
            if (time > ( this.times.ataqueConArco + Enums.Intervalo.ataqueConArco))
                if (time > ( this.times.hechizoAtaque + Enums.Intervalo.hechizoAtaque))
                    if (time > ( this.times.ataque + Enums.Intervalo.ataque)) {
                        this.times.ataque = time;
                        this.times.ataqueHechizo = time;
                        return true;
                    }
            return false;
        },

        requestLanzarHechizo: function (time) {
            if (time > ( this.times.ataqueConArco + Enums.Intervalo.ataqueConArco))
                if (time > ( this.times.ataqueHechizo + Enums.Intervalo.ataqueHechizo))
                    if (time > ( this.times.hechizo + Enums.Intervalo.hechizo)) {
                        this.times.hechizo = time;
                        this.times.hechizoAtaque = time;
                        return true;
                    }
            return false;
        },

        requestAtacarConArco: function (time) {
            if (time > ( this.times.ataqueConArco + Enums.Intervalo.ataqueConArco)) {
                this.times.ataqueConArco = time;
                return true;
            }
            return false;
        },

        requestUsarConU: function (time) {
            if (time > ( this.times.usarItemConU + Enums.Intervalo.usarItemConU)) {
                this.times.usarItemConU = time;
                return true;
            }
            return false;
        },

        requestUsarConDobleClick: function (time) {
            if (time > ( this.times.usarItemConDobleClick + Enums.Intervalo.usarItemConDobleClick)) {
                this.times.usarItemConDobleClick = time;
                return true;
            }
            return false;
        }
    });

    return Intervalos;
});