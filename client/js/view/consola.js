/**
 * Created by horacio on 3/8/16.
 */

define(['font', 'lib/pixi'], function (Font, PIXI) {

    function Consola(escala) {
        PIXI.Container.call(this);
        this.CANT_LINEAS = 7;
        escala = escala ? escala : 1;
        this.setEscala(escala);
    }

    Consola.prototype = Object.create(PIXI.Container.prototype);
    Consola.constructor = Consola;

    Consola.prototype.setEscala = function (escala) {
        var BASE_FONT = Font.BASE_FONT;
        var fuente = BASE_FONT._weight + ' ' + Math.round(BASE_FONT._size * escala) + 'px ' + BASE_FONT.font;
        this.baseFont = {
            font: fuente,
            align: "center",
            stroke: BASE_FONT.stroke,
            strokeThickness: BASE_FONT.strokeThickness * escala
        };

        for (var i = 0; i < this.children.length; i++) {
            this.children[i].style.font = fuente;
            this.children[i].dirty = true;
            this.children[i].y = this.children[0].height * i;
        }
    };

    Consola.prototype._removerTexto = function (spriteTexto) {
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].y -= spriteTexto.height;
        }
        PIXI.ticker.shared.remove(spriteTexto.updateChat, spriteTexto);
        this.removeChild(spriteTexto);
        spriteTexto.destroy();
    };

    Consola.prototype.agregarTexto = function (texto, font) {

        var estilo = $.extend({}, this.baseFont, font);
        let nuevoTexto = new PIXI.Text(texto, estilo);

        if (this.children.length > this.CANT_LINEAS - 1) {
            this._removerTexto(this.children[0]);
        }
        var y = 0;
        if (this.children[0]) {
            y = this.children[0].height * this.children.length;
        }
        nuevoTexto.y = y;
        nuevoTexto.duracion = 1000;
        nuevoTexto.tiempoPasado = 0;
        var self = this;
        nuevoTexto.updateChat = function (delta) {
            this.tiempoPasado += delta;
            if (this.tiempoPasado > this.duracion) {
                self._removerTexto(this);
            }
        }.bind(nuevoTexto);
        PIXI.ticker.shared.add(nuevoTexto.updateChat, nuevoTexto);

        this.addChild(nuevoTexto);
    };

    return Consola;
});
