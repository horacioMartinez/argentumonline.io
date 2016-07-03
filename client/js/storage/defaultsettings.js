/**
 * Created by horacio on 4/11/16.
 */

define(["utils/charcodemap"], function (CharCodeMap) {

    function getKeyNumber(name){
        return CharCodeMap.keys.indexOf(name);
    }

    return {
        keys: {
            toggleChat: getKeyNumber("ENTER"),
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
            macroHechizos : getKeyNumber("F7"),
            macroTrabajar : getKeyNumber("F8")

        },
        audio: {
            soundMuted: false,
            musicMuted: false,
            soundVolume: 1.0,
            musicVolume: 1.0
        }
    }
});
