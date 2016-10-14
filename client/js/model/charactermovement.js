/**
 * Created by horacio on 8/22/16.
 */

define(['transition', 'lib/pixi', 'enums'], function (Transition, PIXI, Enums) {

    class CharacterMovement {

        constructor(character) {
            this.movementTransition = new Transition();
            this.character = character;
        }

        update(delta){
            if (this.estaMoviendose()) {
                this.movementTransition.step(delta);
            }
        }

        mover(dir, movimientoCallback, finMovimientoCallback) {
            switch (dir) {  // Se setea la pos del grid nomas porque la (x,y) la usa para la animacion el character ( y la va actualizando)
                case  Enums.Heading.oeste:
                    this.character.setGridPositionOnly(this.character.gridX - 1, this.character.gridY);
                    break;
                case  Enums.Heading.este:
                    this.character.setGridPositionOnly(this.character.gridX + 1, this.character.gridY);
                    break;
                case  Enums.Heading.norte:
                    this.character.setGridPositionOnly(this.character.gridX, this.character.gridY - 1);
                    break;
                case  Enums.Heading.sur:
                    this.character.setGridPositionOnly(this.character.gridX, this.character.gridY + 1);
                    break;
                default:
                    throw new Error(" Direccion de movimiento invalida!");
            }

            this.resetMovement();
            this.character.heading = dir;
            this._crearMovimiento(movimientoCallback, finMovimientoCallback);
        }

        _crearMovimiento(callback_mov, finMovimientoCallback) {
            var self = this;
            var distPrimerFrame = 0;

            if (self.character.heading === Enums.Heading.oeste) {
                self.movementTransition.start(
                    function (x) {
                        self.character.setPosition(x, self.character.y);
                        if (callback_mov) {
                            callback_mov(self.character.x, self.character.y);
                        }
                    },
                    function () {
                        self.character.setPosition(self.movementTransition.endValue, self.character.y);
                        if (callback_mov) {
                            callback_mov(self.character.x, self.character.y);
                        }
                        if (finMovimientoCallback) {
                            finMovimientoCallback();
                        }
                    },
                    self.character.x - distPrimerFrame,
                    self.character.x - 32,
                    self.character.moveSpeed);
            }
            else if (self.character.heading === Enums.Heading.este) {
                self.movementTransition.start(
                    function (x) {
                        self.character.setPosition(x, self.character.y);
                        if (callback_mov) {
                            callback_mov(self.character.x, self.character.y);
                        }
                    },
                    function () {
                        self.character.setPosition(self.movementTransition.endValue, self.character.y);
                        if (callback_mov) {
                            callback_mov(self.character.x, self.character.y);
                        }
                        if (finMovimientoCallback) {
                            finMovimientoCallback();
                        }
                    },
                    self.character.x + distPrimerFrame,
                    self.character.x + 32,
                    self.character.moveSpeed);
            }
            else if (self.character.heading === Enums.Heading.norte) {
                self.movementTransition.start(
                    function (y) {
                        self.character.setPosition(self.character.x, y);
                        if (callback_mov) {
                            callback_mov(self.character.x, self.character.y);
                        }
                    },
                    function () {
                        self.character.setPosition(self.character.x, self.movementTransition.endValue);
                        if (callback_mov) {
                            callback_mov(self.character.x, self.character.y);
                        }
                        if (finMovimientoCallback) {
                            finMovimientoCallback();
                        }
                    },
                    self.character.y - distPrimerFrame,
                    self.character.y - 32,
                    self.character.moveSpeed);
            }
            else if (self.character.heading === Enums.Heading.sur) {
                self.movementTransition.start(
                    function (y) {
                        self.character.setPosition(self.character.x, y);
                        if (callback_mov) {
                            callback_mov(self.character.x, self.character.y);
                        }
                    },
                    function () {
                        self.character.setPosition(self.character.x, self.movementTransition.endValue);
                        if (callback_mov) {
                            callback_mov(self.character.x, self.character.y);
                        }
                        if (finMovimientoCallback) {
                            finMovimientoCallback();
                        }
                    },
                    self.character.y + distPrimerFrame,
                    self.character.y + 32,
                    self.character.moveSpeed);
            }
        }


        estaMoviendose(){
            return this.movementTransition.inProgress;
        }


        resetMovement() {
            if (this.estaMoviendose()) {
                this.movementTransition.stop();
                if (this.movementTransition.stopFunction) {
                    this.movementTransition.stopFunction();
                }
            }
        }

    }

    return CharacterMovement;
});