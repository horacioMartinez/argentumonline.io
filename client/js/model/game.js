define(['model/mapa', 'updater', 'model/item', 'model/character', 'model/atributos', 'model/inventario', 'model/skills', 'model/playerstate', 'model/playermovement', 'enums', 'font'],
    function (Mapa, Updater, Item, Character, Atributos, Inventario, Skills, PlayerState, PlayerMovement, Enums, Font) {
        class Game {
            constructor(assetManager) {
                this.init(assetManager);
            }

            init(assetManager) { // temporal
                this.playerMovement = new PlayerMovement(this);
                this.initPlayerMovementCallbacks();
                this.playerState = new PlayerState();
                this.atributos = new Atributos(this);
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
                this.bankShop = new Inventario();
                this.skills = new Skills();
                this.hechizos = [];

                this.mouse = {x: 0, y: 0};

                this.seguroResucitacionActivado = null;
                this.seguroAtacarActivado = null;

                this.lloviendo = false;
                this.bajoTecho = false;
                this.ignorarProximoSonidoPaso = false;
            }

            setup(client, gameUI, renderer) {
                this.client = client;
                this.gameUI = gameUI;
                this.renderer = renderer;
            }

            setStorage(storage) {
                this.storage = storage;
            }

            setUpdater(updater) {
                this.updater = updater;
            }

            recibirDanioCriatura(parteCuerpo, danio) {

                var txt = "";
                var formatMessage = function (bodyPartMessage) {
                    return Enums.MensajeConsola.MENSAJE_1 + bodyPartMessage + danio + Enums.MensajeConsola.MENSAJE_2;
                };
                switch (parteCuerpo) {
                    case Enums.ParteCuerpo.cabeza:
                        txt = formatMessage(Enums.MensajeConsola.MENSAJE_GOLPE_CABEZA);
                        break;
                    case Enums.ParteCuerpo.brazoIzquierdo:
                        txt = formatMessage(Enums.MensajeConsola.MENSAJE_GOLPE_BRAZO_IZQ);
                        break;
                    case Enums.ParteCuerpo.brazoDerecho:
                        txt = formatMessage(Enums.MensajeConsola.MENSAJE_GOLPE_BRAZO_DER);
                        break;
                    case Enums.ParteCuerpo.piernaIzquierda:
                        txt = formatMessage(Enums.MensajeConsola.MENSAJE_GOLPE_PIERNA_IZQ);
                        break;
                    case Enums.ParteCuerpo.piernaDerecha:
                        txt = formatMessage(Enums.MensajeConsola.MENSAJE_GOLPE_PIERNA_DER);
                        break;
                    case Enums.ParteCuerpo.torso:
                        txt = formatMessage(Enums.MensajeConsola.MENSAJE_GOLPE_TORSO);
                        break;
                    default:
                        log.error("Mensaje de parte de cuerpo invalido");
                }

                this.renderer.agregarCharacterHoveringInfo(this.player, -danio, Font.CANVAS_DANIO_RECIBIDO);
                this.renderer.agregarTextoConsola(txt, Font.FIGHT);
            }

            recibirDanioUser(parteCuerpo, danio, attackerIndex) {
                var txt = "";
                let attackerName = this.characters[attackerIndex].nombre;
                var formatMessage = function (bodyPartMessage) {
                    return Enums.MensajeConsola.MENSAJE_1 + attackerName + bodyPartMessage + danio + Enums.MensajeConsola.MENSAJE_2;
                };
                switch (parteCuerpo) {
                    case Enums.ParteCuerpo.cabeza:
                        txt = formatMessage(Enums.MensajeConsola.RECIBE_IMPACTO_CABEZA);
                        break;
                    case Enums.ParteCuerpo.brazoIzquierdo:
                        txt = formatMessage(Enums.MensajeConsola.RECIBE_IMPACTO_BRAZO_IZQ);
                        break;
                    case Enums.ParteCuerpo.brazoDerecho:
                        txt = formatMessage(Enums.MensajeConsola.RECIBE_IMPACTO_BRAZO_DER);
                        break;
                    case Enums.ParteCuerpo.piernaIzquierda:
                        txt = formatMessage(Enums.MensajeConsola.RECIBE_IMPACTO_PIERNA_IZQ);
                        break;
                    case Enums.ParteCuerpo.piernaDerecha:
                        txt = formatMessage(Enums.MensajeConsola.RECIBE_IMPACTO_PIERNA_DER);
                        break;
                    case Enums.ParteCuerpo.torso:
                        txt = formatMessage(Enums.MensajeConsola.RECIBE_IMPACTO_TORSO);
                        break;
                    default:
                        log.error("Mensaje de parte de cuerpo invalido");
                }

                this.renderer.agregarCharacterHoveringInfo(this.player, -danio, Font.CANVAS_DANIO_RECIBIDO);
                this.renderer.agregarTextoConsola(txt, Font.FIGHT);
            }

            realizarDanioCriatura(danio) {
                var char = this.player.lastAttackedTarget;
                if (char) {
                    this.renderer.agregarCharacterHoveringInfo(char, danio, Font.CANVAS_DANIO_REALIZADO);
                }
                this.renderer.agregarTextoConsola(Enums.MensajeConsola.MENSAJE_GOLPE_CRIATURA_1 + danio + Enums.MensajeConsola.MENSAJE_2, Font.FIGHT);
            }

            realizarDanioPlayer(danio, parteCuerpo, victimIndex) {
                let victim = this.characters[victimIndex];
                let attackerName = this.characters[victimIndex].nombre;

                this.renderer.agregarCharacterHoveringInfo(victim, danio, Font.CANVAS_DANIO_REALIZADO);

                var formatMessage = function (bodyPartMessage) {
                    return Enums.MensajeConsola.PRODUCE_IMPACTO_1 + attackerName + bodyPartMessage + danio + Enums.MensajeConsola.MENSAJE_2;
                };
                let txt = "";
                switch (parteCuerpo) {
                    case Enums.ParteCuerpo.cabeza:
                        txt = formatMessage(Enums.MensajeConsola.PRODUCE_IMPACTO_CABEZA);
                        break;
                    case Enums.ParteCuerpo.brazoIzquierdo:
                        txt = formatMessage(Enums.MensajeConsola.PRODUCE_IMPACTO_BRAZO_IZQ);
                        break;
                    case Enums.ParteCuerpo.brazoDerecho:
                        txt = formatMessage(Enums.MensajeConsola.PRODUCE_IMPACTO_BRAZO_DER);
                        break;
                    case Enums.ParteCuerpo.piernaIzquierda:
                        txt = formatMessage(Enums.MensajeConsola.PRODUCE_IMPACTO_PIERNA_IZQ);
                        break;
                    case Enums.ParteCuerpo.piernaDerecha:
                        txt = formatMessage(Enums.MensajeConsola.PRODUCE_IMPACTO_PIERNA_DER);
                        break;
                    case Enums.ParteCuerpo.torso:
                        txt = formatMessage(Enums.MensajeConsola.PRODUCE_IMPACTO_TORSO);
                        break;
                    default:
                        log.error("Mensaje de parte de cuerpo invalido");
                }
                this.renderer.agregarTextoConsola(txt, Font.FIGHT);
            }

            escribirMsgConsola(texto, font) {
                if (!font) {
                    font = Font.INFO;
                }
                this.renderer.agregarTextoConsola(texto, font);
            }

            escribirChat(chat, charIndex, r, g, b) { // TODO: colores?
                if (this.characters[charIndex]) {
                    this.renderer.setCharacterChat(this.characters[charIndex], chat, r, g, b);
                }
            }

            actualizarMovPos(char, direccion) {
                // Se setea la pos del grid nomas porque la (x,y) la usa para la animacion el character ( y la actualiza el al final)
                if (this.entityGrid[char.gridX][char.gridY][1]) {
                    if (this.entityGrid[char.gridX][char.gridY][1].id === char.id) // es necesario checkear que sean iguales porque puede que haya otro char que piso la dir de este (pisar caspers)
                    {
                        this.entityGrid[char.gridX][char.gridY][1] = null;
                    }
                }

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
            }

            actualizarBajoTecho() {
                this.map.onceLoaded(() => {
                    var bajoTecho = this.map.isBajoTecho(this.player.gridX, this.player.gridY);
                    if (this.bajoTecho !== bajoTecho) {
                        this.bajoTecho = bajoTecho;
                        this.renderer.setBajoTecho(bajoTecho);
                        if (this.lloviendo && this.map.mapaOutdoor()) {
                            this.assetManager.audio.playLoopLluvia(bajoTecho);
                        }
                    }
                });
            }

            _removeAllEntitys() {
                var self = this;
                this.forEachEntity(
                    function (entity, index) {
                        if (entity !== self.player) {
                            self.sacarEntity(entity);
                        }
                    }
                );
            }

            _removeAllEntities() {
                var self = this;
                this.forEachEntity(function (entity) {
                    if (entity.id !== self.player.id) {
                        self.sacarEntity(entity);
                    }
                });
                this.items = [];
            }

            sacarEntity(entity) {
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
            }

            moverCharacter(CharIndex, gridX, gridY) {

                if (CharIndex === this.player.id) {
                    if ((X !== this.player.gridX) || (Y !== this.player.gridY)) {
                        this.resetPosCharacter(CharIndex, X, Y);
                        log.error("moverCharacter: cambiar pos player a x:" + X + " y:" + Y);
                    }
                } else {
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

            }

            playSonidoPaso(char) {
                if (char.muerto || !this.renderer.entityEnTileVisible(char)) {
                    return;
                }
                if (this.playerState.navegando) { //todo: que sea dependiendo si el char navega, no el player
                    this.assetManager.audio.playSound(Enums.SONIDOS.pasoNavegando);
                }
                else {
                    char.pasoDerecho = !char.pasoDerecho;
                    if (char.pasoDerecho) {
                        this.assetManager.audio.playSound(Enums.SONIDOS.paso1);
                    } else {
                        this.assetManager.audio.playSound(Enums.SONIDOS.paso2);
                    }
                }
            }

            cambiarCharacter(CharIndex, Body, Head, Heading, Weapon, Shield, Helmet, FX, FXLoops) { // TODO: que solo cambie los que son diferentes!

                var c = this.characters[CharIndex];

                if (!c) {
                    //log.error(" cambiar character inexistente ");
                    return;
                }
                if (Heading !== c.heading) {
                    c.cambiarHeading(Heading);
                }
                c.muerto = !!((Head === Enums.Muerto.cabezaCasper) || (Body === Enums.Muerto.cuerpoFragataFantasmal));

                this.renderer.cambiarCharacter(c, Body, Head, Heading, Weapon, Shield, Helmet, FX, FXLoops);
            }

            agregarCharacter(CharIndex, Body, Head, Heading, X, Y, Weapon, Shield, Helmet, FX, FXLoops, Name,
                             NickColor, Privileges) {

                if (this.characters[CharIndex]) {
                    if (CharIndex === this.player.id) {
                        this.resetPosCharacter(this.player.id, X, Y, true);
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
                var c = new Character(CharIndex, X, Y, Heading, nombre, clan);

                if ((Head === Enums.Muerto.cabezaCasper) || (Body === Enums.Muerto.cuerpoFragataFantasmal)) {
                    c.muerto = true;
                } else {
                    c.muerto = false;
                }

                this.entityGrid[X][Y][1] = c;
                this.characters[CharIndex] = c;

                this.setCharacterFX(CharIndex, FX, FXLoops);
                this.renderer.agregarCharacter(c, Body, Head, Heading, X, Y, Weapon, Shield, Helmet, FX, FXLoops, nombre, clan,
                    NickColor);
            }

            agregarItem(grhIndex, gridX, gridY) { // TODO: rever si ahora que no hay que updatear hace falta tenerlos en un array
                var viejoItem = this.entityGrid[gridX][gridY][0];
                if (viejoItem) {
                    this.sacarEntity(viejoItem);
                }
                var id = 0;
                while (this.items[id]) {
                    id++;
                }
                var item = new Item(id, gridX, gridY);
                this.entityGrid[gridX][gridY][0] = item;
                this.items[id] = item;
                this.renderer.agregarItem(item, grhIndex);
            }

            sacarItem(gridX, gridY) {
                var item = this.items[this.entityGrid[gridX][gridY][0].id];
                if (item) {
                    this.sacarEntity(item);
                }
            }

            changePlayerIndex(CharIndex) {
                if (this.player.id !== CharIndex) {
                    log.error("NUEVO PLAYER INDEX: " + CharIndex);
                    var prevPlayerCharacter = this.player;
                    this.player = this.characters[CharIndex];
                    this.sacarEntity(prevPlayerCharacter);

                }
                this.inicializarPlayerEnMapa();
            }

            inicializarPlayerEnMapa() {
                var X = this.player.gridX;
                var Y = this.player.gridY;
                log.error("DRAW MAPA INICIAL!!! MAPA:" + this.map.numero + " X: " + X + " Y: " + Y);
                // --- esto para que se setee al player una pos "anterior" a la del cambio de mapa para que de la ilusion que avanza un tile (sino se deberia quedar quieto esperando el intervalo o traeria problemas en mapas donde entras mirando la salida (ademas de que pasarias siempre en la 2da pos)) ---
                let f = () => {
                    if (this.playerMovement.estaMoviendose()) {
                        var dir;
                        switch (this.playerMovement.getDirMov()) {
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
                        this.playerMovement.forceCaminar(dir);
                        this.ignorarProximoSonidoPaso = true; // que no haga sonido este paso forzado
                    }

                    this.resetPosCharacter(this.player.id, X, Y, true);
                    this.renderer.drawMapaIni(this.player.gridX, this.player.gridY);
                };
                if (!this.map.isLoaded) {
                    this.map.onceLoaded(() => {
                        f();
                    });
                } else {
                    f();
                }
            }

            toggleSeguroResucitar() {
                this.seguroResucitacionActivado = !this.seguroResucitacionActivado;
                this.gameUI.interfaz.setSeguroResucitacion(this.seguroResucitacionActivado);
                this.client.sendResuscitationSafeToggle();
            }

            toggleSeguroAtacar() {
                this.seguroAtacarActivado = !this.seguroAtacarActivado;
                this.gameUI.interfaz.setSeguroAtacar(this.seguroAtacarActivado);
                this.client.sendSafeToggle();
            }

            cambiarSlotInventario(numSlot, ObjIndex, ObjName, Amount, Equiped, GrhIndex, ObjType, MaxHit, MinHit, MaxDef, MinDef, ObjSalePrice) {
                this.inventario.cambiarSlot(numSlot, ObjName, Amount, ObjSalePrice, GrhIndex, ObjIndex, ObjType, MaxHit, MinHit, MaxDef, MinDef, Equiped);
                this.gameUI.updateSlotUser(numSlot, this.inventario.getSlot(numSlot));
            }

            cambiarSlotHechizos(slot, spellID, nombre) {
                this.hechizos[slot] = {id: spellID, nombre: nombre};
                this.gameUI.interfaz.modificarSlotHechizo(slot, nombre);
                /*if (this.logeado)
                 this.uiRenderer.modificarSlotHechizos(slot, nombre);*/
            }

            inicializarPlayer(CharIndex, Body, Head, Heading, X, Y, Weapon, Shield, Helmet, FX, FXLoops, nombre, clan, NickColor, Privileges) {
                log.error("inicializar player");
                this.player = new Character(CharIndex, X, Y, Heading, nombre, clan);

                this.player.muerto = !!((Head === Enums.Muerto.cabezaCasper) || (Body === Enums.Muerto.cuerpoFragataFantasmal));

                this.entityGrid[X][Y][1] = this.player;
                this.characters[CharIndex] = this.player;

                this.setCharacterFX(CharIndex, FX, FXLoops);
                this.renderer.agregarCharacter(this.player, Body, Head, Heading, X, Y, Weapon, Shield, Helmet, FX, FXLoops, nombre, clan,
                    NickColor);

                this.actualizarIndicadorPosMapa();
            }

            resetPosCharacter(charIndex, gridX, gridY, noReDraw) {
                var c = this.characters[charIndex];
                if (!c) {
                    log.error(" Reset pos de character no existente, charindex=" + charIndex);
                    return;
                }
                if (this.entityGrid[c.gridX][c.gridY][1] === c) {
                    this.entityGrid[c.gridX][c.gridY][1] = null;
                }

                c.resetMovement();
                c.setGridPosition(gridX, gridY);
                this.entityGrid[gridX][gridY][1] = c; // TODO <- esto puede traer problemas

                if (c === this.player) {
                    console.log(" reseteando pos player");
                    if (!noReDraw) {
                        this.renderer.resetPos(gridX, gridY);
                    }
                    this.actualizarBajoTecho();
                    this.actualizarIndicadorPosMapa();
                }
            }

            cambiarMapa(numeroMapa) {
                /* todo: cambiar esto si deja de ser sync: */
                //this._removeAllEntitys();
                var prevMapa = this.map;
                this.map = new Mapa(numeroMapa);
                this.renderer.cambiarMapa(this.map);
                
                this.assetManager.getMapaASync(
                    numeroMapa,
                    (mapData) => {
                        if (this.map.numero === numeroMapa) {
                            this.map.setData(mapData);
                        }
                    });

                this.playerMovement.disable();
                this.map.onceLoaded( () => {
                    this.playerMovement.enable();
                    if (this.lloviendo && prevMapa) {
                        if (this.map.mapaOutdoor() !== prevMapa.mapaOutdoor()) {
                            if (this.map.mapaOutdoor()) {
                                this.assetManager.audio.IniciarSonidoLluvia();
                            } else {
                                this.assetManager.audio.finalizarSonidoLluvia();
                            }
                            this.renderer.toggleLluvia();
                        }
                    }
                });
                this._removeAllEntities();
            }

            actualizarIndicadorPosMapa() {
                this.gameUI.interfaz.updateIndicadorPosMapa(this.map.numero, this.player.gridX, this.player.gridY);
            }

            cambiarArea(gridX, gridY) {

                var MinLimiteX = Math.floor(gridX / 9 - 1) * 9;
                var MaxLimiteX = MinLimiteX + 26;

                var MinLimiteY = Math.floor(gridY / 9 - 1) * 9;
                var MaxLimiteY = MinLimiteY + 26;

                var self = this;
                this.forEachEntity(
                    function (entity, index) {
                        if (( (entity.gridY < MinLimiteY) || (entity.gridY > MaxLimiteY) ) || ( (entity.gridX < MinLimiteX) || (entity.gridX > MaxLimiteX) )) {
                            if (entity !== self.player) {
                                self.sacarEntity(entity);
                            }
                        }
                    }
                );
            }

            forceCaminar(direccion) {
                this.playerMovement.forceCaminar(direccion);
            }

            initPlayerMovementCallbacks() {
                this.playerMovement.setOnCaminar(function (direccion, forced) {
                    {
                        if (!forced) {
                            this.client.sendWalk(direccion);
                        }
                        this.actualizarMovPos(this.player, direccion);
                        this.actualizarBajoTecho();
                        if (this.ignorarProximoSonidoPaso) {
                            this.ignorarProximoSonidoPaso = false;
                        } else {
                            this.playSonidoPaso(this.player);
                        }
                        this.actualizarIndicadorPosMapa();
                    }
                }.bind(this));

                this.playerMovement.setOnCambioHeading(function (direccion) {
                    this.client.sendChangeHeading(direccion);
                }.bind(this));

                this.playerMovement.setOnPuedeCaminar(function (direccion) {

                    if (this.playerState.paralizado) {
                        return false;
                    }
                    if (this.playerState.meditando) {
                        // envia solo 1 vez el mensaje de caminar para que deje de meditar, feo esto
                        if (!this._waltkToCancelMeditarSent) {
                            this.client.sendWalk(direccion);
                        }
                        this._waltkToCancelMeditarSent = true;
                        return false;
                    } else {
                        this._waltkToCancelMeditarSent = false;
                    }

                    var x = this.player.gridX;
                    var y = this.player.gridY;
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

                    if (this.map.isBlocked(x, y)) {
                        return false;
                    }

                    if (this.map.hayAgua(x, y) !== this.playerState.navegando) {
                        return false;
                    }

                    if (this.entityGrid[x][y][1]) {
                        if (!this.entityGrid[x][y][1].muerto) {
                            return false;
                        }
                        else {
                            // tienen que estar o ambos en agua o ambos en tierra (player y casper)
                            if (!(this.map.hayAgua(x, y) === this.map.hayAgua(this.player.gridX, this.player.gridY))) {
                                return false;
                            }
                        }
                    }

                    return true;
                }.bind(this));

                this.playerMovement.setOnMoverse(
                    function (x, y) {
                        x = Math.round(x);
                        y = Math.round(y);
                        this.renderer.moverPosition(x - this.renderer.camera.centerPosX, y - this.renderer.camera.centerPosY);
                    }.bind(this));

                this.playerMovement.setOnMoverseBegin(
                    function (dir) {
                        this.renderer.updateTilesMov(dir);
                    }.bind(this));
            }

            setTrabajoPendiente(skill) {
                this.gameUI.interfaz.setMouseCrosshair(true);
                this.trabajoPendiente = skill;
            }

            realizarTrabajoPendiente() {
                var gridPos = this.getMouseGridPosition();
                this.gameUI.interfaz.setMouseCrosshair(false);
                this.client.sendWorkLeftClick(gridPos.x, gridPos.y, this.trabajoPendiente);
                this.trabajoPendiente = null;
            }

            cambiarSlotCompra(numSlot, ObjName, Amount, Price, GrhIndex, ObjIndex, ObjType, MaxHit, MinHit, MaxDef, MinDef) {
                this.inventarioShop.cambiarSlot(numSlot, ObjName, Amount, Price, GrhIndex, ObjIndex, ObjType, MaxHit, MinHit, MaxDef, MinDef);
                this.gameUI.updateSlotShop(numSlot, this.inventarioShop.getSlot(numSlot));

            }

            cambiarSlotRetirar(numSlot, ObjIndex, ObjName, Amount, GrhIndex, ObjType, MaxHit, MinHit, MaxDef, MinDef, ObjSalePrice) {
                this.bankShop.cambiarSlot(numSlot, ObjName, Amount, ObjSalePrice, GrhIndex, ObjIndex, ObjType, MaxHit, MinHit, MaxDef, MinDef);
                this.gameUI.updateSlotBank(numSlot, this.bankShop.getSlot(numSlot));
            }

            togglePausa() {
                this.isPaused = !(this.isPaused);
            }

            setCharacterFX(CharIndex, FX, FXLoops) {
                if (!this.characters[CharIndex]) {
                    log.error("crear fx en character inexistente");
                    return;
                }
                if (FX === 0) {
                    if (this.characters[CharIndex].sprite) {
                        this.characters[CharIndex].sprite.removerFxsInfinitos();
                    }
                    return;
                }
                FXLoops = FXLoops + 1;
                this.renderer.setCharacterFX(this.characters[CharIndex], FX, FXLoops);
            }

            initEntityGrid() {
                this.entityGrid = [];
                for (var i = 1; i < this.map.height + 1; i += 1) {
                    this.entityGrid[i] = [];
                    for (var j = 1; j < this.map.width + 1; j += 1) {
                        this.entityGrid[i][j] = []; // [1] = son cosas que bloquena (PJS,NPCS, ETC) , [0] son cosas pisables, items , etc
                    }
                }
                log.info("Initialized the entity grid.");
            }

            inicializar(username) {
                this.username = username;
                this.setUpdater(new Updater(this));
                this.initEntityGrid();
                this.ready = true;
            }

            tick() {
                this.currentTime = Date.now();
                if (this.started) {

                    this.renderer.renderFrame();
                    if (!this.isPaused) {
                        this.updater.update();
                    }
                }

                if (!this.isStopped) {
                    requestAnimFrame(this.tick.bind(this));
                }
            }

            start() {

                if (this.started) {
                    return;
                }

                this.logeado = true;
                this.started = true;
                this.tick();
                log.info("Game loop started.");
            }

            stop() {
                log.info("Game stopped.");
                this.isStopped = true;
            }

            entityIdExists(id) {
                return id in this.entities;
            }

            getEntityById(id) {
                if (id in this.entities) {
                    return this.entities[id];
                }
                else {
                    log.error("Unknown entity id : " + id, true);
                }
            }

            getMouseGridPosition() { // TODO: usar InteractionManager para detectar sprite clickeado y rederigir a ese tile???
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
                if (this.playerMovement.estaMoviendose() && offsetX) {

                    if (this.player.heading === Enums.Heading.oeste) {
                        x = x + 1; // fix de pos de c.gridX
                        if (x === (this.player.gridX + 1)) {
                            x--;
                        }
                    }
                    if (this.player.heading === Enums.Heading.este) {
                        if (x === this.player.gridX - 1) {
                            x++;
                        }
                    }
                }
                return {x: x, y: y};
            }

            forEachEntity(callback) {
                _.each(this.characters, function (entity, index) {
                    if (entity) {
                        callback(entity, index);
                    }
                });

                _.each(this.items, function (entity, index) {
                    if (entity) {
                        callback(entity, index);
                    }
                });

            }

            forEachCharacter(callback) {
                _.each(this.characters, function (entity) {
                    if (entity) {
                        callback(entity);
                    }
                });
            }

            forEachItem(callback) {
                _.each(this.items, function (entity) {
                    if (entity) {
                        callback(entity);
                    }
                });
            }

            resize(escala) {
                this.renderer.rescale(escala);
            }

        }

        return Game;
    });
