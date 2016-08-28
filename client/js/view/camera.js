define(['enums'], function (Enums) {

    class Camera {
        constructor(tilesize) {
            this.DEFAULT_EXTRA_POSITIONS = {
                norte: 0,
                sur: 0,
                este: 0,
                oeste: 0
            };

            this.tilesize = tilesize;
            this.x = 0;
            this.y = 0;
            this.gridX = 0;
            this.gridY = 0;

            this.gridW = 17;
            this.gridH = 13;

            this.height = this.gridH * this.tilesize;
            this.width = this.gridW * this.tilesize;
        }

        get centerPosX() {
            return this.x + (Math.floor(this.gridW / 2) * this.tilesize);
        }

        get centerPosY() {
            return this.y + (Math.floor(this.gridH / 2) * this.tilesize);
        }

        get centerGridX() {
            return this.gridX + Math.floor(this.gridW / 2);
        }

        get centerGridY() {
            return this.gridY + Math.floor(this.gridH / 2);
        }

        setPosition(x, y) {
            this.x = x;
            this.y = y;

            this.gridX = Math.floor(x / this.tilesize);
            this.gridY = Math.floor(y / this.tilesize);
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

        forEachVisiblePosition(callback, extraPositions) {
            extraPositions = extraPositions || this.DEFAULT_EXTRA_POSITIONS;

            let extraXEste = extraPositions.este,
                extraXOeste = extraPositions.oeste,
                extraYSur = extraPositions.sur,
                extraYNorte = extraPositions.norte;

            var gridIniY = this.gridY - extraYNorte;
            var maxY = this.gridY + this.gridH + extraYSur;
            var gridiniX = this.gridX - extraXOeste;
            var maxX = this.gridX + this.gridW + extraXEste;

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

        forEachVisibleNextLinea(direccion, callback, extraPositions, offsetX, offsetY) { // x,y en la proxima "linea" del grid en la direccion direccion
            extraPositions = extraPositions || this.DEFAULT_EXTRA_POSITIONS;

            let extraXEste = extraPositions.este,
                extraXOeste = extraPositions.oeste,
                extraYSur = extraPositions.sur,
                extraYNorte = extraPositions.norte;

            offsetX = offsetX || 0;
            offsetY = offsetY || 0;

            var cameraGridX = this.gridX + offsetX;
            var cameraGridY = this.gridY + offsetY;

            var topGridY = cameraGridY - extraYNorte;
            var botGridY = cameraGridY + this.gridH - 1 + extraYSur;
            var izqGridX = cameraGridX - extraXOeste;
            var derGridX = cameraGridX + this.gridW - 1 + extraXEste;

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
                    topGridY -= 1;
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
                    throw new Error("Heading invalido");
            }
        }

        forEachVisibleLastLinea(direccion, callback, extraPositions) {
            let dirInversa;
            let offsetY = 0;
            let offsetX = 0; //offset para dar la ultima de las visible, no la anterior ("next") a la ultima visibles
            switch (direccion) {
                case Enums.Heading.oeste:
                    dirInversa = Enums.Heading.este;
                    offsetX = -1;
                    break;
                case Enums.Heading.este:
                    dirInversa = Enums.Heading.oeste;
                    offsetX = 1;
                    break;
                case Enums.Heading.norte:
                    dirInversa = Enums.Heading.sur;
                    offsetY = -1;
                    break;
                case Enums.Heading.sur:
                    dirInversa = Enums.Heading.norte;
                    offsetY = 1;
                    break;
            }
            this.forEachVisibleNextLinea(dirInversa, callback, extraPositions, offsetX, offsetY);
        }

        isVisiblePosition(gridX, gridY, extraPositions) {
            extraPositions = extraPositions || this.DEFAULT_EXTRA_POSITIONS;

            let extraXEste = extraPositions.este,
                extraXOeste = extraPositions.oeste,
                extraYSur = extraPositions.sur,
                extraYNorte = extraPositions.norte;
            if ((gridY >= (this.gridY - extraYNorte) ) && (gridY < (this.gridY + this.gridH + extraYSur))
                && (gridX >= (this.gridX - extraXOeste) ) && ( gridX < (this.gridX + this.gridW + extraXEste))) {
                return true;
            } else {
                return false;
            }
        }

        rectVisible(rect, extraPositions) { // eje x,y en esquina izquierda superior de rect
            extraPositions = extraPositions || this.DEFAULT_EXTRA_POSITIONS;

            return !((this.x > rect.x + rect.width + +extraPositions.oeste * this.tilesize ) ||
            (this.x + this.width + extraPositions.este * this.tilesize < rect.x) ||
            (this.y > rect.y + rect.height + extraPositions.oeste * this.tilesize) ||
            (this.y + this.height + extraPositions.sur * this.tilesize < rect.y));
        }

        focusEntity(entity) {
            var x = Math.round(entity.x - (Math.floor(this.gridW / 2) * this.tilesize)),
                y = Math.round(entity.y - (Math.floor(this.gridH / 2) * this.tilesize));
            this.setPosition(x, y);
        }
    }

    return Camera;
});
