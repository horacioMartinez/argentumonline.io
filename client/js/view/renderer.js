define(['view/camera', 'item', 'character', 'player', 'timer', 'lib/pixi', 'view/charactersprites', 'view/consola', 'view/charactertext', 'view/spritegrh', 'view/containerordenado'],
    function (Camera, Item, Character, Player, Timer, PIXI, CharacterSprites, Consola, CharacterText, SpriteGrh, ContainerOrdenado) {

        var Renderer = Class.extend({
            init: function (game, assetManager, escala) {
                this.POSICIONES_EXTRA_RENDER_X = 4; //TODO
                this.POSICIONES_EXTRA_RENDER_Y = 8; //TODO
                this.POSICIONES_EXTRA_TERRENO = 1; // no deberia ser necesario mas de una. (una pos extra en cada una de las 4 direcciones)

                this.game = game;
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

            },

            _inicializarPixi: function () {
                this.pixiRenderer = new PIXI.autoDetectRenderer(this.camera.gridW * this.tilesize, this.camera.gridH * this.tilesize);
                $(this.pixiRenderer.view).css('position', 'relative');
                $("#gamecanvas").append(this.pixiRenderer.view);
                this._initStage()
            },

            _initStage: function () {
                this.stage = new PIXI.Container();
                this.gameStage = new PIXI.Container();
                this.layer1 = new PIXI.Container();
                this.layer2 = new PIXI.Container();
                this.layer3 = new ContainerOrdenado(this.game.map.width);
                this.layer3.ordenado = true;
                this.layer4 = new PIXI.Container();
                this.gameText = new PIXI.Container();
                this.consola = new Consola(this.escala);
                this.stage.addChild(this.gameStage);
                this.stage.addChild(this.consola);
                this.gameStage.addChild(this.layer1);
                this.gameStage.addChild(this.layer2);
                this.gameStage.addChild(this.layer3);
                this.gameStage.addChild(this.gameText); // todo? gametext abajo o arriba de layer4?
                this.gameStage.addChild(this.layer4);
                this._initTerrenoSpriteGrid(this.layer1);
            },

            _removeChilds: function (padre, hijos) {
                if (hijos)
                    for (var i = 0; i < hijos.length; i++) {
                        padre.removeChild(hijos[i]);
                    }
            },

            _drawSpritesIni: function () { // dibuja TODOS los sprites del mapa de las layers 2,3,4: TODO: obviamente que no dibuje todo
                this._removeChilds(this.layer2, this._spritesLayer2);
                this._removeChilds(this.layer3, this._spritesLayer3);
                this._removeChilds(this.layer4, this._spritesLayer4);
                this._spritesLayer2 = [];
                this._spritesLayer3 = [];
                this._spritesLayer4 = [];

                for (var i = 1; i < this.game.map.width + 1; i++) {
                    for (var j = 1; j < this.game.map.height + 1; j++) {
                        var screenX = i * this.tilesize;
                        var screenY = j * this.tilesize;
                        var grh2 = this.game.map.getGrh2(i, j);
                        var grh3 = this.game.map.getGrh3(i, j);
                        var grh4 = this.game.map.getGrh4(i, j);
                        if (grh2) {
                            var nuevoSprite = new SpriteGrh(this.grhs[grh2]);
                            this.layer2.addChild(nuevoSprite);
                            nuevoSprite.setPosition(screenX, screenY);
                            this._spritesLayer2.push(nuevoSprite);
                        }
                        if (grh3) {
                            var nuevoSprite = new SpriteGrh(this.grhs[grh3]);
                            this.layer3.addChild(nuevoSprite);
                            nuevoSprite.setPosition(screenX, screenY);
                            this._spritesLayer3.push(nuevoSprite);
                        }
                        if (grh4) {
                            nuevoSprite = new SpriteGrh(this.grhs[grh4]);
                            this.layer4.addChild(nuevoSprite);
                            nuevoSprite.setPosition(screenX, screenY);
                            this._spritesLayer4.push(nuevoSprite);
                        }
                    }
                }

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

                        if (this.game.map.getGrh1(gridXIni + i, gridYIni + j))
                            this.terreno[i][j].cambiarGrh(this.grhs[this.game.map.getGrh1(gridXIni + i, gridYIni + j)]);
                    }
                }

            },

            _initTerrenoSpriteGrid: function (layer1) {

                this.terreno = [];
                for (var i = 0; i < this.camera.gridW + this.POSICIONES_EXTRA_TERRENO * 2; i++) {
                    this.terreno[i] = [];
                    for (var j = 0; j < this.camera.gridH + this.POSICIONES_EXTRA_TERRENO * 2; j++) {
                        this.terreno[i][j] = new SpriteGrh(this.grhs[1]); // grh null <-- todo (poco importante) arreglar esto?
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
                res[Enums.Heading.norte] = this.grhs[varIndice[num].up];
                res[Enums.Heading.este] = this.grhs[varIndice[num].right];
                res[Enums.Heading.sur] = this.grhs[varIndice[num].down];
                res[Enums.Heading.oeste] = this.grhs[varIndice[num].left];
                return res;
            },

            agregarTextoConsola: function (texto, font) {
                this.consola.agregarTexto(texto, font);
            },

            agregarItem: function (item, numGrh) {
                if (!this.grhs[numGrh]) {
                    log.error("grh de item invalido!")
                    return;
                }
                item.sprite = new SpriteGrh(this.grhs[numGrh]);
                item.sprite.zOffset = -this.game.map.width; // para que item quede debajo de chars en misma cord Y ( para todo X)
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

                var sprite = new CharacterSprites(Heading, bodys, heads, headOffX, headOffY, weapons, shields, helmets, Enums.Font.NOMBRE, Name, clan); //(Heading, bodys, heads, weapons, shields, helmets, FXGrh, FXLoops, Name) {
                sprite.setSombraSprite(this.grhs[24208]);

                this.layer3.addChild(sprite);

                var self = this;
                sprite.setSpeed(char.moveSpeed);
                char.sprite = sprite;

                char.texto = new CharacterText(this.escala);
                this.gameText.addChild(char.texto);

                char.onPositionChange = function () {
                    if (this.sprite)
                        this.sprite.setPosition(this.x, this.y);
                    if (this.texto) {
                        this.texto.x = this.x * self.escala;
                        this.texto.y = this.y * self.escala;
                    }
                };
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

            sacarCharacter: function (char) {
                this.layer3.removeChild(char.sprite);
                this.gameText.removeChild(char.texto);
                char.texto = null;
                char.sprite = null;
            },

            setCharacterChat: function (char, chat) {
                char.texto.setChat(chat);
            },

            setCharacterFX: function (char, FX, FXLoops) {
                var grh = this.grhs[this.fxs[FX].animacion];
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
                this.game.forEachCharacter(function (c) {
                    if (c.onPositionChange)
                        c.onPositionChange();
                    if (c.texto)
                        c.texto.setEscala(escala);
                });
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
                this._drawTerrenoIni();
                this._drawSpritesIni();
            },

            resetCameraPosition: function (gridX, gridY) { // hecha por mi
                this.camera.lookAtGridPos(gridX, gridY);
            },

            _syncGamePosition: function () {
                this.gameStage.x = -this.camera.x * this.escala;
                this.gameStage.y = -this.camera.y * this.escala;
            },

            entityEnRangoVisible: function (entity) {
                return this.camera.isVisiblePosition(entity.gridX, entity.gridY, this.POSICIONES_EXTRA_RENDER_X, this.POSICIONES_EXTRA_RENDER_Y);
            },


            moverPosition: function (x, y) {
                this.camera.mover(x, y);
                this._syncGamePosition();
            },

            // TODO: probar crear una imagen del terreno con el mapa entero y al moverse ir clipeandola
            _updateTilesMov: function (dir) { // al moverse mueve la columna/fila que queda atras al frente de todo
                // todo (POCO IMPORTANTE): arreglar bien y usar camera.foreachvisiblenextposition
                var gridXIni = this.camera.gridX - this.POSICIONES_EXTRA_TERRENO;
                var gridYIni = this.camera.gridY - this.POSICIONES_EXTRA_TERRENO;
                var cols = this.camera.gridW + this.POSICIONES_EXTRA_TERRENO * 2;
                var rows = this.camera.gridH + this.POSICIONES_EXTRA_TERRENO * 2;

                switch (dir) {
                    case Enums.Heading.norte:
                        var j = (this._lowestRowTerreno === 0) ? rows - 1 : this._lowestRowTerreno - 1;
                        for (var i = 0; i < this.terreno.length; i++) {
                            this.terreno[i][j].setPosition(this.terreno[i][j].x,this.terreno[i][j].y - (rows * this.tilesize));
                            var grh = this.game.map.getGrh1(gridXIni + modulo(i - this._lowestColTerreno, cols), gridYIni - 1);
                            if (grh)
                                this.terreno[i][j].cambiarGrh(this.grhs[grh]);
                        }

                        this._lowestRowTerreno = modulo(this._lowestRowTerreno - 1, rows);
                        break;

                    case Enums.Heading.oeste:
                        var i = (this._lowestColTerreno === 0) ? cols - 1 : this._lowestColTerreno - 1;
                        for (var j = 0; j < this.terreno[i].length; j++) {
                            this.terreno[i][j].setPosition(this.terreno[i][j].x - (cols * this.tilesize),this.terreno[i][j].y);
                            var grh = this.game.map.getGrh1(gridXIni - 1, gridYIni + modulo(j - this._lowestRowTerreno, rows));
                            if (grh)
                                this.terreno[i][j].cambiarGrh(this.grhs[grh]);
                        }
                        this._lowestColTerreno = modulo(this._lowestColTerreno - 1, cols);
                        break;

                    case Enums.Heading.sur:
                        var j = this._lowestRowTerreno;
                        for (var i = 0; i < this.terreno.length; i++) {
                            this.terreno[i][j].setPosition(this.terreno[i][j].x,(this.terreno[i][j].y + (rows * this.tilesize)));
                            var grh = this.game.map.getGrh1(gridXIni + modulo(i - this._lowestColTerreno, cols), gridYIni + rows);
                            if (grh)
                                this.terreno[i][j].cambiarGrh(this.grhs[grh]);
                        }
                        this._lowestRowTerreno = modulo(this._lowestRowTerreno + 1, rows);
                        break;

                    case Enums.Heading.este:
                        var i = this._lowestColTerreno;
                        for (var j = 0; j < this.terreno[i].length; j++) {
                            this.terreno[i][j].setPosition((this.terreno[i][j].x + cols * this.tilesize),this.terreno[i][j].y);
                            var grh = this.game.map.getGrh1(gridXIni + cols, gridYIni + modulo(j - this._lowestRowTerreno, rows));
                            if (grh)
                                this.terreno[i][j].cambiarGrh(this.grhs[grh]);
                        }
                        this._lowestColTerreno = modulo(this._lowestColTerreno + 1, cols);
                        break;

                    default:
                        log.error("character heading invalido");
                        break;
                }
            },
            resetPos: function (gridX, gridY) {
                this.resetCameraPosition(gridX, gridY);
                this._syncGamePosition();
                this._drawTerrenoIni();
            },

            renderFrame: function () {
                this.pixiRenderer.render(this.stage);
            },

            getNumGraficoFromGrh: function (grh) {
                if (this.indices[grh] && this.indices[grh].grafico)
                    return this.indices[grh].grafico;
            },

        });
        return Renderer;
    });
