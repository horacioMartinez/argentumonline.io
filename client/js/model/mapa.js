define([], function () {
    class Mapa {
        constructor(numMap, data) {
            this.numero = numMap;
            this.data = data;
            this.isLoaded = true; // <- modificar al hacerlo asincronico
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

        getGrh1(gridX, gridY) { //devuelve indice de grafico de la primer lagridYer
            if (this.data.layers[gridX - 1])
                if (this.data.layers[gridX - 1][gridY - 1])
                    if (this.data.layers[gridX - 1][gridY - 1][1])
                        return this.data.layers[gridX - 1][gridY - 1][1];
            return 0;
        }

        getGrh2(gridX, gridY) {
            if (this.data.layers[gridX - 1])
                if (this.data.layers[gridX - 1][gridY - 1])
                    if (this.data.layers[gridX - 1][gridY - 1][2])
                        return this.data.layers[gridX - 1][gridY - 1][2];
            return 0;
        }

        getGrh3(gridX, gridY) {
            if (this.data.layers[gridX - 1])
                if (this.data.layers[gridX - 1][gridY - 1])
                    if (this.data.layers[gridX - 1][gridY - 1][3])
                        return this.data.layers[gridX - 1][gridY - 1][3];
            return 0;
        }

        getGrh4(gridX, gridY) {
            if (this.data.layers[gridX - 1])
                if (this.data.layers[gridX - 1][gridY - 1])
                    if (this.data.layers[gridX - 1][gridY - 1][4])
                        return this.data.layers[gridX - 1][gridY - 1][4];
            return 0;
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
