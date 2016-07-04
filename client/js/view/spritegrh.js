/**
 * Created by horacio on 3/10/16.
 */

define(['lib/pixi'], function (PIXI) {

    function SpriteGrh(grh, cantLoops) {

        this._velocidadSeteada = false;
        this._playedLoops = 0;
        this._cantLoops = cantLoops || 0;
        this._realOnComplete = null;

        if (grh.frames) { //grh animado
            PIXI.extras.MovieClip.call(this, grh.frames);
            this._setSpeed(grh.velocidad);
            if (!cantLoops) {
                this.play();
            }
        } else {
            var aux = [];
            aux.push(grh);
            PIXI.extras.MovieClip.call(this, aux);
        }
        if (cantLoops) {
            this.loop = false;
        }

        var self = this;
        this.onComplete = function () {
            if (self._playedLoops < self._cantLoops) {
                self._playedLoops++;
                self.gotoAndStop(0);
                self._play();
            } else {
                self.gotoAndStop(0);
                if (this._realOnComplete){
                    this._realOnComplete();
                }
            }
        };

        this._posicionarGrafico();
    }

    SpriteGrh.constructor = SpriteGrh;
    SpriteGrh.prototype = Object.create(PIXI.extras.MovieClip.prototype);

    SpriteGrh.prototype.play = function () {
        if (this.textures.length > 1) {
            this._playedLoops = 1;
            this._play();
        }
    };

    SpriteGrh.prototype._play = function () {
        PIXI.extras.MovieClip.prototype.play.call(this);
    };

    SpriteGrh.prototype.setOnComplete = function (cb) {
        this._realOnComplete = cb;
    };

    SpriteGrh.prototype._setSpeed = function (velocidad) {
        var duracion;
        if (this._velocidadSeteada) {
            duracion = this._velocidadSeteada;
        } else {
            duracion = velocidad;
        }
        var fps = (this.textures.length / duracion) * 1000;
        this.animationSpeed = fps / 60;
    };

    SpriteGrh.prototype.setSpeed = function (vel) {
        this._velocidadSeteada = vel;
        this._setSpeed();
    };

    SpriteGrh.prototype.setGridPositionChangeCallback = function (callback) {
        this._onGridPositionChange = callback;
    };

    SpriteGrh.prototype.setPosition = function (x, y) {
        this.x = x;
        this.y = y;
        var gridX = Math.round(x / 32);
        var gridY = Math.round(y / 32);
        if ((gridX !== this._gridX) || (gridY !== this._gridY)) {
            this._gridX = gridX;
            this._gridY = gridY;
            if (this._onGridPositionChange) {
                this._onGridPositionChange();
            }
        }
    };

    SpriteGrh.prototype.setSize = function (w, h) {
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
        //temporal
        if (this._grh === grh) {
            return;
        } else {
            this._grh = grh;
        }
        //<<temporal
        if (!grh) {
            this.gotoAndStop(0);
            return;
        }
        if (grh.frames) { //grh animado
            this.textures = grh.frames;
            this._setSpeed(grh.velocidad);
        } else {
            var aux = [];
            aux.push(grh);
            this.textures = aux;
        }
        this.gotoAndStop(0);
        this._posicionarGrafico();
        if (grh.frames && this.loop) {
            this.play();
        }
    };

    return SpriteGrh;
});