define(['enums', 'utils/util', 'font', 'lib/pixi', 'view/camera', 'view/charactersprites', 'view/charactername',
        'view/consola', 'view/charactertext', 'view/spritegrh', 'view/containerordenado', 'view/indicadormapa',
        'view/entityrenderer', 'view/climarenderer'],
    function (Enums, Utils, Font, PIXI, Camera, CharacterSprites, CharacterName, Consola, CharacterText, SpriteGrh,
              ContainerOrdenado, IndicadorMapa, EntityRenderer, ClimaRenderer) {

        class Renderer {
            constructor(assetManager, escala) {
                this.POSICIONES_EXTRA_RENDER_X = 3;
                this.POSICIONES_EXTRA_RENDER_Y = 7;
                this.POSICIONES_EXTRA_TERRENO = 1; // no deberia ser necesario mas de una. (una pos extra en cada una de las 4 direcciones)

                this.MAPA_WIDTH = 100; // todo: usarlo desde mapa
                this.mapa = null;
                this.assetManager = assetManager;
                this.grhs = assetManager.grhs;
                this.indices = assetManager.getIndices();
                this.armas = assetManager.getArmas();
                this.cabezas = assetManager.getCabezas();
                this.cascos = assetManager.getCascos();
                this.cuerpos = assetManager.getCuerpos();
                this.escudos = assetManager.getEscudos();
                this.fxs = assetManager.getFxs();

                this.tilesize = 32;
                this.camera = new Camera(this.tilesize);
                this._inicializarPixi();

                this.rescale(escala);

                this._spritesLayer2 = [];
                this._spritesLayer3 = [];
                this._spritesLayer4 = [];

                this._lowestRowTerreno = null;
                this._lowestColTerreno = null;

                this.entityRenderer = new EntityRenderer(this.escala, this.layer3, this.gameNames, this.gameChat, this.camera, this.assetManager, this.gameStage);
                this.climaRenderer = new ClimaRenderer(this.escala, this.climaContainer, assetManager, this.pixiRenderer);
            }

            _inicializarPixi() {
                PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
                PIXI.MIPMAP_TEXTURES = false;
                //PIXI.GC_MODES.DEFAULT = PIXI.GC_MODES.AUTO; // todo: para mobile... algun dia..

                this.pixiRenderer = new PIXI.autoDetectRenderer(this.camera.gridW * this.tilesize, this.camera.gridH * this.tilesize);
                $(this.pixiRenderer.view).css('position', 'relative');
                $(this.pixiRenderer.view).css('display', 'block');
                $("#gamecanvas").append(this.pixiRenderer.view);
                this._initStage();
            }

            _initStage() {
                this.stage = new PIXI.Container();
                this.gameStage = new PIXI.Container();
                this.climaContainer = new PIXI.Container();
                this.layer1 = new PIXI.Container();
                this.layer2 = new PIXI.Container();
                this.gameNames = new PIXI.Container();
                this.layer3 = new ContainerOrdenado(this.MAPA_WIDTH);
                this.layer3.ordenado = true;
                this.layer4 = new PIXI.Container();
                this.gameChat = new PIXI.Container();
                this.consola = new Consola(this.escala);
                this.indicadorMapa = new IndicadorMapa(this.escala);
                this.stage.addChild(this.gameStage);
                this.stage.addChild(this.climaContainer);
                this.stage.addChild(this.consola);
                this.stage.addChild(this.indicadorMapa);
                this.gameStage.addChild(this.layer1);
                this.gameStage.addChild(this.layer2);
                this.gameStage.addChild(this.gameNames);
                this.gameStage.addChild(this.layer3);
                this.gameStage.addChild(this.layer4);
                this.gameStage.addChild(this.gameChat); // todo? gametext abajo o arriba de layer4?
                this._initTerrenoSpriteGrid(this.layer1);
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

            _initTerrenoSpriteGrid(layer1) {

                this.terreno = [];
                for (var i = 0; i < this.camera.gridW + this.POSICIONES_EXTRA_TERRENO * 2; i++) {
                    this.terreno[i] = [];
                    for (var j = 0; j < this.camera.gridH + this.POSICIONES_EXTRA_TERRENO * 2; j++) {
                        this.terreno[i][j] = new SpriteGrh(this.assetManager.getTerrenoGrh(1)); // grh null <-- todo (poco importante) arreglar esto?
                        this.layer1.addChild(this.terreno[i][j]);
                    }
                }
            }

            agregarTextoConsola(texto, font) {
                this.consola.agregarTexto(texto, font);
            }

            actualizarIndicadorMapa(numMap, x, y) {
                this.indicadorMapa.actualizar(numMap, x, y);
            }

            agregarItem(item, numGrh) {
                this.entityRenderer.agregarItem(item, numGrh);
            }

            sacarItem(item) {
                this.entityRenderer.sacarItem(item);
            }

            agregarCharacter(char) {
                this.entityRenderer.agregarCharacter(char);
            }

            sacarCharacter(char) {
                this.entityRenderer.sacarCharacter(char);
            }

            setCharacterChat(char, chat, r, g, b) {
                this.entityRenderer.setCharacterChat(char, chat, r, g, b);
            }

            removerChat(char) {
                this.entityRenderer.removerChat(char);
            }

            setCharVisible(char, visible) {
                this.entityRenderer.setCharVisible(char, visible);
            }

            agregarCharacterHoveringInfo(char, valor, font, duracion) {
                this.entityRenderer.agregarCharacterHoveringInfo(char, valor, font, duracion);
            }

            setCharacterFX(char, FX, FXLoops) {
                this.entityRenderer.setCharacterFX(char, FX, FXLoops);
            }

            entityVisiblePorCamara(entity, heightTileOffset) {
                return this.entityRenderer.entityVisiblePorCamara(entity, heightTileOffset);
            }

            entityEnTileVisible(entity) { // puede que no este en un tile visible pero si sea visible la entidad (para eso usar el de arriba)
                return this.entityRenderer.entityEnTileVisible(entity);
            }

            rescale(escala) {
                this.escala = escala;
                this.pixiRenderer.resize(Math.round(this.camera.gridW * this.tilesize * escala), Math.round(this.camera.gridH * this.tilesize * escala));
                this.gameStage.scale.x = escala;
                this.gameStage.scale.y = escala;

                this.gameChat.scale.x = 1 / escala;
                this.gameChat.scale.y = 1 / escala;

                this.gameNames.scale.x = 1 / escala;
                this.gameNames.scale.y = 1 / escala;

                this._syncGamePosition();

                for (var i = 0; i < this.gameChat.children.length; i++) {
                    this.gameChat.children[i].setEscala(escala);
                }
                for (var name of this.gameNames.children) {
                    name.setEscala(escala);
                }
                this.consola.setEscala(escala);
                this.indicadorMapa.x = Math.floor((17 * 32 - 65) * escala);
                this.indicadorMapa.y = Math.floor((13 * 32 - 12) * escala);
                this.indicadorMapa.setEscala(escala);

                /* TEMPORAL */
                if (this.entityRenderer) {
                    this.entityRenderer.rescale(escala);
                }
                if (this.climaRenderer){
                    this.climaRenderer.escala = escala;
                }
                /* TEMPORAL */
            }

            clean(escala) {
                while (this.stage.children.length > 0) {
                    var child = this.stage.getChildAt(0);
                    this.stage.removeChild(child);
                }
                this._initStage();
                this.rescale(escala);
            }

            setBajoTecho(bajoT) {
                this.layer4.visible = !bajoT;
            }

            drawMapaIni(gridX, gridY) { // SOLO USARLO EN CAMBIO DE MAPA, SINO USAR RESETPOS. Limpia vectores, dibuja el terreno del mapa, almacena los tiles animados
                log.error("dibujando inicialmente mapa, solo deberia pasar en cambio de map");

                if (!this.mapa.isLoaded) {
                    log.error("DRAW MAPA INI SIN QUE ESTE CARGADO");
                    return;
                }
                this.resetCameraPosition(gridX, gridY);
                this._syncGamePosition();
                this._drawSpritesIni();
                this._drawTerrenoIni();
            }

            resetCameraPosition(gridX, gridY) {
                this.camera.lookAtGridPos(gridX, gridY);
            }

            _syncGamePosition() {
                this.gameStage.x = -Math.round(this.camera.x * this.escala);
                this.gameStage.y = -Math.round(this.camera.y * this.escala);
            }


            moverPosition(x, y) {
                this.camera.mover(x, y);
                this._syncGamePosition();
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
                        self.layer2.removeChild(self._spritesLayer2[i][j]);
                        self._spritesLayer2[i][j] = null;
                    }
                    if (self._spritesLayer3[i][j]) {
                        self.layer3.removeChild(self._spritesLayer3[i][j]);
                        self._spritesLayer3[i][j] = null;
                    }
                    if (self._spritesLayer4[i][j]) {
                        self.layer4.removeChild(self._spritesLayer4[i][j]);
                        self._spritesLayer4[i][j] = null;
                    }
                }, this.POSICIONES_EXTRA_RENDER_X, this.POSICIONES_EXTRA_RENDER_Y);
            }

            _removeChilds(padre, gridHijos) {
                _.each(gridHijos, function (fila) {
                    _.each(fila, function (hijo) {
                        if (hijo) {
                            padre.removeChild(hijo);
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

            resetPos(gridX, gridY) {
                this.drawMapaIni(gridX, gridY);
            }

            removeLluvia() {
                this.climaRenderer.removeLluvia();
            }

            createLluvia() {
                this.climaRenderer.createLluvia();
            }

            renderFrame() {
                this.pixiRenderer.render(this.stage);
                /*
                 let testPosEnteras = (c) => {
                 if ( (Math.round(c.x) !== c.x) || (Math.round(c.y) !== c.y) ){
                 log.error(c._grh);
                 throw new Error("ERROR!!!!!!!!!!!: X:" + c.x+ " Y:" + c.y);
                 }
                 c.children.forEach(testPosEnteras);
                 };
                 testPosEnteras(this.stage);
                 */
            }

            cambiarMapa(mapa) {
                this.mapa = mapa;
            }

        }
        return Renderer;
    });
