define(['camera', 'item', 'character', 'player', 'timer', 'tileanimado', 'enums'],
    function (Camera, Item, Character, Player, Timer, TileAnimado, Enums) {

        var Renderer = Class.extend({
            init: function (game, canvas, background, foreground, loader) {
                this.ALTO_LETRAS_CHAT = 12;
                this.POSICIONES_EXTRA_RENDER_X = 4; // disminuir para aumentar performance ( no creo que cambie mucho ya que solo dibuja las porciones visibles, pero tiene que iterar en cada frame por todas las pos..)
                this.POSICIONES_EXTRA_RENDER_Y = 8; // disminuir para aumentar performance
                this.INTERFAZ_OFFSET_X = 0;//12; // ofset en pixels de donde dibujar los graficos debido a la interfaz
                this.INTERFAZ_OFFSET_Y = 0;//33; // TODO: SACAR
                this.game = game;
                this.indices = game.indices;
                this.loader = loader;
                this.graficos = this.loader.getGraficos();

                this.tilesAnimados = []; // vector continuo que tiene todos los tileanimados agregados (se usa para udpate)
                this.tilesAnimadosGrid = []; // vector 3-D que contiene tiles animados en [x][y][layer]
                for (var i = 1; i < 101; i += 1) { // TODO: cambiar numeros hardcodeados
                    this.tilesAnimadosGrid[i] = [];
                    for (var j = 1; j < 101; j += 1) {
                        this.tilesAnimadosGrid[i][j] = [];
                    }
                }

                log.info("Initialized the entity grid.");
                this.context = (canvas && canvas.getContext) ? canvas.getContext("2d") : null;
                this.background = (background && background.getContext) ? background.getContext("2d") : null;
                this.foreground = (foreground && foreground.getContext) ? foreground.getContext("2d") : null;
                this.interfaz = (interfaz && interfaz.getContext) ? interfaz.getContext("2d") : null;

                this.canvas = canvas;
                this.backcanvas = background;
                this.forecanvas = foreground;

                this.initFPS();
                this.tilesize = 32;

                this.upscaledRendering = this.context.mozImageSmoothingEnabled !== undefined;
                this.supportsSilhouettes = this.upscaledRendering;

                this.rescale();

                this.lastTime = new Date();
                this.frameCount = 0;
                this.maxFPS = this.FPS;
                this.realFPS = 0;
                //Turn on or off Debuginfo (FPS Counter)
                this.isDebugInfoVisible = true; // TODO : volver a poner false

                this.tablet = Detect.isTablet(window.innerWidth);

                this.fixFlickeringTimer = new Timer(100);

            },

            getWidth: function () {
                return this.canvas.width;
            },

            getHeight: function () {
                return this.canvas.height;
            },

            setTileset: function (tileset) {
                this.tileset = tileset;
            },

            getScaleFactor: function () {
                /*var w = window.innerWidth,
                 h = window.innerHeight,
                 scale;

                 this.mobile = false;

                 if (w <= 1000) {
                 scale = 2;
                 this.mobile = true;
                 }
                 else if (w <= 1500 || h <= 870) {
                 scale = 2;
                 }
                 else {
                 scale = 3;
                 }*/
                this.mobile = false;
                var scale = 1; // TODO
                return scale;
            },

            rescale: function () {
                this.scale = __ESCALA__;
                this.createCamera();
                if (this.game.player)
                    this.resetPos(this.game.player.gridX,this.game.player.gridY);
                else
                    this.resetCanvases();
            },

            createCamera: function () {
                this.camera = new Camera(this);

                this.canvas.width = this.camera.gridW * this.tilesize * this.scale;// * this.scale;
                this.canvas.height = this.camera.gridH * this.tilesize * this.scale;// * this.scale;
                log.debug("#entities set to " + this.canvas.width + " x " + this.canvas.height);

                this.backcanvas.width = this.canvas.width;
                this.backcanvas.height = this.canvas.height;
                log.debug("#background set to " + this.backcanvas.width + " x " + this.backcanvas.height);

                this.forecanvas.width = this.canvas.width;
                this.forecanvas.height = this.canvas.height;
                log.debug("#foreground set to " + this.forecanvas.width + " x " + this.forecanvas.height);
            },

            initFPS: function () {
                this.FPS = this.mobile ? 50 : 50;
            },

            initFont: function () {
                var fontsize;

                switch (this.scale) {
                    case 1:
                        fontsize = 10;
                        break;
                    case 2:
                        fontsize = Detect.isWindows() ? 10 : 13;
                        break;
                    case 3:
                        fontsize = 20;
                }
                this.setFontSize(fontsize);
            },

            setFontSize: function (size) {
                var font = size + "px GraphicPixel";

                this.context.font = font;
                this.background.font = font;
            },

            drawText: function (text, x, y, centered, color, strokeColor) {
                var ctx = this.context,
                    strokeSize;

                switch (this.scale) {
                    case 1:
                        strokeSize = 3;
                        break;
                    case 2:
                        strokeSize = 3;
                        break;
                    case 3:
                        strokeSize = 5;
                }
                if (text && x && y) {
                    ctx.save();
                    if (centered) {
                        ctx.textAlign = "center";
                    }
                    ctx.strokeStyle = strokeColor || "#373737";
                    ctx.lineWidth = strokeSize;
                    ctx.strokeText(text, x, y);
                    ctx.fillStyle = color || "white";
                    ctx.fillText(text, x, y);
                    ctx.restore();
                }
            },

            drawCellRect: function (x, y, color) {
                this.context.save();
                this.context.lineWidth = 2 * this.scale;
                this.context.strokeStyle = color;
                this.context.translate(x + 2, y + 2);
                this.context.strokeRect(0, 0, (this.tilesize * this.scale) - 4, (this.tilesize * this.scale) - 4);
                this.context.restore();
            },
            drawRectStroke: function (x, y, width, height, color) {
                this.context.fillStyle = color;
                this.context.fillRect(x, y, (this.tilesize * this.scale) * width, (this.tilesize * this.scale) * height);
                this.context.fill();
                this.context.lineWidth = 5;
                this.context.strokeStyle = 'black';
                this.context.strokeRect(x, y, (this.tilesize * this.scale) * width, (this.tilesize * this.scale) * height);
            },
            drawRect: function (x, y, width, height, color) {
                this.context.fillStyle = color;
                this.context.fillRect(x, y, (this.tilesize * this.scale) * width, (this.tilesize * this.scale) * height);
            },

            drawCellHighlight: function (x, y, color) {
                var s = this.scale,
                    ts = this.tilesize,
                    tx = x * ts * s,
                    ty = y * ts * s;

                this.drawCellRect(tx, ty, color);
            },

            drawTargetCell: function () {
                var mouse = this.game.getMouseGridPosition();

                if (this.game.targetCellVisible && !(mouse.x === this.game.selectedX && mouse.y === this.game.selectedY)) {
                    this.drawCellHighlight(mouse.x, mouse.y, this.game.targetColor);
                }
            },

            drawAttackTargetCell: function () {
                var mouse = this.game.getMouseGridPosition(),
                    entity = this.game.getEntityAt(mouse.x, mouse.y),
                    s = this.scale;

                if (entity) {
                    this.drawCellRect(entity.x * s, entity.y * s, "rgba(255, 0, 0, 0.5)");
                }
            },

            drawOccupiedCells: function () {
                var positions = this.game.entityGrid;

                if (positions) {
                    for (var i = 0; i < positions.length; i += 1) {
                        for (var j = 0; j < positions[i].length; j += 1) {
                            if (!_.isNull(positions[i][j])) {
                                this.drawCellHighlight(i, j, "rgba(50, 50, 255, 0.5)");
                            }
                        }
                    }
                }
            },

            drawPathingCells: function () {
                var grid = this.game.pathingGrid;

                if (grid && this.game.debugPathing) {
                    for (var y = 0; y < grid.length; y += 1) {
                        for (var x = 0; x < grid[y].length; x += 1) {
                            if (grid[y][x] === 1 && this.game.camera.isVisiblePosition(x, y)) {
                                this.drawCellHighlight(x, y, "rgba(50, 50, 255, 0.5)");
                            }
                        }
                    }
                }
            },

            drawSelectedCell: function () {
                var sprite = this.game.cursors["target"],
                    anim = this.game.targetAnimation,
                    os = this.upscaledRendering ? 1 : this.scale,
                    ds = this.upscaledRendering ? this.scale : 1;

                if (this.game.selectedCellVisible) {
                    if (this.mobile || this.tablet) {
                        if (this.game.drawTarget) {
                            var x = this.game.selectedX,
                                y = this.game.selectedY;

                            this.drawCellHighlight(this.game.selectedX, this.game.selectedY, "rgb(51, 255, 0)");
                            this.lastTargetPos = {
                                x: x,
                                y: y
                            };
                            this.game.drawTarget = false;
                        }
                    } else {
                        if (sprite && anim) {
                            var frame = anim.currentFrame,
                                s = this.scale,
                                x = frame.x * os,
                                y = frame.y * os,
                                w = sprite.width * os,
                                h = sprite.height * os,
                                ts = 32,
                                dx = this.game.selectedX * ts * s,
                                dy = this.game.selectedY * ts * s,
                                dw = w * ds,
                                dh = h * ds;

                            this.context.save();
                            this.context.translate(dx, dy);
                            this.context.drawImage(sprite.image, x, y, w, h, 0, 0, dw, dh);
                            this.context.restore();
                        }
                    }
                }
            },

            clearScaledRect: function (ctx, x, y, w, h) {
                var s = this.scale;

                ctx.clearRect(x * s, y * s, w * s, h * s);
            },

            drawCursor: function () {
                var mx = this.game.mouse.x,
                    my = this.game.mouse.y,
                    s = this.scale,
                    os = this.upscaledRendering ? 1 : this.scale;

                this.context.save();
                if (this.game.currentCursor && this.game.currentCursor.isLoaded) {
                    this.context.drawImage(this.game.currentCursor.image, 0, 0, 14 * os, 14 * os, mx, my, 14 * s, 14 * s);
                }
                this.context.restore();
            },

            drawScaledImage: function (ctx, image, x, y, w, h, dx, dy) {
                var s = this.upscaledRendering ? 1 : this.scale;
                _.each(arguments, function (arg) {
                    if (_.isUndefined(arg) || _.isNaN(arg) || _.isNull(arg) || arg < 0) {
                        log.error("x:" + x + " y:" + y + " w:" + w + " h:" + h + " dx:" + dx + " dy:" + dy, true);
                        throw Error("A problem occured when trying to draw on the canvas");
                    }
                });
                ctx.drawImage(image,
                    x * s,
                    y * s,
                    w * s,
                    h * s,
                    dx * this.scale,
                    dy * this.scale,
                    w * this.scale,
                    h * this.scale);
            },

            drawTilesAnimados: function (gridX, gridY) {
                for (var i = 1; i < 2; i++) { //tiles del layers de abajo ( se vuelve a dibujar solo si estan diry)
                    if (this.tilesAnimadosGrid[gridX][gridY][i])
                        if (this.tilesAnimadosGrid[gridX][gridY][i].isDirty) {
                            this.drawGrh(this.background, this.tilesAnimadosGrid[gridX][gridY][i].getCurrentFrame(), this.tilesAnimadosGrid[gridX][gridY][i].x, this.tilesAnimadosGrid[gridX][gridY][i].y);
                            this.tilesAnimadosGrid[gridX][gridY][i].isDirty = false;
                        }
                }

                //layer3
                if (this.tilesAnimadosGrid[gridX][gridY][3])
                    this.drawGrh(this.context, this.tilesAnimadosGrid[gridX][gridY][3].getCurrentFrame(), this.tilesAnimadosGrid[gridX][gridY][3].x, this.tilesAnimadosGrid[gridX][gridY][3].y);

                if (this.tilesAnimadosGrid[gridX][gridY][4])
                    this.drawGrh(this.foreground, this.tilesAnimadosGrid[gridX][gridY][4].getCurrentFrame(), this.tilesAnimadosGrid[gridX][gridY][4].x, this.tilesAnimadosGrid[gridX][gridY][4].y);

            },

            drawPosicionesLoop: function () { // TODO: (mucho menos imporatnte que lo de abajo) seria mas eficiente tener las entidades a dibujar y demas del this.context en un vector ordenado por pos (ver metodo de busqueda bin en game.js) y dibujarlos en orden (contal la mayoria de posiciones son terreno y no hace falta dibujar en cada frame (abajo se dibujan de vez en cuando mientras se mueve) )
                // TODO: MAS IMPORTANTE ->>>> setear dirtys de entidades y demas del this.context como en browserquest para no dibujar todo cada frame
                var self = this;

                //terreno:
                if (this.dibujarTerrenoYTechos)
                    this.clearScreen(this.foreground); // el background no se limpia porque contal siempre se dibuja entero
                this.camera.forEachVisiblePosition(function (gridX, gridY) {

                    if (self.dibujarTerrenoYTechos) {
                        self.drawLayer(1, gridX, gridY);
                        self.drawLayer(2, gridX, gridY);
                        self.drawLayer(4, gridX, gridY);
                    }

                    if (self.game.entityGrid[gridX][gridY][0])
                        self.drawItem(self.game.entityGrid[gridX][gridY][0]);
                    if (self.game.entityGrid[gridX][gridY][1])
                        self.drawCharacter(self.game.entityGrid[gridX][gridY][1]);
                    self.drawTilesAnimados(gridX, gridY);

                    //layers de arriba:
                    self.drawLayer(3, gridX, gridY);
                }, this.POSICIONES_EXTRA_RENDER_X, this.POSICIONES_EXTRA_RENDER_Y);
                this.dibujarTerrenoYTechos = false;
                this.drawCombatInfo(); // MAL, esto tiene que ir en interfaz, ver TODO en infomangaer
            },

            drawCharacter: function (char) {
                if (char.isVisible()) {
                    if (char.hasShadow()) {
                        this.drawSombra(char);
                    }

                    switch (char.heading) {
                        case Enums.Heading.norte:
                            this.drawGrh(this.context, char.getShieldGrh(), char.x, char.y);
                            this.drawGrh(this.context, char.getWeaponGrh(), char.x, char.y);
                            this.drawGrh(this.context, char.getBodyGrh(), char.x, char.y);
                            break;
                        case Enums.Heading.sur:
                            this.drawGrh(this.context, char.getBodyGrh(), char.x, char.y);
                            this.drawGrh(this.context, char.getWeaponGrh(), char.x, char.y);
                            this.drawGrh(this.context, char.getShieldGrh(), char.x, char.y);
                            break;
                        case Enums.Heading.este:
                            this.drawGrh(this.context, char.getShieldGrh(), char.x, char.y);
                            this.drawGrh(this.context, char.getWeaponGrh(), char.x, char.y);
                            this.drawGrh(this.context, char.getBodyGrh(), char.x, char.y);
                            break;
                        case Enums.Heading.oeste:
                            this.drawGrh(this.context, char.getBodyGrh(), char.x, char.y);
                            this.drawGrh(this.context, char.getWeaponGrh(), char.x, char.y);
                            this.drawGrh(this.context, char.getShieldGrh(), char.x, char.y);
                            break;
                        default:
                            log.error("character heading invalido");
                    }

                    this.drawGrh(this.context, char.getHeadGrh(), char.x, char.y, char.offHeadX, char.offHeadY);
                    this.drawGrh(this.context, char.getHelmetGrh(), char.x, char.y);
                    this.drawEntityName(char);
                }
                if (char.chat){
                    for (var i = 0; i < char.chat.length; i++) {
                        this.drawText(char.chat[i], char.x + this.tilesize / 2, char.y - this.ALTO_LETRAS_CHAT * ((char.chat.length-i)+2)+ 6, true, "white");
                    }
                }
            },
            drawItem: function (item) {
                //es un item
                this.drawGrh(this.context, item.getGrh(), item.x, item.y);
                /*
                 var sparks = this.game.sprites["sparks"],
                 anim = this.game.sparksAnimation,
                 frame = anim.currentFrame,
                 sx = sparks.width * frame.index * os,
                 sy = sparks.height * anim.row * os,
                 sw = sparks.width * os,
                 sh = sparks.width * os;

                 this.context.drawImage(sparks.image, sx, sy, sw, sh,
                 sparks.offsetX * s,
                 sparks.offsetY * s,
                 sw * ds, sh * ds);*/

                /*var sprite = entity.sprite,
                 shadow = this.game.shadows["small"],
                 anim = entity.currentAnimation,
                 os = this.upscaledRendering ? 1 : this.scale,
                 ds = this.upscaledRendering ? this.scale : 1;

                 if (anim && sprite) {
                 var frame = anim.currentFrame,
                 s = this.scale,
                 x = frame.x * os,
                 y = frame.y * os,
                 w = sprite.width * os,
                 h = sprite.height * os,
                 ox = sprite.offsetX * s,
                 oy = sprite.offsetY * s,
                 dx = entity.x * s,
                 dy = entity.y * s,
                 dw = w * ds,
                 dh = h * ds;

                 if (entity.isFading) {
                 this.context.save();
                 this.context.globalAlpha = entity.fadingAlpha;
                 }

                 if (!this.mobile && !this.tablet) {
                 this.drawEntityName(entity);
                 }

                 this.context.save();
                 if (entity.flipSpriteX) {
                 this.context.translate(dx + this.tilesize * s, dy);
                 this.context.scale(-1, 1);
                 }
                 else if (entity.flipSpriteY) {
                 this.context.translate(dx, dy + dh);
                 this.context.scale(1, -1);
                 }
                 else {
                 this.context.translate(dx, dy);
                 }

                 if (entity.isVisible()) {
                 if (entity.hasShadow()) {
                 this.context.drawImage(shadow.image, 0, 0, shadow.width * os, shadow.height * os,
                 0,
                 entity.shadowOffsetY * ds,
                 shadow.width * os * ds, shadow.height * os * ds);
                 }

                 this.context.drawImage(sprite.image, x, y, w, h, ox, oy, dw, dh);
                 this.context.drawImage(this.graficos[1].imagen, x, y, w, h, ox, oy, dw, dh); // SACAR
                 if (entity instanceof Item && entity.kind !== Types.Entities.CAKE) {
                 var sparks = this.game.sprites["sparks"],
                 anim = this.game.sparksAnimation,
                 frame = anim.currentFrame,
                 sx = sparks.width * frame.index * os,
                 sy = sparks.height * anim.row * os,
                 sw = sparks.width * os,
                 sh = sparks.width * os;

                 this.context.drawImage(sparks.image, sx, sy, sw, sh,
                 sparks.offsetX * s,
                 sparks.offsetY * s,
                 sw * ds, sh * ds);
                 }
                 }

                 if (entity instanceof Character && !entity.isDead && entity.hasWeapon()) {
                 var weapon = this.game.sprites[entity.getWeaponName()];

                 if (weapon) {
                 var weaponAnimData = weapon.animationData[anim.name],
                 index = frame.index < weaponAnimData.length ? frame.index : frame.index % weaponAnimData.length,
                 wx = weapon.width * index * os,
                 wy = weapon.height * anim.row * os,
                 ww = weapon.width * os,
                 wh = weapon.height * os;

                 this.context.drawImage(weapon.image, wx, wy, ww, wh,
                 weapon.offsetX * s,
                 weapon.offsetY * s,
                 ww * ds, wh * ds);
                 }
                 }

                 this.context.restore();

                 if (entity.isFading) {
                 this.context.restore();
                 }
                 }*/
            },

            drawSombra: function (entity) { // para dibujar bien el de los bichos se podria hacer que el server mande offsets en en offX e offY de la cabeza! (contal no lo usna para otra cosa)

                var index_grafico_sombra = 24208;
                var numGrafico = this.indices[index_grafico_sombra].grafico;
                if (!this.graficos[numGrafico].loaded)
                    return;

                var entityW = this.indices[entity.getBodyGrh()].width;
                var sombraW = entityW < 32 ? 32 : entityW;
                var sombraH = sombraW;
                var x = entity.x + (this.tilesize - sombraW) / 2 + this.INTERFAZ_OFFSET_X + entity.offHeadX;
                var y = entity.y + this.tilesize - sombraH + this.INTERFAZ_OFFSET_Y + 2;
                if (entity.heading === Enums.Heading.este)
                    x += 3;
                else if (entity.heading === Enums.Heading.oeste)
                    x += 2;
                else
                    x+=1;
                this.context.drawImage(this.graficos[numGrafico].imagen, x, y, sombraW, sombraH);
            },

            drawGrh: function (ctx, indexGraf, X, Y, offX, offY) { // offX y offY son de lo dibujado en pantalla, no del grafico (sirve para cabezas por ej)

                if (indexGraf === 0)
                    return;

                if (!offX)
                    offX = 0;

                if (!offY)
                    offY = 0;
                var numGrafico = this.indices[indexGraf].grafico;
                if (!this.graficos[numGrafico].loaded)
                    return;

                var grafico = this.graficos[numGrafico].imagen;
                var sx = this.indices[indexGraf].offX;
                var sy = this.indices[indexGraf].offY;
                var w = this.indices[indexGraf].width;
                var h = this.indices[indexGraf].height;
                var x = X + (this.tilesize - w) / 2 + offX; // ojo: entitys.x e y son de la pantalla y gridX y gridY son del mapa ( a esta func se le pasa de la pantalla)
                var y = Y + (this.tilesize - h) + offY; // estos dos anteriores ponen el grafico abajo centrado en el medio del tile (en realidad arriba a la izquierda de eso de tal manera que se dibuje asi)

                // dibujo solo la parte del grafico que esta en el rango visible TODO: testear que realmente funcione
                var c = this.camera;

                if (y < c.y) {
                    var nuevoH = (y + h) - c.y;
                    var nuevoSy = sy + ( h - nuevoH);
                    y = y + (nuevoSy - sy);
                    h = nuevoH;
                    sy = nuevoSy;
                }

                else if (c.y + c.getHeight() < y + h)
                    h = c.y + c.getHeight() - y;

                if (x < c.x) {
                    var nuevoW = (x + w) - c.x;
                    var nuevoSx = sx + ( w - nuevoW);
                    x = x + (nuevoSx - sx);
                    w = nuevoW;
                    sx = nuevoSx;
                }

                else if (c.x + c.getWidth() < x + w)
                    w = c.x + c.getWidth() - x;

                if (w <= 0 || h <= 0)
                    return;

                ctx.drawImage(grafico, sx, sy, w, h, x + this.INTERFAZ_OFFSET_X, y + this.INTERFAZ_OFFSET_Y, w, h);
            },

            drawTile: function (ctx, tileid, tileset, setW, gridW, cellid) {
                var s = this.upscaledRendering ? 1 : this.scale;
                if (tileid !== -1) { // -1 when tile is empty in Tiled. Don't attempt to draw it.
                    this.drawScaledImage(ctx,
                        tileset,
                        getX(tileid + 1, (setW / s)) * this.tilesize,
                        Math.floor(tileid / (setW / s)) * this.tilesize,
                        this.tilesize,
                        this.tilesize,
                        getX(cellid + 1, gridW) * this.tilesize,
                        Math.floor(cellid / gridW) * this.tilesize);
                }
            },

            clearTile: function (ctx, gridW, cellid) {
                var s = this.scale,
                    ts = this.tilesize,
                    x = getX(cellid + 1, gridW) * ts * s,
                    y = Math.floor(cellid / gridW) * ts * s,
                    w = ts * s,
                    h = w;

                ctx.clearRect(x, y, h, w);
            },

            drawEntity: function (entity) {
                var sprite = entity.sprite,
                    shadow = this.game.shadows["small"],
                    anim = entity.currentAnimation,
                    os = this.upscaledRendering ? 1 : this.scale,
                    ds = this.upscaledRendering ? this.scale : 1;

                if (anim && sprite) {
                    var frame = anim.currentFrame,
                        s = this.scale,
                        x = frame.x * os,
                        y = frame.y * os,
                        w = sprite.width * os,
                        h = sprite.height * os,
                        ox = sprite.offsetX * s,
                        oy = sprite.offsetY * s,
                        dx = entity.x * s,
                        dy = entity.y * s,
                        dw = w * ds,
                        dh = h * ds;

                    if (entity.isFading) {
                        this.context.save();
                        this.context.globalAlpha = entity.fadingAlpha;
                    }

                    if (!this.mobile && !this.tablet) {
                        this.drawEntityName(entity);
                    }

                    this.context.save();
                    if (entity.flipSpriteX) {
                        this.context.translate(dx + this.tilesize * s, dy);
                        this.context.scale(-1, 1);
                    }
                    else if (entity.flipSpriteY) {
                        this.context.translate(dx, dy + dh);
                        this.context.scale(1, -1);
                    }
                    else {
                        this.context.translate(dx, dy);
                    }

                    if (entity.isVisible()) {
                        if (entity.hasShadow()) {
                            this.context.drawImage(shadow.image, 0, 0, shadow.width * os, shadow.height * os,
                                0,
                                entity.shadowOffsetY * ds,
                                shadow.width * os * ds, shadow.height * os * ds);
                        }

                        this.context.drawImage(sprite.image, x, y, w, h, ox, oy, dw, dh);
                        this.context.drawImage(this.graficos[1].imagen, x, y, w, h, ox, oy, dw, dh); // SACAR
                        if (entity instanceof Item && entity.kind !== Types.Entities.CAKE) {
                            var sparks = this.game.sprites["sparks"],
                                anim = this.game.sparksAnimation,
                                frame = anim.currentFrame,
                                sx = sparks.width * frame.index * os,
                                sy = sparks.height * anim.row * os,
                                sw = sparks.width * os,
                                sh = sparks.width * os;

                            this.context.drawImage(sparks.image, sx, sy, sw, sh,
                                sparks.offsetX * s,
                                sparks.offsetY * s,
                                sw * ds, sh * ds);
                        }
                    }

                    if (entity instanceof Character && !entity.isDead && entity.hasWeapon()) {
                        var weapon = this.game.sprites[entity.getWeaponName()];

                        if (weapon) {
                            var weaponAnimData = weapon.animationData[anim.name],
                                index = frame.index < weaponAnimData.length ? frame.index : frame.index % weaponAnimData.length,
                                wx = weapon.width * index * os,
                                wy = weapon.height * anim.row * os,
                                ww = weapon.width * os,
                                wh = weapon.height * os;

                            this.context.drawImage(weapon.image, wx, wy, ww, wh,
                                weapon.offsetX * s,
                                weapon.offsetY * s,
                                ww * ds, wh * ds);
                        }
                    }

                    this.context.restore();

                    if (entity.isFading) {
                        this.context.restore();
                    }
                }
            },

            drawEntities: function (dirtyOnly) {
                var self = this;

                this.game.forEachVisibleEntityByDepth(function (entity) {
                    if (entity.isLoaded) {
                        if (dirtyOnly) {
                            if (entity.isDirty) {
                                self.drawEntity(entity);

                                entity.isDirty = false;
                                entity.oldDirtyRect = entity.dirtyRect;
                                entity.dirtyRect = null;
                            }
                        } else {
                            self.drawEntity(entity);
                        }
                    }
                });
            },

            drawDirtyEntities: function () {
                this.drawEntities(true);
            },

            clearDirtyRect: function (r) {
                this.context.clearRect(r.x, r.y, r.w, r.h);
            },

            clearDirtyRects: function () {
                var self = this,
                    count = 0;

                this.game.forEachVisibleEntityByDepth(function (entity) {
                    if (entity.isDirty && entity.oldDirtyRect) {
                        self.clearDirtyRect(entity.oldDirtyRect);
                        count += 1;
                    }
                });

                this.game.forEachAnimatedTile(function (tile) {
                    if (tile.isDirty) {
                        self.clearDirtyRect(tile.dirtyRect);
                        count += 1;
                    }
                });

                if (this.game.clearTarget && this.lastTargetPos) {
                    var last = this.lastTargetPos,
                        rect = this.getTargetBoundingRect(last.x, last.y);

                    this.clearDirtyRect(rect);
                    this.game.clearTarget = false;
                    count += 1;
                }

                if (count > 0) {
                    //log.debug("count:"+count);
                }
            },

            getEntityBoundingRect: function (entity) {
                var rect = {},
                    s = this.scale,
                    spr;

                if (entity instanceof Player && entity.hasWeapon()) {
                    var weapon = this.game.sprites[entity.getWeaponName()];
                    spr = weapon;
                } else {
                    spr = entity.sprite;
                }

                if (spr) {
                    rect.x = (entity.x + spr.offsetX - this.camera.x) * s;
                    rect.y = (entity.y + spr.offsetY - this.camera.y) * s;
                    rect.w = spr.width * s;
                    rect.h = spr.height * s;
                    rect.left = rect.x;
                    rect.right = rect.x + rect.w;
                    rect.top = rect.y;
                    rect.bottom = rect.y + rect.h;
                }
                return rect;
            },

            getTileBoundingRect: function (tile) {
                var rect = {},
                    gridW = this.game.map.width,
                    s = this.scale,
                    ts = this.tilesize,
                    cellid = tile.index;

                rect.x = ((getX(cellid + 1, gridW) * ts) - this.camera.x) * s;
                rect.y = ((Math.floor(cellid / gridW) * ts) - this.camera.y) * s;
                rect.w = ts * s;
                rect.h = ts * s;
                rect.left = rect.x;
                rect.right = rect.x + rect.w;
                rect.top = rect.y;
                rect.bottom = rect.y + rect.h;

                return rect;
            },

            getTargetBoundingRect: function (x, y) {
                var rect = {},
                    s = this.scale,
                    ts = this.tilesize,
                    tx = x || this.game.selectedX,
                    ty = y || this.game.selectedY;

                rect.x = ((tx * ts) - this.camera.x) * s;
                rect.y = ((ty * ts) - this.camera.y) * s;
                rect.w = ts * s;
                rect.h = ts * s;
                rect.left = rect.x;
                rect.right = rect.x + rect.w;
                rect.top = rect.y;
                rect.bottom = rect.y + rect.h;

                return rect;
            },

            isIntersecting: function (rect1, rect2) {
                return !((rect2.left > rect1.right) ||
                (rect2.right < rect1.left) ||
                (rect2.top > rect1.bottom) ||
                (rect2.bottom < rect1.top));
            },

            drawEntityName: function (entity) {
                if (entity.Name) {
                    var color = (entity.id === this.game.playerId) ? "#fcda5c" : "white";
                    this.drawText(entity.Name, entity.x + this.tilesize / 2 , entity.y + this.tilesize + this.tilesize / 3, true, color);
                }
            },

            agregarTileAnimado: function (numLayer, gridX, gridY) {
                var layerGrh;
                switch (numLayer) {
                    case 1:
                        layerGrh = this.game.map.getGrh1(gridX, gridY);
                        break;
                    case 2:
                        layerGrh = this.game.map.getGrh2(gridX, gridY);
                        break;
                    case 3:
                        layerGrh = this.game.map.getGrh3(gridX, gridY);
                        break;
                    case 4:
                        layerGrh = this.game.map.getGrh4(gridX, gridY);
                        break;
                    default:
                        log.error(" Numero de layer invalido")
                }
                if (this.indices[layerGrh].frames) { // es animacion
                    if (!this.tilesAnimadosGrid[gridX][gridY][numLayer]) { // no esta ocupado
                        var nuevoTile = (new TileAnimado(this.indices[layerGrh].frames, this.indices[layerGrh].velocidad, gridX, gridY, numLayer));
                        this.tilesAnimadosGrid[gridX][gridY][numLayer] = nuevoTile;
                        this.tilesAnimados.push(nuevoTile);
                        return true;
                    }
                    return true;
                }
                else
                    return false;
            },

            drawLayer: function (numLayer, gridX, gridY) {
                var layerGrh;
                var ctx;
                switch (numLayer) {
                    case 1:
                        layerGrh = this.game.map.getGrh1(gridX, gridY);
                        ctx = this.background;
                        break;
                    case 2:
                        layerGrh = this.game.map.getGrh2(gridX, gridY);
                        ctx = this.background;
                        break;
                    case 3:
                        layerGrh = this.game.map.getGrh3(gridX, gridY);
                        ctx = this.context;
                        break;
                    case 4:
                        layerGrh = this.game.map.getGrh4(gridX, gridY);
                        ctx = this.foreground;
                        break;
                    default:
                        log.error(" Numero de layer invalido")
                }

                if (layerGrh)
                    if (!this.indices[layerGrh].frames) { // no es anim
                        this.drawGrh(ctx, layerGrh, gridX * this.tilesize, gridY * this.tilesize);
                        return true;
                    }
                return false;
            },

            drawMapaIni: function (gridX, gridY) { // Limpia vectores, dibuja el terreno del mapa, almacena los tiles animados

                this.resetCameraPosition(gridX, gridY);
                for (var i = 0; i < this.tilesAnimados.length; i++) {
                    this.tilesAnimadosGrid[this.tilesAnimados[i].gridX][this.tilesAnimados[i].gridY][this.tilesAnimados[i].numLayer] = null;
                }
                this.tilesAnimados = [];

                var self = this;

                this.camera.forEachVisiblePosition(function (gridX, gridY) {
                    for (var i = 1; i < 5; i++) {
                        if (!self.drawLayer(i, gridX, gridY))
                            self.agregarTileAnimado(i, gridX, gridY);
                    }
                }, this.POSICIONES_EXTRA_RENDER_X, this.POSICIONES_EXTRA_RENDER_Y);

                this.dibujarTerrenoYTechos = false; // recien dibujados
            },

            drawBackground: function (ctx, color) {
                ctx.fillStyle = color;
                ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            },

            drawFPS: function () { // ESTO SE DEBERIA DIBUJAR EN UNA CAPA MAS ARRIBA!
                var nowTime = new Date(),
                    diffTime = nowTime.getTime() - this.lastTime.getTime();

                if (diffTime >= 1000) {
                    this.realFPS = this.frameCount;
                    this.frameCount = 0;
                    this.lastTime = nowTime;
                }
                this.frameCount++;

                //this.drawText("FPS: " + this.realFPS + " / " + this.maxFPS, 30, 30, false);
                //this.drawText("FPS: " + this.realFPS, 40 * 32, 45 * 32, false);
            },

            drawDebugInfo: function () {
                if (this.isDebugInfoVisible) {
                    this.drawFPS();
                    //this.drawText("A: " + this.animatedTileCount, 100, 30, false);
                    //this.drawText("H: " + this.highTileCount, 140, 30, false);
                }
            },

            drawCombatInfo: function () {
                var self = this;
                /*
                 switch (this.scale) {
                 case 2:
                 this.setFontSize(20);
                 break;
                 case 3:
                 this.setFontSize(30);
                 break;
                 }*/
                this.game.infoManager.forEachDamageInfo(function (info) {
                    if (info.opacity < 1) {
                        self.context.save();
                        self.context.globalAlpha = info.opacity;
                    }
                    self.drawText(info.value, info.x, info.y, info.centered, info.fillColor, info.strokeColor);

                    if (info.opacity < 1)
                        self.context.restore();
                });

            },

            resetCanvases: function(){
                this.background.setTransform(1, 0, 0, 1, 0, 0);
                this.context.setTransform(1, 0, 0, 1, 0, 0);
                this.foreground.setTransform(1, 0, 0, 1, 0, 0);
                this.background.scale(this.scale, this.scale);
                this.context.scale(this.scale, this.scale);
                this.foreground.scale(this.scale, this.scale);
                this.setCameraView(this.background);
                this.setCameraView(this.context);
                this.setCameraView(this.foreground);
            },

            resetCameraPosition: function (gridX, gridY) { // hecha por mi
                this.camera.lookAtGridPos(gridX, gridY);
                this.resetCanvases();
                this.dibujarTerrenoYTechos = true;
            },

            setCameraView: function (ctx) { // pone la camara en la pos (x,y)
                ctx.translate(-this.camera.x, -this.camera.y);
            },

            clearScreen: function (ctx) {
                ctx.clearRect(this.camera.x, this.camera.y, this.canvas.width, this.canvas.height);
            },

            entityEnRangoVisible: function (entity) {
                return this.camera.isVisiblePosition(entity.gridX, entity.gridY, this.POSICIONES_EXTRA_RENDER_X, this.POSICIONES_EXTRA_RENDER_Y);
            },

            // TODO: probar crear una imagen del terreno con el mapa entero (antes y tenerla guardada o al logear con el pj) y al moverse ir clipeandola
            moverCamara: function (segundoUpdateMov, x, y) {
                this.background.translate(x, y);
                this.context.translate(x, y);
                this.foreground.translate(x, y);
                this.camera.mover(-x, -y);
                if (segundoUpdateMov) {
                    var dir;
                    if (x < 0)
                        dir = Enums.Heading.oeste;
                    else if (x > 0)
                        dir = Enums.Heading.este;
                    else if (y < 0)
                        dir = Enums.Heading.norte;
                    else if (y > 0)
                        dir = Enums.Heading.sur;
                    var self = this;
                    this.camera.forEachVisibleNextLinea(function (gridX, gridY) { // TODO: (baja prioridad) muy feo todo esto de los tiles animados, reverlo enteramente
                        for (var i = 1; i < 5; i++)
                            self.agregarTileAnimado(i, gridX, gridY);
                    }, dir);

                }
                this.dibujarTerrenoYTechos = true;
            },

            resetPos: function (gridX, gridY) {
                this.resetCameraPosition(gridX, gridY);
                this.renderFrameDesktop();
            },

            moverCanvas: function (x, y) {
                ctx.translate(x, y);
            },

            getPlayerImage: function () {
                var canvas = document.createElement('canvas'),
                    ctx = canvas.getContext('2d'),
                    os = this.upscaledRendering ? 1 : this.scale,
                    player = this.game.player,
                    sprite = player.getArmorSprite(),
                    spriteAnim = sprite.animationData["idle_down"],
                // character
                    row = spriteAnim.row,
                    w = sprite.width * os,
                    h = sprite.height * os,
                    y = row * h,
                // weapon
                    weapon = this.game.sprites[this.game.player.getWeaponName()],
                    ww = weapon.width * os,
                    wh = weapon.height * os,
                    wy = wh * row,
                    offsetX = (weapon.offsetX - sprite.offsetX) * os,
                    offsetY = (weapon.offsetY - sprite.offsetY) * os,
                // shadow
                    shadow = this.game.shadows["small"],
                    sw = shadow.width * os,
                    sh = shadow.height * os,
                    ox = -sprite.offsetX * os,
                    oy = -sprite.offsetY * os;

                canvas.width = w;
                canvas.height = h;

                ctx.clearRect(0, 0, w, h);
                ctx.drawImage(shadow.image, 0, 0, sw, sh, ox, oy, sw, sh);
                ctx.drawImage(sprite.image, 0, y, w, h, 0, 0, w, h);
                ctx.drawImage(weapon.image, 0, wy, ww, wh, offsetX, offsetY, ww, wh);

                return canvas.toDataURL("image/png");
            },

            renderFrame: function () {
                if (this.mobile || this.tablet) {
                    this.renderFrameMobile();
                }
                else {
                    this.renderFrameDesktop();
                }
            },

            renderFrameDesktop: function () {

                this.clearScreen(this.context);
                this.drawPosicionesLoop();
                if (this.game.cursorVisible)
                    this.drawCursor();

                this.drawDebugInfo();
            },

            renderFrameMobile: function () {
                this.clearDirtyRects();
                this.preventFlickeringBug();

                this.context.save();
                this.setCameraView(this.context);

                this.drawDirtyAnimatedTiles();
                this.drawSelectedCell();
                this.drawDirtyEntities();
                this.context.restore();
            },

            preventFlickeringBug: function () {
                if (this.fixFlickeringTimer.isOver(this.game.currentTime)) {
                    this.background.fillRect(0, 0, 0, 0);
                    this.context.fillRect(0, 0, 0, 0);
                    this.foreground.fillRect(0, 0, 0, 0);
                }
            }
        });

        var getX = function (id, w) {
            if (id == 0) {
                return 0;
            }
            return (id % w == 0) ? w - 1 : (id % w) - 1;
        };

        return Renderer;
    });
