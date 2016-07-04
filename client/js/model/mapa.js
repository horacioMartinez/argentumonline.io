define([], function () {
    class Mapa {
        constructor(numMap, data) {
            this.numero = numMap;
            this.data = data;
            this.isLoaded = false;
            this.height = 100;
            this.width = 100;
        }

        mapaOutdoor() {
            return this.data.outdoor;
        }

        isBlocked(gridX, gridY) {
            return this.data.layers[gridX - 1][gridY - 1][0];
        }

        hayAgua(gridX, gridY) {
            var grh1 = this.getGrh1(gridX, gridY);
            var grh2 = this.getGrh2(gridX, gridY);

            if (grh2)
                return false;
            if ((grh1 >= 1505) && (grh1 <= 1520))
                return true;
            if ((grh1 >= 5665) && (grh1 <= 5680))
                return true;
            if ((grh1 >= 5665) && (grh1 <= 5680))
                return true;
            if ((grh1 >= 13547) && (grh1 <= 13562))
                return true;
            return false;
        }

        setBlockPosition(gridX, gridY, blocked) {
            if (blocked)
                this.data.layers[gridX - 1][gridY - 1][0] = 1;
            else
                this.data.layers[gridX - 1][gridY - 1][0] = 0;
        }

        getGrh(numGrh, gridX, gridY) {
            if (this.data.layers[gridX - 1] &&
                this.data.layers[gridX - 1][gridY - 1] &&
                this.data.layers[gridX - 1][gridY - 1][numGrh]) {
                return this.data.layers[gridX - 1][gridY - 1][numGrh];
            }
            return 0;
        }

        getGrh1(gridX, gridY) { //devuelve indice de grafico de la primer lagridYer
            return this.getGrh(1,gridX,gridY);
        }

        getGrh2(gridX, gridY) {
            return this.getGrh(2,gridX,gridY);
        }

        getGrh3(gridX, gridY) {
            return this.getGrh(3,gridX,gridY);
        }

        getGrh4(gridX, gridY) {
            return this.getGrh(4,gridX,gridY);
        }

        isBajoTecho(gridX, gridY) {
            if (this.data.layers[gridX - 1][gridY - 1][5])
                return true;
            else
                return false;
        }

        isOutOfBounds(gridX, gridY) {
            return (gridX < 0 || gridX >= this.width || gridY < 0 || gridY >= this.height);
        }
    }

    return Mapa;
});
