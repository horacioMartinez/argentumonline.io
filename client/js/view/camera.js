define(['enums'], function (Enums) {

    class Camera {
        constructor(tilesize) {
            this.tilesize = tilesize;
            this.x = 0;
            this.y = 0;
            this.centerPosX = 0;
            this.centerPosY = 0;
            this.gridX = 0;
            this.gridY = 0;

            this.gridW = 17;
            this.gridH = 13;

            this.height = this.gridH * this.tilesize;
            this.width = this.gridW * this.tilesize;
        }

        setPosition(x, y) {
            this.x = x;
            this.y = y;

            this.gridX = Math.floor(x / this.tilesize);
            this.gridY = Math.floor(y / this.tilesize);

            this.centerPosX = this.x + (Math.floor(this.gridW / 2) * this.tilesize);
            this.centerPosY = this.y + (Math.floor(this.gridH / 2) * this.tilesize);
        }

        setGridPosition(gridX, gridY) {
            this.setPosition(gridX * this.tilesize, gridY * this.tilesize);
        }

        lookAtGridPos(gridX, gridY) {
            this.setGridPosition(gridX - Math.floor(this.gridW / 2), gridY - Math.floor(this.gridH / 2));
        }

        mover(x, y) {
            this.setPosition(this.x + x, this.y + y);
        }

        posFueraDeMapa(gridX, gridY) { //esto deberia estar en el mapa y blabhblahblah
            if (((gridX > 100) || (gridX < 1)) || ((gridY > 100) || (gridY < 1))) {
                return true;
            }
        }

        forEachVisiblePosition(callback, extraX, extraY) { // TODO: poner mas extra en el eje y?
            extraX = extraX || 0;
            extraY = extraY || 0;
            var gridIniY = this.gridY;
            var maxY = this.gridY + this.gridH + extraY;
            var gridiniX = this.gridX - extraX;
            var maxX = this.gridX + this.gridW + extraX;
            if (gridIniY < 1) {
                gridIniY = 1;
            }
            if (maxY > 100) {
                maxY = 100;
            }
            if (gridiniX < 1) {
                gridiniX = 1;
            }
            if (maxX > 100) {
                maxX = 100;
            }
            for (; gridIniY < maxY; gridIniY++) {
                for (var gX = gridiniX; gX < maxX; gX++) {
                    callback(gX, gridIniY);
                }
            }
        }

        forEachVisibleNextLinea(direccion, callback, extraX, extraY) { // x,y en la proxima "linea" del grid en la direccion direccion
            var topGridY = this.gridY;
            var botGridY = this.gridY + this.gridH - 1 + extraY;
            var izqGridX = this.gridX - extraX;
            var derGridX = this.gridX + this.gridW - 1 + extraX;

            if (topGridY < 1) {
                topGridY = 1;
            }
            if (botGridY > 100) {
                botGridY = 100;
            }
            if (izqGridX < 1) {
                izqGridX = 1;
            }
            if (derGridX > 100) {
                derGridX = 100;
            }

            switch (direccion) {
                case Enums.Heading.oeste:
                    izqGridX -= 1;
                    if (izqGridX < 1) {
                        return;
                    }
                    for (var y = topGridY; y <= botGridY; y++) {
                        callback(izqGridX, y);
                    }
                    break;
                case Enums.Heading.este:
                    derGridX += 1;
                    if (derGridX > 100) {
                        return;
                    }
                    for (var y = topGridY; y <= botGridY; y++) {
                        callback(derGridX, y);
                    }
                    break;
                case Enums.Heading.norte:
                    topGridY -= 1; //extras en el norte se ignoran
                    if (topGridY < 1) {
                        return;
                    }
                    for (var x = izqGridX; x <= derGridX; x++) {
                        callback(x, topGridY);
                    }
                    break;
                case Enums.Heading.sur:
                    botGridY += 1;
                    if (botGridY > 100) {
                        return;
                    } // <-- ojo
                    for (var x = izqGridX; x <= derGridX; x++) {
                        callback(x, botGridY);
                    }
                    break;
                default:
                    log.error("Heading invalido");
            }
        }

        //TODO: algunos siguen quedando visibles por ir caminando en zig zag con offsets distintos
        forEachVisibleLastLinea(direccion, callback, extraX, extraY) {
            var dirInversa;
            switch (direccion) {
                case Enums.Heading.oeste:
                    dirInversa = Enums.Heading.este;
                    break;
                case Enums.Heading.este:
                    dirInversa = Enums.Heading.oeste;
                    break;
                case Enums.Heading.norte:
                    dirInversa = Enums.Heading.sur;
                    break;
                case Enums.Heading.sur:
                    dirInversa = Enums.Heading.norte;
                    break;
            }
            this.forEachVisibleNextLinea(dirInversa, callback, extraX, extraY);
        }

        isVisiblePosition(gridX, gridY, extraX, extraY) {
            extraX = extraX || 0;
            extraY = extraY || 0;
            if (gridY >= this.gridY && gridY < (this.gridY + this.gridH + extraY)
                && gridX >= (this.gridX - extraX) && gridX < (this.gridX + this.gridW + extraX)) {
                return true;
            } else {
                return false;
            }
        }

        rectVisible(rect) { // eje x,y en esquina izquierda superior de rect
            return !((this.x > rect.x + rect.width) ||
            (this.x + this.width < rect.x) ||
            (this.y > rect.y + rect.height) ||
            (this.y + this.height < rect.y));
        }

        focusEntity(entity) {
            var x = Math.round(entity.x - (Math.floor(this.gridW / 2) * this.tilesize)),
                y = Math.round(entity.y - (Math.floor(this.gridH / 2) * this.tilesize));
            this.setPosition(x, y);
        }
    }

    return Camera;
});
