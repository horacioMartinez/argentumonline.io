define(['enums', 'mapa', 'infomanager', 'view/renderer',
        'gameclient', 'updater', 'transition',
        'item', 'player', 'character', 'assetmanager', 'intervalos', 'ui/uimanager', 'comandoschat'],
    function (__enums__, Mapa, InfoManager, Renderer,
              GameClient, Updater, Transition,
              Item, Player, Character, AssetManager, Intervalos, UIManager, ComandosChat) {
        var Game = Class.extend({
            init: function (app, assetManager) {
                this.uiManager = new UIManager(this);

                this.comandosChat = new ComandosChat(this);
                this.map = new Mapa();
                this.assetManager = assetManager;

                this.app = app;
                this.ready = false;
                this.started = false;
                this.isPaused = false;

                this.updater = null;
                this.chatinput = null;

                // items: se ven abajo de tod0 (items, sprites de sangre, etc) , characters: npcs, bichos, jugadores (incluye el propio) ambos osn entity
                this.entityGrid = null;
                this.characters = []; // characters indexeados por ID
                this.items = []; // idem items
                this.username = null;
                // Player
                this.playerId = null; //charindex
                this.player = null;
                this.logeado = false; // NOTA: se pone logeado cuando llega el mensaje de logged, este es el ultimo de los mensajes al conectarse, asi que antes llega los mensajes de hechizos inventarios, etc. Deberia primero llegar esto y listo.. tambien deberia llegar el chardinex de tu pj al principio con este mensaje
                this.inventario = [];
                this.inventarioCompra = [];
                this.hechizos = [];
                this.intervalos = new Intervalos(0);

                // Game state
                this.itemGrid = null;
                this.currentCursor = null;
                this.mouse = {x: 0, y: 0};

                // combat
                this.infoManager = new InfoManager(this);

                this.cursors = {};

            },

            setup: function (input) {
                this.renderer = new Renderer(this.map, this.assetManager, this.app.getEscala());
                this.chatinput = input;
            },

            setStorage: function (storage) {
                this.storage = storage;
            },

            setUpdater: function (updater) {
                this.updater = updater;
            },

            setCursor: function (name, orientation) {
                if (name in this.cursors) {
                    this.currentCursor = this.cursors[name];
                    this.currentCursorOrientation = orientation;
                } else {
                    log.error("Unknown cursor name :" + name);
                }
            },

            updateCursorLogic: function () {
                /*
                 if (this.hoveringCollidingTile && this.started) {
                 this.targetColor = "rgba(255, 50, 50, 0.5)";
                 }
                 else {
                 this.targetColor = "rgba(255, 255, 255, 0.5)";
                 }

                 if (this.hoveringPlayer && this.started) {
                 if (this.pvpFlag)
                 this.setCursor("sword");
                 else
                 this.setCursor("hand");
                 this.hoveringTarget = false;
                 this.hoveringMob = false;
                 this.targetCellVisible = false;
                 } else if (this.hoveringMob && this.started) {
                 this.setCursor("sword");
                 this.hoveringTarget = false;
                 this.hoveringPlayer = false;
                 this.targetCellVisible = false;

                 }
                 else if (this.hoveringNpc && this.started) {
                 this.setCursor("talk");
                 this.hoveringTarget = false;
                 this.targetCellVisible = false;
                 }
                 else if ((this.hoveringItem || this.hoveringChest) && this.started) {
                 this.setCursor("loot");
                 this.hoveringTarget = false;
                 this.targetCellVisible = true;
                 }
                 else {
                 this.setCursor("hand");
                 this.hoveringTarget = false;
                 this.hoveringPlayer = false;
                 this.targetCellVisible = true;
                 }*/
            },

            /*            binaryPosSearch: function (list, item) { // devuelve indice donde insertar si no lo encuentra (esto deberia estar en utils o en otro lado)
             var lo = 0;
             var hi = list.length;
             cmp_func = function (a, b) {
             if (a.y < b.y)
             return -1;
             if (a.y > b.y)
             return 1;
             if (a.x < b.x)
             return -1;
             if (a.x > b.x)
             return 1;
             return 0;
             }
             while (lo < hi) {
             var mid = ((lo + hi) / 2) | 0;
             var cmp_res = cmp_func(item, list[mid]);
             if (cmp_res == 0) {
             return {
             found: true,
             index: mid
             };
             } else if (cmp_res < 0) {
             hi = mid;
             } else {
             lo = mid + 1;
             }
             }
             return {
             found: false,
             index: hi
             };
             },

             insertarEnOrden: function (array, entity) {
             res = this.binaryPosSearch(array, entity)
             if (res.found) {
             log.error("Dos entidades del mismo tipo en la misma cordenada! x:"+res.index.x+ " y:"+res.index.y);
             array.push(entity);
             }
             array.splice(res.index, 0, entity);

             },*/

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

                this.infoManager.addHoveringInfo(-danio, this.player, Enums.Font.CANVAS_DANIO_RECIBIDO);
                this.renderer.agregarTextoConsola(txt, Enums.Font.FIGHT);
            },

            realizarDanio: function (danio) {
                var char = this.player.lastAttackedTarget;
                if (char) {
                    this.infoManager.addHoveringInfo(danio, char, Enums.Font.CANVAS_DANIO_REALIZADO);
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
                    this.renderer.setCharacterChat(this.characters[charIndex], chat);
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
                this.renderer.setBajoTecho(this.map.isBajoTecho(this.player.gridX, this.player.gridY));
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
            },

            moverCharacter: function (CharIndex, gridX, gridY) {
                if (CharIndex === this.playerId) {
                    if (this.player) {
                        if ((X !== this.player.gridX) || (Y !== this.player.gridY)) {
                            this.resetPosCharacter(Charindex, X, Y);
                            log.error("moverCharacter: cambiar pos player a x:" + X + " y:" + Y);
                        }
                        else
                            return;
                    }
                }
                else {
                    var c = this.characters[CharIndex];
                    if (!c) {
                        //log.error("mover character inexistente:");// + CharIndex);
                        return;
                    }
                    var dir = c.esPosAdyacente(gridX, gridY);
                    if (!this.renderer.entityEnRangoVisible(c) || !dir) {
                        this.resetPosCharacter(CharIndex, gridX, gridY);
                    }
                    else {
                        c.mover(dir);
                        this.actualizarMovPos(c, dir);
                    }

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
                                switch (this.player.getDirMov()) {
                                    case Enums.Heading.sur:
                                        Y = Y - 1;
                                        this.player.forceCaminar(Enums.Heading.sur);
                                        break;
                                    case Enums.Heading.norte:
                                        Y = Y + 1;
                                        this.player.forceCaminar(Enums.Heading.norte);
                                        break;
                                    case Enums.Heading.este:
                                        X = X - 1;
                                        this.player.forceCaminar(Enums.Heading.este);
                                        break;
                                    case Enums.Heading.oeste:
                                        X = X + 1;
                                        this.player.forceCaminar(Enums.Heading.oeste);
                                        break;
                                    default:
                                        break;
                                }
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

            setVida: function (min, max) {
                if (!max)
                    max = this.player.maxHp;
                if ((this.player.hp !== min) || (this.player.maxHp !== max)) {
                    this.player.hp = min;
                    this.player.maxHp = max;
                    this.uiManager.interfaz.updateBarraVida(min, max);
                }
            },

            setMana: function (MinMan, MaxMan) {
                if (!MaxMan)
                    MaxMan = this.player.maxMana;

                if ((this.player.mana !== MinMan) || (this.player.maxMana !== MaxMan)) {
                    this.player.mana = MinMan;
                    this.player.maxMana = MaxMan;
                    this.uiManager.interfaz.updateBarraMana(MinMan, MaxMan);
                }
            },

            setStamina: function (MinSta, MaxSta) {
                if (!MaxSta)
                    MaxSta = this.player.maxStamina;
                if ((this.player.stamina !== MinSta) || this.player.maxStamina !== MaxSta) {
                    this.player.stamina = MinSta;
                    this.player.maxStamina = MaxSta;
                    this.uiManager.interfaz.updateBarraEnergia(MinSta, MaxSta);
                }
            },

            setAgua: function (MinAgu, MaxAgu) {
                if (!MaxAgu)
                    MaxAgu = this.player.maxAgua;
                if ((this.player.agua !== MinAgu) || (this.player.maxAgua !== MaxAgu)) {
                    this.player.maxAgua = MaxAgu;
                    this.player.agua = MinAgu;
                    this.uiManager.interfaz.updateBarraSed(MinAgu, MaxAgu);
                }
            },

            setHambre: function (MinHam, MaxHam) {
                if (!MaxHam)
                    MaxHam = this.player.maxHambre;
                if ((this.player.hambre !== MinHam) || (this.player.maxHambre !== MaxHam)) {
                    this.player.hambre = MinHam;
                    this.player.maxHambre = MaxHam;
                    this.uiManager.interfaz.updateBarraHambre(MinHam, MaxHam);
                }
            },

            cambiarSlotInventario: function (Slot, ObjIndex, ObjName, Amount, Equiped, GrhIndex, ObjType, MaxHit, MinHit, MaxDef, MinDef, ObjSalePrice) {
                this.inventario[Slot] = {
                    objIndex: ObjIndex,
                    objName: ObjName,
                    cantidad: Amount,
                    equipado: Equiped,
                    grh: GrhIndex,
                    objType: ObjType,
                    maxHit: MaxHit,
                    minHit: MinHit,
                    maxDef: MaxDef,
                    minDef: MinDef,
                    precioVenta: ObjSalePrice
                };

                if ((Amount > 0 ) && (GrhIndex > 0)) {
                    var numGrafico = this.renderer.getNumGraficoFromGrh(GrhIndex);
                    this.uiManager.interfaz.cambiarSlotInventario(Slot, Amount, numGrafico, Equiped);
                    if (this.uiManager.comerciar.visible)
                        this.uiManager.comerciar.cambiarSlotVenta(Slot, Amount, numGrafico);
                }
                else {
                    this.uiManager.interfaz.borrarSlotInventario(Slot);
                    if (this.uiManager.comerciar.visible)
                        this.uiManager.comerciar.borrarSlotVenta(Slot);
                }

            },

            cambiarSlotHechizos: function (slot, spellID, nombre) {
                this.hechizos[slot] = {id: spellID, nombre: nombre};
                this.uiManager.interfaz.modificarSlotHechizo(slot, nombre);
                /*if (this.logeado)
                 this.uiRenderer.modificarSlotHechizos(slot, nombre);*/
            },

            inicializarPlayer: function (CharIndex, Body, Head, Heading, X, Y, Weapon, Shield, Helmet, FX, FXLoops, nombre, clan, NickColor, Privileges) {
                log.error("inicializar player");
                this.playerId = CharIndex;
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
                    }
                });

                this.player.onCambioHeading(function (direccion) {
                    self.client.sendChangeHeading(direccion);
                });

                this.player.onPuedeCaminar(function (direccion) {
                    var x = self.player.gridX;
                    var y = self.player.gridY;
                    if (direccion === Enums.Heading.oeste) {
                        if (self.map.isBlocked(x - 1, y))
                            return false;

                        if (self.entityGrid[x - 1][y][1])
                            if (!self.entityGrid[x - 1][y][1].muerto)
                                return false;
                    }
                    else if (direccion === Enums.Heading.este) {
                        if (self.map.isBlocked(x + 1, y))
                            return false;
                        if (self.entityGrid[x + 1][y][1])
                            if (!self.entityGrid[x + 1][y][1].muerto)
                                return false;
                    }
                    else if (direccion === Enums.Heading.norte) {
                        if (self.map.isBlocked(x, y - 1))
                            return false;
                        if (self.entityGrid[x][y - 1][1])
                            if (!self.entityGrid[x][y - 1][1].muerto)
                                return false;
                    }
                    else if (direccion === Enums.Heading.sur) {
                        if (self.map.isBlocked(x, y + 1))
                            return false;
                        if (self.entityGrid[x][y + 1][1])
                            if (!self.entityGrid[x][y + 1][1].muerto)
                                return false;
                    }
                    return true;
                });

                this.player.onMoverse(
                    function (x, y) {
                        self.renderer.moverPosition(x - self.renderer.camera.centerPosX, y - self.renderer.camera.centerPosY);
                    });
            },

            resetPosCharacter: function (charIndex, gridX, gridY, noReDraw) {
                c = this.characters[charIndex];
                if (!c) {
                    log.error(" Reset pos de character no existente, charindex=" + charIndex);
                    return;
                }
                this.entityGrid[c.gridX][c.gridY][1] = null;

                c.resetMovement();
                c.setGridPosition(gridX, gridY);
                this.entityGrid[gridX][gridY][1] = c; // TODO <- esto puede traer problemas

                if (c instanceof Player) {
                    console.log(" reseteando pos player");
                    if (!noReDraw)
                        this.renderer.resetPos(gridX, gridY);
                }
            },

            cambiarMapa: function (numeroMapa) {
                /* todo: cambiar esto si deja de ser sync: */
                //this._removeAllEntitys();
                this.map = new Mapa(numeroMapa, this.assetManager.getMapaSync(numeroMapa));
                this._removeAllEntities();
                this.renderer.cambiarMapa(this.map);
                //if (this.player)
                //    this.player.resetMovement();
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

            caminar: function (direccion) {
                if (this.logeado)
                    this.player.comenzarCaminar(direccion);
            },

            terminarDeCaminar: function (direccion) {
                if (this.logeado)
                    this.player.terminarDeCaminar(direccion);
            },

            forceCaminar: function (direccion) {
                var x = this.player.gridX;
                var y = this.player.gridY;
                /*
                 switch (direccion) {
                 case Enums.Heading.este:
                 this.entityGrid[x][y][1] = this.entityGrid[x + 1][y][1];
                 break;
                 case Enums.Heading.oeste:
                 this.entityGrid[x][y][1] = this.entityGrid[x - 1][y][1];
                 break;
                 case Enums.Heading.sur:
                 this.entityGrid[x][y][1] = this.entityGrid[x][y + 1][1];
                 break;
                 case Enums.Heading.norte:
                 this.entityGrid[x][y][1] = this.entityGrid[x][y - 1][1];
                 break;
                 default:
                 log.error("direccion invalida en forceCaminar");
                 return;
                 }
                 */
                this.player.forceCaminar(direccion);
            },

            agarrar: function () {

                if (this.player.muerto) {
                    this.escribirMsgConsola(Enums.MensajeConsola.ESTAS_MUERTO);
                }
                else {
                    this.client.sendPickUp();
                }
            },

            ocultarse: function () {

                if (this.player.muerto) {
                    this.escribirMsgConsola(Enums.MensajeConsola.ESTAS_MUERTO);
                }
                else {
                    this.client.sendWork(Enums.Skill.ocultarse);
                }
            },
            requestPosUpdate: function () {
                if (this.intervalos.requestPosUpdate(this.currentTime))
                    this.client.sendRequestPositionUpdate();
            },

            equiparSelectedItem: function () {
                var slot = this.uiManager.interfaz.getSelectedSlotInventario();
                if (slot)
                    this.client.sendEquipItem(slot);
            },

            usarConU: function () {
                var slot = this.uiManager.interfaz.getSelectedSlotInventario();
                if (!slot)
                    return;
                if (this.intervalos.requestUsarConU(this.currentTime)) {
                    this.client.sendUseItem(slot);
                }
            },

            usarConDobleClick: function (slot) {
                if (!slot)
                    return;
                if (this.intervalos.requestUsarConDobleClick(this.currentTime)) {
                    this.client.sendUseItem(slot);
                }

            },

            atacar: function () {
                if (this.intervalos.requestAtacar(this.currentTime)) {
                    this.client.sendAttack();
                    switch (this.player.heading) { // todo: hacerlo con el arco y con hechizos tambien
                        case  Enums.Heading.oeste:
                            this.player.lastAttackedTarget = this.entityGrid[this.player.gridX - 1][this.player.gridY][1];
                            break;
                        case  Enums.Heading.este:
                            this.player.lastAttackedTarget = this.entityGrid[this.player.gridX + 1][this.player.gridY][1];
                            break;
                        case  Enums.Heading.norte:
                            this.player.lastAttackedTarget = this.entityGrid[this.player.gridX][this.player.gridY - 1][1];
                            break;
                        case  Enums.Heading.sur:
                            this.player.lastAttackedTarget = this.entityGrid[this.player.gridX][this.player.gridY + 1][1];
                            break;
                        default:
                            log.error(" Direccion de player invalida!");
                    }
                }

            },

            lanzarHechizo: function () {
                if (!this.intervalos.requestLanzarHechizo(this.currentTime))
                    return;
                var slot = this.uiManager.interfaz.getSelectedSlotHechizo();
                if (!slot)
                    return;
                this.client.sendCastSpell(slot);
                this.client.sendWork(Enums.Skill.magia);
            },

            setTrabajoPendiente: function (skill) {
                this.uiManager.interfaz.setMouseCrosshair(true);
                this.trabajoPendiente = skill;
            },

            cambiarSlotCompra: function (Slot, ObjName, Amount, Price, GrhIndex, ObjIndex, ObjType, MaxHit, MinHit, MaxDef, MinDef) {
                this.inventarioCompra[Slot] = {
                    objIndex: ObjIndex,
                    objName: ObjName,
                    cantidad: Amount,
                    grh: GrhIndex,
                    objType: ObjType,
                    maxHit: MaxHit,
                    minHit: MinHit,
                    maxDef: MaxDef,
                    minDef: MinDef,
                    precio: Price
                };

                if ((Amount > 0 ) && (GrhIndex > 0)) {
                    var numGrafico = this.renderer.getNumGraficoFromGrh(GrhIndex);
                    this.uiManager.comerciar.cambiarSlotCompra(Slot, Amount, numGrafico);
                }
                else
                    this.uiManager.comerciar.borrarSlotCompra(Slot);
            },

            cerrarComerciar: function () {
                this.client.sendCommerceEnd();
            },

            comprar: function (slot, cantidad) {
                this.client.sendCommerceBuy(slot, cantidad);
            },

            vender: function (slot, cantidad) {
                this.client.sendCommerceSell(slot, cantidad);
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
                    this.updateCursorLogic();

                    if (!this.isPaused)
                        this.updater.update();
                    this.renderer.renderFrame();
                    /*this.uiRenderer.renderFrame();*/
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

            click: function () {
                var gridPos = this.getMouseGridPosition();
                if (this.logeado) {
                    if (this.trabajoPendiente) {
                        this.uiManager.interfaz.setMouseCrosshair(false);
                        this.client.sendWorkLeftClick(gridPos.x, gridPos.y, this.trabajoPendiente);
                        this.trabajoPendiente = false;
                    }
                    else
                        this.client.sendLeftClick(gridPos.x, gridPos.y);
                }
            },

            doubleclick: function () {
                var gridPos = this.getMouseGridPosition();
                if (this.logeado)
                    this.client.sendDoubleClick(gridPos.x, gridPos.y);
            },

            resize: function (escala) {
                this.renderer.rescale(escala);
            },

        });

        return Game;
    });
