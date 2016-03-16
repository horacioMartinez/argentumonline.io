define([], function () {

    var Camera = Class.extend({
        init: function (tilesize) {
            this.tilesize = tilesize;
            this.x = 0;
            this.y = 0;
            this.centerPosX = 0;
            this.centerPosY = 0;
            this.gridX = 0;
            this.gridY = 0;
            this.offset = 0.5;

            this.gridW = 17;
            this.gridH = 13;
        },

        getHeight: function () {
            return this.gridH * this.tilesize;
        },

        getWidth: function () {
            return this.gridW * this.tilesize;
        },

        setPosition: function (x, y) {
            this.x = x;
            this.y = y;

            this.gridX = Math.floor(x / this.tilesize);
            this.gridY = Math.floor(y / this.tilesize);

            this.centerPosX = this.x + (Math.floor(this.gridW / 2) * this.tilesize);
            this.centerPosY = this.y + (Math.floor(this.gridH / 2) * this.tilesize);
        },

        setGridPosition: function (gridX, gridY) {
            this.setPosition(gridX * this.tilesize, gridY * this.tilesize);
        },

        lookAtGridPos: function (gridX, gridY) {
            this.setGridPosition(gridX - Math.floor(this.gridW / 2), gridY - Math.floor(this.gridH / 2));
        },

        mover: function (x, y) {
            this.setPosition(this.x + x, this.y + y);
        },

        posFueraDeMapa: function (gridX, gridY) { //esto deberia estar en el mapa y blabhblahblah
            if (((gridX > 100) || (gridX < 1)) || ((gridY > 100) || (gridY < 1)))
                return true;
        },

        forEachVisiblePosition: function (callback, extraX, extraY) { // TODO: poner mas extra en el eje y?
            var extraX = extraX || 0;
            var extraY = extraY || 0;
            var gridIniY = this.gridY;
            var maxY = this.gridY + this.gridH + extraY;
            var gridiniX = this.gridX - extraX;
            var maxX = this.gridX + this.gridW + extraX;
            if (gridIniY < 1)
                gridIniY = 1;
            if (maxY > 100)
                maxY = 100;
            if (gridiniX < 1)
                gridiniX = 1;
            if (maxX > 100)
                maxX = 100;
            for (; gridIniY < maxY; gridIniY += 1) {
                for (var gX = gridiniX; gX < maxX; gX += 1) {
                    callback(gX, gridIniY);
                }
            }
        },

        forEachVisibleNextLinea: function (callback, direccion) { // x,y en la proxima "linea" del grid en la direccion direccion
            var topGridY = this.gridY;
            var botGridY = this.gridY + this.gridH;
            var izqGridX = this.gridX;
            var derGridX = this.gridX + this.gridW;

            if (topGridY < 1)
                topGridY = 1;
            if (botGridY > 100)
                botGridY = 100;
            if (izqGridX < 1)
                izqGridX = 1;
            if (derGridX > 100)
                derGridX = 100;

            switch (direccion) {
                case Enums.Heading.este:
                    izqGridX -= 1;
                    if (izqGridX < 1)
                        izqGridX = 1;
                    for (var y = topGridY; y < botGridY; y++)
                        callback(izqGridX, y);
                    break;
                case Enums.Heading.oeste:
                    derGridX += 1;
                    if (derGridX > 100)
                        derGridX = 100;
                    for (var y = topGridY; y < botGridY; y++)
                        callback(derGridX, y);
                    break;
                case Enums.Heading.sur:
                    topGridY -= 1;
                    if (topGridY < 1)
                        topGridY = 1;
                    for (var x = izqGridX; x < derGridX; x++)
                        callback(x, topGridY);
                    break;
                case Enums.Heading.norte:
                    botGridY += 1;
                    if (botGridY > 100)
                        botGridY = 100;
                    for (var x = izqGridX; x < derGridX; x++)
                        callback(x, botGridY);
                    break;
                default:
                    log.error("Heading invalido");
            }
        },

        isVisiblePosition: function (gridX, gridY, extraX, extraY) {
            if (gridY >= this.gridY && gridY < (this.gridY + this.gridH + extraY)
                && gridX >= (this.gridX - extraX) && gridX < (this.gridX + this.gridW + extraX)) {
                return true;
            } else {
                return false;
            }
        },

        focusEntity: function (entity) {
            /*    var w = this.gridW - 2,
             h = this.gridH - 2,
             x = Math.floor((entity.gridX - 1) / w) * w,
             y = Math.floor((entity.gridY - 1) / h) * h;

             this.setGridPosition(x, y);*/

            var x = Math.round(entity.x - (Math.floor(this.gridW / 2) * this.tilesize)),
                y = Math.round(entity.y - (Math.floor(this.gridH / 2) * this.tilesize));
            this.setPosition(x, y);
        }
    });

    return Camera;
});
