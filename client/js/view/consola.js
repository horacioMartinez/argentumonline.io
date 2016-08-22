/**
 * Created by horacio on 3/8/16.
 */

define(['font', 'lib/pixi'], function (Font, PIXI) {

    function Consola(escala) {
        PIXI.Container.call(this);
        
        this.DURACION_TEXTO = 700;
        this.CANT_LINEAS = 7;
        
        escala = escala || 1;

        this.baseFont = $.extend({}, Font.CONSOLA_BASE_FONT);
        this.setEscala(escala);
        this._initUpdater();

        this._elapsedTime = 0;
    }

    Consola.prototype = Object.create(PIXI.Container.prototype);
    Consola.constructor = Consola;

    Consola.prototype.setEscala = function (escala) {
        this.baseFont.fontSize = Math.round(Font.CONSOLA_BASE_FONT.fontSize * escala);

        for (var i = 0; i < this.children.length; i++) {
            $.extend(this.children[i].style, this.children[i].style, this.baseFont); // OJO ANDA ESTO??? TODO
            this.children[i].dirty = true;
            this.children[i].y = this.children[0].height * i;
        }
    };

    Consola.prototype._initUpdater = function () {
        PIXI.ticker.shared.add(this._update, this);
    };

    Consola.prototype.destroy = function() {
        PIXI.ticker.shared.remove(this._update, this);
        PIXI.Container.prototype.destroy.call(this);
    };

    Consola.prototype._update = function (delta) {
        this._elapsedTime += delta;

        //solo checkeo primer item porque fue el primero en aparecer
        let texto = this.children[0];
        if (!texto) {
            return;
        }
        if (texto.tiempoInicial + this.DURACION_TEXTO < this._elapsedTime) {
            this._removerTexto(texto);
        }
    };


    Consola.prototype._removerTexto = function (spriteTexto) {
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].y -= spriteTexto.height;
        }
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
        nuevoTexto.tiempoInicial = this._elapsedTime;

        this.addChild(nuevoTexto);
    };

    return Consola;
});
