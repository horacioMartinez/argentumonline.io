/**
 * Created by horacio on 3/14/16.
 */

define(['lib/pixi'], function (PIXI) {

    function ContainerOrdenado(mapWidth) {
        PIXI.Container.call(this);
        this._mapWidth = mapWidth;

    }

    ContainerOrdenado.prototype = Object.create(PIXI.Container.prototype);
    ContainerOrdenado.constructor = ContainerOrdenado;

    ContainerOrdenado.prototype.addChild = function (spriteGrh) {
        var self = this;
        spriteGrh.setGridPositionChangeCallback(function () {
            self._ordenarChild(this);
        });
        PIXI.Container.prototype.addChild.call(this, spriteGrh);
        //this._ordenarChild(spriteGrh);
    };

    ContainerOrdenado.prototype._ordenarChild = function (hijo) {
        var gridX = Math.round(hijo.x / 32);
        var gridY = Math.round(hijo.y / 32);
        hijo.zIndex = gridY * (this._mapWidth + 1) + ((this._mapWidth + 1) - gridX) + (hijo.zOffset || 0);

        this._reordenarTodo();
    };

    ContainerOrdenado.prototype._reordenarTodo = function () { // TODO: no ordenar cada vez, sino insertar con una busqueda binaria

        this.children.sort(function (a, b) {
            a.zIndex = a.zIndex || 0;
            b.zIndex = b.zIndex || 0;
            return a.zIndex - b.zIndex;
        });
    };

    return ContainerOrdenado;
});