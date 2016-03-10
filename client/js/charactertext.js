/**
 * Created by horacio on 3/9/16.
 */

define(['lib/pixi', 'spritegrh'], function (PIXI) {

    function CharacterText(escala) {
        PIXI.Container.call(this);
        this.MAXIMO_LARGO_CHAT = 15;
        this._chat = null;
        this.setEscala(escala);
    }

    CharacterText.prototype = Object.create(PIXI.Container.prototype);
    CharacterText.constructor = CharacterText;

    CharacterText.prototype.setEscala = function (escala) {
        var font = Math.round(14*escala)+'px Arial';
        var aux = {font: font, align: "center", stroke: "black", strokeThickness: 0.2};
        this.estilo = $.extend({}, aux,Enums.Font.TALK);

        if (this._chat){
            this._chat.style = this.estilo;
        }
    };

    CharacterText.prototype._formatearChat = function (str) {
        var resultado = [];
        while ((str.length > this.MAXIMO_LARGO_CHAT) && (str.indexOf(' ') > (-1))) {
            var idx = str.indexOf(' ');
            var posUltimoEspacioPrimerBloque = idx;
            while ((idx != -1) && (idx < this.MAXIMO_LARGO_CHAT - 1 )) {
                idx = str.indexOf(' ', idx + 1);
                if (idx > 0)
                    posUltimoEspacioPrimerBloque = idx;
            }
            if (posUltimoEspacioPrimerBloque > 0)
                resultado.push(str.slice(0, posUltimoEspacioPrimerBloque));
            str = str.slice(posUltimoEspacioPrimerBloque + 1, str.length);
        }
        resultado.push(str);
        return resultado;
    };

    CharacterText.prototype.setChat = function( chat ){
        this.removerChat();
        chat = this._formatearChat(chat);
        this._chat = new PIXI.Text(chat.join('\n'), this.estilo);
        var self = this;
        this._chat.duracion = 1000;
        this._chat.tiempoPasado = 0;
        this._chat.updateChat = function(delta){
            this.tiempoPasado += delta;
            if (this.tiempoPasado > this.duracion){
                self.removerChat();
            }
        }.bind(this._chat);
        PIXI.ticker.shared.add(this._chat.updateChat, this._chat);

        this.addChild(this._chat);
        this._chat.x = 32 /2 - this._chat.width /2 ;
        this._chat.y =  - 28 - this._chat.height;
    };

    CharacterText.prototype.removerChat = function( chat ){
        if (this._chat) {
            PIXI.ticker.shared.remove(this._chat.updateChat, this._chat);
            this.removeChild(this._chat);
        }
        this._chat = null;

    };

    return CharacterText;
});
