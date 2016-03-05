/**
 * Created by horacio on 3/4/16.
 */

define(['lib/pixi'], function (PIXI) {

    function SpriteGrh(texture) { // TODO: EN CAMBIO TEXTURE
        PIXI.Sprite.call(this, texture);
        if (texture) {
            this._posicionarGrafico();
        }
    }

    SpriteGrh.prototype = Object.create(PIXI.Sprite.prototype);
    SpriteGrh.constructor = SpriteGrh;

    // posicionar el grafico al medio y sobre el tile
    SpriteGrh.prototype._posicionarGrafico = function () {
        this.anchor.set(( (this.width - 32) / 2 ) / this.width, (this.height - 32) / this.height);

    };

    SpriteGrh.prototype.cambiarTexture = function (texture) { // todo: hacerlo extendiendo el define property?
        this.texture = texture;
        if (texture)
            this._posicionarGrafico();
    };

    return SpriteGrh;
});
