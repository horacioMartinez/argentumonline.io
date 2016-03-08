define(['camera', 'item', 'character', 'player', 'timer', 'tileanimado', 'lib/pixi', 'charactersprites', 'spritegrh', 'consola'],
    function (Camera, Item, Character, Player, Timer, TileAnimado, PIXI, CharacterSprites, SpriteGrh, Consola) {

        var Renderer = Class.extend({
            init: function (game, canvas, background, foreground, assetManager) {
                this.POSICIONES_EXTRA_RENDER_X = 4; // disminuir para aumentar performance ( no creo que cambie mucho ya que solo dibuja las porciones visibles, pero tiene que iterar en cada frame por todas las pos..)
                this.POSICIONES_EXTRA_RENDER_Y = 8; // disminuir para aumentar performance
                this.POSICIONES_EXTRA_TERRENO = 1; // no deberia ser necesario mas de una. (una pos extra en cada una de las 4 direcciones)
                this.game = game;

                this.indices = game.indices;
                this.assetManager = assetManager;
                this.grhs = assetManager.grhs;
                this.indices = this.assetManager.getIndices();
                this.armas = this.assetManager.getArmas();
                this.cabezas = this.assetManager.getCabezas();
                this.cascos = this.assetManager.getCascos();
                this.cuerpos = this.assetManager.getCuerpos();
                this.escudos = this.assetManager.getEscudos();
                this.fxs = this.assetManager.getFxs();
                this.graficos = this.assetManager.getGraficos();

                this.camera = new Camera(this);
                this._initPixi();

                this.tilesize = 32;

                this.rescale();

                this.tablet = Detect.isTablet(window.innerWidth);

            },

            _initPixi: function () {

                this.pixiRenderer = new PIXI.autoDetectRenderer(544, 416);

                document.getElementById("gamecanvas").appendChild(this.pixiRenderer.view);

                this.stage = new PIXI.Container();
                this.gameStage = new PIXI.Container();
                this.layer1 = new PIXI.Container();
                this.layer2 = new PIXI.Container();
                this.layer3 = new PIXI.Container();
                this.layer3.ordenado = true;
                this.layer4 = new PIXI.Container();
                this.gameText = new PIXI.Container();
                this.consola = new Consola();
                this.stage.addChild(this.gameStage);
                this.stage.addChild(this.consola);
                this.gameStage.addChild(this.layer1);
                this.gameStage.addChild(this.layer2);
                this.gameStage.addChild(this.layer3);
                this.gameStage.addChild(this.gameText); // todo? gametext abajo o arriba de layer4?
                this.gameStage.addChild(this.layer4);
                this._initTerrenoSpriteGrid(this.layer1);
            },

            _limpiarVecSprites: function (vec) {
                if (vec)
                    for (var i = 0; i < vec.length; i++) {
                        vec[i].remover();
                    }
            },

            _drawSpritesIni: function () { // dibuja TODOS los sprites del mapa de las layers 2,3,4: TODO: obviamente que no dibuje todo
                this._limpiarVecSprites(this._spritesLayer2);
                this._limpiarVecSprites(this._spritesLayer3);
                this._limpiarVecSprites(this._spritesLayer4);
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
                            var nuevoSprite = new SpriteGrh(this.layer2, this.grhs[grh2]);
                            nuevoSprite.setPosition(screenX, screenY);
                            this._spritesLayer2.push(nuevoSprite);
                        }
                        if (grh3) {
                            var nuevoSprite = new SpriteGrh(this.layer3, this.grhs[grh3]);
                            nuevoSprite.setPosition(screenX, screenY);
                            this._spritesLayer3.push(nuevoSprite);
                        }
                        if (grh4) {
                            nuevoSprite = new SpriteGrh(this.layer4, this.grhs[grh4]);
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
                        this.terreno[i][j] = new SpriteGrh(layer1);
                    }
                }
            },

            _ordenarLayer3: function () { // TODO (IMPORTANTE): no ordenar cada vez, sino insertar con una busqueda binaria, fijarse los z = (gridY * 1000 + (101-gridX)); hardcodeados en charsprites y spritegrh
                this.layer3.children.sort(function (a, b) {
                    a.zIndex = a.zIndex || 0;
                    b.zIndex = b.zIndex || 0;
                    return a.zIndex - b.zIndex
                });
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
                item.sprite = new SpriteGrh(this.layer3, this.grhs[numGrh]);
                item.sprite.setPosition(item.x, item.y);
                this._ordenarLayer3();
            },

            removerItem: function (item) {
                if (!item.sprite)
                    return;
                item.sprite.remover();
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
                sprite.setOnZindexChange(function () {
                    self._ordenarLayer3();
                });
                sprite.setSpeed(char.moveSpeed);
                sprite.setPosition(char.x, char.y);
                char.sprite = sprite;
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
                char.sprite.setHeads(heads, true);
                char.sprite.setWeapons(weapons, true);
                char.sprite.setShields(shields, true);
                char.sprite.setHelmets(helmets, true);
                char.sprite._updateOrdenHijos();
            },

            sacarCharacter: function (char) {
                this.layer3.removeChild(char.sprite);
                char.sprite = null;
            },

            setCharacterChat: function (char, chat) {
                char.sprite.setChat(chat);
            },

            setCharacterFX: function (char, FX, FXLoops) {
                var grh = this.grhs[this.fxs[FX].animacion];
                char.sprite.setFX(grh, this.fxs[FX].offX, this.fxs[FX].offY, FXLoops);
            },

            rescale: function () {
                this.scale = __ESCALA__;
                if (this.game.player)
                    this.resetPos(this.game.player.gridX, this.game.player.gridY);
            },

            setBajoTecho: function (bajoT) {
                this.layer4.visible = !bajoT;
            },

            drawMapaIni: function (gridX, gridY) { // SOLO USARLO EN CAMBIO DE MAPA, SINO USAR RESETPOS. Limpia vectores, dibuja el terreno del mapa, almacena los tiles animados
                log.error("dibujando inicialmente mapa, solo deberia pasar en cambio de map");
                this.resetCameraPosition(gridX, gridY);
                this.gameStage.x = -this.camera.x;
                this.gameStage.y = -this.camera.y;
                this._drawTerrenoIni();
                this._drawSpritesIni();
            },

            resetCameraPosition: function (gridX, gridY) { // hecha por mi
                this.camera.lookAtGridPos(gridX, gridY);
            },

            entityEnRangoVisible: function (entity) {
                return this.camera.isVisiblePosition(entity.gridX, entity.gridY, this.POSICIONES_EXTRA_RENDER_X, this.POSICIONES_EXTRA_RENDER_Y);
            },

            // TODO: probar crear una imagen del terreno con el mapa entero (antes y tenerla guardada o al logear con el pj) y al moverse ir clipeandola
            moverPosition: function (x, y) {
                this.camera.mover(x, y);
                this.gameStage.x = -this.camera.x;
                this.gameStage.y = -this.camera.y;
            },

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
                            this.terreno[i][j].setY(this.terreno[i][j].getPosition().y - (rows * this.tilesize));
                            var grh = this.game.map.getGrh1(gridXIni + modulo(i - this._lowestColTerreno, cols), gridYIni - 1);
                            if (grh)
                                this.terreno[i][j].cambiarGrh(this.grhs[grh]);
                        }

                        this._lowestRowTerreno = modulo(this._lowestRowTerreno - 1, rows);
                        break;

                    case Enums.Heading.oeste:
                        var i = (this._lowestColTerreno === 0) ? cols - 1 : this._lowestColTerreno - 1;
                        for (var j = 0; j < this.terreno[i].length; j++) {
                            this.terreno[i][j].setX(this.terreno[i][j].getPosition().x - (cols * this.tilesize));
                            var grh = this.game.map.getGrh1(gridXIni - 1, gridYIni + modulo(j - this._lowestRowTerreno, rows));
                            if (grh)
                                this.terreno[i][j].cambiarGrh(this.grhs[grh]);
                        }
                        this._lowestColTerreno = modulo(this._lowestColTerreno - 1, cols);
                        break;

                    case Enums.Heading.sur:
                        var j = this._lowestRowTerreno;
                        for (var i = 0; i < this.terreno.length; i++) {
                            this.terreno[i][j].setY(this.terreno[i][j].getPosition().y + (rows * this.tilesize));
                            var grh = this.game.map.getGrh1(gridXIni + modulo(i - this._lowestColTerreno, cols), gridYIni + rows);
                            if (grh)
                                this.terreno[i][j].cambiarGrh(this.grhs[grh]);
                        }
                        this._lowestRowTerreno = modulo(this._lowestRowTerreno + 1, rows);
                        break;

                    case Enums.Heading.este:
                        var i = this._lowestColTerreno;
                        for (var j = 0; j < this.terreno[i].length; j++) {
                            this.terreno[i][j].setX(this.terreno[i][j].getPosition().x + cols * this.tilesize);
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
                this.gameStage.x = -this.camera.x;
                this.gameStage.y = -this.camera.y;
                this._drawTerrenoIni();
            },

            renderFrame: function () {
                this.pixiRenderer.render(this.stage);
            },
        });
        return Renderer;
    });
