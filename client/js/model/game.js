define(['model/mapa', 'updater', 'model/item', 'model/player', 'model/character', 'model/comandoschat', 'model/atributos', 'model/inventario', 'model/skills','enums'],
    function (Mapa, Updater, Item, Player, Character, ComandosChat, Atributos, Inventario,Skills,Enums) {
        var Game = Class.extend({
            init: function (assetManager) {
                this.atributos = new Atributos(this);
                this.comandosChat = new ComandosChat(this);
                this.map = new Mapa();
                this.assetManager = assetManager;

                this.ready = false;
                this.started = false;
                this.isPaused = false;

                this.updater = null;

                // items: se ven abajo de tod0 (items, sprites de sangre, etc) , characters: npcs, bichos, jugadores (incluye el propio) ambos osn entity
                this.entityGrid = null;
                this.characters = []; // characters indexeados por ID
                this.items = []; // idem items
                this.username = null;
                // Player
                this.player = null;
                this.logeado = false; // NOTA: se pone logeado cuando llega el mensaje de logged, este es el ultimo de los mensajes al conectarse, asi que antes llega los mensajes de hechizos inventarios, etc. Deberia primero llegar esto y listo.. tambien deberia llegar el chardinex de tu pj al principio con este mensaje
                this.inventario = new Inventario();
                this.inventarioShop = new Inventario();
                this.skills = new Skills();
                this.hechizos = [];

                this.mouse = {x: 0, y: 0};

                this.seguroResucitacionActivado = null;
                this.seguroAtacarActivado = null;

                this.lloviendo = false;
                this.bajoTecho = false;
            },

            setup: function (client, gameUI, renderer) {
                this.client = client;
                this.gameUI = gameUI;
                this.renderer = renderer;
            },

            setStorage: function (storage) {
                this.storage = storage;
            },

            setUpdater: function (updater) {
                this.updater = updater;
            },

            recibirDanio: function (parteCuerpo, danio) {

                var txt = "";
                switch (parteCuerpo) {
                    case Enums.ParteCuerpo.cabeza:
                        txt = Enums.MensajeConsola.MENSAJE_GOLPE_CABEZA + danio + Enums.MensajeConsola.MENSAJE_2;
                        break;
                    case Enums.ParteCuerpo.brazoIzquierdo:
                        txt = Enums.MensajeConsola.MENSAJE_GOLPE_BRAZO_IZQ + danio + Enums.MensajeConsola.MENSAJE_2;
                        break;
                    case Enums.ParteCuerpo.brazoDerecho:
                        txt = Enums.MensajeConsola.MENSAJE_GOLPE_BRAZO_DER + danio + Enums.MensajeConsola.MENSAJE_2;
                        break;
                    case Enums.ParteCuerpo.piernaIzquierda:
                        txt = Enums.MensajeConsola.MENSAJE_GOLPE_PIERNA_IZQ + danio + Enums.MensajeConsola.MENSAJE_2;
                        break;
                    case Enums.ParteCuerpo.piernaDerecha:
                        txt = Enums.MensajeConsola.MENSAJE_GOLPE_PIERNA_DER + danio + Enums.MensajeConsola.MENSAJE_2;
                        break;
                    case Enums.ParteCuerpo.torso:
                        txt = Enums.MensajeConsola.MENSAJE_GOLPE_TORSO + danio + Enums.MensajeConsola.MENSAJE_2;
                        break;
                    default:
                        log.error("Mensaje de parte de cuerpo invalido");
                }

                this.renderer.agregarCharacterHoveringInfo(this.player, -danio, Enums.Font.CANVAS_DANIO_RECIBIDO);
                this.renderer.agregarTextoConsola(txt, Enums.Font.FIGHT);
            },

            realizarDanio: function (danio) {
                var char = this.player.lastAttackedTarget;
                if (char) {
                    this.renderer.agregarCharacterHoveringInfo(char, danio, Enums.Font.CANVAS_DANIO_REALIZADO);
                    this.renderer.agregarTextoConsola(Enums.MensajeConsola.MENSAJE_GOLPE_CRIATURA_1 + danio + Enums.MensajeConsola.MENSAJE_2, Enums.Font.FIGHT);
                }
            },

            escribirMsgConsola: function (texto, font) {
                if (!font)
                    font = Enums.Font.INFO;
                this.renderer.agregarTextoConsola(texto, font);
            },

            escribirChat: function (chat, charIndex, r, g, b) { // TODO: colores?
                if (this.characters[charIndex]) {
                    this.renderer.setCharacterChat(this.characters[charIndex], chat, r, g, b);
                }
            },

            enviarChat: function (message) {
                var res = this.comandosChat.parsearChat(message);
                if (res)
                    this.client.sendTalk(res);
            },

            actualizarMovPos: function (char, direccion) {
                // Se setea la pos del grid nomas porque la (x,y) la usa para la animacion el character ( y la actualiza el al final)
                if (this.entityGrid[char.gridX][char.gridY][1])
                    if (this.entityGrid[char.gridX][char.gridY][1].id === char.id) // es necesario checkear que sean iguales porque puede que haya otro char que piso la dir de este (pisar caspers)
                        this.entityGrid[char.gridX][char.gridY][1] = null;

                switch (direccion) {
                    case  Enums.Heading.oeste:
                        this.entityGrid[char.gridX - 1][char.gridY][1] = char;
                        char.setGridPositionOnly(char.gridX - 1, char.gridY); //
                        break;
                    case  Enums.Heading.este:
                        this.entityGrid[char.gridX + 1][char.gridY][1] = char;
                        char.setGridPositionOnly(char.gridX + 1, char.gridY);
                        break;
                    case  Enums.Heading.norte:
                        this.entityGrid[char.gridX][char.gridY - 1][1] = char;
                        char.setGridPositionOnly(char.gridX, char.gridY - 1);
                        break;
                    case  Enums.Heading.sur:
                        this.entityGrid[char.gridX][char.gridY + 1][1] = char;
                        char.setGridPositionOnly(char.gridX, char.gridY + 1);
                        break;
                    default:
                        log.error(" Direccion de movimiento invalida!");

                }

                // hacer para que se vea animacion y demas... de los characters
            },

            actualizarBajoTecho: function () {
                var bajoTecho = this.map.isBajoTecho(this.player.gridX, this.player.gridY);
                if (this.bajoTecho !== bajoTecho) {
                    this.bajoTecho = bajoTecho;
                    this.renderer.setBajoTecho(bajoTecho);
                    if (this.lloviendo && this.map.mapaOutdoor())
                        this.assetManager.audio.playLoopLluvia(bajoTecho);
                }
            },

            _removeAllEntitys: function () {
                var self = this;
                this.forEachEntity(
                    function (entity, index) {
                        if (entity !== self.player)
                            self.sacarEntity(entity);
                    }
                );
            },

            _removeAllEntities: function () {
                var self = this;
                this.forEachEntity(function (entity) {
                    if (entity.id !== self.player.id)
                        self.sacarEntity(entity);
                });
                this.items = [];
            },

            sacarEntity: function (entity) {
                if (entity instanceof Character) {
                    if (entity === this.player) {
                        log.error("TRATANDO DE SACAR AL PLAYER!");
                        return;
                    }
                    this.renderer.sacarCharacter(this.characters[entity.id]);
                    this.entityGrid[entity.gridX][entity.gridY][1] = null;
                    this.characters[entity.id] = null;
                }
                else if (entity instanceof Item) {
                    var item = this.items[entity.id];
                    this.renderer.sacarItem(item);
                    this.entityGrid[item.gridX][item.gridY][0] = null;
                    this.items[entity.id] = null;
                }
                else {
                    log.error("Tipo de entity desconocido!");
                }
            },

            moverCharacter: function (CharIndex, gridX, gridY) {

                if (CharIndex === this.player.id) {
                    if ((X !== this.player.gridX) || (Y !== this.player.gridY)) {
                        this.resetPosCharacter(CharIndex, X, Y);
                        log.error("moverCharacter: cambiar pos player a x:" + X + " y:" + Y);
                    }
                    else
                        return;
                }

                else {
                    var c = this.characters[CharIndex];
                    if (!c) {
                        //log.error("mover character inexistente:");// + CharIndex);
                        return;
                    }
                    var dir = c.esPosAdyacente(gridX, gridY);
                    if (!this.renderer.entityVisiblePorCamara(c, 1) || !dir) {
                        this.resetPosCharacter(CharIndex, gridX, gridY);
                    }
                    else {
                        c.mover(dir);
                        this.actualizarMovPos(c, dir);
                        this.playSonidoPaso(c);
                    }

                }
            },

            playSonidoPaso: function (char) {
                if (char.muerto || !this.renderer.entityEnTileVisible(char))
                    return;
                if (this.player.navegando) { //todo: que sea dependiendo si el char navega, no el player
                    this.assetManager.audio.playSound(Enums.SONIDOS.pasoNavegando);
                }
                else {
                    char.pasoDerecho = !char.pasoDerecho;
                    if (char.pasoDerecho)
                        this.assetManager.audio.playSound(Enums.SONIDOS.paso1);
                    else
                        this.assetManager.audio.playSound(Enums.SONIDOS.paso2);
                }
            },

            cambiarCharacter: function (CharIndex, Body, Head, Heading, Weapon, Shield, Helmet, FX, FXLoops) { // TODO: que solo cambie los que son diferentes!

                c = this.characters[CharIndex];

                if (!c) {
                    //log.error(" cambiar character inexistente ");
                    return;
                }
                if (Heading !== c.heading)
                    c.cambiarHeading(Heading);
                c.muerto = !!((Head === Enums.Muerto.cabezaCasper) || (Body === Enums.Muerto.cuerpoFragataFantasmal));

                this.renderer.cambiarCharacter(c, Body, Head, Heading, Weapon, Shield, Helmet, FX, FXLoops);
            },

            agregarCharacter: function (CharIndex, Body, Head, Heading, X, Y, Weapon, Shield, Helmet, FX, FXLoops, Name,
                                        NickColor, Privileges) {

                if (this.characters[CharIndex]) {
                    if (CharIndex === this.player.id) {
                        if ((X !== this.player.gridX) || (Y !== this.player.gridY)) { // cuando pasa de mapa vuelve a mandar el crear de tu pj, directamente cambio pos e ignoro lo demas (esta es la unica forma de saber las pos en el cambio)
                            log.error("DRAW MAPA INICIAL!!! MAPA:" + this.map.numero + " X: " + X + " Y: " + Y);

                            // --- esto para que se setee al player una pos "anterior" a la del cambio de mapa para que de la ilusion que avanza un tile (sino se deberia quedar quieto esperando el intervalo o traeria problemas en mapas donde entras mirando la salida (ademas de que pasarias siempre en la 2da pos)) ---
                            if (this.player.moviendose) {
                                var dir;
                                switch (this.player.getDirMov()) {
                                    case Enums.Heading.sur:
                                        Y = Y - 1;
                                        dir = Enums.Heading.sur;
                                        break;
                                    case Enums.Heading.norte:
                                        Y = Y + 1;
                                        dir = Enums.Heading.norte;
                                        break;
                                    case Enums.Heading.este:
                                        X = X - 1;
                                        dir = Enums.Heading.este;
                                        break;
                                    case Enums.Heading.oeste:
                                        X = X + 1;
                                        dir = Enums.Heading.oeste;
                                        break;
                                    default:
                                        break;
                                }
                                this.player.forceCaminar(dir);
                            }
                            // -- fin --

                            this.resetPosCharacter(this.player.id, X, Y, true);
                            this.renderer.drawMapaIni(this.player.gridX, this.player.gridY);

                        }
                        return;
                    }
                    log.error("tratando de agregar character habiendo un character con mismo charindex existente");
                    return;
                }
                var nombre, clan;
                if (Name.indexOf("<") > 0) {
                    nombre = Name.slice(Name, Name.indexOf("<") - 1);
                    clan = Name.slice(Name.indexOf("<"), Name.length);
                }
                else {
                    nombre = Name;
                    clan = null;
                }

                if ((!this.player) && ( this.username.toUpperCase() === nombre.toUpperCase())) { // mal esto, se deberia hacer comparando el charindex pero no se puede porque el server manda el char index del pj despues de crear los chars
                    this.inicializarPlayer(CharIndex, Body, Head, Heading, X, Y, Weapon, Shield, Helmet, FX, FXLoops, nombre, clan, NickColor, Privileges);
                    return;
                }
                c = new Character(CharIndex, X, Y, Heading, nombre, clan);

                if ((Head === Enums.Muerto.cabezaCasper) || (Body === Enums.Muerto.cuerpoFragataFantasmal))
                    c.muerto = true;
                else
                    c.muerto = false;

                this.entityGrid[X][Y][1] = c;
                this.characters[CharIndex] = c;

                this.setCharacterFX(CharIndex, FX, FXLoops);
                this.renderer.agregarCharacter(c, Body, Head, Heading, X, Y, Weapon, Shield, Helmet, FX, FXLoops, nombre, clan,
                    NickColor);
            },

            agregarItem: function (grhIndex, gridX, gridY) { // TODO: rever si ahora que no hay que updatear hace falta tenerlos en un array
                var viejoItem = this.entityGrid[gridX][gridY][0];
                if (viejoItem)
                    this.sacarEntity(viejoItem);
                var id = 0;
                while (this.items[id])
                    id++;
                item = new Item(id, gridX, gridY);
                this.entityGrid[gridX][gridY][0] = item;
                this.items[id] = item;
                this.renderer.agregarItem(item, grhIndex);
            },

            sacarItem: function (gridX, gridY) {
                var item = this.items[this.entityGrid[gridX][gridY][0].id];
                if (item) {
                    this.sacarEntity(item);
                }
            },

            toggleSeguroResucitar: function () {
                this.seguroResucitacionActivado = !this.seguroResucitacionActivado;
                this.gameUI.interfaz.setSeguroResucitacion(this.seguroResucitacionActivado);
                this.client.sendResuscitationSafeToggle();
            },

            toggleSeguroAtacar: function () {
                this.seguroAtacarActivado = !this.seguroAtacarActivado;
                this.gameUI.interfaz.setSeguroAtacar(this.seguroAtacarActivado);
                this.client.sendSafeToggle();
            },

            cambiarSlotInventario: function (numSlot, ObjIndex, ObjName, Amount, Equiped, GrhIndex, ObjType, MaxHit, MinHit, MaxDef, MinDef, ObjSalePrice) {
                this.inventario.cambiarSlot(numSlot, ObjName, Amount, ObjSalePrice, GrhIndex, ObjIndex, ObjType, MaxHit, MinHit, MaxDef, MinDef, Equiped);
                this.gameUI.updateSlotUser(numSlot,this.inventario.getSlot(numSlot));
            },

            cambiarSlotHechizos: function (slot, spellID, nombre) {
                this.hechizos[slot] = {id: spellID, nombre: nombre};
                this.gameUI.interfaz.modificarSlotHechizo(slot, nombre);
                /*if (this.logeado)
                 this.uiRenderer.modificarSlotHechizos(slot, nombre);*/
            },

            inicializarPlayer: function (CharIndex, Body, Head, Heading, X, Y, Weapon, Shield, Helmet, FX, FXLoops, nombre, clan, NickColor, Privileges) {
                log.error("inicializar player");
                this.player = new Player(CharIndex, X, Y, Heading, nombre, clan);

                if ((Head === Enums.Muerto.cabezaCasper) || (Body === Enums.Muerto.cuerpoFragataFantasmal))
                    this.player.muerto = true;
                else
                    this.player.muerto = false;

                this.entityGrid[X][Y][1] = this.player;
                this.characters[CharIndex] = this.player;

                this.setCharacterFX(CharIndex, FX, FXLoops);
                this.renderer.agregarCharacter(this.player, Body, Head, Heading, X, Y, Weapon, Shield, Helmet, FX, FXLoops, nombre, clan,
                    NickColor);

                var self = this;
                this.player.onCaminar(function (direccion, forced) {
                    {
                        if (!forced)
                            self.client.sendWalk(direccion);
                        self.actualizarMovPos(self.player, direccion);
                        self.actualizarBajoTecho();
                        self.playSonidoPaso(self.player);
                        self.actualizarIndicadorPosMapa();
                    }
                });

                this.player.onCambioHeading(function (direccion) {
                    self.client.sendChangeHeading(direccion);
                });

                this.player.onPuedeCaminar(function (direccion) {

                    if (self.player.paralizado)
                        return false;

                    var x = self.player.gridX;
                    var y = self.player.gridY;
                    switch (direccion) {
                        case Enums.Heading.oeste:
                            x--;
                            break;
                        case Enums.Heading.este:
                            x++;
                            break;
                        case Enums.Heading.norte:
                            y--;
                            break;
                        case Enums.Heading.sur:
                            y++;
                            break;
                        default:
                            log.error("Direccion invalida!");
                    }

                    if (self.map.isBlocked(x, y))
                        return false;

                    if (self.map.hayAgua(x, y) !== self.player.navegando)
                        return false;

                    if (self.entityGrid[x][y][1]) {
                        if (!self.entityGrid[x][y][1].muerto) {
                            return false;
                        }
                        else {
                            // tienen que estar o ambos en agua o ambos en tierra (player y casper)
                            if (!(self.map.hayAgua(x, y) === self.map.hayAgua(self.player.gridX, self.player.gridY)))
                                return false;
                        }
                    }

                    return true;
                });

                this.player.setOnMoverse(
                    function (x, y) {
                        self.renderer.moverPosition(x - self.renderer.camera.centerPosX, y - self.renderer.camera.centerPosY);
                    });

                this.player.setOnMoverseBegin(
                    function (dir) {
                        self.renderer.updateTilesMov(dir);
                    });

                this.actualizarIndicadorPosMapa();
            },

            resetPosCharacter: function (charIndex, gridX, gridY, noReDraw) {
                c = this.characters[charIndex];
                if (!c) {
                    log.error(" Reset pos de character no existente, charindex=" + charIndex);
                    return;
                }
                if (this.entityGrid[c.gridX][c.gridY][1] === c)
                    this.entityGrid[c.gridX][c.gridY][1] = null;

                var prevPos = {x: c.gridX, y: c.gridY};
                c.resetMovement();
                c.setGridPosition(gridX, gridY);
                this.entityGrid[gridX][gridY][1] = c; // TODO <- esto puede traer problemas

                if (c instanceof Player) {
                    console.log(" reseteando pos player");
                    if (!noReDraw)
                        this.renderer.resetPos(gridX, gridY);
                    this.actualizarBajoTecho();
                    this.actualizarIndicadorPosMapa();
                }
            },

            cambiarMapa: function (numeroMapa) {
                /* todo: cambiar esto si deja de ser sync: */
                //this._removeAllEntitys();
                prevMapa = this.map;
                this.map = new Mapa(numeroMapa, this.assetManager.getMapaSync(numeroMapa));
                this._removeAllEntities();
                this.renderer.cambiarMapa(this.map);

                if (this.lloviendo && prevMapa) {
                    if (this.map.mapaOutdoor() !== prevMapa.mapaOutdoor()) {
                        if (this.map.mapaOutdoor())
                            this.assetManager.audio.IniciarSonidoLluvia();
                        else
                            this.assetManager.audio.finalizarSonidoLluvia();
                        this.renderer.toggleLluvia();
                    }
                }

            },

            actualizarIndicadorPosMapa: function () {
                this.gameUI.interfaz.updateIndicadorPosMapa(this.map.numero, this.player.gridX, this.player.gridY);
            },

            cambiarArea: function (gridX, gridY) {

                var MinLimiteX = Math.floor(gridX / 9 - 1) * 9;
                var MaxLimiteX = MinLimiteX + 26;

                var MinLimiteY = Math.floor(gridY / 9 - 1) * 9;
                var MaxLimiteY = MinLimiteY + 26;

                var self = this;
                this.forEachEntity(
                    function (entity, index) {
                        if (( (entity.gridY < MinLimiteY) || (entity.gridY > MaxLimiteY) ) || ( (entity.gridX < MinLimiteX) || (entity.gridX > MaxLimiteX) )) {
                            if (entity !== self.player)
                                self.sacarEntity(entity);
                        }
                    }
                );
            },

            forceCaminar: function (direccion) {
                this.player.forceCaminar(direccion);
            },

            setTrabajoPendiente: function (skill) {
                this.gameUI.interfaz.setMouseCrosshair(true);
                this.trabajoPendiente = skill;
            },

            cambiarSlotCompra: function (numSlot, ObjName, Amount, Price, GrhIndex, ObjIndex, ObjType, MaxHit, MinHit, MaxDef, MinDef) {
                this.inventarioShop.cambiarSlot(numSlot, ObjName, Amount, Price, GrhIndex, ObjIndex, ObjType, MaxHit, MinHit, MaxDef, MinDef);
                this.gameUI.updateSlotShop(numSlot,this.inventarioShop.getSlot(numSlot));

            },

            cambiarSlotRetirar: function (numSlot, ObjIndex, ObjName, Amount, GrhIndex, ObjType, MaxHit, MinHit, MaxDef, MinDef, ObjSalePrice) {
                this.inventarioShop.cambiarSlot(numSlot, ObjName, Amount, ObjSalePrice, GrhIndex, ObjIndex, ObjType, MaxHit, MinHit, MaxDef, MinDef);
                this.gameUI.updateSlotShop(numSlot,this.inventarioShop.getSlot(numSlot));
            },

            togglePausa: function () {
                this.isPaused = !(this.isPaused);
            },

            setCharacterFX: function (CharIndex, FX, FXLoops) {
                if (!this.characters[CharIndex]) {
                    log.error("crear fx en character inexistente");
                    return;
                }
                if (FX === 0) {
                    if (this.characters[CharIndex].sprite)
                        this.characters[CharIndex].sprite.removerFxsInfinitos();
                    return;
                }
                FXLoops = FXLoops + 1;
                this.renderer.setCharacterFX(this.characters[CharIndex], FX, FXLoops);
            },

            initEntityGrid: function () {
                this.entityGrid = [];
                for (var i = 1; i < this.map.height + 1; i += 1) {
                    this.entityGrid[i] = [];
                    for (var j = 1; j < this.map.width + 1; j += 1) {
                        this.entityGrid[i][j] = []; // [1] = son cosas que bloquena (PJS,NPCS, ETC) , [0] son cosas pisables, items , etc
                    }
                }
                log.info("Initialized the entity grid.");
            },

            inicializar: function (username) {
                this.username = username;
                this.setUpdater(new Updater(this));
                this.initEntityGrid();
                this.ready = true;
            },

            tick: function () {
                this.currentTime = Date.now();
                if (this.started) {
                    if (!this.isPaused)
                        this.updater.update();
                    this.renderer.renderFrame();
                }

                if (!this.isStopped) {
                    requestAnimFrame(this.tick.bind(this));
                }
            },

            start: function () {

                if (this.started)
                    return;
                this.renderer.drawMapaIni(this.player.gridX, this.player.gridY);

                this.logeado = true;
                this.started = true;
                this.tick();
                this.hasNeverStarted = false;
                log.info("Game loop started.");
            },

            stop: function () {
                log.info("Game stopped.");
                this.isStopped = true;
            },

            entityIdExists: function (id) {
                return id in this.entities;
            },

            getEntityById: function (id) {
                if (id in this.entities) {
                    return this.entities[id];
                }
                else {
                    log.error("Unknown entity id : " + id, true);
                }
            },

            getMouseGridPosition: function () { // TODO: usar InteractionManager para detectar sprite clickeado y rederigir a ese tile???
                var ts = this.renderer.tilesize,
                    c = this.renderer.camera,
                    mx = this.mouse.x / this.renderer.escala,
                    my = this.mouse.y / this.renderer.escala,
                    offsetX = mx % ts,
                    offsetY = my % ts;

                var x = ((mx - offsetX) / ts) + c.gridX;
                var y = ((my - offsetY) / ts) + c.gridY;

                /*  Medio feo pero me parece que no hay otra, explicacion:
                 Cuando se mueve un pj, ni bien comienza la animacion ya esta en el tile siguiente. El problema con esto es que cuando estas caminando,
                 esto significa que si clickeas el centro de la pantalla, no estas clickeando el tile de tu pj porque ya esta en el siguiente.
                 Entonces: si haces click en el centro y te estas moviendo lo rederijo al tile del pj.
                 (en el eje y no hay problema porque acepta 2 posiciones distintas)
                 */
                if (this.player.movement.inProgress && offsetX) {

                    if (this.player.heading === Enums.Heading.oeste) {
                        x = x + 1; // fix de pos de c.gridX
                        if (x === (this.player.gridX + 1))
                            x--;
                    }
                    if (this.player.heading === Enums.Heading.este) {
                        if (x === this.player.gridX - 1)
                            x++;
                    }
                }
                return {x: x, y: y};
            },

            /**
             * Loops through all the entities currently present in the game.
             * @param {Function} callback The function to call back (must accept one entity argument).
             */
            forEachEntity: function (callback) {
                _.each(this.characters, function (entity, index) {
                    if (entity)
                        callback(entity, index);
                });

                _.each(this.items, function (entity, index) {
                    if (entity)
                        callback(entity, index);
                });

            },

            forEachCharacter: function (callback) { // TODO (importante): este _.each itera solo los elementos del array?, dado que characters tiene por ej elementos en [3] y [5323] ("sparse array"), quiero imaginar que solo itera los elementos y no va desde 0 a 5323 probando con cada uno no?
                _.each(this.characters, function (entity) {
                    if (entity)
                        callback(entity);
                });
            },

            forEachItem: function (callback) {
                _.each(this.items, function (entity) {
                    if (entity)
                        callback(entity);
                });
            },

            resize: function (escala) {
                this.renderer.rescale(escala);
            },

        });

        return Game;
    });
