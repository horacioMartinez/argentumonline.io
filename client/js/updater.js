define(['character', 'player', 'timer', 'enums'], function (Character, Player, Timer, Enums) {

    var Updater = Class.extend({
        init: function (game) {
            this.contadorPrimerUpdate = 0;
            this.segundoUpdateAlMover = true; // en realidad es la segunda o tercera (segun el contador)

            this.game = game;
            this.playerAggroTimer = new Timer(1000);
        },
        /* TODO: checkear bajo techo:
         bTecho = IIf(MapData(UserPos.X, UserPos.Y).Trigger = 1 Or _
         MapData(UserPos.X, UserPos.Y).Trigger = 2 Or _
         MapData(UserPos.X, UserPos.Y).Trigger = 4, True, False)
         */
        update: function () {
            if (this.game.logeado) {
                //this.updateZoning();
                this.updateItems();
                this.updateCharacters();
                this.updateRendererMov();
                //this.updatePlayerAggro();
                //this.updateAnimations();
                //this.updateAnimatedTiles();
                this.updateTilesAnimados();
                this.updateInfos();
                //this.updateKeyboardMovement();
            }
        },

        updateItems: function(){
            var self = this;
            this.game.forEachItem(function (item) {
                item.update((self.game.currentTime));
            });
        },

        updateCharacters: function () {
            var self = this;
            this.game.forEachCharacter(function (char) {
                if (self.game.renderer.entityEnRangoVisible(char)) {
                    self.updateMovimientoCharacter(char);
                    //self.game.onCharacterUpdate(entity);
                    self.updateEntityFading(char);
                    char.update(self.game.currentTime);
                    self.updateCharTransitions(char);
                }
            });
        },


        updatePlayerAggro: function () {
            var t = this.game.currentTime,
                player = this.game.player;

            // Check player aggro every 1s when not moving nor attacking
            if (player && !player.isMoving() && !player.isAttacking() && this.playerAggroTimer.isOver(t)) {
                player.checkAggro();
            }
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

        /*
         updateZoning: function() {
         var g = this.game,
         c = g.camera,
         z = g.currentZoning,
         s = 3,
         ts = 32,
         speed = 500;

         if(z && z.inProgress === false) {
         var orientation = this.game.zoningOrientation,
         startValue = endValue = offset = 0,
         updateFunc = null,
         endFunc = null;

         if(orientation === Types.Orientations.LEFT || orientation === Types.Orientations.RIGHT) {
         offset = (c.gridW - 2) * ts;
         startValue = (orientation === Types.Orientations.LEFT) ? c.x - ts : c.x + ts;
         endValue = (orientation === Types.Orientations.LEFT) ? c.x - offset : c.x + offset;
         updateFunc = function(x) {
         c.setPosition(x, c.y);
         g.initAnimatedTiles();
         g.renderer.renderStaticCanvases();
         }
         endFunc = function() {
         c.setPosition(z.endValue, c.y);
         g.endZoning();
         }
         } else if(orientation === Types.Orientations.UP || orientation === Types.Orientations.DOWN) {
         offset = (c.gridH - 2) * ts;
         startValue = (orientation === Types.Orientations.UP) ? c.y - ts : c.y + ts;
         endValue = (orientation === Types.Orientations.UP) ? c.y - offset : c.y + offset;
         updateFunc = function(y) {
         c.setPosition(c.x, y);
         g.initAnimatedTiles();
         g.renderer.renderStaticCanvases();
         }
         endFunc = function() {
         c.setPosition(c.x, z.endValue);
         g.endZoning();
         }
         }

         z.start(this.game.currentTime, updateFunc, endFunc, startValue, endValue, speed);
         }
         },*/

        updateMovimientoCharacter: function (c) {
            var self = this;
            var tick = Math.round(32 / Math.round((c.moveSpeed / (1000 / this.game.renderer.FPS))));

            if (c.moviendose && c.movement.inProgress === false) {
                if (!c.puedeCaminar())
                    return;
                c.animarMovimiento();
                if (c.getDirMov() === Enums.Heading.oeste) {

                    c.movement.start(this.game.currentTime,
                        function (x) {
                            c.x = x;
                        },
                        function () {
                            c.x = c.movement.endValue;
                            c.hasMoved();
                        },
                        c.x - tick,
                        c.x - 32,
                        c.moveSpeed);
                }
                else if (c.getDirMov() === Enums.Heading.este) {
                    c.movement.start(this.game.currentTime,
                        function (x) {
                            c.x = x;
                        },
                        function () {
                            c.x = c.movement.endValue;
                            c.hasMoved();
                        },
                        c.x + tick,
                        c.x + 32,
                        c.moveSpeed);
                }
                else if (c.getDirMov() === Enums.Heading.norte) {
                    c.movement.start(this.game.currentTime,
                        function (y) {
                            c.y = y;
                        },
                        function () {
                            c.y = c.movement.endValue;
                            c.hasMoved();
                        },
                        c.y - tick,
                        c.y - 32,
                        c.moveSpeed);
                }
                else if (c.getDirMov() === Enums.Heading.sur) {
                    c.movement.start(this.game.currentTime,
                        function (y) {
                            c.y = y;
                        },
                        function () {
                            c.y = c.movement.endValue;
                            c.hasMoved();
                        },
                        c.y + tick,
                        c.y + 32,
                        c.moveSpeed);
                }
            }
        },

        updateRendererMov: function () {
            if ((this.game.player.x !== this.game.renderer.camera.centerPosX) || (this.game.player.y !== this.game.renderer.camera.centerPosY)) {
                this.game.renderer.moverCamara(this.segundoUpdateAlMover, this.game.renderer.camera.centerPosX - this.game.player.x, this.game.renderer.camera.centerPosY - this.game.player.y);

                if (this.game.player.movement.inProgress) {
                    this.contadorPrimerUpdate++;
                    if (this.contadorPrimerUpdate === 1) // true si la proxima es la segunda update del movimiento del player
                        this.segundoUpdateAlMover = true;
                    else
                        this.segundoUpdateAlMover = false;
                }
                else
                    this.contadorPrimerUpdate = 0;
            }
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

        updateTilesAnimados: function (time) {
            for (var i = 0; i < this.game.renderer.tilesAnimados.length; i++)
                this.game.renderer.tilesAnimados[i].update(this.game.currentTime);
        },

        updateAnimatedTiles: function () {
            var self = this,
                t = this.game.currentTime;

            this.game.forEachAnimatedTile(function (tile) {
                if (tile.animate(t)) {
                    tile.isDirty = true;
                    tile.dirtyRect = self.game.renderer.getTileBoundingRect(tile);

                    if (self.game.renderer.mobile || self.game.renderer.tablet) {
                        self.game.checkOtherDirtyRects(tile.dirtyRect, tile, tile.x, tile.y);
                    }
                }
            });
        },

        updateInfos: function () {
            var t = this.game.currentTime;

            this.game.infoManager.update(t);
        }
    });

    return Updater;
});
