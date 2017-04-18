/**
 * Created by horacio on 4/11/16.
 */

define(["utils/charcodemap"], function (CharCodeMap) {

    function getKeyNumber(name) {
        return CharCodeMap.keys.indexOf(name);
    }

    return {
        keys: {
            chat: getKeyNumber("ENTER"),
            chatClan: "",
            cerrar: getKeyNumber("ESCAPE"),
            atacar: getKeyNumber("SPACE"),
            caminarNorte: getKeyNumber("W"),
            caminarSur: getKeyNumber("S"),
            caminarOeste: getKeyNumber("A"),
            caminarEste: getKeyNumber("D"),
            agarrar: "",
            seguro: "",
            equipar: getKeyNumber("E"),
            deslagear: getKeyNumber("L"),
            ocultarse: getKeyNumber("R"),
            tirar: "",
            usar: getKeyNumber("Q"),
            meditar: getKeyNumber("F6"),
            domar: "",
            robar: getKeyNumber("R"),
            macroHechizos: "",
            macroTrabajo: "",
            mostrarMenu: getKeyNumber("ESCAPE")
        },
        audio: {
            soundMuted: false,
            musicMuted: false,
            soundVolume: 1.0,
            musicVolume: 1.0
        }
    };
});
