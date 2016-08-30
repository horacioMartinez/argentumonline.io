/**
 * Created by horacio on 13/08/2016.
 */

define(['font', 'lib/pixi', 'utils/palette', 'view/textstyle'], function (Font, PIXI, Palette, TextStyle) {

    class IndicadorMapa extends PIXI.Text {
        constructor(escala) {
            let style = new TextStyle(Font.INDICADOR_MAPA,escala);
            super(" ",style);
            this.setEscala(escala);
        }

        actualizar(numMap, x, y) {
            this.text = "Mapa " + numMap + " X: " + x + " Y: " + y;
        }

        setEscala(escala){
            this.style.setEscala(escala);
        }

    }
    return IndicadorMapa;
});
