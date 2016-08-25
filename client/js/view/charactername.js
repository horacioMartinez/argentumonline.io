/**
 * Created by horacio on 07/06/2016.
 */

define(['enums', 'lib/pixi', 'font'], function (Enums, PIXI, Font) {

    class CharacterName extends PIXI.Text {
        constructor(nombre, clan, font, escala) {
            if (clan) {
                nombre = nombre + "\n" + clan;
            }
            
            let style = $.extend({}, Font.NOMBRE_BASE_FONT, font);
            super(nombre, style);

            this.anchor.set(0.5, 0);

            this._escala = escala;
            this.setEscala(escala);
        }

        setPosition(x, y) {
            this.x = Math.round(( x + 16 ) * this._escala);
            this.y = Math.round((y + 32) * this._escala);
        }

        setEscala(nuevaEscala) {
            this.x = this.x * (nuevaEscala / this._escala);
            this.y = this.y * (nuevaEscala / this._escala);

            this.style.fontSize = Math.round(Font.NOMBRE_BASE_FONT.fontSize * nuevaEscala);
            this._escala = nuevaEscala;
        }

        setVisible(visible) {
            this.visible = visible;
        }

    }

    return CharacterName;
});