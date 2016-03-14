/**
 * Created by horacio on 3/8/16.
 */

define(['lib/pixi'], function (PIXI) {

    function Consola() {
        PIXI.Container.call(this);
        this.CANT_LINEAS = 5;
    }

    Consola.prototype = Object.create(PIXI.Container.prototype);
    Consola.constructor = Consola;

    Consola.prototype.setEscala = function (escala) {
        var font = Math.round(14*escala)+'px Arial';
        this.baseFont = {font: font, align: "center", stroke: "black", strokeThickness: 0.2};
    };

    Consola.prototype._removerTexto = function(spriteTexto){
        for (var i = 0; i < this.children.length ; i++){
            this.children[i].y -= spriteTexto.height;
        }
        PIXI.ticker.shared.remove(spriteTexto.updateChat,spriteTexto);
        this.removeChild(spriteTexto);
    };

    Consola.prototype.agregarTexto = function (texto, font) {

        var estilo = $.extend({},this.baseFont,font);
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
    };

    return Consola;
});
