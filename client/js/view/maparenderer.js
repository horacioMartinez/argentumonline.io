/**
 * Created by horacio on 8/21/16.
 */

define(['enums', 'utils/util', 'lib/pixi', 'view/spritegrh', 'view/rendererutils'],
    function (Enums, Utils, PIXI, SpriteGrh, RendererUtils) {

        class MapaRenderer {
            constructor(camera, assetManager, layer1Container, layer2Container, layer3Container, layer4Container) {
                this.POSICIONES_EXTRA_RENDER_X = 3;// afecta a izq y derecha (osea, el doble de tiles se agregan)
                this.POSICIONES_EXTRA_RENDER_Y = 7;// solo afecta hacia abajo
                this.POSICIONES_EXTRA_TERRENO = 1; // no deberia ser necesario mas de una. (una pos extra en cada una de las 4 direcciones)

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

            _initTerrenoSpriteGrid() {
                this.terreno = [];
                for (var i = 0; i < this.camera.gridW + this.POSICIONES_EXTRA_TERRENO * 2; i++) {
                    this.terreno[i] = [];
                    for (var j = 0; j < this.camera.gridH + this.POSICIONES_EXTRA_TERRENO * 2; j++) {
                        this.terreno[i][j] = new SpriteGrh(this.assetManager.getTerrenoGrh(1)); // grh null <-- todo (poco importante) arreglar esto?
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


            drawMapaIni(gridX, gridY) { // SOLO USARLO EN CAMBIO DE MAPA, SINO USAR RESETPOS. Limpia vectores, dibuja el terreno del mapa, almacena los tiles animados
                log.error("dibujando inicialmente mapa, solo deberia pasar en cambio de map");

                if (!this.mapa.isLoaded) {
                    log.error("DRAW MAPA INI SIN QUE ESTE CARGADO");
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
                        nuevoSprite = new SpriteGrh(self.assetManager.getTerrenoGrh(grh2));
                        self.layer2.addChild(nuevoSprite);
                        nuevoSprite.setPosition(screenX, screenY);
                        self._spritesLayer2[i][j] = (nuevoSprite);
                    }
                    if (grh3) {
                        if (self._spritesLayer3[i][j]) {
                            return;
                        }
                        nuevoSprite = new SpriteGrh(self.assetManager.getGrh(grh3));
                        self.layer3.addChild(nuevoSprite);
                        nuevoSprite.setPosition(screenX, screenY);
                        self._spritesLayer3[i][j] = (nuevoSprite);
                    }
                    if (grh4) {
                        if (self._spritesLayer4[i][j]) {
                            return;
                        }
                        nuevoSprite = new SpriteGrh(self.assetManager.getGrh(grh4));
                        self.layer4.addChild(nuevoSprite);
                        nuevoSprite.setPosition(screenX, screenY);
                        self._spritesLayer4[i][j] = (nuevoSprite);
                    }
                }, this.POSICIONES_EXTRA_RENDER_X, this.POSICIONES_EXTRA_RENDER_Y);

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
                }, this.POSICIONES_EXTRA_RENDER_X, this.POSICIONES_EXTRA_RENDER_Y);
            }

            _removeChilds(padre, gridHijos) {
                _.each(gridHijos, function (fila) {
                    _.each(fila, function (hijo) {
                        if (hijo) {
                            RendererUtils.removePixiChild(padre,hijo);
                        }
                    });
                });
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
                        nuevoSprite = new SpriteGrh(self.assetManager.getTerrenoGrh(grh2));
                        nuevoSprite.setPosition(screenX, screenY);
                        self.layer2.addChild(nuevoSprite);
                        self._spritesLayer2[i][j] = nuevoSprite;
                    }
                    if (grh3) {
                        nuevoSprite = new SpriteGrh(self.assetManager.getGrh(grh3));
                        self.layer3.addChild(nuevoSprite);
                        nuevoSprite.setPosition(screenX, screenY);
                        self._spritesLayer3[i][j] = nuevoSprite;
                    }
                    if (grh4) {
                        nuevoSprite = new SpriteGrh(self.assetManager.getGrh(grh4));
                        nuevoSprite.setPosition(screenX, screenY);
                        self.layer4.addChild(nuevoSprite);
                        self._spritesLayer4[i][j] = nuevoSprite;
                    }
                }, this.POSICIONES_EXTRA_RENDER_X, this.POSICIONES_EXTRA_RENDER_Y);
            }

            cambiarMapa(mapa) {
                this.mapa = mapa;
            }

        }
        return MapaRenderer;
    });
