define(['model/entity', 'transition', 'lib/pixi', 'enums'], function (Entity, Transition, PIXI, Enums) {

    class Character extends Entity {
        constructor(CharIndex, gridX, gridY, Heading, Name, clan) {

            super(gridX, gridY);

            var self = this;
            if (!Name) // es un bicho o npc
                this.moveSpeed = 310;// bicho (duracion de movimiento en ms, animaciones de mov se setean automaticamnete a esta vel (abajo) )
            else
                this.moveSpeed = 230; // PJ TODO: setear bien estos valores, fijarse que en lo posible no haya resetmovements (esto pasa si la animacion es mas lenta que el llamado a cambiar de pos)

            this.id = CharIndex;

            this.heading = Heading;

            this.muerto = false;
            this.movement = new Transition();
            this.sprite = null;
            this.spriteNombre = null;
            this.texto = null;
            this.nombre = Name;
            this.clan = clan;
        }

        _setHeading(heading) {
            this.heading = heading;
            this.sprite.cambiarHeading(heading);
        }

        getDirMov() {
            return this.heading;
        }

        mover(dir) {
            this.resetMovement();
            if (this.heading !== dir)
                this.cambiarHeading(dir);
            this._crearMovimiento();
        }

        _crearMovimiento(callback_mov) {
            this.animarMovimiento();

            var self = this;
            var tick = 32 / (this.moveSpeed / (1000 / 60));

            if (self.getDirMov() === Enums.Heading.oeste) {

                self.movement.start(
                    function (x) {
                        self.setPosition(x, self.y);
                        if (callback_mov)
                            callback_mov(self.x, self.y);
                    },
                    function () {
                        self.setPosition(self.movement.endValue, self.y);
                        if (callback_mov)
                            callback_mov(self.x, self.y);
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
                            callback_mov(self.x, self.y);
                    },
                    function () {
                        self.setPosition(self.movement.endValue, self.y);
                        if (callback_mov)
                            callback_mov(self.x, self.y);
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
                            callback_mov(self.x, self.y);
                    },
                    function () {
                        self.setPosition(self.x, self.movement.endValue);
                        if (callback_mov)
                            callback_mov(self.x, self.y);
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
                            callback_mov(self.x, self.y);
                    },
                    function () {
                        self.setPosition(self.x, self.movement.endValue);
                        if (callback_mov)
                            callback_mov(self.x, self.y);
                        self.hasMoved();
                    },
                    self.y + tick,
                    self.y + 32,
                    self.moveSpeed);
            }

            PIXI.ticker.shared.add(this._updateMovement, this);
        }

        _updateMovement(delta) {
            if (this.movement.inProgress) {
                this.movement.step(delta * (1 / 60) * 1000);
            }
        }

        hasMoved() { // se ejecuta al finalizar de caminar
            PIXI.ticker.shared.remove(this._updateMovement, this);
        }

        cambiarHeading(heading) {
            this._setHeading(heading);
        }

        resetMovement() {
            if (this.movement.inProgress) {
                log.error("reset movement!!!");
                this.movement.stop();
                if (this.movement.stopFunction)
                    this.movement.stopFunction();
            }
        }

        setGridPositionOnly(gridX, gridY) {
            this.gridX = gridX;
            this.gridY = gridY;
        }

        animarMovimiento() {
            if (this.sprite)
                this.sprite.play();
        }

    }

    return Character;
});