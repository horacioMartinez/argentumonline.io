define([],
    function () {
        /*Function HayAgua(ByVal X As Integer, ByVal Y As Integer) As Boolean
         HayAgua = ((MapData(X, Y).Graphic(1).GrhIndex >= 1505 And MapData(X, Y).Graphic(1).GrhIndex <= 1520) Or _
         (MapData(X, Y).Graphic(1).GrhIndex >= 5665 And MapData(X, Y).Graphic(1).GrhIndex <= 5680) Or _
         (MapData(X, Y).Graphic(1).GrhIndex >= 13547 And MapData(X, Y).Graphic(1).GrhIndex <= 13562)) And _
         MapData(X, Y).Graphic(2).GrhIndex = 0

         End Function
         */

        var Mapa = Class.extend({
            init: function (numMap, data) {
                this.numero = numMap;
                this.data = data;
                this.isLoaded = true; // <- modificar al hacerlo asincronico
                this.height = 100; // primer linea en x y en y llena de 0s...
                this.width = 100;
            },

            getLayer: function(gridX,gridY,numLayer){
                return this.data[gridX -1][gridY -1][numLayer];
            },

            isBlocked: function (gridX, gridY) {
                return this.data[gridX -1][gridY -1][0];
            },

            setBlockPosition: function (gridX, gridY, blocked) {
                if (blocked)
                    this.data[gridX -1][gridY -1][0] = 1;
                else
                    this.data[gridX -1][gridY -1][0] = 0;
            },

            getGrh1: function (gridX, gridY) { //devuelve indice de grafico de la primer lagridYer
                if (this.data[gridX -1][gridY -1][1])
                    return this.data[gridX -1][gridY -1][1];
                else
                    return 0;
            },

            getGrh2: function (gridX, gridY) {
                if (this.data[gridX -1][gridY -1][2])
                    return this.data[gridX -1][gridY -1][2];
                else
                return 0;
            },
            getGrh3: function (gridX, gridY) {
                if(this.data[gridX -1][gridY -1][3])
                    return this.data[gridX -1][gridY -1][3];
                else
                    return 0;
            },

            getGrh4: function (gridX, gridY) {
                if (this.data[gridX -1][gridY -1][4])
                    return this.data[gridX -1][gridY -1][4];
                else
                return 0;
            },

            isBajoTecho: function (gridX, gridY) {
                if (this.data[gridX -1][gridY -1][5])
                    return true;
                else
                    return false;
            },

            isOutOfBounds: function (gridX, gridY) {
                return isInt(gridX) && isInt(gridY) && (gridX < 0 || gridX >= this.width || gridY < 0 || gridY >= this.height);
            },
        });

        return Mapa;
    });
