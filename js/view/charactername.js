/**
 * Created by horacio on 07/06/2016.
 */

import Enums from '../enums.js';
import * as PIXI from 'pixi.js';
import Font from '../font.js';
import TextStyle from '../view/textstyle.js';



    class CharacterName extends PIXI.Text {
        constructor(nombre, clan, font, escala) {
            if (clan) {
                nombre = nombre + "\n" + clan;
            }

            let style = new TextStyle(Font.NOMBRE_BASE_FONT,escala);
            super(nombre, style);

            this.anchor.set(0.5, 0);

            escala = escala || 1;
            this._escala = escala;
        }

        setPosition(x, y) {
            this.x = Math.round(( x + 16 ) * this._escala);
            this.y = Math.round((y + 32) * this._escala);
        }

        setEscala(nuevaEscala) {
            this.x = this.x * (nuevaEscala / this._escala);
            this.y = this.y * (nuevaEscala / this._escala);
            this.style.setEscala(nuevaEscala);
            
            this._escala = nuevaEscala;
        }

    }

    
export default CharacterName;