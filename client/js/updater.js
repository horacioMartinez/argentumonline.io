define(['character', 'player', 'timer', 'enums'], function (Character, Player, Timer) {

    var Updater = Class.extend({
        init: function (game) {
            this.game = game;
        },

        update: function () { // TODO:usar pixi ticker o: no hace falta esto, usar directamente callbacks y para los timers algo como https://github.com/Nazariglez/pixi-timer/commits/master
            if (this.game.logeado) {
                this.updateCharacters();
                this.updateInfos();
            }
        },

        updateCharacters: function () { // TODO: un callback asi no hay que estar checkeando en cada uno...
            var self = this;
            this.game.forEachCharacter(function (char) {
                if (self.game.renderer.entityEnRangoVisible(char)) {
                    self.updateMovimientoCharacter(char);
                    self.updateEntityFading(char);
                    self.updateCharTransitions(char);
                }
            });
        },

        updateEntityFading: function (entity) {
            if (entity && entity.isFading) {
                var duration = 1000,
                    t = this.game.currentTime,
                    dt = t - entity.startFadingTime;

                if (dt > duration) {
                    this.isFading = false;
                    entity.fadingAlpha = 1;
                } else {
                    entity.fadingAlpha = dt / duration;
                }
            }
        },

        updateCharTransitions: function (character) {
            var m = character.movement;
            if (m) {
                if (m.inProgress) {
                    m.step(this.game.currentTime);
                }
            }
        },

        updateMovimientoCharacter: function (c) { // todo: hacer una diferente para player y sacarse de encima los instanceof
            if (c.moviendose && c.movement.inProgress === false) {
                if (!c.tratarDeCaminar())
                    return;
                //mover
                if (c instanceof Player)
                    this.updateRendererComenzarMov(c.getDirMov());

                c.animarMovimiento();

                var self = this;
                var tick = Math.round(32 / Math.round((c.moveSpeed / (1000 / 60))));

                if (c.getDirMov() === Enums.Heading.oeste) {

                    c.movement.start(this.game.currentTime,
                        function (x) {
                            c.setPosition(x, c.y);
                            if (c instanceof Player)
                                self.updateRendererPos(c.x, c.y);
                        },
                        function () {
                            c.setPosition(c.movement.endValue,  c.y);
                            c.hasMoved();
                            if (c instanceof Player)
                                self.updateRendererPos(c.x, c.y);
                        },
                        c.x - tick,
                        c.x - 32,
                        c.moveSpeed);
                }
                else if (c.getDirMov() === Enums.Heading.este) {
                    c.movement.start(this.game.currentTime,
                        function (x) {
                            c.setPosition(x, c.y);
                            if (c instanceof Player)
                                self.updateRendererPos(c.x, c.y);
                        },
                        function () {
                            c.setPosition(c.movement.endValue,  c.y);
                            c.hasMoved();
                            if (c instanceof Player)
                                self.updateRendererPos(c.x, c.y);
                        },
                        c.x + tick,
                        c.x + 32,
                        c.moveSpeed);
                }
                else if (c.getDirMov() === Enums.Heading.norte) {
                    c.movement.start(this.game.currentTime,
                        function (y) {
                            c.setPosition(c.x, y);
                            if (c instanceof Player)
                                self.updateRendererPos(c.x, c.y);
                        },
                        function () {
                            c.setPosition(c.x, c.movement.endValue);
                            c.hasMoved();
                            if (c instanceof Player)
                                self.updateRendererPos(c.x, c.y);
                        },
                        c.y - tick,
                        c.y - 32,
                        c.moveSpeed);
                }
                else if (c.getDirMov() === Enums.Heading.sur) {
                    c.movement.start(this.game.currentTime,
                        function (y) {
                            c.setPosition(c.x, y);
                            if (c instanceof Player)
                                self.updateRendererPos(c.x, c.y);
                        },
                        function () {
                            c.setPosition(c.x, c.movement.endValue);
                            c.hasMoved();
                            if (c instanceof Player)
                                self.updateRendererPos(c.x, c.y);
                        },
                        c.y + tick,
                        c.y + 32,
                        c.moveSpeed);
                }
            }
        },

        updateRendererComenzarMov: function (dir) {
            this.game.renderer._updateTilesMov(dir);
        },

        updateRendererPos: function (x, y) {
            this.game.renderer.moverPosition(x - this.game.renderer.camera.centerPosX, y - this.game.renderer.camera.centerPosY);
        },

        updateKeyboardMovement: function () {
            if (!this.game.player || this.game.player.isMoving())
                return;

            var game = this.game;
            var player = this.game.player;

            var pos = {
                x: player.gridX,
                y: player.gridY
            };

            if (player.moveUp) {
                pos.y -= 1;
                game.keys(pos, Types.Orientations.UP);
            }
            else if (player.moveDown) {
                pos.y += 1;
                game.keys(pos, Types.Orientations.DOWN);
            }
            else if (player.moveRight) {
                pos.x += 1;
                game.keys(pos, Types.Orientations.RIGHT);
            }
            else if (player.moveLeft) {
                pos.x -= 1;
                game.keys(pos, Types.Orientations.LEFT);
            }

        },

        updateAnimations: function () {
            var t = this.game.currentTime;

            this.game.forEachAnimatedEntity(function (entity) {
                var anim = entity.currentAnimation;

                if (anim) {
                    if (anim.update(t)) {
                        entity.setDirty();
                    }
                }
            });

            var sparks = this.game.sparksAnimation;
            if (sparks) {
                sparks.update(t);
            }

            var target = this.game.targetAnimation;
            if (target) {
                target.update(t);
            }
        },

        updateInfos: function () {
            var t = this.game.currentTime;

            this.game.infoManager.update(t);
        }
    });

    return Updater;
});
