define(['enums', 'utils/util', 'font', 'lib/pixi', 'view/camera', 'view/charactersprites', 'view/charactername',
    'view/consola', 'view/charactertext', 'view/spritegrh', 'view/containerordenado','view/indicadormapa'],
    function (Enums, Utils, Font, PIXI, Camera, CharacterSprites, CharacterName, Consola, CharacterText, SpriteGrh,
              ContainerOrdenado, IndicadorMapa) {

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

                //this.tablet = Detect.isTablet(window.innerWidth);

                this._spritesLayer2 = [];
                this._spritesLayer3 = [];
                this._spritesLayer4 = [];

                this._lowestRowTerreno = null;
                this._lowestColTerreno = null;
            }

            _inicializarPixi() {
                this.pixiRenderer = new PIXI.autoDetectRenderer(this.camera.gridW * this.tilesize, this.camera.gridH * this.tilesize);
                $(this.pixiRenderer.view).css('position', 'relative');
                $(this.pixiRenderer.view).css('display', 'block');
                $("#gamecanvas").append(this.pixiRenderer.view);
                this._initStage();
            }

            _initStage() {
                this.stage = new PIXI.Container();
                this.gameStage = new PIXI.Container();
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

            _getHeadingsGrhs(varIndice, num) {
                if (!num) {
                    return null;
                }
                if (!varIndice[num]) {
                    return null;
                }
                if (!varIndice[num].down) {
                    return null;
                }
                var res = [];
                res[Enums.Heading.norte] = this.assetManager.getGrh(varIndice[num].up);
                res[Enums.Heading.este] = this.assetManager.getGrh(varIndice[num].right);
                res[Enums.Heading.sur] = this.assetManager.getGrh(varIndice[num].down);
                res[Enums.Heading.oeste] = this.assetManager.getGrh(varIndice[num].left);
                return res;
            }

            agregarTextoConsola(texto, font) {
                this.consola.agregarTexto(texto, font);
            }

            actualizarIndicadorMapa(numMap,x,y){
                this.indicadorMapa.actualizar(numMap,x,y);
            }

            agregarItem(item, numGrh) {
                if (!this.assetManager.getGrh(numGrh)) {
                    log.error("grh de item invalido!");
                    return;
                }
                item.sprite = new SpriteGrh(this.assetManager.getGrh(numGrh));
                item.sprite.zOffset = -50; // para que item quede debajo de chars en misma cord Y ( para todo X)
                this.layer3.addChild(item.sprite);
                item.sprite.setPosition(item.x, item.y);
            }

            sacarItem(item) {
                if (!item.sprite) {
                    return;
                }
                this.layer3.removeChild(item.sprite);
                item.sprite = null;
            }

            agregarCharacter(char) {
                var self = this;               

                let f = function () {
                    var char = this;
                    var nombre = char.nombre;
                    var clan = char.clan;
                    var color = char.nickColor;
                    if (char.spriteNombre) {
                        self.gameNames.removeChild(char.spriteNombre);
                        char.spriteNombre = null;
                    }
                    if (!nombre.trim()) {
                        return;
                    }
                    var fontColor = color ? Font.NickColor[Font.NickColorIndex[color]] : Font.NickColor.CIUDADANO;
                    var font = Font.NOMBRE;
                    font.fill = fontColor;
                    var nuevoNombre = new CharacterName(nombre, clan, font, self.escala);
                    self.gameNames.addChild(nuevoNombre);
                    char.spriteNombre = nuevoNombre;
                };

                char.on('nameChanged', f);

                char.emit('nameChanged');

                var sprite = new CharacterSprites();
                sprite.setSombraSprite(this.assetManager.getGrh(24208));

                this.layer3.addChild(sprite);

                sprite.setSpeed(char.moveSpeed);

                sprite.zOffset = -30; // para que quede debajo de los objetos del mapa en el mismo y
                char.sprite = sprite;

                char.texto = new CharacterText(this.escala);
                this.gameChat.addChild(char.texto);

                char.on('positionChanged', function () {
                    var spriteX = this.x;
                    var spriteY = this.y;
                    if (this.sprite) {//sacar
                        this.sprite.setPosition(spriteX, spriteY);
                    }
                    if (this.spriteNombre) {
                        this.spriteNombre.setPosition(spriteX, spriteY);
                    }
                    if (this.texto) {
                        this.texto.setPosition(spriteX, spriteY);
                    }
                });

                char.emit('positionChanged');

                char.on('headingChanged', function () {
                    char.sprite.cambiarHeading(char.heading);
                });

                char.emit('headingChanged');

                char.on('bodyChanged', function () {
                    var Body = char.body;
                    var bodys = self._getHeadingsGrhs(self.cuerpos, Body);
                    var headOffX = 0;
                    var headOffY = 0;
                    if (self.cuerpos[Body]) {
                        headOffX = self.cuerpos[Body].offHeadX;
                        headOffY = self.cuerpos[Body].offHeadY;
                    }
                    char.sprite.setBodys(bodys, headOffX, headOffY);
                });

                char.emit('bodyChanged');

                char.on('headChanged', function () {
                    var Head = char.head;
                    var heads = self._getHeadingsGrhs(self.cabezas, Head);
                    char.sprite.setHeads(heads);
                });

                char.emit('headChanged');

                char.on('weaponChanged', function () {
                    var Weapon = char.weapon;
                    var weapons = self._getHeadingsGrhs(self.armas, Weapon);
                    char.sprite.setWeapons(weapons);
                });

                char.emit('weaponChanged');

                char.on('shieldChanged', function () {
                    var Shield = char.shield;
                    var shields = self._getHeadingsGrhs(self.escudos, Shield);
                    char.sprite.setShields(shields);
                });

                char.emit('shieldChanged');

                char.on('helmetChanged', function () {
                    var Helmet = char.helmet;
                    var helmets = self._getHeadingsGrhs(self.cascos, Helmet);
                    char.sprite.setHelmets(helmets);
                });

                char.emit('helmetChanged');

            }

            sacarCharacter(char) {
                this.layer3.removeChild(char.sprite);
                this.gameChat.removeChild(char.texto);
                if (char.spriteNombre) {
                    this.gameNames.removeChild(char.spriteNombre);
                    char.spriteNombre.destroy();
                    char.spriteNombre = null;
                }
                /* destroy necesario en textos y meshes
                 http://www.html5gamedevs.com/topic/19815-correct-way-of-deleting-a-display-object/
                 */
                char.texto.destroy();
                char.texto = null;
                char.sprite = null;
            }

            setCharacterChat(char, chat, r, g, b) {
                var color = "rgb(" + r + "," + g + "," + b + ")";
                char.texto.setChat(chat, color);
            }

            removerChat(char){
                char.texto.removerChat();
            }

            setCharVisible(char, visible) {
                char.sprite.setVisible(visible);
                if (char.spriteNombre) {
                    char.spriteNombre.setVisible(visible);
                }
            }

            agregarCharacterHoveringInfo(char, valor, font, duracion) {
                char.texto.setHoveringInfo(valor, font, duracion);
            }

            setCharacterFX(char, FX, FXLoops) {
                var grh = this.assetManager.getGrh(this.fxs[FX].animacion);
                char.sprite.setFX(grh, this.fxs[FX].offX, this.fxs[FX].offY, FXLoops);
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
                this.indicadorMapa.x = Math.floor((17*32-65)*escala);
                this.indicadorMapa.y = Math.floor((13*32-12)*escala);
                this.indicadorMapa.setEscala(escala);
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

            entityVisiblePorCamara(entity, heightTileOffset) {
                if (!entity.sprite) {
                    return false;
                }

                var entityRect = entity.sprite.getBounds().clone();
                if (!entityRect.width) {
                    entityRect.x = entity.x;
                    entityRect.y = entity.y;
                }
                else {
                    entityRect.width /= this.escala;
                    entityRect.height = (entityRect.height / this.escala) + this.tilesize * heightTileOffset * 2;
                    entityRect.x = (-this.gameStage.x + entityRect.x) / this.escala;
                    entityRect.y = (-this.gameStage.y + entityRect.y) / this.escala - this.tilesize * heightTileOffset;
                }
                return this.camera.rectVisible(entityRect);
            }

            entityEnTileVisible(entity) { // puede que no este en un tile visible pero si sea visible la entidad (para eso usar el de arriba)
                return this.camera.isVisiblePosition(entity.gridX, entity.gridY, 0, 0);
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

            toggleLluvia() {
                if (this.containerLluvia) {
                    this.removeLluvia();
                } else {
                    this.createLluvia();
                }
            }

            removeLluvia() {
                if (!this.containerLluvia) {
                    return;
                }
                PIXI.ticker.shared.remove(this._updateGotas, this);
                this.stage.removeChild(this.containerLluvia);
                this.gotas = null;
                this.containerLluvia = null;
            }

            createLluvia() {
                if (this.containerLluvia) {
                    return;
                }
                this.gotas = [];
                this.containerLluvia = new PIXI.ParticleContainer();
                var indice = this.stage.getChildIndex(this.gameStage) + 1;
                this.stage.addChildAt(this.containerLluvia, indice);

                var anguloBase = Math.random() * (Math.PI / 12) + Math.PI / 12;

                var velocidad = 7 + Math.pow(anguloBase, 2) * 15;
                var cantidadGotas = Math.floor((100 + anguloBase * 250) * this.escala);
                if (Math.random() < 0.5) {
                    anguloBase = -anguloBase;
                }
                for (var i = 0; i < cantidadGotas; ++i) {
                    var gota = new SpriteGrh(this.assetManager.getGrh(24209)); // TODO: usar directamente sprite

                    gota.x = Math.random() * this.pixiRenderer.width;
                    gota.y = Math.random() * this.pixiRenderer.height;
                    gota.rotation = anguloBase + Math.random() * Math.PI / 16;
                    gota.velocidad = velocidad;

                    gota.height = (4 + 6 * Math.random()) * this.escala;
                    gota.alpha = 0.4;
                    this.gotas.push(gota);
                    this.containerLluvia.addChild(gota);
                }
                PIXI.ticker.shared.add(this._updateGotas, this);
            }

            _updateGotas(delta) {
                // iterate through the sprites and update their position
                for (var i = 0; i < this.gotas.length; i++) {
                    var gota = this.gotas[i];
                    gota.position.x -= Math.sin(gota.rotation) * (gota.velocidad) * delta;
                    gota.position.y += Math.cos(gota.rotation) * (gota.velocidad) * delta;

                    if (gota.position.x > this.pixiRenderer.width + 20) {
                        gota.position.x = 0 - 20;
                        gota.y = Math.random() * this.pixiRenderer.height;
                    }
                    else if (gota.position.x < 0 - 20) {
                        gota.position.x = this.pixiRenderer.width + 20;
                        gota.y = Math.random() * this.pixiRenderer.height;
                    }
                    if (gota.position.y > this.pixiRenderer.height) {
                        gota.position.y = 0 - 20;
                        gota.x = Math.random() * this.pixiRenderer.width;
                    }
                }
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
