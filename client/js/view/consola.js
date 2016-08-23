/**
 * Created by horacio on 3/8/16.
 */

define(['font', 'lib/pixi'], function (Font, PIXI) {

    function Consola(escala) {
        PIXI.Container.call(this);
        
        this.DURACION_TEXTO = 7000;
        this.CANT_LINEAS = 7;
        
        escala = escala || 1;

        this.baseFont = $.extend({}, Font.CONSOLA_BASE_FONT);
        this.setEscala(escala);

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

    Consola.prototype.update = function (delta) {
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
            // aumento el tiempo restante de los que tienen poco asi no se van todos de una
            let tiempoRestante = this.children[i].tiempoInicial + this.DURACION_TEXTO - this._elapsedTime;
            if (tiempoRestante < this.DURACION_TEXTO/5 ){
                this.children[i].tiempoInicial += this.DURACION_TEXTO/5;
            }
        }
        this.removeChild(spriteTexto);
        spriteTexto.destroy(true);
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
