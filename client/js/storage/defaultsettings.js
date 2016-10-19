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
            chatClan: getKeyNumber("DELETE"),
            cerrar: getKeyNumber("ESCAPE"),
            atacar: getKeyNumber("CONTROL"),
            caminarNorte: getKeyNumber("UP"),
            caminarSur: getKeyNumber("DOWN"),
            caminarOeste: getKeyNumber("LEFT"),
            caminarEste: getKeyNumber("RIGHT"),
            agarrar: getKeyNumber("A"),
            seguro: getKeyNumber("S"),
            equipar: getKeyNumber("E"),
            deslagear: getKeyNumber("L"),
            ocultarse: getKeyNumber("O"),
            tirar: getKeyNumber("T"),
            usar: getKeyNumber("U"),
            meditar: getKeyNumber("F6"),
            domar: getKeyNumber("D"),
            robar: getKeyNumber("R"),
            macroHechizos: getKeyNumber("F7"),
            macroTrabajo: getKeyNumber("F8"),
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
