define(['lib/pixi', 'view/camera', 'view/charactersprites', 'view/consola', 'view/charactertext', 'view/spritegrh', 'view/containerordenado'],
    function (PIXI, Camera, CharacterSprites, Consola, CharacterText, SpriteGrh, ContainerOrdenado) {

        var Renderer = Class.extend({
            init: function (assetManager, escala) {
                this.POSICIONES_EXTRA_RENDER_X = 3;
                this.POSICIONES_EXTRA_RENDER_Y = 5;
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

                this.tablet = Detect.isTablet(window.innerWidth);

                this._spritesLayer2 = [];
                this._spritesLayer3 = [];
                this._spritesLayer4 = [];
            },

            _inicializarPixi: function () {
                this.pixiRenderer = new PIXI.autoDetectRenderer(this.camera.gridW * this.tilesize, this.camera.gridH * this.tilesize);
                $(this.pixiRenderer.view).css('position', 'relative');
                $("#gamecanvas").append(this.pixiRenderer.view);
                this._initStage();
            },

            _initStage: function () {
                this.stage = new PIXI.Container();
                this.gameStage = new PIXI.Container();
                this.layer1 = new PIXI.Container();
                this.layer2 = new PIXI.Container();
                this.layer3 = new ContainerOrdenado(this.MAPA_WIDTH);
                this.layer3.ordenado = true;
                this.layer4 = new PIXI.Container();
                this.gameText = new PIXI.Container(); // nota: los nombres no estan aca, solo los dialogos (no se puede meter los nombres porque pisan a algunos graficos y son pisados otros)
                // todo?: que los nombres siempre pisen al grh1 y esten debajo de los demas, de esa forma en vez de hacerles el scale del juego se los puede agrandar como a los demas textos
                this.consola = new Consola(this.escala);
                this.stage.addChild(this.gameStage);
                this.stage.addChild(this.consola);
                this.gameStage.addChild(this.layer1);
                this.gameStage.addChild(this.layer2);
                this.gameStage.addChild(this.layer3);
                this.gameStage.addChild(this.layer4);
                this.gameStage.addChild(this.gameText); // todo? gametext abajo o arriba de layer4?
                this._initTerrenoSpriteGrid(this.layer1);
            },

            // TODO!: (MUY IMPORTANTE) probar con rendertexture en las layers 1,2 y 4. (para los tiles animados generar un sprite)
            _drawTerrenoIni: function () {
                var gridXIni = this.camera.gridX - this.POSICIONES_EXTRA_TERRENO;
                var gridYIni = this.camera.gridY - this.POSICIONES_EXTRA_TERRENO;
                this._lowestRowTerreno = 0; // variable que indica que indice tiene los sprites de pos mas baja, para que al caminar estos sean movidos a las mas altas
                this._lowestColTerreno = 0;

                for (var i = 0; i < this.camera.gridW + this.POSICIONES_EXTRA_TERRENO * 2; i++) {
                    for (var j = 0; j < this.camera.gridH + this.POSICIONES_EXTRA_TERRENO * 2; j++) {
                        var screenX = (gridXIni + i) * this.tilesize;
                        var screenY = (gridYIni + j) * this.tilesize;
                        this.terreno[i][j].setPosition(screenX, screenY);

                        if (this.mapa.getGrh1(gridXIni + i, gridYIni + j))
                            this.terreno[i][j].cambiarGrh(this.assetManager.getTerrenoGrh(this.mapa.getGrh1(gridXIni + i, gridYIni + j)));
                    }
                }
            },

            _initTerrenoSpriteGrid: function (layer1) {

                this.terreno = [];
                for (var i = 0; i < this.camera.gridW + this.POSICIONES_EXTRA_TERRENO * 2; i++) {
                    this.terreno[i] = [];
                    for (var j = 0; j < this.camera.gridH + this.POSICIONES_EXTRA_TERRENO * 2; j++) {
                        this.terreno[i][j] = new SpriteGrh(this.assetManager.getGrh(1)); // grh null <-- todo (poco importante) arreglar esto?
                        this.layer1.addChild(this.terreno[i][j]);
                    }
                }
            },

            _getHeadingsGrhs: function (varIndice, num) {
                if (!num)
                    return null;
                if (!varIndice[num])
                    return null;
                if (!varIndice[num].down)
                    return null;
                var res = [];
                res[Enums.Heading.norte] = this.assetManager.getGrh(varIndice[num].up);
                res[Enums.Heading.este] = this.assetManager.getGrh(varIndice[num].right);
                res[Enums.Heading.sur] = this.assetManager.getGrh(varIndice[num].down);
                res[Enums.Heading.oeste] = this.assetManager.getGrh(varIndice[num].left);
                return res;
            },

            agregarTextoConsola: function (texto, font) {
                this.consola.agregarTexto(texto, font);
            },

            agregarItem: function (item, numGrh) {
                if (!this.assetManager.getGrh(numGrh)) {
                    log.error("grh de item invalido!");
                    return;
                }
                item.sprite = new SpriteGrh(this.assetManager.getGrh(numGrh));
                item.sprite.zOffset = -50; // para que item quede debajo de chars en misma cord Y ( para todo X)
                this.layer3.addChild(item.sprite);
                item.sprite.setPosition(item.x, item.y);
            },

            sacarItem: function (item) {
                if (!item.sprite)
                    return;
                this.layer3.removeChild(item.sprite);
                item.sprite = null;
            },

            agregarCharacter: function (char, Body, Head, Heading, X, Y, Weapon, Shield, Helmet, FX, FXLoops, Name, clan,
                                        NickColor) {
                var bodys = this._getHeadingsGrhs(this.cuerpos, Body);
                var heads = this._getHeadingsGrhs(this.cabezas, Head);
                var weapons = this._getHeadingsGrhs(this.armas, Weapon);
                var shields = this._getHeadingsGrhs(this.escudos, Shield);
                var helmets = this._getHeadingsGrhs(this.cascos, Helmet);
                var headOffX = 0;
                var headOffY = 0;
                if (this.cuerpos[Body]) {
                    headOffX = this.cuerpos[Body].offHeadX;
                    headOffY = this.cuerpos[Body].offHeadY;
                }
                var color = NickColor ? Enums.NickColor[Enums.NickColorIndex[NickColor]] : Enums.NickColor.CIUDADANO;
                var font = Enums.Font.NOMBRE;
                font.fill = color;

                var sprite = new CharacterSprites(Heading, bodys, heads, headOffX, headOffY, weapons, shields, helmets, Name, clan, font);
                sprite.setSombraSprite(this.assetManager.getGrh(24208));

                this.layer3.addChild(sprite);

                var self = this;
                sprite.setSpeed(char.moveSpeed);

                sprite.zOffset = -30; // para que quede debajo de los objetos del mapa en el mismo y
                char.sprite = sprite;

                char.texto = new CharacterText(this.escala);
                this.gameText.addChild(char.texto);

                char.setOnPositionChange(function () {
                    if (this.sprite) {
                        this.sprite.setPosition(this.x, this.y);
                    }
                    if (this.texto) {
                        this.texto.setPosition(this.x, this.y);
                    }
                }.bind(char));

                char.onPositionChange();
            },

            cambiarCharacter: function (char, Body, Head, Heading, Weapon, Shield, Helmet, FX, FXLoops) {
                var bodys = this._getHeadingsGrhs(this.cuerpos, Body);
                var heads = this._getHeadingsGrhs(this.cabezas, Head);
                var weapons = this._getHeadingsGrhs(this.armas, Weapon);
                var shields = this._getHeadingsGrhs(this.escudos, Shield);
                var helmets = this._getHeadingsGrhs(this.cascos, Helmet);
                var headOffX = 0;
                var headOffY = 0;
                if (this.cuerpos[Body]) {
                    headOffX = this.cuerpos[Body].offHeadX;
                    headOffY = this.cuerpos[Body].offHeadY;
                }
                // TODO (IMPORTANTE) que solo cambie los que son distintos!
                char.sprite.setBodys(bodys, headOffX, headOffY);
                char.sprite.setHeads(heads);
                char.sprite.setWeapons(weapons);
                char.sprite.setShields(shields);
                char.sprite.setHelmets(helmets);
                char.sprite._updateOrdenHijos();
            },

            cambiarNombreCharacter: function (char, nombre, clan, color) {
                var fontColor = color ? Enums.NickColor[Enums.NickColorIndex[color]] : Enums.NickColor.CIUDADANO;
                var font = Enums.Font.NOMBRE;
                font.fill = fontColor;
                char.sprite.setNombre(nombre, clan, font);
            },

            sacarCharacter: function (char) {
                this.layer3.removeChild(char.sprite);
                this.gameText.removeChild(char.texto);
                char.texto = null;
                char.sprite = null;
            },

            setCharacterChat: function (char, chat, r, g, b) {
                var color = "rgb(" + r + "," + g + "," + b + ")";
                char.texto.setChat(chat, color);
            },

            setCharVisible: function (char, visible) {
                char.sprite.setVisible(visible);
            },

            agregarCharacterHoveringInfo: function (char, valor, font, duracion) {
                char.texto.setHoveringInfo(valor, font, duracion);
            },

            setCharacterFX: function (char, FX, FXLoops) {
                var grh = this.assetManager.getGrh(this.fxs[FX].animacion);
                char.sprite.setFX(grh, this.fxs[FX].offX, this.fxs[FX].offY, FXLoops);
            },

            rescale: function (escala) { // TODO: que escale solo los graficos del juego, asi las letras no se ven feas (tendrian que estar en otro contenedor y agrandar el tamaño de las letras en vez del contenedor)
                this.escala = escala;
                this.pixiRenderer.resize(this.camera.gridW * this.tilesize * escala, this.camera.gridH * this.tilesize * escala);
                this.gameStage.scale.x = escala;
                this.gameStage.scale.y = escala;

                this.gameText.scale.x = 1 / escala;
                this.gameText.scale.y = 1 / escala;
                this._syncGamePosition();

                for (var i = 0; i < this.gameText.children.length; i++) {
                    this.gameText.children[i].setEscala(escala);
                }
                this.consola.setEscala(escala);
            },

            clean: function (escala) {
                while (this.stage.children.length > 0) {
                    var child = this.stage.getChildAt(0);
                    this.stage.removeChild(child);
                }
                this._initStage();
                this.rescale(escala);
            },

            setBajoTecho: function (bajoT) {
                this.layer4.visible = !bajoT;
            },

            drawMapaIni: function (gridX, gridY) { // SOLO USARLO EN CAMBIO DE MAPA, SINO USAR RESETPOS. Limpia vectores, dibuja el terreno del mapa, almacena los tiles animados
                log.error("dibujando inicialmente mapa, solo deberia pasar en cambio de map");
                this.resetCameraPosition(gridX, gridY);
                this._syncGamePosition();
                this._drawSpritesIni();
                this._drawTerrenoIni();
            },

            resetCameraPosition: function (gridX, gridY) { // hecha por mi
                this.camera.lookAtGridPos(gridX, gridY);
            },

            _syncGamePosition: function () {
                this.gameStage.x = -this.camera.x * this.escala;
                this.gameStage.y = -this.camera.y * this.escala;
            },

            entityVisiblePorCamara: function (entity, heightTileOffset) {
                if (!entity.sprite)
                    return false;

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
            },

            entityEnTileVisible: function (entity) { // puede que no este en un tile visible pero si sea visible la entidad (para eso usar el de arriba)
                return this.camera.isVisiblePosition(entity.gridX, entity.gridY, 0, 0);
            },

            moverPosition: function (x, y) {
                this.camera.mover(x, y);
                this._syncGamePosition();
            },

            updateTilesMov: function (dir) {
                this.updateTerrenoMov(dir);
                this.updateLayersMov(dir);
            },

            updateTerrenoMov: function (dir) { // al moverse mueve la columna/fila que queda atras al frente de todo
                var gridXIni = this.camera.gridX - this.POSICIONES_EXTRA_TERRENO;
                var gridYIni = this.camera.gridY - this.POSICIONES_EXTRA_TERRENO;
                var cols = this.camera.gridW + this.POSICIONES_EXTRA_TERRENO * 2;
                var rows = this.camera.gridH + this.POSICIONES_EXTRA_TERRENO * 2;

                switch (dir) {
                    case Enums.Heading.norte:
                        var j = (this._lowestRowTerreno === 0) ? rows - 1 : this._lowestRowTerreno - 1;
                        for (var i = 0; i < this.terreno.length; i++) {
                            this.terreno[i][j].setPosition(this.terreno[i][j].x, this.terreno[i][j].y - (rows * this.tilesize));
                            var grh = this.mapa.getGrh1(gridXIni + modulo(i - this._lowestColTerreno, cols), gridYIni - 1);
                            if (grh)
                                this.terreno[i][j].cambiarGrh(this.assetManager.getTerrenoGrh(grh));
                        }

                        this._lowestRowTerreno = modulo(this._lowestRowTerreno - 1, rows);
                        break;

                    case Enums.Heading.oeste:
                        var i = (this._lowestColTerreno === 0) ? cols - 1 : this._lowestColTerreno - 1;
                        for (var j = 0; j < this.terreno[i].length; j++) {
                            this.terreno[i][j].setPosition(this.terreno[i][j].x - (cols * this.tilesize), this.terreno[i][j].y);
                            var grh = this.mapa.getGrh1(gridXIni - 1, gridYIni + modulo(j - this._lowestRowTerreno, rows));
                            if (grh)
                                this.terreno[i][j].cambiarGrh(this.assetManager.getTerrenoGrh(grh));
                        }
                        this._lowestColTerreno = modulo(this._lowestColTerreno - 1, cols);
                        break;

                    case Enums.Heading.sur:
                        var j = this._lowestRowTerreno;
                        for (var i = 0; i < this.terreno.length; i++) {
                            this.terreno[i][j].setPosition(this.terreno[i][j].x, (this.terreno[i][j].y + (rows * this.tilesize)));
                            var grh = this.mapa.getGrh1(gridXIni + modulo(i - this._lowestColTerreno, cols), gridYIni + rows);
                            if (grh)
                                this.terreno[i][j].cambiarGrh(this.assetManager.getTerrenoGrh(grh));
                        }
                        this._lowestRowTerreno = modulo(this._lowestRowTerreno + 1, rows);
                        break;

                    case Enums.Heading.este:
                        var i = this._lowestColTerreno;
                        for (var j = 0; j < this.terreno[i].length; j++) {
                            this.terreno[i][j].setPosition((this.terreno[i][j].x + cols * this.tilesize), this.terreno[i][j].y);
                            var grh = this.mapa.getGrh1(gridXIni + cols, gridYIni + modulo(j - this._lowestRowTerreno, rows));
                            if (grh)
                                this.terreno[i][j].cambiarGrh(this.assetManager.getTerrenoGrh(grh));
                        }
                        this._lowestColTerreno = modulo(this._lowestColTerreno + 1, cols);
                        break;

                    default:
                        log.error("character heading invalido");
                        break;
                }
            },
            _removeChilds: function (padre, gridHijos) {
                _.each(gridHijos, function(fila){
                    _.each(fila, function(hijo){
                        if (hijo)
                            padre.removeChild(hijo);
                    });
                });
            },

            _drawSpritesIni: function () {

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
            },

            updateLayersMov: function (dir) {
                var self = this;
                this.camera.forEachVisibleNextLinea(dir, function (i, j) {
                    var screenX = i * self.tilesize;
                    var screenY = j * self.tilesize;
                    var grh2 = self.mapa.getGrh2(i, j);
                    var grh3 = self.mapa.getGrh3(i, j);
                    var grh4 = self.mapa.getGrh4(i, j);
                    if (grh2) {
                        if (self._spritesLayer2[i][j])
                            return;
                        nuevoSprite = new SpriteGrh(self.assetManager.getTerrenoGrh(grh2));
                        self.layer2.addChild(nuevoSprite);
                        nuevoSprite.setPosition(screenX, screenY);
                        self._spritesLayer2[i][j] = (nuevoSprite);
                    }
                    if (grh3) {
                        if (self._spritesLayer3[i][j])
                            return;
                        nuevoSprite = new SpriteGrh(self.assetManager.getGrh(grh3));
                        self.layer3.addChild(nuevoSprite);
                        nuevoSprite.setPosition(screenX, screenY);
                        self._spritesLayer3[i][j] = (nuevoSprite);
                    }
                    if (grh4) {
                        if (self._spritesLayer4[i][j])
                            return;
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
            },

            resetPos: function (gridX, gridY) {
                this.drawMapaIni(gridX, gridY);
                //this.resetCameraPosition(gridX, gridY);
                //this._syncGamePosition();
                //this._drawTerrenoIni();
            },

            toggleLluvia: function () {
                if (this.containerLluvia)
                    this.hideLluvia();
                else
                    this.showLluvia();
            },

            hideLluvia: function () {
                if (!this.containerLluvia)
                    return;
                PIXI.ticker.shared.remove(this._updateGotas, this);
                this.stage.removeChild(this.containerLluvia);
                this.gotas = null;
                this.containerLluvia = null;
            },

            showLluvia: function () {
                if (this.containerLluvia)
                    return;
                this.gotas = [];
                this.containerLluvia = new PIXI.ParticleContainer();
                var indice = this.stage.getChildIndex(this.gameStage) + 1;
                this.stage.addChildAt(this.containerLluvia, indice);
                this.gameStage.addChild(this.layer4);

                var anguloBase = Math.random() * (Math.PI / 12) + Math.PI / 12;

                var velocidad = 7 + Math.pow(anguloBase, 2) * 15;
                var cantidadGotas = Math.floor((100 + anguloBase * 250) * this.escala);
                if (Math.random() < 0.5)
                    anguloBase = -anguloBase;
                for (var i = 0; i < cantidadGotas; ++i) {
                    var gota = new PIXI.Sprite.fromImage("graficos/extras/gota.png");

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
            },

            _updateGotas: function (delta) {
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
            },

            renderFrame: function () {
                this.pixiRenderer.render(this.stage);
            },

            getNumGraficoFromGrh: function (grh) {
                if (this.indices[grh] && this.indices[grh].grafico)
                    return this.indices[grh].grafico;
            },

            cambiarMapa: function (mapa) {
                this.mapa = mapa;
            },

        });
        return Renderer;
    });
