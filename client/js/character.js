define(['entity', 'transition', 'timer', 'lib/pixi'], function (Entity, Transition, Timer, PIXI) {

    var Character = Entity.extend({
        init: function (CharIndex, gridX, gridY, Heading, Name, clan) {
            var self = this;

            this._super(gridX, gridY);

            if (!Name) // es un bicho o npc
                this.moveSpeed = 290;// bicho (duracion de movimiento en ms, animaciones de mov se setean automaticamnete a esta vel (abajo) )
            else
                this.moveSpeed = 230; // PJ TODO: setear bien estos valores, fijarse que en lo posible no haya resetmovements (esto pasa si la animacion es mas lenta que el llamado a cambiar de pos)

            this.id = CharIndex;

            this.heading = Heading;

            this.moviendose = false; // moviendose es si sigue pasando al otro tile desde el anterior

            this.muerto = false;
            this.movement = new Transition();
            this.sprite = null;
            this.texto = null;
        },

        setPosition: function (x, y) {
            this.x = x;
            this.y = y;
            if (this.onPositionChange)
                this.onPositionChange();
        },

        _setHeading: function (heading) {
            this.heading = heading;
            this.sprite.cambiarHeading(heading);
        },

        getDirMov: function () {
            return this.heading;
        },

        tratarDeCaminar: function () {
            return true;
        },

        mover: function (dir) {
            this.resetMovement();
            if (this.heading !== dir)
                this.cambiarHeading(dir);
            this.moviendose = true;
        },

        hasMoved: function () { // se ejecuta al finalizar de caminar
            this.moviendose = false;
        },

        cambiarHeading: function (heading) {
            this._setHeading(heading);
        },

        resetMovement: function () {
            if (this.movement.inProgress) {
                log.error("reset movement!!!");
                this.movement.stop();
                if (this.movement.stopFunction)
                    this.movement.stopFunction();
            }
        },

        setGridPositionOnly: function (gridX, gridY) {
            this.gridX = gridX;
            this.gridY = gridY;
        },

        animarMovimiento: function () {
            if (this.sprite)
                this.sprite.play();
        },

    });

    return Character;
});