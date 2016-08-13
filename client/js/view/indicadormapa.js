/**
 * Created by horacio on 13/08/2016.
 */

define(['font', 'lib/pixi', 'utils/palette'], function (Font, PIXI, Palette) {

    class IndicadorMapa extends PIXI.Text {
        constructor(escala) {
            super(" ");
            this.setEscala(escala);
        }

        actualizar(numMap, x, y) {
            this.text = "Mapa " + numMap + " X: " + x + " Y: " + y;
        }

        setEscala(escala){
            /* copiado de consola */
            var BASE_FONT = Font.BASE_FONT;
            var fuente = BASE_FONT._weight + ' ' + Math.round(BASE_FONT._size * escala / 1.85) + 'px ' + BASE_FONT.font;
            this.style = {
                font: fuente,
                align: "left",
                fill: Palette.get('yellow'),
                stroke: BASE_FONT.stroke,
                strokeThickness: BASE_FONT.strokeThickness * escala
            };
            this.dirty = true;
        }

    }
    return IndicadorMapa;
});
