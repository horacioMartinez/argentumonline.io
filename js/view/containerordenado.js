/**
 * Created by horacio on 3/14/16.
 */

import * as PIXI from 'pixi.js';

class ContainerOrdenado extends PIXI.Container {
    constructor(mapWidth) {
        super();
        this._mapWidth = mapWidth;
    }

    addChild(spriteGrh) {
        const self = this;
        spriteGrh.setGridPositionChangeCallback(function () {
            self._ordenarChild(this);
        });
        super.addChild(spriteGrh);
        //this._ordenarChild(spriteGrh);
    }

    _ordenarChild(hijo) {
        const gridX = Math.round(hijo.x / 32);
        const gridY = Math.round(hijo.y / 32);
        hijo.zIndex = gridY * (this._mapWidth + 1) + ((this._mapWidth + 1) - gridX) + (hijo.zOffset || 0);

        this._reordenarTodo();
    }

    _reordenarTodo() { // TODO: no ordenar cada vez, sino insertar con una busqueda binaria
        this.children.sort(function (a, b) {
            a.zIndex = a.zIndex || 0;
            b.zIndex = b.zIndex || 0;
            return a.zIndex - b.zIndex;
        });
    }
}

export default ContainerOrdenado;