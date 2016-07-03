define(['model/entity', 'transition', 'lib/pixi', 'enums'], function (Entity, Transition, PIXI, Enums) {

    class Character extends Entity {
        constructor(CharIndex, gridX, gridY, Heading, Name, clan) {

            super(gridX, gridY);

            var self = this;
            if (!Name) // es un bicho o npc
                this.moveSpeed = 200;// bicho (duracion de movimiento en ms, animaciones de mov se setean automaticamnete a esta vel (abajo) )
            else
                this.moveSpeed = 230; // PJ TODO: setear bien estos valores, fijarse que en lo posible no haya resetmovements (esto pasa si la animacion es mas lenta que el llamado a cambiar de pos)

            this.id = CharIndex;

            this.heading = Heading;

            this.muerto = false;
            this.movementTransition = new Transition();
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
            var distPrimerFrame = 0 ; //32 / (this.moveSpeed / (1000 / 60));

            if (self.getDirMov() === Enums.Heading.oeste) {

                self.movementTransition.start(
                    function (x) {
                        self.setPosition(x, self.y);
                        if (callback_mov)
                            callback_mov(self.x, self.y);
                    },
                    function () {
                        self.setPosition(self.movementTransition.endValue, self.y);
                        if (callback_mov)
                            callback_mov(self.x, self.y);
                        self.hasMoved();
                    },
                    self.x - distPrimerFrame,
                    self.x - 32,
                    self.moveSpeed);
            }
            else if (self.getDirMov() === Enums.Heading.este) {
                self.movementTransition.start(
                    function (x) {
                        self.setPosition(x, self.y);
                        if (callback_mov)
                            callback_mov(self.x, self.y);
                    },
                    function () {
                        self.setPosition(self.movementTransition.endValue, self.y);
                        if (callback_mov)
                            callback_mov(self.x, self.y);
                        self.hasMoved();
                    },
                    self.x + distPrimerFrame,
                    self.x + 32,
                    self.moveSpeed);
            }
            else if (self.getDirMov() === Enums.Heading.norte) {
                self.movementTransition.start(
                    function (y) {
                        self.setPosition(self.x, y);
                        if (callback_mov)
                            callback_mov(self.x, self.y);
                    },
                    function () {
                        self.setPosition(self.x, self.movementTransition.endValue);
                        if (callback_mov)
                            callback_mov(self.x, self.y);
                        self.hasMoved();
                    },
                    self.y - distPrimerFrame,
                    self.y - 32,
                    self.moveSpeed);
            }
            else if (self.getDirMov() === Enums.Heading.sur) {
                self.movementTransition.start(
                    function (y) {
                        self.setPosition(self.x, y);
                        if (callback_mov)
                            callback_mov(self.x, self.y);
                    },
                    function () {
                        self.setPosition(self.x, self.movementTransition.endValue);
                        if (callback_mov)
                            callback_mov(self.x, self.y);
                        self.hasMoved();
                    },
                    self.y + distPrimerFrame,
                    self.y + 32,
                    self.moveSpeed);
            }

            PIXI.ticker.shared.add(this._updateMovement, this);
        }

        // TODO (MUY IMPORTANTE) reveer esto de movimientos,  usar aceleracion ? mov del player en 1 solo event

        _updateMovement(delta) {
            if (this.movementTransition.inProgress) {
                this.movementTransition.step(delta * (1 / 60) * 1000);
            }
        }

        hasMoved() { // se ejecuta al finalizar de caminar
            PIXI.ticker.shared.remove(this._updateMovement, this);
        }

        cambiarHeading(heading) {
            this._setHeading(heading);
        }

        resetMovement() {
            if (this.movementTransition.inProgress) {
                log.error("reset movementTransition!!!");
                this.movementTransition.stop();
                if (this.movementTransition.stopFunction)
                    this.movementTransition.stopFunction();
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