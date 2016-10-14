/**
 * Created by horacio on 8/21/16.
 */

define(['enums', 'utils/util', 'lib/pixi', 'view/spritegrh', 'view/rendererutils'],
    function (Enums, Utils, PIXI, SpriteGrh, RendererUtils) {

        class MapaRenderer {
            constructor(camera, assetManager, layer1Container, layer2Container, layer3Container, layer4Container) {

                // posiciones extra que se analizan para ver si lo que hay en ellas es visible o no
                // (si es algo visible pero tan grande que cuando esta lejos no entra en estas posiciones no se ve)
                this.POSICIONES_EXTRA_RENDER = {
                    norte: 1,
                    sur: 7,
                    este: 4,
                    oeste: 4
                };

                // posiciones extras que se renderizan del terreno (no deberia ser necesaria mas de 1 por el movimiento)
                this.POSICIONES_EXTRA_TERRENO = 1;

                this.camera = camera;
                this.assetManager = assetManager;
                this.layer1 = layer1Container;
                this.layer2 = layer2Container;
                this.layer3 = layer3Container;
                this.layer4 = layer4Container;

                this.tilesize = 32;
                this.mapa = null;
                this.terreno = null;
                this._lowestRowTerreno = null;
                this._lowestColTerreno = null;
                this._spritesLayer2 = [];
                this._spritesLayer3 = [];
                this._spritesLayer4 = [];

                this._initTerrenoSpriteGrid();
            }

            cambiarMapa(mapa) {
                this.mapa = mapa;
            }

            drawMapaIni(gridX, gridY) { // SOLO USARLO EN CAMBIO DE MAPA, SINO USAR RESETPOS. Limpia vectores, dibuja el terreno del mapa, almacena los tiles animados

                if (!this.mapa.isLoaded) {
                    throw new Error("DRAW MAPA INI SIN QUE ESTE CARGADO");
                    return;
                }
                this._drawSpritesIni();
                this._drawTerrenoIni();
            }

            updateTilesMov(dir) {
                if (!this.mapa.isLoaded) {
                    return;
                }
                this._updateTerrenoMov(dir);
                this._updateLayersMov(dir);
            }

            _initTerrenoSpriteGrid() {
                this.terreno = [];
                for (var i = 0; i < this.camera.gridW + this.POSICIONES_EXTRA_TERRENO * 2; i++) {
                    this.terreno[i] = [];
                    for (var j = 0; j < this.camera.gridH + this.POSICIONES_EXTRA_TERRENO * 2; j++) {
                        this.terreno[i][j] = new SpriteGrh(this.assetManager.getTerrenoGrh(1)); // grh null
                        this.layer1.addChild(this.terreno[i][j]);
                    }
                }
            }

            _drawTerrenoIni() {
                var gridXIni = this.camera.gridX - this.POSICIONES_EXTRA_TERRENO;
                var gridYIni = this.camera.gridY - this.POSICIONES_EXTRA_TERRENO;
                this._lowestRowTerreno = 0; // variable que indica que indice tiene los sprites de pos mas baja, para que al caminar estos sean movidos a las mas altas
                this._lowestColTerreno = 0;

                for (var i = 0; i < this.camera.gridW + this.POSICIONES_EXTRA_TERRENO * 2; i++) {
                    for (var j = 0; j < this.camera.gridH + this.POSICIONES_EXTRA_TERRENO * 2; j++) {
                        var screenX = (gridXIni + i) * this.tilesize;
                        var screenY = (gridYIni + j) * this.tilesize;
                        this.terreno[i][j].setPosition(screenX, screenY);

                        var grh = this.mapa.getGrh1(gridXIni + i, gridYIni + j);
                        if (grh) {
                            this.terreno[i][j].cambiarGrh(this.assetManager.getTerrenoGrh(grh));
                        }
                    }
                }
            }

            _updateTerrenoMov(dir) { // al moverse mueve la columna/fila que queda atras al frente de todo
                var gridXIni = this.camera.gridX - this.POSICIONES_EXTRA_TERRENO;
                var gridYIni = this.camera.gridY - this.POSICIONES_EXTRA_TERRENO;
                var cols = this.camera.gridW + this.POSICIONES_EXTRA_TERRENO * 2;
                var rows = this.camera.gridH + this.POSICIONES_EXTRA_TERRENO * 2;

                switch (dir) {
                    case Enums.Heading.norte:
                        var j = Utils.modulo(this._lowestRowTerreno - 1, rows);
                        for (var i = 0; i < this.terreno.length; i++) {
                            this.terreno[i][j].setPosition(this.terreno[i][j].x, this.terreno[i][j].y - (rows * this.tilesize));

                            var grh = this.mapa.getGrh1(gridXIni + Utils.modulo(i - this._lowestColTerreno, cols), gridYIni - 1);
                            if (grh) {
                                this.terreno[i][j].cambiarGrh(this.assetManager.getTerrenoGrh(grh));
                            }

                        }

                        this._lowestRowTerreno = Utils.modulo(this._lowestRowTerreno - 1, rows);
                        break;

                    case Enums.Heading.oeste:
                        var i = Utils.modulo(this._lowestColTerreno - 1, cols);
                        for (var j = 0; j < this.terreno[i].length; j++) {
                            this.terreno[i][j].setPosition(this.terreno[i][j].x - (cols * this.tilesize), this.terreno[i][j].y);

                            var grh = this.mapa.getGrh1(gridXIni - 1, gridYIni + Utils.modulo(j - this._lowestRowTerreno, rows));
                            if (grh) {
                                this.terreno[i][j].cambiarGrh(this.assetManager.getTerrenoGrh(grh));
                            }

                        }
                        this._lowestColTerreno = Utils.modulo(this._lowestColTerreno - 1, cols);
                        break;

                    case Enums.Heading.sur:
                        var j = this._lowestRowTerreno;
                        for (var i = 0; i < this.terreno.length; i++) {
                            this.terreno[i][j].setPosition(this.terreno[i][j].x, (this.terreno[i][j].y + (rows * this.tilesize)));

                            var grh = this.mapa.getGrh1(gridXIni + Utils.modulo(i - this._lowestColTerreno, cols), gridYIni + rows);
                            if (grh) {
                                this.terreno[i][j].cambiarGrh(this.assetManager.getTerrenoGrh(grh));
                            }

                        }
                        this._lowestRowTerreno = Utils.modulo(this._lowestRowTerreno + 1, rows);
                        break;

                    case Enums.Heading.este:
                        var i = this._lowestColTerreno;
                        for (var j = 0; j < this.terreno[i].length; j++) {
                            this.terreno[i][j].setPosition((this.terreno[i][j].x + cols * this.tilesize), this.terreno[i][j].y);

                            var grh = this.mapa.getGrh1(gridXIni + cols, gridYIni + Utils.modulo(j - this._lowestRowTerreno, rows));
                            if (grh) {
                                this.terreno[i][j].cambiarGrh(this.assetManager.getTerrenoGrh(grh));
                            }

                        }
                        this._lowestColTerreno = Utils.modulo(this._lowestColTerreno + 1, cols);
                        break;

                    default:
                        log.error("character heading invalido");
                        break;
                }
            }

            _drawSpritesIni() {
                this._removeChilds(this.layer2, this._spritesLayer2);
                this._removeChilds(this.layer3, this._spritesLayer3);
                this._removeChilds(this.layer4, this._spritesLayer4);
                for (var k = 0; k <= 100; k++) {
                    this._spritesLayer2[k] = [];
                    this._spritesLayer3[k] = [];
                    this._spritesLayer4[k] = [];
                }
                var nuevoSprite;

                var self = this;
                this.camera.forEachVisiblePosition(function (i, j) {
                    var screenX = i * self.tilesize;
                    var screenY = j * self.tilesize;
                    var grh2 = self.mapa.getGrh2(i, j);
                    var grh3 = self.mapa.getGrh3(i, j);
                    var grh4 = self.mapa.getGrh4(i, j);
                    if (grh2) {
                        self._spritesLayer2[i][j] = self._crearSprite(self.layer2, grh2, screenX, screenY);
                    }
                    if (grh3) {
                        self._spritesLayer3[i][j] = self._crearSprite(self.layer3, grh3, screenX, screenY);
                    }
                    if (grh4) {
                        self._spritesLayer4[i][j] = self._crearSprite(self.layer4, grh4, screenX, screenY);
                    }
                }, this.POSICIONES_EXTRA_RENDER);
            }

            _updateLayersMov(dir) {
                var self = this;
                this.camera.forEachVisibleNextLinea(dir, function (i, j) {
                    var screenX = i * self.tilesize;
                    var screenY = j * self.tilesize;
                    var grh2 = self.mapa.getGrh2(i, j);
                    var grh3 = self.mapa.getGrh3(i, j);
                    var grh4 = self.mapa.getGrh4(i, j);
                    var nuevoSprite;
                    if (grh2) {
                        if (self._spritesLayer2[i][j]) {
                            return;
                        }
                        self._spritesLayer2[i][j] = self._crearSprite(self.layer2, grh2, screenX, screenY);
                    }
                    if (grh3) {
                        if (self._spritesLayer3[i][j]) {
                            return;
                        }
                        self._spritesLayer3[i][j] = self._crearSprite(self.layer3, grh3, screenX, screenY);
                    }
                    if (grh4) {
                        if (self._spritesLayer4[i][j]) {
                            return;
                        }
                        self._spritesLayer4[i][j] = self._crearSprite(self.layer4, grh4, screenX, screenY);
                    }
                }, this.POSICIONES_EXTRA_RENDER);

                this.camera.forEachVisibleLastLinea(dir, function (i, j) {

                    if (self._spritesLayer2[i][j]) {
                        RendererUtils.removePixiChild(self.layer2, self._spritesLayer2[i][j]);
                        self._spritesLayer2[i][j] = null;
                    }
                    if (self._spritesLayer3[i][j]) {
                        RendererUtils.removePixiChild(self.layer3, self._spritesLayer3[i][j]);
                        self._spritesLayer3[i][j] = null;
                    }
                    if (self._spritesLayer4[i][j]) {
                        RendererUtils.removePixiChild(self.layer4, self._spritesLayer4[i][j]);
                        self._spritesLayer4[i][j] = null;
                    }
                }, this.POSICIONES_EXTRA_RENDER);

                this.camera.forEachVisiblePosition(function (i, j) {
                    if (self._spritesLayer2[i][j]) {
                        self._setSpriteClipping(self._spritesLayer2[i][j]);
                    }
                    if (self._spritesLayer3[i][j]) {
                        self._setSpriteClipping(self._spritesLayer3[i][j]);
                    }

                    if (self._spritesLayer4[i][j]) {
                        self._setSpriteClipping(self._spritesLayer4[i][j]);
                    }

                }, this.POSICIONES_EXTRA_RENDER);

            }

            _crearSprite(parentLayer, grh, x, y) {
                let nuevoSprite = new SpriteGrh(this.assetManager.getGrh(grh));
                parentLayer.addChild(nuevoSprite); // ojo tiene que estar en este orden sino no anda el z-index(TODO)
                nuevoSprite.setPosition(x, y);
                this._setSpriteClipping(nuevoSprite);
                return nuevoSprite;
            }

            _setSpriteClipping(sprite) {
                let spriteRect = {};

                spriteRect.x = sprite.x;
                spriteRect.y = sprite.y;
                spriteRect.width = sprite.width;
                spriteRect.height = sprite.height;

                RendererUtils.posicionarRectEnTile(spriteRect);
                sprite.visible = this.camera.rectVisible(spriteRect);
            }

            _removeChilds(padre, gridHijos) {
                _.each(gridHijos, function (fila) {
                    _.each(fila, function (hijo) {
                        if (hijo) {
                            RendererUtils.removePixiChild(padre, hijo);
                        }
                    });
                });
            }

            _drawDebugTile(x, y) {
                var graphics = new PIXI.Graphics();
                graphics.beginFill(0xFFFF00);
                graphics.lineStyle(5, 0xFF0000);
                graphics.drawRect(x, y, this.tilesize, this.tilesize);
                this.layer4.addChild(graphics);
            }

        }
        return MapaRenderer;
    });
