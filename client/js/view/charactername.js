/**
 * Created by horacio on 07/06/2016.
 */

define(['enums', 'lib/pixi'], function (Enums, PIXI) {

    class CharacterName extends PIXI.Text {
        constructor(nombre, clan, font, escala) {
            if (clan) {
                nombre = nombre + "\n" + clan;
            }
            super(nombre, font);

            this._estilo = font;
            log.error(font);
            this._escala = escala;
            this.anchor.set(0.5, 0);
            this.setEscala(escala);
        }

        setPosition(x, y) {
            this.x = ( x + 16 ) * this._escala;
            this.y = (y + 32) * this._escala;
        }

        setEscala(escala){
            this._escala = escala;
            var font = {font: "900 " + Math.round(12*this._escala) +"px Arial"}; // TODO: mas lindo esto
            $.extend(this._estilo, this._estilo, font);
            this.style = this._estilo;
        }

        setVisible(visible){
            this.visible  = visible;
        }

    }

    return CharacterName;
});

/*
 var baseFont = Font.BASE_FONT;
 var fuente = baseFont._weight + ' ' + Math.round(baseFont._size * escala) + 'px ' + baseFont.font;
 var aux = {
 font: fuente,
 align: "center",
 stroke: baseFont.stroke,
 strokeThickness: baseFont.strokeThickness * escala
 };

 this.estiloChat = $.extend({}, aux, Font.TALK);
 if (this._chat) {
 this._chat.style = this.estiloChat;
 this._chat.x = this._chat.x * (escala / this._escala);
 this._chat.y = this._chat.y * (escala / this._escala);
 }
 this.x = this.x * (escala / this._escala);
 this.y = this.y * (escala / this._escala);

 this._escala = escala;

 baseFont = Font.HOVERING_BASE_FONT;
 fuente = baseFont._weight + ' ' + Math.round(baseFont._size * escala) + 'px ' + baseFont.font;
 this.estiloHovering = {
 font: fuente,
 align: "center",
 stroke: baseFont.stroke,
 strokeThickness: baseFont.strokeThickness * escala
 };
 */