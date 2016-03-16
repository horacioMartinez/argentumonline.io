/**
 * Created by horacio on 3/10/16.
 */

define(['lib/pixi'], function (PIXI) {

    function SpriteGrh(grh, cantLoops) {

        this._velocidadSeteada = false;

        if (grh.frames) { //grh animado
            PIXI.extras.MovieClip.call(this, grh.frames);
            this._setSpeed(grh.velocidad);
            if (!cantLoops)
                this.play();
        }
        else {
            var aux = [];
            aux.push(grh);
            PIXI.extras.MovieClip.call(this, aux);
        }
        if (cantLoops)
            this.loop = false;
        this.onComplete = function () {
            this.gotoAndStop(0);
        };

        this._posicionarGrafico();
    }

    SpriteGrh.constructor = SpriteGrh;
    SpriteGrh.prototype = Object.create(PIXI.extras.MovieClip.prototype);

    SpriteGrh.prototype.play = function () {
        if (this.textures.length > 1)
            PIXI.extras.MovieClip.prototype.play.call(this);
    };

    SpriteGrh.prototype._setSpeed = function (velocidad) {
        var duracion;
        if (this._velocidadSeteada) {
            duracion = this._velocidadSeteada;
        }
        else {
            duracion = velocidad;
        }
        var fps = (this.textures.length / duracion) * 1000;
        this.animationSpeed = fps / 60;
    };

    SpriteGrh.prototype.setSpeed = function (vel) {
        this._velocidadSeteada = vel;
        this._setSpeed();
    };

    SpriteGrh.prototype.setPositionChangeCallback = function (callback) {
        this._onSetPosition = callback;
    };

    SpriteGrh.prototype.setPosition = function (x,y) {
        this.x = x;
        this.y = y;
        if (this._onSetPosition)
            this._onSetPosition();
    };


    SpriteGrh.prototype.setSize = function (w,h) {
        this.width = w;
        this.height = h;
        this._posicionarGrafico();
    };

    SpriteGrh.prototype._posicionarGrafico = function () {
        var x = ( (this.width - 32) / 2 ) / this.width;
        var y = (this.height - 32) / this.height;
        this.anchor.set(x, y);
    };

    SpriteGrh.prototype.cambiarGrh = function (grh) {
        if (!grh) {
            this.visible = false;
            this.gotoAndStop(0);
            return;
        }
        this.visible = true;
        if (grh.frames) { //grh animado
            this.textures = grh.frames;
            this._setSpeed(grh.velocidad);
            if (this.loop)
                this.play();
        }
        else {
            var aux = [];
            aux.push(grh);
            this.textures = aux;
        }
        this.gotoAndStop(0);
        this._posicionarGrafico();
        if (grh.frames && this.loop)
            this.play();
    };

    return SpriteGrh;
});