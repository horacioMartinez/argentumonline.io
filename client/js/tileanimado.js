define(['animacion'], function (Animacion) {

    var TileAnimado = Animacion.extend({
        init: function (frames, velocidad, gridX, gridY, layer) {
            this._super(frames,velocidad);
            this.gridX = gridX;
            this.gridY = gridY;
            this.x = gridX*32;
            this.y = gridY*32;
            this.numLayer = layer;
        }
    });

    return TileAnimado;
});