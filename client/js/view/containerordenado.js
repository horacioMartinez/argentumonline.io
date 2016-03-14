/**
 * Created by horacio on 3/14/16.
 */

define(['lib/pixi'], function (PIXI) {

    function ContainerOrdenado() {
        PIXI.Container.call(this);

    }

    ContainerOrdenado.prototype = Object.create(PIXI.Container.prototype);
    ContainerOrdenado.constructor = ContainerOrdenado;

    ContainerOrdenado.prototype.addChild= function (spriteGrh) {
        var self = this;
        spriteGrh.setPositionChangeCallback( function(){
            self._ordenarChild(this);
        });
        PIXI.Container.prototype.addChild.call(this,spriteGrh);
        //this._ordenarChild(spriteGrh);
    };

    ContainerOrdenado.prototype._ordenarChild= function (hijo) {
        var gridX = Math.round(hijo.x / 32);
        var gridY = Math.round(hijo.y / 32);
        hijo.zIndex = (gridY * 1000 + (101 - gridX));
        this._reordenarTodo(); // todo <- busqueda bin y insercion
    };

    ContainerOrdenado.prototype._reordenarTodo= function () { // TODO (IMPORTANTE): no ordenar cada vez, sino insertar con una busqueda binaria, fijarse los z = (gridY * 1000 + (101-gridX)); hardcodeados en charsprites y spritegrh
        this.children.sort(function (a, b) {
            a.zIndex = a.zIndex || 0;
            b.zIndex = b.zIndex || 0;
            return a.zIndex - b.zIndex
        });
    };


    return ContainerOrdenado;
});