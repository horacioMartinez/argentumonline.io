/**
 * Created by horacio on 3/8/16.
 */

/**
 * Created by horacio on 3/2/16.
 */

define(['lib/pixi'], function (PIXI) {

    function Consola() {
        PIXI.Container.call(this);
        this.CANT_LINEAS = 5;
        this.BASE_FONT = {font: '14px Arial', stroke: "black", strokeThickness: 0.2};
    }

    Consola.prototype = Object.create(PIXI.Container.prototype);
    Consola.constructor = Consola;

    Consola.prototype._removerTexto = function(spriteTexto){
        for (var i = 0; i < this.children.length ; i++){
            this.children[i].y -= spriteTexto.height;
        }
        PIXI.ticker.shared.remove(spriteTexto.updateChat,spriteTexto);
        this.removeChild(spriteTexto);
    };

    Consola.prototype.agregarTexto = function (texto, font) {

        var estilo = $.extend({},this.BASE_FONT,font);
        var texto = new PIXI.Text(texto, estilo);

        if (this.children.length > this.CANT_LINEAS-1){
            this._removerTexto(this.children[0])
        }
        var y = 0;
        if (this.children[0])
            y = this.children[0].height* this.children.length;
        texto.y = y;
        texto.duracion = 1000;
        texto.tiempoPasado = 0;
        var self = this;
        texto.updateChat = function(delta){
            this.tiempoPasado += delta;
            if (this.tiempoPasado > this.duracion){
                self._removerTexto(this);
            }
        }.bind(texto);
        PIXI.ticker.shared.add(texto.updateChat, texto);

        this.addChild(texto);
        /*
        var self = this;
        texto.duracion = 1000;
        texto.tiempoPasado = 0;
        texto.updateChat = function(delta){
            this.tiempoPasado += delta;
            log.error(this.tiempoPasado);
            log.error(this.duracion);
            if (this.tiempoPasado > this.duracion){
                PIXI.ticker.shared.remove(this.updateChat, this);
                self.removeChild(this);
            }
        }.bind(texto);
        PIXI.ticker.shared.add(texto.updateChat, texto);

        this.addChild(texto);
        texto.x = this.bodySprite.sprite.x + 32 /2 - texto.width /2 ;
        texto.y = this.bodySprite.sprite.y - this.bodySprite.sprite.height - (chat.length -1 )* 14;
*/
    };

    return Consola;
});
