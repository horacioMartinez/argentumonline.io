/**
 * Created by horacio on 4/11/16.
 */

define(["utils/charcodemap"], function (CharCodeMap) {

    function getKeyNumber(name){
        return CharCodeMap.keys.indexOf(name);
    }

    return {
        keys: {
            toggleChat: CharCodeMap.keys.indexOf("ENTER"),
            cerrar: CharCodeMap.keys.indexOf("ESCAPE"),
            atacar: CharCodeMap.keys.indexOf("CONTROL"),
            caminarNorte: CharCodeMap.keys.indexOf("UP"),
            caminarSur: CharCodeMap.keys.indexOf("DOWN"),
            caminarOeste: CharCodeMap.keys.indexOf("LEFT"),
            caminarEste: CharCodeMap.keys.indexOf("RIGHT"),
            agarrar: CharCodeMap.keys.indexOf("A"),
            seguro: CharCodeMap.keys.indexOf("S"),
            equipar: CharCodeMap.keys.indexOf("E"),
            deslagear: CharCodeMap.keys.indexOf("L"),
            ocultarse: CharCodeMap.keys.indexOf("O"),
            tirar: CharCodeMap.keys.indexOf("T"),
            usar: CharCodeMap.keys.indexOf("U"),
            meditar: CharCodeMap.keys.indexOf("F6"),
            macroHechizos : CharCodeMap.keys.indexOf("F7"),
            macroTrabajar : CharCodeMap.keys.indexOf("F8")

        },
        audio: {
            soundMuted: false,
            musicMuted: false,
            soundVolume: 1.0,
            musicVolume: 1.0
        }
    }
});
