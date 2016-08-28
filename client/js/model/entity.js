define(['enums', 'lib/pixi'], function (Enums, PIXI) {

    class Entity extends PIXI.utils.EventEmitter{
        constructor(gridX, gridY) {
            super();
            var self = this;
            this._x = null;
            this._y = null;
            this._gridX = null;
            this._gridY = null;
            this.setGridPosition(gridX, gridY);
        }

        get x(){
            return this._x;
        }

        get y(){
            return this._y;
        }

        get gridX(){
            return this._gridX;
        }

        get gridY(){
            return this._gridY;
        }

        setPosition(x, y) {
            this._x = x;
            this._y = y;
            this.emit('positionChanged');
        }

        setGridPositionOnly(gridX, gridY) {
            this._gridX = gridX;
            this._gridY = gridY;
            this.emit('gridPositionChanged');
        }
        
        setGridPosition(gridX, gridY) {
            this.setGridPositionOnly(gridX,gridY);
            this.setPosition(gridX*32,gridY*32);
        }

        esPosAdyacente(gridX, gridY) { // devulve el heading si la pos es adyacente, sino 0
            if ((gridY === this.gridY) && (gridX === this.gridX + 1 )) {
                return Enums.Heading.este;
            }
            if ((gridY === this.gridY) && (gridX === this.gridX - 1 )) {
                return Enums.Heading.oeste;
            }
            if ((gridX === this.gridX) && (gridY === this.gridY - 1 )) {
                return Enums.Heading.norte;
            }
            if ((gridX === this.gridX) && (gridY === this.gridY + 1 )) {
                return Enums.Heading.sur;
            }
            return 0;
        }
    }

    return Entity;
});
