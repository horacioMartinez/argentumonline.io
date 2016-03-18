define(['entity', 'transition', 'lib/pixi'], function (Entity, Transition, PIXI) {

    var Character = Entity.extend({
        init: function (CharIndex, gridX, gridY, Heading, Name, clan) {
            var self = this;

            this._super(gridX, gridY);

            if (!Name) // es un bicho o npc
                this.moveSpeed = 310;// bicho (duracion de movimiento en ms, animaciones de mov se setean automaticamnete a esta vel (abajo) )
            else
                this.moveSpeed = 230; // PJ TODO: setear bien estos valores, fijarse que en lo posible no haya resetmovements (esto pasa si la animacion es mas lenta que el llamado a cambiar de pos)

            this.id = CharIndex;

            this.heading = Heading;

            this.muerto = false;
            this.movement = new Transition();
            this.sprite = null;
            this.texto = null;
            this.nombre = Name;
            this.clan = clan;
        },

        _setHeading: function (heading) {
            this.heading = heading;
            this.sprite.cambiarHeading(heading);
        },

        getDirMov: function () {
            return this.heading;
        },

        mover: function (dir) {
            this.resetMovement();
            if (this.heading !== dir)
                this.cambiarHeading(dir);
            this._crearMovimiento();
        },

        _crearMovimiento: function (callback_mov) {
            this.animarMovimiento();

            var self = this;
            var tick = Math.round(32 / Math.round((this.moveSpeed / (1000 / 60))));

            if (self.getDirMov() === Enums.Heading.oeste) {

                self.movement.start(
                    function (x) {
                        self.setPosition(x, self.y);
                        if (callback_mov)
                            callback_mov(self.x,self.y);
                    },
                    function () {
                        self.setPosition(self.movement.endValue, self.y);
                        if (callback_mov)
                            callback_mov(self.x,self.y);
                        self.hasMoved();
                    },
                    self.x - tick,
                    self.x - 32,
                    self.moveSpeed);
            }
            else if (self.getDirMov() === Enums.Heading.este) {
                self.movement.start(
                    function (x) {
                        self.setPosition(x, self.y);
                        if (callback_mov)
                            callback_mov(self.x,self.y);
                    },
                    function () {
                        self.setPosition(self.movement.endValue, self.y);
                        if (callback_mov)
                            callback_mov(self.x,self.y);
                        self.hasMoved();
                    },
                    self.x + tick,
                    self.x + 32,
                    self.moveSpeed);
            }
            else if (self.getDirMov() === Enums.Heading.norte) {
                self.movement.start(
                    function (y) {
                        self.setPosition(self.x, y);
                        if (callback_mov)
                            callback_mov(self.x,self.y);
                    },
                    function () {
                        self.setPosition(self.x, self.movement.endValue);
                        if (callback_mov)
                            callback_mov(self.x,self.y);
                        self.hasMoved();
                    },
                    self.y - tick,
                    self.y - 32,
                    self.moveSpeed);
            }
            else if (self.getDirMov() === Enums.Heading.sur) {
                self.movement.start(
                    function (y) {
                        self.setPosition(self.x, y);
                        if (callback_mov)
                            callback_mov(self.x,self.y);
                    },
                    function () {
                        self.setPosition(self.x, self.movement.endValue);
                        if (callback_mov)
                            callback_mov(self.x,self.y);
                        self.hasMoved();
                    },
                    self.y + tick,
                    self.y + 32,
                    self.moveSpeed);
            }

            PIXI.ticker.shared.add(this._updateMovement, this);
        },

        _updateMovement: function (delta) {
            if (this.movement.inProgress) {
                this.movement.step(delta *(1/60)*1000);
            }
        },

        hasMoved: function () { // se ejecuta al finalizar de caminar
            PIXI.ticker.shared.remove(this._updateMovement, this);
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