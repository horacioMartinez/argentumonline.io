/**
 * Created by horacio on 3/9/16.
 */

define(['font', 'lib/pixi'], function (Font, PIXI) {

    class CharacterText extends PIXI.Container {
        constructor(escala) {
            super();
            this.estiloChat = null;
            this.estiloHovering = null;
            this._chat = null;
            this._escala = escala ? escala : 1;
            this.setEscala(escala);
            this.MAXIMO_LARGO_CHAT = 15;
        }

        setEscala(escala) {
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
                this._chat.x = Math.round(this._chat.x * (escala / this._escala));
                this._chat.y = Math.round(this._chat.y * (escala / this._escala));
            }
            this.x = Math.round(this.x * (escala / this._escala));
            this.y = Math.round(this.y * (escala / this._escala));

            this._escala = escala;

            baseFont = Font.HOVERING_BASE_FONT;
            fuente = baseFont._weight + ' ' + Math.round(baseFont._size * escala) + 'px ' + baseFont.font;
            this.estiloHovering = {
                font: fuente,
                align: "center",
                stroke: baseFont.stroke,
                strokeThickness: baseFont.strokeThickness * escala
            };
        };

        setPosition(x, y) {
            this.x = Math.round(x * this._escala);
            this.y = Math.round(y * this._escala);
        };

        _formatearChat(str) {
            var resultado = [];
            str = str.trim();
            while ((str.length > CharacterText.MAXIMO_LARGO_CHAT) && (str.indexOf(' ') > (-1))) {
                var idx = str.indexOf(' ');
                var posUltimoEspacioPrimerBloque = idx;
                while ((idx != -1) && (idx < CharacterText.MAXIMO_LARGO_CHAT - 1 )) {
                    idx = str.indexOf(' ', idx + 1);
                    if (idx > 0) {
                        posUltimoEspacioPrimerBloque = idx;
                    }
                }
                if (posUltimoEspacioPrimerBloque > 0) {
                    resultado.push(str.slice(0, posUltimoEspacioPrimerBloque));
                }
                str = str.slice(posUltimoEspacioPrimerBloque + 1, str.length);
            }
            resultado.push(str);
            return resultado;
        };

        setChat(chat, color) {
            this.removerChat();
            chat = this._formatearChat(chat);
            this.estiloChat.fill = color;
            this._chat = new PIXI.Text(chat.join('\n'), this.estiloChat);
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
            this._chat.x = Math.round(32 * this._escala / 2 - this._chat.width / 2);
            this._chat.y = Math.round(-28 * this._escala - this._chat.height);
        };

        removerChat() {
            if (this._chat) {
                PIXI.ticker.shared.remove(this._chat.updateChat, this._chat);
                this.removeChild(this._chat);
                this._chat.destroy();
            }
            this._chat = null;
        };

        //TODO: ordenar codigo repetido y animacion bien hecha (ademas en el chat animarlo cuando aparece, como que suba un poco)
        setHoveringInfo(value, font, duration) {

            duration = duration ? duration : 125;

            var estilo = $.extend({}, this.estiloHovering, font);
            var info = new PIXI.Text(value, estilo);

            info.duracion = duration;
            info.tiempoPasado = 0;
            var self = this;
            info.updateInfo = function (delta) {
                this.tiempoPasado += delta;
                this.y -= delta / 5;
                var alpha = ((this.duracion - this.tiempoPasado) / this.duracion );
                if (alpha >= 0) {
                    this.alpha = alpha;
                }
                if (this.tiempoPasado > this.duracion) {
                    PIXI.ticker.shared.remove(this.updateInfo, this);
                    self.removeChild(this);
                }
            }.bind(info);
            PIXI.ticker.shared.add(info.updateInfo, info);
            this.addChild(info);
            info.y = -16 * this._escala - info.height;
            info.x = 32 * this._escala / 2 - info.width / 2;
        };

        destroy() {
            // hay que destruir los childs de este tambien
            // TODO: emprolijar
            this.removerChat();
            this.children.forEach((hijo, num) => {
                if (hijo.updateInfo) {
                    PIXI.ticker.shared.remove(hijo.updateInfo, hijo);
                }
                hijo.destroy();
            });
            super.destroy();
        };
    }

    return CharacterText;
});
