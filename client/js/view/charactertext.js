/**
 * Created by horacio on 3/9/16.
 */

define(['font', 'lib/pixi', 'view/textstyle'], function (Font, PIXI, TextStyle) {

    class CharacterText extends PIXI.Container {
        constructor(escala) {
            super();
            this.estiloChat = new TextStyle(Font.TALK_BASE_FONT,escala);

            this.infos = [];
            this._chat = null;
            this._escala = escala || 1;
            this.setEscala(escala);
            this.MAXIMO_LARGO_LINEA_CHAT = 18;
            this.DURACION_CHAT = 15000;
            this.DURACION_INFO = 2000;
        }

        setEscala(escala) {
            this.estiloChat.setEscala(escala);

            if (this._chat) {
                //this._chat.style = this.estiloChat;
                this._chat.x = Math.round(this._chat.x * (escala / this._escala));
                this._chat.y = Math.round(this._chat.y * (escala / this._escala));
            }
            this.x = Math.round(this.x * (escala / this._escala));
            this.y = Math.round(this.y * (escala / this._escala));

            this._escala = escala;
        }

        setPosition(x, y) {
            this.x = Math.round(x * this._escala);
            this.y = Math.round(y * this._escala);
        }

        _formatearChat(str) {
            var resultado = [];
            str = str.trim();
            while ((str.length > this.MAXIMO_LARGO_LINEA_CHAT) && (str.indexOf(' ') > (-1))) {
                var idx = str.indexOf(' ');
                var posUltimoEspacioPrimerBloque = idx;
                while ((idx != -1) && (idx < this.MAXIMO_LARGO_LINEA_CHAT - 1 )) {
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
        }

        setChat(chat, color) {
            this.removerChat();
            chat = this._formatearChat(chat);
            this.estiloChat.fill = color;
            this._chat = new PIXI.Text(chat.join('\n'), this.estiloChat);

            this._chat.tiempoPasado = 0;

            this.addChild(this._chat);
            this._chat.x = Math.round(32 * this._escala / 2 - this._chat.width / 2);
            this._chat.y = Math.round(-28 * this._escala - this._chat.height);
        }

        removerChat() {
            if (this._chat) {
                this.removeChild(this._chat);
                this._chat.destroy();
            }
            this._chat = null;
        }


        addHoveringInfo(value, font) {
            var estilo = new TextStyle(Font.HOVERING_BASE_FONT,this._escala,font);
            var info = new PIXI.Text(value, estilo);

            info.tiempoPasado = 0;
            this.addChild(info);
            this.infos.push(info);
            
            info.y = -16 * this._escala - info.height;
            info.x = 32 * this._escala / 2 - info.width / 2;
        }

        _removerInfo(info) {
            let index = this.infos.indexOf(info);
            if (index > -1) {
                this.infos.splice(index, 1);
                this.removeChild(info);
                info.destroy();
            }
        }

        update(delta) {
            this._updateChat(delta);
            this._updateInfos(delta);
        }

        _updateChat(delta) {
            if (!this._chat)
                return;
            this._chat.tiempoPasado += delta;
            if (this._chat.tiempoPasado > this.DURACION_CHAT) {
                this.removerChat();
            }
        }

        _updateInfos(delta) {
            let i;
            for (i = this.infos.length - 1; i >= 0; i--) {
                let info = this.infos[i];
                info.tiempoPasado += delta;
                info.y -= delta / 50;
                var alpha = ((this.DURACION_INFO - info.tiempoPasado) / this.DURACION_INFO );
                if (alpha >= 0) {
                    info.alpha = alpha;
                }
                if (info.tiempoPasado > this.DURACION_INFO) {
                    this._removerInfo(info);
                }
            }
        }

        destroy(options) {
            this.removerChat();
            for (let i = this.infos.length - 1; i >= 0; i--) {
                this._removerInfo(this.infos[i]);
            }
            super.destroy(options);
        }
    }

    return CharacterText;
});
