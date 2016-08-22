/**
 * Created by horacio on 13/08/2016.
 */

define(['font', 'lib/pixi', 'utils/palette'], function (Font, PIXI, Palette) {

    class IndicadorMapa extends PIXI.Text {
        constructor(escala) {
            let style = $.extend({}, Font.INDICADOR_MAPA);
            super(" ",style);
            this.setEscala(escala);
        }

        actualizar(numMap, x, y) {
            this.text = "Mapa " + numMap + " X: " + x + " Y: " + y;
        }

        setEscala(escala){
            this.style.fontSize = Math.round(Font.INDICADOR_MAPA.fontSize * escala);
        }

    }
    return IndicadorMapa;
});
