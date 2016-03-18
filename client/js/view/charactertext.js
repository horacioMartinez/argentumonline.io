/**
 * Created by horacio on 3/9/16.
 */

define(['lib/pixi'], function (PIXI) {

    function CharacterText(escala) {
        PIXI.Container.call(this);
        CharacterText.MAXIMO_LARGO_CHAT = 15;
        this._chat = null;
        this._escala = escala ? escala : 1;
        this.setEscala(escala);
    }

    CharacterText.MAXIMO_LARGO_CHAT = 15;

    CharacterText.prototype = Object.create(PIXI.Container.prototype);
    CharacterText.constructor = CharacterText;

    CharacterText.prototype.setEscala = function (escala) {
        var font = Math.round(14 * escala) + 'px Arial';
        var aux = {font: font, align: "center", stroke: "black", strokeThickness: 0.2};
        this.estilo = $.extend({}, aux, Enums.Font.TALK);

        if (this._chat) {
            this._chat.style = this.estilo;
            this._chat.x = this._chat.x * (escala / this._escala);
            this._chat.y = this._chat.y * (escala / this._escala);
        }
        this.x = this.x * (escala / this._escala);
        this.y = this.y * (escala / this._escala);

        this._escala = escala;
    };

    CharacterText.prototype.setPosition = function (x, y) {
        this.x = x * this._escala;
        this.y = y * this._escala;
    };

    CharacterText.prototype._formatearChat = function (str) {
        var resultado = [];
        while ((str.length > CharacterText.MAXIMO_LARGO_CHAT) && (str.indexOf(' ') > (-1))) {
            var idx = str.indexOf(' ');
            var posUltimoEspacioPrimerBloque = idx;
            while ((idx != -1) && (idx < CharacterText.MAXIMO_LARGO_CHAT - 1 )) {
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

    CharacterText.prototype.setChat = function (chat) {
        this.removerChat();
        chat = this._formatearChat(chat);
        this._chat = new PIXI.Text(chat.join('\n'), this.estilo);
        var self = this;
        this._chat.duracion = 1000;
        this._chat.tiempoPasado = 0;
        this._chat.updateChat = function (delta) {
            this.tiempoPasado += delta;
            if (this.tiempoPasado > this.duracion) {
                self.removerChat();
            }
        }.bind(this._chat);
        PIXI.ticker.shared.add(this._chat.updateChat, this._chat);

        this.addChild(this._chat);
        this._chat.x = 32 * this._escala / 2 - this._chat.width / 2;
        this._chat.y = -28 * this._escala - this._chat.height;
    };

    CharacterText.prototype.removerChat = function (chat) {
        if (this._chat) {
            PIXI.ticker.shared.remove(this._chat.updateChat, this._chat);
            this.removeChild(this._chat);
        }
        this._chat = null;

    };

    return CharacterText;
});
