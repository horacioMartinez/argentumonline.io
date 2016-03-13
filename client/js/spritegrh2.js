/**
 * Created by horacio on 3/10/16.
 */

// TODO: SPRITEGRH QUE HEREDE DE MOVIECLIP

define(['lib/pixi'], function (PIXI) {

    function SpriteGrh(grh,loops) {
        this._grh = grh;
        this.velocidadModificada = false;
        this.animacion = false;
        if (grh.frames){
            this.animacion = true;
            PIXI.extras.MovieClip.call(this,grh.frames);
            this._setSpeed();
        }
        PIXI.extras.MovieClip.call(this);

    }

    SpriteGrh.prototype = Object.create(PIXI.extras.MovieClip);
    SpriteGrh.constructor = SpriteGrh;

    SpriteGrh.prototype._setSpeed = function () {
        var duracion;
        if (this._velocidadSeteada) {
            duracion = this._velocidadSeteada;
        }
        else {
            duracion = this._grh.velocidad;
        }
        var fps = (this._grh.frames.length / duracion) * 1000;
        this.animationSpeed = fps / 60;
    };

    SpriteGrh.prototype.setSpeed = function () {
        if (this._grh.frames) {
            this._setSpeed();
        }
    };


    return SpriteGrh;
});