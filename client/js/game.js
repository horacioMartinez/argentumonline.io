define(['enums', 'animacion', 'mapa', 'infomanager', 'renderer',
         'gameclient', 'audio', 'updater', 'transition',
         'item',  'player', 'character',
        'config', '../shared/js/gametypes', 'loader', 'uirenderer'],
    function (Enums, Animacion, Mapa, InfoManager, Renderer,
               GameClient, AudioManager, Updater, Transition,
              Item, Player, Character,  config, __gametypes__, Loader, UIRenderer) {
        var Game = Class.extend({
            init: function (app) {
                this.MAXIMO_LARGO_CHAT = 15; // maximo largo en caracters hasta hacer nueva linea de chat (notar las palabras se escriben completa, por lo que puede pasar los 10 caracteres)

                this.loader = new Loader();
                this.indices = this.loader.getIndices();
                this.armas = this.loader.getArmas();
                this.cabezas = this.loader.getCabezas();
                this.cascos = this.loader.getCascos();
                this.cuerpos = this.loader.getCuerpos();
                this.escudos = this.loader.getEscudos();
                this.escudos = this.loader.getEscudos();
                this.fxs = this.loader.getFxs();

                this.loader.loadUI();
                this.loader.loadGraficos();

                this.app = app;
                this.app.config = config;
                this.ready = false;
                this.started = false;

                this.uiRenderer = null;
                this.renderer = null;
                this.updater = null;
                this.chatinput = null;
                this.audioManager = null;

                // items: se ven abajo de tod0 (items, sprites de sangre, etc) , characters: npcs, bichos, jugadores (incluye el propio) ambos osn entity
                this.entityGrid = null;
                this.characters = []; // characters indexeados por ID
                this.items = []; // idem items

                // Player
                this.playerId = null; //charindex
                this.player = {}; // se inicializa con el msj logged, ver la funcion inicializarPlayer
                this.logeado = false;
                this.inventario = [];
                this.hechizos = [];

                // Game state
                this.itemGrid = null;
                this.currentCursor = null;
                this.mouse = {x: 0, y: 0};

                this.cursorVisible = true;

                // combat
                this.infoManager = new InfoManager(this);


                this.cursors = {};



            },

            setup: function (canvas, background, foreground, interfaz, input) {
                this.uiRenderer = new UIRenderer(this, interfaz, this.loader);
                this.setRenderer(new Renderer(this, canvas, background, foreground, this.loader));
                this.setChatInput(input);
            },

            setStorage: function (storage) {
                this.storage = storage;
            },

            setRenderer: function (renderer) {
                this.renderer = renderer;
            },

            setUpdater: function (updater) {
                this.updater = updater;
            },


            setChatInput: function (element) {
                this.chatinput = element;
            },

            loadMap: function () {

                this.map = new Mapa(1, this); // TODO: ver esto
                /*var self = this;
                 this.map = new Map(!this.renderer.upscaledRendering, this);

                 this.map.ready(function () {
                 log.info("Map loaded.");
                 var tilesetIndex = self.renderer.upscaledRendering ? 0 : self.renderer.scale - 1;
                 self.renderer.setTileset(self.map.tilesets[tilesetIndex]);
                 });*/
            },

            initPlayer: function () {
                if (this.storage.hasAlreadyPlayed() && this.storage.data.player) {
                    if (this.storage.data.player.armor && this.storage.data.player.weapon) {
                        this.player.setSpriteName(this.storage.data.player.armor);
                        this.player.setWeaponName(this.storage.data.player.weapon);
                    }
                    if (this.storage.data.player.guild) {
                        this.player.setGuild(this.storage.data.player.guild);
                    }
                }

                this.player.setSprite(this.sprites[this.player.getSpriteName()]);
                this.player.idle();

                log.debug("Finished initPlayer");
            },

            initShadows: function () {
                this.shadows = {};
                this.shadows["small"] = this.sprites["shadow16"];
            },

            initCursors: function () {

            },

            initAnimations: function () {
                this.targetAnimation = new Animation("idle_down", 4, 0, 16, 16);
                this.targetAnimation.setSpeed(50);

                this.sparksAnimation = new Animation("idle_down", 6, 0, 16, 16);
                this.sparksAnimation.setSpeed(120);
            },

            initHurtSprites: function () {
                var self = this;

                Types.forEachArmorKind(function (kind, kindName) {
                    self.sprites[kindName].createHurtSprite();
                });
            },

            initSilhouettes: function () {
                var self = this;

                Types.forEachMobOrNpcKind(function (kind, kindName) {
                    self.sprites[kindName].createSilhouette();
                });
                self.sprites["chest"].createSilhouette();
                self.sprites["item-cake"].createSilhouette();
            },

            initAchievements: function () {
                var self = this;

                this.achievements = {
                    A_TRUE_WARRIOR: {
                        id: 1,
                        name: "A True Warrior",
                        desc: "Find a new weapon"
                    },
                    INTO_THE_WILD: {
                        id: 2,
                        name: "Into the Wild",
                        desc: "Venture outside the village"
                    },
                    ANGRY_RATS: {
                        id: 3,
                        name: "Angry Rats",
                        desc: "Kill 10 rats",
                        isCompleted: function () {
                            return self.storage.getRatCount() >= 10;
                        }
                    },
                    SMALL_TALK: {
                        id: 4,
                        name: "Small Talk",
                        desc: "Talk to a non-player character"
                    },
                    FAT_LOOT: {
                        id: 5,
                        name: "Fat Loot",
                        desc: "Get a new armor set"
                    },
                    UNDERGROUND: {
                        id: 6,
                        name: "Underground",
                        desc: "Explore at least one cave"
                    },
                    AT_WORLDS_END: {
                        id: 7,
                        name: "At World's End",
                        desc: "Reach the south shore"
                    },
                    COWARD: {
                        id: 8,
                        name: "Coward",
                        desc: "Successfully escape an enemy"
                    },
                    TOMB_RAIDER: {
                        id: 9,
                        name: "Tomb Raider",
                        desc: "Find the graveyard"
                    },
                    SKULL_COLLECTOR: {
                        id: 10,
                        name: "Skull Collector",
                        desc: "Kill 10 skeletons",
                        isCompleted: function () {
                            return self.storage.getSkeletonCount() >= 10;
                        }
                    },
                    NINJA_LOOT: {
                        id: 11,
                        name: "Ninja Loot",
                        desc: "Get hold of an item you didn't fight for"
                    },
                    NO_MANS_LAND: {
                        id: 12,
                        name: "No Man's Land",
                        desc: "Travel through the desert"
                    },
                    HUNTER: {
                        id: 13,
                        name: "Hunter",
                        desc: "Kill 50 enemies",
                        isCompleted: function () {
                            return self.storage.getTotalKills() >= 50;
                        }
                    },
                    STILL_ALIVE: {
                        id: 14,
                        name: "Still Alive",
                        desc: "Revive your character five times",
                        isCompleted: function () {
                            return self.storage.getTotalRevives() >= 5;
                        }
                    },
                    MEATSHIELD: {
                        id: 15,
                        name: "Meatshield",
                        desc: "Take 5,000 points of damage",
                        isCompleted: function () {
                            return self.storage.getTotalDamageTaken() >= 5000;
                        }
                    },
                    HOT_SPOT: {
                        id: 16,
                        name: "Hot Spot",
                        desc: "Enter the volcanic mountains"
                    },
                    HERO: {
                        id: 17,
                        name: "Hero",
                        desc: "Defeat the final boss"
                    },
                    FOXY: {
                        id: 18,
                        name: "Foxy",
                        desc: "Find the Firefox costume",
                        hidden: true
                    },
                    FOR_SCIENCE: {
                        id: 19,
                        name: "For Science",
                        desc: "Enter into a portal",
                        hidden: true
                    },
                    RICKROLLD: {
                        id: 20,
                        name: "Rickroll'd",
                        desc: "Take some singing lessons",
                        hidden: true
                    }
                };

                _.each(this.achievements, function (obj) {
                    if (!obj.isCompleted) {
                        obj.isCompleted = function () {
                            return true;
                        }
                    }
                    if (!obj.hidden) {
                        obj.hidden = false;
                    }
                });


                if (this.storage.hasAlreadyPlayed()) {
                    //this.app.initUnlockedAchievements(this.storage.data.achievements.unlocked);
                }
            },

            setSpriteScale: function (scale) {
                var self = this;
                /*
                if (this.renderer.upscaledRendering) {
                    this.sprites = this.spritesets[0];
                } else {
                    this.sprites = this.spritesets[2];//scale - 1]; modificiado por mi

                    _.each(this.entities, function (entity) {
                        entity.sprite = null;
                        entity.setSprite(self.sprites[entity.getSpriteName()]);
                    });
                    //this.initHurtSprites();
                    this.initShadows();
                    //this.initCursors();
                }*/
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

            realizarDanio: function (CharIndex,danio) {
                this.infoManager.addDamageInfo(-danio, this.characters[CharIndex].x + 15, this.characters[CharIndex].y - 25 , "received");
                this.infoManager.addConsoleInfo("TODO: daño en consola!:"+danio);
            },

            escribirMsgConsola: function (texto,fontIndex){ //TODO: fontindex
                this.infoManager.addConsoleInfo(texto);
            },

            formatearChat: function(str){
                var resultado = [];
                while ( (str.length > this.MAXIMO_LARGO_CHAT) && (str.indexOf(' ') > (-1)) ){
                    var idx = str.indexOf(' ');
                    var posUltimoEspacioPrimerBloque = idx;
                    while ( (idx != -1) && (idx < this.MAXIMO_LARGO_CHAT - 1 ) ) {
                        idx = str.indexOf(' ', idx + 1);
                        if (idx > 0)
                            posUltimoEspacioPrimerBloque = idx;
                    }
                    if (posUltimoEspacioPrimerBloque > 0 )
                        resultado.push(str.slice(0, posUltimoEspacioPrimerBloque));
                    str = str.slice(posUltimoEspacioPrimerBloque+1,str.length);
                }
                resultado.push(str);
                return resultado;
            },

            escribirChat: function (chat, charIndex, r, g, b) { // TODO: colores?
                if (this.characters[charIndex]){
                    this.characters[charIndex].chat = this.formatearChat(chat);
                    this.characters[charIndex].tiempoChatInicial = this.currentTime;
                }
                //this.createBubble(charIndex, chat);
            },

            enviarChat: function (message) {
                //#cli guilds
                var regexp = /^\/guild\ (invite|create|accept)\s+([^\s]*)|(guild:)\s*(.*)$|^\/guild\ (leave)$/i;
                var args = message.match(regexp);
                if (args != undefined) {
                    switch (args[1]) {
                        case "invite":
                            if (this.player.hasGuild()) {
                                this.client.sendGuildInvite(args[2]);
                            }
                            else {
                                this.showNotification("Invite " + args[2] + " to where?");
                            }
                            break;
                        case "create":
                            this.client.sendNewGuild(args[2]);
                            break;
                        case undefined:
                            if (args[5] === "leave") {
                                this.client.sendLeaveGuild();
                            }
                            else if (this.player.hasGuild()) {
                                this.client.talkToGuild(args[4]);
                            }
                            else {
                                this.showNotification("You got no-one to talk to…");
                            }
                            break;
                        case "accept":
                            var status;
                            if (args[2] === "yes") {
                                status = this.player.checkInvite();
                                if (status === false) {
                                    this.showNotification("You were not invited anyway…");
                                }
                                else if (status < 0) {
                                    this.showNotification("Sorry to say it's too late…");
                                    setTimeout(function () {
                                        self.showNotification("Find someone and ask for another invite.")
                                    }, 2500);
                                }
                                else {
                                    this.client.sendGuildInviteReply(this.player.invite.guildId, true);
                                }
                            }
                            else if (args[2] === "no") {
                                status = this.player.checkInvite();
                                if (status !== false) {
                                    this.client.sendGuildInviteReply(this.player.invite.guildId, false);
                                    this.player.deleteInvite();
                                }
                                else {
                                    this.showNotification("Whatever…");
                                }
                            }
                            else {
                                this.showNotification("“guild accept” is a YES or NO question!!");
                            }
                            break;
                    }
                }

                this.client.sendTalk(message);
            },
            /*            Case "/ONLINE"
             Call WriteOnline

             Case "/SALIR"
             If UserParalizado Then 'Inmo
             With FontTypes(FontTypeNames.FONTTYPE_WARNING)
             Call ShowConsoleMsg("No puedes salir estando paralizado.", .red, .green, .blue, .bold, .italic)
             End With
             Exit Sub
             End If
             If frmMain.macrotrabajo.Enabled Then Call frmMain.DesactivarMacroTrabajo
             Call WriteQuit

             Case "/SALIRCLAN"
             Call WriteGuildLeave

             Case "/BALANCE"
             If UserEstado = 1 Then 'Muerto
             With FontTypes(FontTypeNames.FONTTYPE_INFO)
             Call ShowConsoleMsg("¡¡Estás muerto!!", .red, .green, .blue, .bold, .italic)
             End With
             Exit Sub
             End If
             Call WriteRequestAccountState

             Case "/QUIETO"
             If UserEstado = 1 Then 'Muerto
             With FontTypes(FontTypeNames.FONTTYPE_INFO)
             Call ShowConsoleMsg("¡¡Estás muerto!!", .red, .green, .blue, .bold, .italic)
             End With
             Exit Sub
             End If
             Call WritePetStand

             Case "/ACOMPAÑAR"
             If UserEstado = 1 Then 'Muerto
             With FontTypes(FontTypeNames.FONTTYPE_INFO)
             Call ShowConsoleMsg("¡¡Estás muerto!!", .red, .green, .blue, .bold, .italic)
             End With
             Exit Sub
             End If
             Call WritePetFollow

             Case "/LIBERAR"
             If UserEstado = 1 Then 'Muerto
             With FontTypes(FontTypeNames.FONTTYPE_INFO)
             Call ShowConsoleMsg("¡¡Estás muerto!!", .red, .green, .blue, .bold, .italic)
             End With
             Exit Sub
             End If
             Call WriteReleasePet

             Case "/ENTRENAR"
             If UserEstado = 1 Then 'Muerto
             With FontTypes(FontTypeNames.FONTTYPE_INFO)
             Call ShowConsoleMsg("¡¡Estás muerto!!", .red, .green, .blue, .bold, .italic)
             End With
             Exit Sub
             End If
             Call WriteTrainList

             Case "/DESCANSAR"
             If UserEstado = 1 Then 'Muerto
             With FontTypes(FontTypeNames.FONTTYPE_INFO)
             Call ShowConsoleMsg("¡¡Estás muerto!!", .red, .green, .blue, .bold, .italic)
             End With
             Exit Sub
             End If
             Call WriteRest

             Case "/MEDITAR"
             If UserMinMAN = UserMaxMAN Then Exit Sub

             If UserEstado = 1 Then 'Muerto
             With FontTypes(FontTypeNames.FONTTYPE_INFO)
             Call ShowConsoleMsg("¡¡Estás muerto!!", .red, .green, .blue, .bold, .italic)
             End With
             Exit Sub
             End If
             Call WriteMeditate

             Case "/CONSULTA"
             Call WriteConsultation

             Case "/RESUCITAR"
             Call WriteResucitate

             Case "/CURAR"
             Call WriteHeal

             Case "/EST"
             Call WriteRequestStats

             Case "/AYUDA"
             Call WriteHelp

             Case "/COMERCIAR"
             If UserEstado = 1 Then 'Muerto
             With FontTypes(FontTypeNames.FONTTYPE_INFO)
             Call ShowConsoleMsg("¡¡Estás muerto!!", .red, .green, .blue, .bold, .italic)
             End With
             Exit Sub

             ElseIf Comerciando Then 'Comerciando
             With FontTypes(FontTypeNames.FONTTYPE_INFO)
             Call ShowConsoleMsg("Ya estás comerciando", .red, .green, .blue, .bold, .italic)
             End With
             Exit Sub
             End If
             Call WriteCommerceStart

             Case "/BOVEDA"
             If UserEstado = 1 Then 'Muerto
             With FontTypes(FontTypeNames.FONTTYPE_INFO)
             Call ShowConsoleMsg("¡¡Estás muerto!!", .red, .green, .blue, .bold, .italic)
             End With
             Exit Sub
             End If
             Call WriteBankStart

             Case "/ENLISTAR"
             Call WriteEnlist

             Case "/INFORMACION"
             Call WriteInformation

             Case "/RECOMPENSA"
             Call WriteReward

             Case "/MOTD"
             Call WriteRequestMOTD

             Case "/UPTIME"
             Call WriteUpTime

             Case "/SALIRPARTY"
             Call WritePartyLeave

             Case "/CREARPARTY"
             If UserEstado = 1 Then 'Muerto
             With FontTypes(FontTypeNames.FONTTYPE_INFO)
             Call ShowConsoleMsg("¡¡Estás muerto!!", .red, .green, .blue, .bold, .italic)
             End With
             Exit Sub
             End If
             Call WritePartyCreate

             Case "/PARTY"
             If UserEstado = 1 Then 'Muerto
             With FontTypes(FontTypeNames.FONTTYPE_INFO)
             Call ShowConsoleMsg("¡¡Estás muerto!!", .red, .green, .blue, .bold, .italic)
             End With
             Exit Sub
             End If
             Call WritePartyJoin

             Case "/COMPARTIRNPC"
             If UserEstado = 1 Then 'Muerto
             With FontTypes(FontTypeNames.FONTTYPE_INFO)
             Call ShowConsoleMsg("¡¡Estás muerto!!", .red, .green, .blue, .bold, .italic)
             End With
             Exit Sub
             End If

             Call WriteShareNpc

             Case "/NOCOMPARTIRNPC"
             If UserEstado = 1 Then 'Muerto
             With FontTypes(FontTypeNames.FONTTYPE_INFO)
             Call ShowConsoleMsg("¡¡Estás muerto!!", .red, .green, .blue, .bold, .italic)
             End With
             Exit Sub
             End If

             Call WriteStopSharingNpc

             Case "/ENCUESTA"
             If CantidadArgumentos = 0 Then
             ' Version sin argumentos: Inquiry
             Call WriteInquiry
             Else
             ' Version con argumentos: InquiryVote
             If ValidNumber(ArgumentosRaw, eNumber_Types.ent_Byte) Then
             Call WriteInquiryVote(ArgumentosRaw)
             Else
             'No es numerico
             Call ShowConsoleMsg("Para votar una opción, escribe /encuesta NUMERODEOPCION, por ejemplo para votar la opcion 1, escribe /encuesta 1.")
             End If
             End If

             Case "/CMSG"
             'Ojo, no usar notNullArguments porque se usa el string vacio para borrar cartel.
             If CantidadArgumentos > 0 Then
             Call WriteGuildMessage(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Escriba un mensaje.")
             End If

             Case "/PMSG"
             'Ojo, no usar notNullArguments porque se usa el string vacio para borrar cartel.
             If CantidadArgumentos > 0 Then
             Call WritePartyMessage(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Escriba un mensaje.")
             End If

             Case "/CENTINELA"
             If notNullArguments Then
             If ValidNumber(ArgumentosRaw, eNumber_Types.ent_Integer) Then
             Call WriteCentinelReport(CInt(ArgumentosRaw))
             Else
             'No es numerico
             Call ShowConsoleMsg("El código de verificación debe ser numérico. Utilice /centinela X, siendo X el código de verificación.")
             End If
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /centinela X, siendo X el código de verificación.")
             End If

             Case "/ONLINECLAN"
             Call WriteGuildOnline

             Case "/ONLINEPARTY"
             Call WritePartyOnline

             Case "/BMSG"
             If notNullArguments Then
             Call WriteCouncilMessage(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Escriba un mensaje.")
             End If

             Case "/ROL"
             If notNullArguments Then
             Call WriteRoleMasterRequest(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Escriba una pregunta.")
             End If

             Case "/GM"
             Call WriteGMRequest

             Case "/_BUG"
             If notNullArguments Then
             Call WriteBugReport(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Escriba una descripción del bug.")
             End If

             Case "/DESC"
             If UserEstado = 1 Then 'Muerto
             With FontTypes(FontTypeNames.FONTTYPE_INFO)
             Call ShowConsoleMsg("¡¡Estás muerto!!", .red, .green, .blue, .bold, .italic)
             End With
             Exit Sub
             End If

             Call WriteChangeDescription(ArgumentosRaw)

             Case "/VOTO"
             If notNullArguments Then
             Call WriteGuildVote(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /voto NICKNAME.")
             End If

             Case "/PENAS"
             If notNullArguments Then
             Call WritePunishments(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /penas NICKNAME.")
             End If

             Case "/CONTRASEÑA"
             Call frmNewPassword.Show(vbModal, frmMain)

             Case "/APOSTAR"
             If UserEstado = 1 Then 'Muerto
             With FontTypes(FontTypeNames.FONTTYPE_INFO)
             Call ShowConsoleMsg("¡¡Estás muerto!!", .red, .green, .blue, .bold, .italic)
             End With
             Exit Sub
             End If
             If notNullArguments Then
             If ValidNumber(ArgumentosRaw, eNumber_Types.ent_Integer) Then
             Call WriteGamble(ArgumentosRaw)
             Else
             'No es numerico
             Call ShowConsoleMsg("Cantidad incorrecta. Utilice /apostar CANTIDAD.")
             End If
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /apostar CANTIDAD.")
             End If

             Case "/RETIRARFACCION"
             If UserEstado = 1 Then 'Muerto
             With FontTypes(FontTypeNames.FONTTYPE_INFO)
             Call ShowConsoleMsg("¡¡Estás muerto!!", .red, .green, .blue, .bold, .italic)
             End With
             Exit Sub
             End If

             Call WriteLeaveFaction

             Case "/RETIRAR"
             If UserEstado = 1 Then 'Muerto
             With FontTypes(FontTypeNames.FONTTYPE_INFO)
             Call ShowConsoleMsg("¡¡Estás muerto!!", .red, .green, .blue, .bold, .italic)
             End With
             Exit Sub
             End If

             If notNullArguments Then
             ' Version con argumentos: BankExtractGold
             If ValidNumber(ArgumentosRaw, eNumber_Types.ent_Long) Then
             Call WriteBankExtractGold(ArgumentosRaw)
             Else
             'No es numerico
             Call ShowConsoleMsg("Cantidad incorrecta. Utilice /retirar CANTIDAD.")
             End If
             End If

             Case "/DEPOSITAR"
             If UserEstado = 1 Then 'Muerto
             With FontTypes(FontTypeNames.FONTTYPE_INFO)
             Call ShowConsoleMsg("¡¡Estás muerto!!", .red, .green, .blue, .bold, .italic)
             End With
             Exit Sub
             End If

             If notNullArguments Then
             If ValidNumber(ArgumentosRaw, eNumber_Types.ent_Long) Then
             Call WriteBankDepositGold(ArgumentosRaw)
             Else
             'No es numerico
             Call ShowConsoleMsg("Cantidad incorecta. Utilice /depositar CANTIDAD.")
             End If
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /depositar CANTIDAD.")
             End If

             Case "/DENUNCIAR"
             If notNullArguments Then
             Call WriteDenounce(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Formule su denuncia.")
             End If

             Case "/FUNDARCLAN"
             If UserLvl >= 25 Then
             Call WriteGuildFundate
             Else
             Call ShowConsoleMsg("Para fundar un clan tienes que ser nivel 25 y tener 90 skills en liderazgo.")
             End If

             Case "/FUNDARCLANGM"
             Call WriteGuildFundation(eClanType.ct_GM)

             Case "/ECHARPARTY"
             If notNullArguments Then
             Call WritePartyKick(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /echarparty NICKNAME.")
             End If

             Case "/PARTYLIDER"
             If notNullArguments Then
             Call WritePartySetLeader(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /partylider NICKNAME.")
             End If

             Case "/ACCEPTPARTY"
             If notNullArguments Then
             Call WritePartyAcceptMember(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /acceptparty NICKNAME.")
             End If

             '
             ' BEGIN GM COMMANDS
             '

             Case "/GMSG"
             If notNullArguments Then
             Call WriteGMMessage(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Escriba un mensaje.")
             End If

             Case "/SHOWNAME"
             Call WriteShowName

             Case "/ONLINEREAL"
             Call WriteOnlineRoyalArmy

             Case "/ONLINECAOS"
             Call WriteOnlineChaosLegion

             Case "/IRCERCA"
             If notNullArguments Then
             Call WriteGoNearby(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /ircerca NICKNAME.")
             End If

             Case "/REM"
             If notNullArguments Then
             Call WriteComment(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Escriba un comentario.")
             End If

             Case "/HORA"
             Call Protocol.WriteServerTime

             Case "/DONDE"
             If notNullArguments Then
             Call WriteWhere(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /donde NICKNAME.")
             End If

             Case "/NENE"
             If notNullArguments Then
             If ValidNumber(ArgumentosRaw, eNumber_Types.ent_Integer) Then
             Call WriteCreaturesInMap(ArgumentosRaw)
             Else
             'No es numerico
             Call ShowConsoleMsg("Mapa incorrecto. Utilice /nene MAPA.")
             End If
             Else
             'Por default, toma el mapa en el que esta
             Call WriteCreaturesInMap(UserMap)
             End If

             Case "/TELEPLOC"
             Call WriteWarpMeToTarget

             Case "/TELEP"
             If notNullArguments And CantidadArgumentos >= 4 Then
             If ValidNumber(ArgumentosAll(1), eNumber_Types.ent_Integer) And ValidNumber(ArgumentosAll(2), eNumber_Types.ent_Byte) And ValidNumber(ArgumentosAll(3), eNumber_Types.ent_Byte) Then
             Call WriteWarpChar(ArgumentosAll(0), ArgumentosAll(1), ArgumentosAll(2), ArgumentosAll(3))
             Else
             'No es numerico
             Call ShowConsoleMsg("Valor incorrecto. Utilice /telep NICKNAME MAPA X Y.")
             End If
             ElseIf CantidadArgumentos = 3 Then
             If ValidNumber(ArgumentosAll(0), eNumber_Types.ent_Integer) And ValidNumber(ArgumentosAll(1), eNumber_Types.ent_Byte) And ValidNumber(ArgumentosAll(2), eNumber_Types.ent_Byte) Then
             'Por defecto, si no se indica el nombre, se teletransporta el mismo usuario
             Call WriteWarpChar("YO", ArgumentosAll(0), ArgumentosAll(1), ArgumentosAll(2))
             ElseIf ValidNumber(ArgumentosAll(1), eNumber_Types.ent_Byte) And ValidNumber(ArgumentosAll(2), eNumber_Types.ent_Byte) Then
             'Por defecto, si no se indica el mapa, se teletransporta al mismo donde esta el usuario
             Call WriteWarpChar(ArgumentosAll(0), UserMap, ArgumentosAll(1), ArgumentosAll(2))
             Else
             'No uso ningun formato por defecto
             Call ShowConsoleMsg("Valor incorrecto. Utilice /telep NICKNAME MAPA X Y.")
             End If
             ElseIf CantidadArgumentos = 2 Then
             If ValidNumber(ArgumentosAll(0), eNumber_Types.ent_Byte) And ValidNumber(ArgumentosAll(1), eNumber_Types.ent_Byte) Then
             ' Por defecto, se considera que se quiere unicamente cambiar las coordenadas del usuario, en el mismo mapa
             Call WriteWarpChar("YO", UserMap, ArgumentosAll(0), ArgumentosAll(1))
             Else
             'No uso ningun formato por defecto
             Call ShowConsoleMsg("Valor incorrecto. Utilice /telep NICKNAME MAPA X Y.")
             End If
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /telep NICKNAME MAPA X Y.")
             End If

             Case "/SILENCIAR"
             If notNullArguments Then
             Call WriteSilence(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /silenciar NICKNAME.")
             End If

             Case "/SHOW"
             If notNullArguments Then
             Select Case UCase$(ArgumentosAll(0))
             Case "SOS"
             Call WriteSOSShowList

             Case "INT"
             Call WriteShowServerForm

             Case "DENUNCIAS"
             Call WriteShowDenouncesList
             End Select
             End If

             Case "/DENUNCIAS"
             Call WriteEnableDenounces

             Case "/IRA"
             If notNullArguments Then
             Call WriteGoToChar(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /ira NICKNAME.")
             End If

             Case "/INVISIBLE"
             Call WriteInvisible

             Case "/PANELGM"
             Call WriteGMPanel

             Case "/TRABAJANDO"
             Call WriteWorking

             Case "/OCULTANDO"
             Call WriteHiding

             Case "/CARCEL"
             If notNullArguments Then
             tmpArr = Split(ArgumentosRaw, "@")
             If UBound(tmpArr) = 2 Then
             If ValidNumber(tmpArr(2), eNumber_Types.ent_Byte) Then
             Call WriteJail(tmpArr(0), tmpArr(1), tmpArr(2))
             Else
             'No es numerico
             Call ShowConsoleMsg("Tiempo incorrecto. Utilice /carcel NICKNAME@MOTIVO@TIEMPO.")
             End If
             Else
             'Faltan los parametros con el formato propio
             Call ShowConsoleMsg("Formato incorrecto. Utilice /carcel NICKNAME@MOTIVO@TIEMPO.")
             End If
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /carcel NICKNAME@MOTIVO@TIEMPO.")
             End If

             Case "/RMATA"
             Call WriteKillNPC

             Case "/ADVERTENCIA"
             If notNullArguments Then
             tmpArr = Split(ArgumentosRaw, "@", 2)
             If UBound(tmpArr) = 1 Then
             Call WriteWarnUser(tmpArr(0), tmpArr(1))
             Else
             'Faltan los parametros con el formato propio
             Call ShowConsoleMsg("Formato incorrecto. Utilice /advertencia NICKNAME@MOTIVO.")
             End If
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /advertencia NICKNAME@MOTIVO.")
             End If

             Case "/MOD"
             If notNullArguments And CantidadArgumentos >= 3 Then
             Select Case UCase$(ArgumentosAll(1))
             Case "BODY"
             tmpInt = eEditOptions.eo_Body

             Case "HEAD"
             tmpInt = eEditOptions.eo_Head

             Case "ORO"
             tmpInt = eEditOptions.eo_Gold

             Case "LEVEL"
             tmpInt = eEditOptions.eo_Level

             Case "SKILLS"
             tmpInt = eEditOptions.eo_Skills

             Case "SKILLSLIBRES"
             tmpInt = eEditOptions.eo_SkillPointsLeft

             Case "CLASE"
             tmpInt = eEditOptions.eo_Class

             Case "EXP"
             tmpInt = eEditOptions.eo_Experience

             Case "CRI"
             tmpInt = eEditOptions.eo_CriminalsKilled

             Case "CIU"
             tmpInt = eEditOptions.eo_CiticensKilled

             Case "NOB"
             tmpInt = eEditOptions.eo_Nobleza

             Case "ASE"
             tmpInt = eEditOptions.eo_Asesino

             Case "SEX"
             tmpInt = eEditOptions.eo_Sex

             Case "RAZA"
             tmpInt = eEditOptions.eo_Raza

             Case "AGREGAR"
             tmpInt = eEditOptions.eo_addGold

             Case "VIDA"
             tmpInt = eEditOptions.eo_Vida

             Case "POSS"
             tmpInt = eEditOptions.eo_Poss

             Case Else
             tmpInt = -1
             End Select

             If tmpInt > 0 Then

             If CantidadArgumentos = 3 Then
             Call WriteEditChar(ArgumentosAll(0), tmpInt, ArgumentosAll(2), "")
             Else
             Call WriteEditChar(ArgumentosAll(0), tmpInt, ArgumentosAll(2), ArgumentosAll(3))
             End If
             Else
             'Avisar que no exite el comando
             Call ShowConsoleMsg("Comando incorrecto.")
             End If
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros.")
             End If

             Case "/INFO"
             If notNullArguments Then
             Call WriteRequestCharInfo(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /info NICKNAME.")
             End If

             Case "/STAT"
             If notNullArguments Then
             Call WriteRequestCharStats(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /stat NICKNAME.")
             End If

             Case "/BAL"
             If notNullArguments Then
             Call WriteRequestCharGold(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /bal NICKNAME.")
             End If

             Case "/INV"
             If notNullArguments Then
             Call WriteRequestCharInventory(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /inv NICKNAME.")
             End If

             Case "/BOV"
             If notNullArguments Then
             Call WriteRequestCharBank(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /bov NICKNAME.")
             End If

             Case "/SKILLS"
             If notNullArguments Then
             Call WriteRequestCharSkills(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /skills NICKNAME.")
             End If

             Case "/REVIVIR"
             If notNullArguments Then
             Call WriteReviveChar(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /revivir NICKNAME.")
             End If

             Case "/ONLINEGM"
             Call WriteOnlineGM

             Case "/ONLINEMAP"
             If notNullArguments Then
             If ValidNumber(ArgumentosAll(0), eNumber_Types.ent_Integer) Then
             Call WriteOnlineMap(ArgumentosAll(0))
             Else
             Call ShowConsoleMsg("Mapa incorrecto.")
             End If
             Else
             Call WriteOnlineMap(UserMap)
             End If

             Case "/PERDON"
             If notNullArguments Then
             Call WriteForgive(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /perdon NICKNAME.")
             End If

             Case "/ECHAR"
             If notNullArguments Then
             Call WriteKick(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /echar NICKNAME.")
             End If

             Case "/EJECUTAR"
             If notNullArguments Then
             Call WriteExecute(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /ejecutar NICKNAME.")
             End If

             Case "/BAN"
             If notNullArguments Then
             tmpArr = Split(ArgumentosRaw, "@", 2)
             If UBound(tmpArr) = 1 Then
             Call WriteBanChar(tmpArr(0), tmpArr(1))
             Else
             'Faltan los parametros con el formato propio
             Call ShowConsoleMsg("Formato incorrecto. Utilice /ban NICKNAME@MOTIVO.")
             End If
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /ban NICKNAME@MOTIVO.")
             End If

             Case "/UNBAN"
             If notNullArguments Then
             Call WriteUnbanChar(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /unban NICKNAME.")
             End If

             Case "/SEGUIR"
             Call WriteNPCFollow

             Case "/SUM"
             If notNullArguments Then
             Call WriteSummonChar(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /sum NICKNAME.")
             End If

             Case "/CC"
             Call WriteSpawnListRequest

             Case "/RESETINV"
             Call WriteResetNPCInventory

             Case "/LIMPIAR"
             Call WriteCleanWorld

             Case "/RMSG"
             If notNullArguments Then
             Call WriteServerMessage(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Escriba un mensaje.")
             End If

             Case "/MAPMSG"
             If notNullArguments Then
             Call WriteMapMessage(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Escriba un mensaje.")
             End If

             Case "/NICK2IP"
             If notNullArguments Then
             Call WriteNickToIP(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /nick2ip NICKNAME.")
             End If

             Case "/IP2NICK"
             If notNullArguments Then
             If validipv4str(ArgumentosRaw) Then
             Call WriteIPToNick(str2ipv4l(ArgumentosRaw))
             Else
             'No es una IP
             Call ShowConsoleMsg("IP incorrecta. Utilice /ip2nick IP.")
             End If
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /ip2nick IP.")
             End If

             Case "/ONCLAN"
             If notNullArguments Then
             Call WriteGuildOnlineMembers(ArgumentosRaw)
             Else
             'Avisar sintaxis incorrecta
             Call ShowConsoleMsg("Utilice /onclan nombre del clan.")
             End If

             Case "/CT"
             If notNullArguments And CantidadArgumentos >= 3 Then
             If ValidNumber(ArgumentosAll(0), eNumber_Types.ent_Integer) And ValidNumber(ArgumentosAll(1), eNumber_Types.ent_Byte) And _
             ValidNumber(ArgumentosAll(2), eNumber_Types.ent_Byte) Then

             If CantidadArgumentos = 3 Then
             Call WriteTeleportCreate(ArgumentosAll(0), ArgumentosAll(1), ArgumentosAll(2))
             Else
             If ValidNumber(ArgumentosAll(3), eNumber_Types.ent_Byte) Then
             Call WriteTeleportCreate(ArgumentosAll(0), ArgumentosAll(1), ArgumentosAll(2), ArgumentosAll(3))
             Else
             'No es numerico
             Call ShowConsoleMsg("Valor incorrecto. Utilice /ct MAPA X Y RADIO(Opcional).")
             End If
             End If
             Else
             'No es numerico
             Call ShowConsoleMsg("Valor incorrecto. Utilice /ct MAPA X Y RADIO(Opcional).")
             End If
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /ct MAPA X Y RADIO(Opcional).")
             End If

             Case "/DT"
             Call WriteTeleportDestroy

             Case "/LLUVIA"
             Call WriteRainToggle

             Case "/SETDESC"
             Call WriteSetCharDescription(ArgumentosRaw)

             Case "/FORCEMIDIMAP"
             If notNullArguments Then
             'elegir el mapa es opcional
             If CantidadArgumentos = 1 Then
             If ValidNumber(ArgumentosAll(0), eNumber_Types.ent_Byte) Then
             'eviamos un mapa nulo para que tome el del usuario.
             Call WriteForceMIDIToMap(ArgumentosAll(0), 0)
             Else
             'No es numerico
             Call ShowConsoleMsg("Midi incorrecto. Utilice /forcemidimap MIDI MAPA, siendo el mapa opcional.")
             End If
             Else
             If ValidNumber(ArgumentosAll(0), eNumber_Types.ent_Byte) And ValidNumber(ArgumentosAll(1), eNumber_Types.ent_Integer) Then
             Call WriteForceMIDIToMap(ArgumentosAll(0), ArgumentosAll(1))
             Else
             'No es numerico
             Call ShowConsoleMsg("Valor incorrecto. Utilice /forcemidimap MIDI MAPA, siendo el mapa opcional.")
             End If
             End If
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Utilice /forcemidimap MIDI MAPA, siendo el mapa opcional.")
             End If

             Case "/FORCEWAVMAP"
             If notNullArguments Then
             'elegir la posicion es opcional
             If CantidadArgumentos = 1 Then
             If ValidNumber(ArgumentosAll(0), eNumber_Types.ent_Byte) Then
             'eviamos una posicion nula para que tome la del usuario.
             Call WriteForceWAVEToMap(ArgumentosAll(0), 0, 0, 0)
             Else
             'No es numerico
             Call ShowConsoleMsg("Utilice /forcewavmap WAV MAP X Y, siendo los últimos 3 opcionales.")
             End If
             ElseIf CantidadArgumentos = 4 Then
             If ValidNumber(ArgumentosAll(0), eNumber_Types.ent_Byte) And ValidNumber(ArgumentosAll(1), eNumber_Types.ent_Integer) And ValidNumber(ArgumentosAll(2), eNumber_Types.ent_Byte) And ValidNumber(ArgumentosAll(3), eNumber_Types.ent_Byte) Then
             Call WriteForceWAVEToMap(ArgumentosAll(0), ArgumentosAll(1), ArgumentosAll(2), ArgumentosAll(3))
             Else
             'No es numerico
             Call ShowConsoleMsg("Utilice /forcewavmap WAV MAP X Y, siendo los últimos 3 opcionales.")
             End If
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Utilice /forcewavmap WAV MAP X Y, siendo los últimos 3 opcionales.")
             End If
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Utilice /forcewavmap WAV MAP X Y, siendo los últimos 3 opcionales.")
             End If

             Case "/REALMSG"
             If notNullArguments Then
             Call WriteRoyalArmyMessage(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Escriba un mensaje.")
             End If

             Case "/CAOSMSG"
             If notNullArguments Then
             Call WriteChaosLegionMessage(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Escriba un mensaje.")
             End If

             Case "/CIUMSG"
             If notNullArguments Then
             Call WriteCitizenMessage(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Escriba un mensaje.")
             End If

             Case "/CRIMSG"
             If notNullArguments Then
             Call WriteCriminalMessage(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Escriba un mensaje.")
             End If

             Case "/TALKAS"
             If notNullArguments Then
             Call WriteTalkAsNPC(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Escriba un mensaje.")
             End If

             Case "/MASSDEST"
             Call WriteDestroyAllItemsInArea

             Case "/ACEPTCONSE"
             If notNullArguments Then
             Call WriteAcceptRoyalCouncilMember(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /aceptconse NICKNAME.")
             End If

             Case "/ACEPTCONSECAOS"
             If notNullArguments Then
             Call WriteAcceptChaosCouncilMember(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /aceptconsecaos NICKNAME.")
             End If

             Case "/PISO"
             Call WriteItemsInTheFloor

             Case "/ESTUPIDO"
             If notNullArguments Then
             Call WriteMakeDumb(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /estupido NICKNAME.")
             End If

             Case "/NOESTUPIDO"
             If notNullArguments Then
             Call WriteMakeDumbNoMore(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /noestupido NICKNAME.")
             End If

             Case "/DUMPSECURITY"
             Call WriteDumpIPTables

             Case "/KICKCONSE"
             If notNullArguments Then
             Call WriteCouncilKick(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /kickconse NICKNAME.")
             End If

             Case "/TRIGGER"
             If notNullArguments Then
             If ValidNumber(ArgumentosRaw, eNumber_Types.ent_Trigger) Then
             Call WriteSetTrigger(ArgumentosRaw)
             Else
             'No es numerico
             Call ShowConsoleMsg("Número incorrecto. Utilice /trigger NUMERO.")
             End If
             Else
             'Version sin parametro
             Call WriteAskTrigger
             End If

             Case "/BANIPLIST"
             Call WriteBannedIPList

             Case "/BANIPRELOAD"
             Call WriteBannedIPReload

             Case "/MIEMBROSCLAN"
             If notNullArguments Then
             Call WriteGuildMemberList(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /miembrosclan GUILDNAME.")
             End If

             Case "/BANCLAN"
             If notNullArguments Then
             Call WriteGuildBan(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /banclan GUILDNAME.")
             End If

             Case "/BANIP"
             If CantidadArgumentos >= 2 Then
             If validipv4str(ArgumentosAll(0)) Then
             Call WriteBanIP(True, str2ipv4l(ArgumentosAll(0)), vbNullString, Right$(ArgumentosRaw, Len(ArgumentosRaw) - Len(ArgumentosAll(0)) - 1))
             Else
             'No es una IP, es un nick
             Call WriteBanIP(False, str2ipv4l("0.0.0.0"), ArgumentosAll(0), Right$(ArgumentosRaw, Len(ArgumentosRaw) - Len(ArgumentosAll(0)) - 1))
             End If
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /banip IP motivo o /banip nick motivo.")
             End If

             Case "/UNBANIP"
             If notNullArguments Then
             If validipv4str(ArgumentosRaw) Then
             Call WriteUnbanIP(str2ipv4l(ArgumentosRaw))
             Else
             'No es una IP
             Call ShowConsoleMsg("IP incorrecta. Utilice /unbanip IP.")
             End If
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /unbanip IP.")
             End If

             Case "/CI"
             If notNullArguments Then
             If ValidNumber(ArgumentosAll(0), eNumber_Types.ent_Long) Then
             Call WriteCreateItem(ArgumentosAll(0))
             Else
             'No es numerico
             Call ShowConsoleMsg("Objeto incorrecto. Utilice /ci OBJETO.")
             End If
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /ci OBJETO.")
             End If

             Case "/DEST"
             Call WriteDestroyItems

             Case "/NOCAOS"
             If notNullArguments Then
             tmpArr = Split(ArgumentosRaw, "@", 2)

             If UBound(tmpArr) = 1 Then
             Call WriteChaosLegionKick(tmpArr(0), tmpArr(1))
             Else
             'Faltan los parametros con el formato propio
             Call ShowConsoleMsg("Faltan parámetros. Utilice /nocaos NICKNAME@MOTIVO.")
             End If
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /nocaos NICKNAME@MOTIVO.")
             End If

             Case "/NOREAL"
             If notNullArguments Then
             tmpArr = Split(ArgumentosRaw, "@", 2)

             If UBound(tmpArr) = 1 Then
             Call WriteRoyalArmyKick(tmpArr(0), tmpArr(1))
             Else
             'Faltan los parametros con el formato propio
             Call ShowConsoleMsg("Faltan parámetros. Utilice /noreal NICKNAME@MOTIVO.")
             End If
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /noreal NICKNAME@MOTIVO.")
             End If

             Case "/FORCEMIDI"
             If notNullArguments Then
             If ValidNumber(ArgumentosAll(0), eNumber_Types.ent_Byte) Then
             Call WriteForceMIDIAll(ArgumentosAll(0))
             Else
             'No es numerico
             Call ShowConsoleMsg("Midi incorrecto. Utilice /forcemidi MIDI.")
             End If
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /forcemidi MIDI.")
             End If

             Case "/FORCEWAV"
             If notNullArguments Then
             If ValidNumber(ArgumentosAll(0), eNumber_Types.ent_Byte) Then
             Call WriteForceWAVEAll(ArgumentosAll(0))
             Else
             'No es numerico
             Call ShowConsoleMsg("Wav incorrecto. Utilice /forcewav WAV.")
             End If
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /forcewav WAV.")
             End If

             Case "/BORRARPENA"
             If notNullArguments Then
             tmpArr = Split(ArgumentosRaw, "@", 3)
             If UBound(tmpArr) = 2 Then
             Call WriteRemovePunishment(tmpArr(0), tmpArr(1), tmpArr(2))
             Else
             'Faltan los parametros con el formato propio
             Call ShowConsoleMsg("Formato incorrecto. Utilice /borrarpena NICK@PENA@NuevaPena.")
             End If
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /borrarpena NICK@PENA@NuevaPena.")
             End If

             Case "/BLOQ"
             Call WriteTileBlockedToggle

             Case "/MATA"
             Call WriteKillNPCNoRespawn

             Case "/MASSKILL"
             Call WriteKillAllNearbyNPCs

             Case "/LASTIP"
             If notNullArguments Then
             Call WriteLastIP(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /lastip NICKNAME.")
             End If

             Case "/MOTDCAMBIA"
             Call WriteChangeMOTD

             Case "/SMSG"
             If notNullArguments Then
             Call WriteSystemMessage(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Escriba un mensaje.")
             End If

             Case "/ACC"
             If notNullArguments Then
             If ValidNumber(ArgumentosAll(0), eNumber_Types.ent_Integer) Then
             Call WriteCreateNPC(ArgumentosAll(0))
             Else
             'No es numerico
             Call ShowConsoleMsg("Npc incorrecto. Utilice /acc NPC.")
             End If
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /acc NPC.")
             End If

             Case "/RACC"
             If notNullArguments Then
             If ValidNumber(ArgumentosAll(0), eNumber_Types.ent_Integer) Then
             Call WriteCreateNPCWithRespawn(ArgumentosAll(0))
             Else
             'No es numerico
             Call ShowConsoleMsg("Npc incorrecto. Utilice /racc NPC.")
             End If
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /racc NPC.")
             End If

             Case "/AI" ' 1 - 4
             If notNullArguments And CantidadArgumentos >= 2 Then
             If ValidNumber(ArgumentosAll(0), eNumber_Types.ent_Byte) And ValidNumber(ArgumentosAll(1), eNumber_Types.ent_Integer) Then
             Call WriteImperialArmour(ArgumentosAll(0), ArgumentosAll(1))
             Else
             'No es numerico
             Call ShowConsoleMsg("Valor incorrecto. Utilice /ai ARMADURA OBJETO.")
             End If
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /ai ARMADURA OBJETO.")
             End If

             Case "/AC" ' 1 - 4
             If notNullArguments And CantidadArgumentos >= 2 Then
             If ValidNumber(ArgumentosAll(0), eNumber_Types.ent_Byte) And ValidNumber(ArgumentosAll(1), eNumber_Types.ent_Integer) Then
             Call WriteChaosArmour(ArgumentosAll(0), ArgumentosAll(1))
             Else
             'No es numerico
             Call ShowConsoleMsg("Valor incorrecto. Utilice /ac ARMADURA OBJETO.")
             End If
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /ac ARMADURA OBJETO.")
             End If

             Case "/NAVE"
             Call WriteNavigateToggle

             Case "/HABILITAR"
             Call WriteServerOpenToUsersToggle

             Case "/APAGAR"
             Call WriteTurnOffServer

             Case "/CONDEN"
             If notNullArguments Then
             Call WriteTurnCriminal(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /conden NICKNAME.")
             End If

             Case "/RAJAR"
             If notNullArguments Then
             Call WriteResetFactions(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /rajar NICKNAME.")
             End If

             Case "/RAJARCLAN"
             If notNullArguments Then
             Call WriteRemoveCharFromGuild(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /rajarclan NICKNAME.")
             End If

             Case "/LASTEMAIL"
             If notNullArguments Then
             Call WriteRequestCharMail(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /lastemail NICKNAME.")
             End If

             Case "/APASS"
             If notNullArguments Then
             tmpArr = Split(ArgumentosRaw, "@", 2)
             If UBound(tmpArr) = 1 Then
             Call WriteAlterPassword(tmpArr(0), tmpArr(1))
             Else
             'Faltan los parametros con el formato propio
             Call ShowConsoleMsg("Formato incorrecto. Utilice /apass PJSINPASS@PJCONPASS.")
             End If
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /apass PJSINPASS@PJCONPASS.")
             End If

             Case "/AEMAIL"
             If notNullArguments Then
             tmpArr = AEMAILSplit(ArgumentosRaw)
             If LenB(tmpArr(0)) = 0 Then
             'Faltan los parametros con el formato propio
             Call ShowConsoleMsg("Formato incorrecto. Utilice /aemail NICKNAME-NUEVOMAIL.")
             Else
             Call WriteAlterMail(tmpArr(0), tmpArr(1))
             End If
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /aemail NICKNAME-NUEVOMAIL.")
             End If

             Case "/ANAME"
             If notNullArguments Then
             tmpArr = Split(ArgumentosRaw, "@", 2)
             If UBound(tmpArr) = 1 Then
             Call WriteAlterName(tmpArr(0), tmpArr(1))
             Else
             'Faltan los parametros con el formato propio
             Call ShowConsoleMsg("Formato incorrecto. Utilice /aname ORIGEN@DESTINO.")
             End If
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /aname ORIGEN@DESTINO.")
             End If

             Case "/SLOT"
             If notNullArguments Then
             tmpArr = Split(ArgumentosRaw, "@", 2)
             If UBound(tmpArr) = 1 Then
             If ValidNumber(tmpArr(1), eNumber_Types.ent_Byte) Then
             Call WriteCheckSlot(tmpArr(0), tmpArr(1))
             Else
             'Faltan o sobran los parametros con el formato propio
             Call ShowConsoleMsg("Formato incorrecto. Utilice /slot NICK@SLOT.")
             End If
             Else
             'Faltan o sobran los parametros con el formato propio
             Call ShowConsoleMsg("Formato incorrecto. Utilice /slot NICK@SLOT.")
             End If
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /slot NICK@SLOT.")
             End If

             Case "/CENTINELAACTIVADO"
             Call WriteToggleCentinelActivated

             Case "/CREARPRETORIANOS"

             If CantidadArgumentos = 3 Then

             If ValidNumber(ArgumentosAll(0), eNumber_Types.ent_Integer) And _
             ValidNumber(ArgumentosAll(1), eNumber_Types.ent_Byte) And _
             ValidNumber(ArgumentosAll(2), eNumber_Types.ent_Byte) Then

             Call WriteCreatePretorianClan(Val(ArgumentosAll(0)), Val(ArgumentosAll(1)), _
             Val(ArgumentosAll(2)))
             Else
             'Faltan o sobran los parametros con el formato propio
             Call ShowConsoleMsg("Formato incorrecto. Utilice /CrearPretorianos MAPA X Y.")
             End If

             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /CrearPretorianos MAPA X Y.")
             End If

             Case "/ELIMINARPRETORIANOS"

             If CantidadArgumentos = 1 Then

             If ValidNumber(ArgumentosAll(0), eNumber_Types.ent_Integer) Then

             Call WriteDeletePretorianClan(Val(ArgumentosAll(0)))
             Else
             'Faltan o sobran los parametros con el formato propio
             Call ShowConsoleMsg("Formato incorrecto. Utilice /EliminarPretorianos MAPA.")
             End If

             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /EliminarPretorianos MAPA.")
             End If

             Case "/DOBACKUP"
             Call WriteDoBackup

             Case "/SHOWCMSG"
             If notNullArguments Then
             Call WriteShowGuildMessages(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /showcmsg GUILDNAME.")
             End If

             Case "/GUARDAMAPA"
             Call WriteSaveMap

             Case "/MODMAPINFO" ' PK, BACKUP
             If CantidadArgumentos > 1 Then
             Select Case UCase$(ArgumentosAll(0))
             Case "PK" ' "/MODMAPINFO PK"
             Call WriteChangeMapInfoPK(ArgumentosAll(1) = "1")

             Case "BACKUP" ' "/MODMAPINFO BACKUP"
             Call WriteChangeMapInfoBackup(ArgumentosAll(1) = "1")

             Case "RESTRINGIR" '/MODMAPINFO RESTRINGIR
             Call WriteChangeMapInfoRestricted(ArgumentosAll(1))

             Case "MAGIASINEFECTO" '/MODMAPINFO MAGIASINEFECTO
             Call WriteChangeMapInfoNoMagic(ArgumentosAll(1) = "1")

             Case "INVISINEFECTO" '/MODMAPINFO INVISINEFECTO
             Call WriteChangeMapInfoNoInvi(ArgumentosAll(1) = "1")

             Case "RESUSINEFECTO" '/MODMAPINFO RESUSINEFECTO
             Call WriteChangeMapInfoNoResu(ArgumentosAll(1) = "1")

             Case "TERRENO" '/MODMAPINFO TERRENO
             Call WriteChangeMapInfoLand(ArgumentosAll(1))

             Case "ZONA" '/MODMAPINFO ZONA
             Call WriteChangeMapInfoZone(ArgumentosAll(1))

             Case "ROBONPC" '/MODMAPINFO ROBONPC
             Call WriteChangeMapInfoStealNpc(ArgumentosAll(1) = "1")

             Case "OCULTARSINEFECTO" '/MODMAPINFO OCULTARSINEFECTO
             Call WriteChangeMapInfoNoOcultar(ArgumentosAll(1) = "1")

             Case "INVOCARSINEFECTO" '/MODMAPINFO INVOCARSINEFECTO
             Call WriteChangeMapInfoNoInvocar(ArgumentosAll(1) = "1")

             End Select
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Opciones: PK, BACKUP, RESTRINGIR, MAGIASINEFECTO, INVISINEFECTO, RESUSINEFECTO, TERRENO, ZONA")
             End If

             Case "/GRABAR"
             Call WriteSaveChars

             Case "/BORRAR"
             If notNullArguments Then
             Select Case UCase(ArgumentosAll(0))
             Case "SOS" ' "/BORRAR SOS"
             Call WriteCleanSOS

             End Select
             End If

             Case "/NOCHE"
             Call WriteNight

             Case "/ECHARTODOSPJS"
             Call WriteKickAllChars

             Case "/RELOADNPCS"
             Call WriteReloadNPCs

             Case "/RELOADSINI"
             Call WriteReloadServerIni

             Case "/RELOADHECHIZOS"
             Call WriteReloadSpells

             Case "/RELOADOBJ"
             Call WriteReloadObjects

             Case "/REINICIAR"
             Call WriteRestart

             Case "/AUTOUPDATE"
             Call WriteResetAutoUpdate

             Case "/CHATCOLOR"
             If notNullArguments And CantidadArgumentos >= 3 Then
             If ValidNumber(ArgumentosAll(0), eNumber_Types.ent_Byte) And ValidNumber(ArgumentosAll(1), eNumber_Types.ent_Byte) And ValidNumber(ArgumentosAll(2), eNumber_Types.ent_Byte) Then
             Call WriteChatColor(ArgumentosAll(0), ArgumentosAll(1), ArgumentosAll(2))
             Else
             'No es numerico
             Call ShowConsoleMsg("Valor incorrecto. Utilice /chatcolor R G B.")
             End If
             ElseIf Not notNullArguments Then    'Go back to default!
             Call WriteChatColor(0, 255, 0)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /chatcolor R G B.")
             End If

             Case "/IGNORADO"
             Call WriteIgnored

             Case "/PING"
             Call WritePing

             Case "/SETINIVAR"
             If CantidadArgumentos = 3 Then
             ArgumentosAll(2) = Replace(ArgumentosAll(2), "+", " ")
             Call WriteSetIniVar(ArgumentosAll(0), ArgumentosAll(1), ArgumentosAll(2))
             Else
             Call ShowConsoleMsg("Prámetros incorrectos. Utilice /SETINIVAR LLAVE CLAVE VALOR")
             End If

             Case "/HOGAR"
             Call WriteHome

             Case "/SETDIALOG"
             If notNullArguments Then
             Call WriteSetDialog(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /SETDIALOG DIALOGO.")
             End If

             Case "/IMPERSONAR"
             Call WriteImpersonate

             Case "/MIMETIZAR"
             Call WriteImitate

             Case "/DMSG"
             If notNullArguments Then
             Call WriteHigherAdminsMessage(ArgumentosRaw)
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Escriba un mensaje.")
             End If

             Case "/ACLAN"
             If notNullArguments Then
             tmpArr = Split(ArgumentosRaw, "@", 2)
             If UBound(tmpArr) = 1 Then
             Call WriteAlterGuildName(tmpArr(0), tmpArr(1))
             Else
             'Faltan los parametros con el formato propio
             Call ShowConsoleMsg("Formato incorrecto. Utilice /ACLAN ORIGEN@DESTINO.")
             End If
             Else
             'Avisar que falta el parametro
             Call ShowConsoleMsg("Faltan parámetros. Utilice /ACLAN ORIGEN@DESTINO.")
             End If
             */


            actualizarMovPos: function (char, direccion, preservarEntity) {
                // Se setea la pos del grid nomas porque la (x,y) la usa para la animacion el character ( y la actualiza el al final)
                if (!preservarEntity)
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

            sacarEntity: function (entity) {
                if (entity instanceof Character) {
                    if (entity === this.player) {
                        log.error("TRATANDO DE SACAR AL PLAYER!");
                        return;
                    }
                    this.entityGrid[entity.gridX][entity.gridY][1] = null;
                    this.characters[entity.id] = null;
                }
                else if (entity instanceof Item) {
                    var item = this.items[entity.id];
                    this.entityGrid[item.gridX][item.gridY][0] = null;
                    this.items[entity.id] = null;
                    //this.items.splice(index, 1);
                }
            },

            getGrhOAnim: function (numGrh, loops) {
                if (!numGrh)
                    return 0;

                if (this.indices[numGrh].frames) {   // es animacion
                    if ( (!loops) && (loops !== 0))
                        loops = 1;
                    return new Animacion(this.indices[numGrh].frames, this.indices[numGrh].velocidad, loops);
                }
                return numGrh;
            },

            desindexear: function (numero, varIndice) {
                var Grhs = [];
                Grhs[Enums.Heading.norte] = this.getGrhOAnim(varIndice[numero].up);
                Grhs[Enums.Heading.este] = this.getGrhOAnim(varIndice[numero].right);
                Grhs[Enums.Heading.sur] = this.getGrhOAnim(varIndice[numero].down);
                Grhs[Enums.Heading.oeste] = this.getGrhOAnim(varIndice[numero].left);

                return Grhs;
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
                        log.error("mover character inexistente: " + CharIndex);
                        return;
                    }
                    var dir = c.esPosAdyacente(gridX, gridY);
                    if (!this.renderer.entityEnRangoVisible(c) || !dir) {
                        this.resetPosCharacter(CharIndex, gridX, gridY);
                    }
                    else {
                        c.mover(dir);
                        if (this.entityGrid[c.gridX][c.gridY][1] !== c) // hay otro pj en la pos de este (pasa al pisar caspers)
                            this.actualizarMovPos(c, dir, true);
                        else
                            this.actualizarMovPos(c, dir);
                    }

                }
            },

            cambiarCharacter: function (CharIndex, Body, Head, Heading, Weapon, Shield, Helmet, FX, FXLoops) { // TODO: que solo cambie los que son diferentes!

                c = this.characters[CharIndex];

                if (!c) {
                    log.error(" cambiar character inexistente ");
                    return;
                }
                if (Heading !== c.heading)
                    c.cambiarHeading(Heading);

                // TODO!!!: que solo cambie los que son diferentes!
                c.setBodyGrh(this.desindexear(Body, this.cuerpos));
                c.offHeadX = this.cuerpos[Body].offHeadX;
                c.offHeadY = this.cuerpos[Body].offHeadY;
                c.setHeadGrh(this.desindexear(Head, this.cabezas));
                c.setWeaponGrh(this.desindexear(Weapon, this.armas));
                c.setShieldGrh(this.desindexear(Shield, this.escudos));
                c.setHelmetGrh(this.desindexear(Helmet, this.cascos));
            },

            agregarCharacter: function (CharIndex, Body, Head, Heading, X, Y, Weapon, Shield, Helmet, FX, FXLoops, Name,
                                        NickColor, Privileges) {

                if (CharIndex === this.playerId) { // cuando pasa de mapa vuelve a mandar el crear de tu pj, directamente cambio pos e ignoro lo demas
                    if (this.player) {
                        if ((X !== this.player.gridX) || (Y !== this.player.gridY)) {
                            log.info(" DIBUJANDO INICIALMENTE MAPA");
                            this.resetPosCharacter(this.playerId, X, Y);
                            this.renderer.drawMapaIni(this.player.gridX, this.player.gridY);
                        }
                        return;
                    }
                }

                c = new Character(CharIndex,
                    this.desindexear(Body, this.cuerpos),
                    this.desindexear(Head, this.cabezas), this.cuerpos[Body].offHeadX, this.cuerpos[Body].offHeadY,
                    Heading, X, Y,
                    this.desindexear(Weapon, this.armas),
                    this.desindexear(Shield, this.escudos),
                    this.desindexear(Helmet, this.cascos),
                    this.getGrhOAnim(this.fxs[FX].animacion, FXLoops), this.fxs[FX].offX, this.fxs[FX].offY, FXLoops,
                    Name, NickColor, Privileges);

                this.entityGrid[X][Y][1] = c;
                this.characters[CharIndex] = c;
            },

            agregarItem: function (grhIndex, gridX, gridY) {
                var id = 0;
                while (this.items[id])
                    id++;
                item = new Item(id,this.getGrhOAnim(grhIndex,0), gridX, gridY);
                this.entityGrid[gridX][gridY][0] = item;
                this.items[id] = item;
            },

            sacarItem: function (gridX, gridY) {
                log.error("SACAR ITEM!! : " + this.entityGrid[gridX][gridY][0].id);
                this.items[this.entityGrid[gridX][gridY][0].id] = null;
                this.entityGrid[gridX][gridY][0] = null;
            },

            cambiarSlotInventario: function(Slot, ObjIndex, ObjName, Amount, Equiped, GrhIndex, ObjType, MaxHit, MinHit, MaxDef, MinDef, ObjSalePrice){
                this.inventario[Slot] = {objIndex: ObjIndex, objName: ObjName, cantidad: Amount, equipado: Equiped, grh: GrhIndex, objType: ObjType, maxHit: MaxHit,minHit: MinHit,maxDef: MaxDef, minDef: MinDef,precioVenta: ObjSalePrice };
                if (this.logeado)
                    this.uiRenderer.dibujarSlotInventario(Slot,GrhIndex,Amount,Equiped);
            },

            cambiarSlotHechizos: function(slot,spellID,nombre){
                this.hechizos[slot] = {id:spellID ,nombre:nombre};
                if (this.logeado)
                    this.uiRenderer.dibujarSlotHechizos(slot,nombre);
            },

            inicializarPlayer: function () { // Es necesario porque el server manda el charindex de tu pj despues de crear characters TODO: esto anda siempre? si tira algun comando cuando recien entra que use this.player puede que no este seteado? (ACEPTAR COMANDOS DESPUES DE LOGGED)
                if (!this.characters[this.playerId])
                    log.error("No se pudo inicializar el jugador");

                // sacamos el character y metemos clase player
                char = this.characters[this.playerId];

                this.player = new Player(char.id, char.bodyGrhs, char.headGrhs, char.offHeadX, char.offHeadY, char.heading, char.gridX, char.gridY, char.weaponGrhs,
                    char.shieldGrhs, char.helmetGrhs, char.FX, char.FXoffX, char.FXoffY, char.FXLoops, char.Name, char.NickColor, char.Privileges);
                this.characters[this.playerId] = this.player;

                this.entityGrid[this.player.gridX][this.player.gridY][1] = this.player;
                var self = this;

                this.player.onCaminar(function (direccion, forced) {
                    if (forced)
                        self.actualizarMovPos(self.player, direccion, true);
                    else {
                        self.client.sendWalk(direccion);
                        self.actualizarMovPos(self.player, direccion);
                    }
                });

                this.player.onCambioHeading(function (direccion) {
                    self.client.sendChangeHeading(direccion);
                });

                this.player.onPuedeCaminar(function (direccion) {
                    var x = self.player.gridX;
                    var y = self.player.gridY;
                    if (direccion === Enums.Heading.oeste) {
                        if (self.map.isBlocked(x - 1, y) || self.entityGrid[x - 1][y][1]) {
                            return false;
                        }
                    }
                    else if (direccion === Enums.Heading.este) {
                        if (self.map.isBlocked(x + 1, y) || self.entityGrid[x + 1][y][1]) {
                            return false;
                        }
                    }
                    else if (direccion === Enums.Heading.norte) {
                        if (self.map.isBlocked(x, y - 1) || self.entityGrid[x][y - 1][1]) {
                            return false;
                        }
                    }
                    else if (direccion === Enums.Heading.sur) {
                        if (self.map.isBlocked(x, y + 1) || self.entityGrid[x][y + 1][1]) {
                            return false;
                        }
                    }
                    return true;
                });
            },

            resetPosCharacter: function (charIndex, gridX, gridY) {

                c = this.characters[charIndex];
                if (!c) {
                    log.error(" Reset pos de character no existente, charindex=" + charIndex);
                    return;
                }
                this.entityGrid[c.gridX][c.gridY][1] = null;

                c.resetMovement();
                if (c instanceof Player) {
                    console.log(" reseteando pos player");
                    this.renderer.resetPos(gridX, gridY);
                }
                c.setGridPosition(gridX, gridY);
                this.entityGrid[gridX][gridY][1] = c;

            },

            cambiarMapa: function (numeroMapa) {
                this.map = new Mapa(numeroMapa, this);
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

            addEntity: function (entity) {
                var self = this;

                if (this.entities[entity.id] === undefined) {
                    this.entities[entity.id] = entity;
                    this.registerEntityPosition(entity);

                    if (!(entity instanceof Item && entity.wasDropped)
                        && !(this.renderer.mobile || this.renderer.tablet)) {
                        entity.fadeIn(this.currentTime);
                    }

                    if (this.renderer.mobile || this.renderer.tablet) {
                        entity.onDirty(function (e) {
                            if (self.camera.isVisible(e)) {
                                e.dirtyRect = self.renderer.getEntityBoundingRect(e);
                                self.checkOtherDirtyRects(e.dirtyRect, e, e.gridX, e.gridY);
                            }
                        });
                    }
                }
                else {
                    log.error("This entity already exists : " + entity.id + " (" + entity.kind + ")");
                }
            },

            removeEntity: function (entity) {
                if (entity.id in this.entities) {
                    this.unregisterEntityPosition(entity);
                    delete this.entities[entity.id];
                }
                else {
                    log.error("Cannot remove entity. Unknown ID : " + entity.id);
                }
            },

            addItem: function (item, x, y) {
                item.setSprite(this.sprites[item.getSpriteName()]);
                item.setGridPosition(x, y);
                item.setAnimation("idle", 150);
                this.addEntity(item);
            },

            removeItem: function (item) {
                if (item) {
                    this.removeFromItemGrid(item, item.gridX, item.gridY);
                    this.removeFromRenderingGrid(item, item.gridX, item.gridY);
                    delete this.entities[item.id];
                } else {
                    log.error("Cannot remove item. Unknown ID : " + item.id);
                }
            },

            /*           initPathingGrid: function () {
             this.pathingGrid = [];
             for (var i = 0; i < this.map.height; i += 1) {
             this.pathingGrid[i] = [];
             for (var j = 0; j < this.map.width; j += 1) {
             this.pathingGrid[i][j] = this.map.grid[i][j];
             }
             }
             log.info("Initialized the pathing grid with static colliding cells.");
             },
             */
            initEntityGrid: function () {
                this.entityGrid = [];
                for (var i = 1; i < this.map.height; i += 1) {
                    this.entityGrid[i] = [];
                    for (var j = 1; j < this.map.width; j += 1) {
                        this.entityGrid[i][j] = []; // [1] = son cosas que bloquena (PJS,NPCS, ETC) , [0] son cosas pisables, items , etc
                    }
                }
                log.info("Initialized the entity grid.");
            },

            initRenderingGrid: function () {
                this.renderingGrid = [];
                for (var i = 1; i < this.map.height; i += 1) {
                    this.renderingGrid[i] = [];
                    for (var j = 1; j < this.map.width; j += 1) {
                        this.renderingGrid[i][j] = {};
                    }
                }
                log.info("Initialized the rendering grid.");
            },

            initItemGrid: function () {
                this.itemGrid = [];
                for (var i = 1; i < this.map.height; i += 1) {
                    this.itemGrid[i] = [];
                    for (var j = 1; j < this.map.width; j += 1) {
                        this.itemGrid[i][j] = {};
                    }
                }
                log.info("Initialized the item grid.");
            },

            /**
             *
             */
            initAnimatedTiles: function () {
                var self = this,
                    m = this.map;

                this.animatedTiles = [];
                this.forEachVisibleTile(function (id, index) {
                    if (m.isAnimatedTile(id)) {
                        var tile = new AnimatedTile(id, m.getTileAnimationLength(id), m.getTileAnimationDelay(id), index),
                            pos = self.map.tileIndexToGridPosition(tile.index);

                        tile.x = pos.x;
                        tile.y = pos.y;
                        self.animatedTiles.push(tile);
                    }
                }, 1);
                //log.info("Initialized animated tiles.");
            },

            addToRenderingGrid: function (entity, x, y) {
                if (!this.map.isOutOfBounds(x, y)) {
                    this.renderingGrid[y][x][entity.id] = entity;
                }
            },

            removeFromRenderingGrid: function (entity, x, y) {
                if (entity && this.renderingGrid[y][x] && entity.id in this.renderingGrid[y][x]) {
                    delete this.renderingGrid[y][x][entity.id];
                }
            },

            removeFromEntityGrid: function (entity, x, y) {
                if (this.entityGrid[y][x][entity.id]) {
                    delete this.entityGrid[y][x][entity.id];
                }
            },

            removeFromItemGrid: function (item, x, y) {
                if (item && this.itemGrid[y][x][item.id]) {
                    delete this.itemGrid[y][x][item.id];
                }
            },

            removeFromPathingGrid: function (x, y) {
                this.pathingGrid[y][x] = 0;
            },

            /**
             * Registers the entity at two adjacent positions on the grid at the same time.
             * This situation is temporary and should only occur when the entity is moving.
             * This is useful for the hit testing algorithm used when hovering entities with the mouse cursor.
             *
             * @param {Entity} entity The moving entity
             */
            registerEntityDualPosition: function (entity) {
                if (entity) {
                    this.entityGrid[entity.gridY][entity.gridX][entity.id] = entity;

                    this.addToRenderingGrid(entity, entity.gridX, entity.gridY);

                    if (entity.nextGridX >= 0 && entity.nextGridY >= 0) {
                        this.entityGrid[entity.nextGridY][entity.nextGridX][entity.id] = entity;
                        if (!(entity instanceof Player)) {
                            this.pathingGrid[entity.nextGridY][entity.nextGridX] = 1;
                        }
                    }
                }
            },

            /**
             * Clears the position(s) of this entity in the entity grid.
             *
             * @param {Entity} entity The moving entity
             */
            unregisterEntityPosition: function (entity) {
                if (entity) {
                    this.removeFromEntityGrid(entity, entity.gridX, entity.gridY);
                    this.removeFromPathingGrid(entity.gridX, entity.gridY);

                    this.removeFromRenderingGrid(entity, entity.gridX, entity.gridY);

                    if (entity.nextGridX >= 0 && entity.nextGridY >= 0) {
                        this.removeFromEntityGrid(entity, entity.nextGridX, entity.nextGridY);
                        this.removeFromPathingGrid(entity.nextGridX, entity.nextGridY);
                    }
                }
            },

            registerEntityPosition: function (entity) {
                var x = entity.gridX,
                    y = entity.gridY;

                if (entity) {
                    if (entity instanceof Character || entity instanceof Chest) {
                        this.entityGrid[y][x][entity.id] = entity;
                        if (!(entity instanceof Player)) {
                            this.pathingGrid[y][x] = 1;
                        }
                    }
                    if (entity instanceof Item) {
                        this.itemGrid[y][x][entity.id] = entity;
                    }

                    this.addToRenderingGrid(entity, x, y);
                }

            },

            setServerOptions: function (host, port, username, userpw, email) {
                this.host = host;
                this.port = port;
                this.username = username;
                this.userpw = userpw;
                this.email = email;
            },

            loadAudio: function () {
                this.audioManager = new AudioManager(this);
            },
            /*
             initMusicAreas: function () {
             var self = this;
             _.each(this.map.musicAreas, function (area) {
             self.audioManager.addArea(area.x, area.y, area.w, area.h, area.id);
             });
             },
             */
            run: function (action, started_callback) {
                var self = this;

                //this.loadSprites();
                this.setUpdater(new Updater(this));
                this.camera = this.renderer.camera;

                //this.setSpriteScale(this.renderer.scale);

                var wait = setInterval(function () { // ACAAAAAAAAAAAAAAAA <- carga de graficos y demas !
                    if (self.map.isLoaded && self.loader.graficosCargados()) {
                        self.ready = true;
                        log.debug('All sprites loaded.');

                        self.loadAudio();

                        self.initAchievements();
                        self.initCursors();

                        if (!self.renderer.mobile
                            && !self.renderer.tablet
                            && self.renderer.upscaledRendering) {
                            self.initSilhouettes();
                        }

                        self.initEntityGrid();
                        self.initItemGrid();
                        self.initRenderingGrid();

                        //self.setPathfinder(new Pathfinder(self.map.width, self.map.height));

                        //self.connect(action, started_callback);
                        self.uiRenderer.setLoginScreen(function(nombre,password) {
                                self.connect(nombre,password);
                            });
                        started_callback({success: true}); // <--- TODO

                        clearInterval(wait);
                    }
                }, 500);
            },

            tick: function () {
                this.currentTime = Date.now();
                if (this.started) {
                    this.updateCursorLogic();
                    this.updater.update();
                    this.renderer.renderFrame();
                    this.uiRenderer.renderFrame();
                }

                if (!this.isStopped) {
                    requestAnimFrame(this.tick.bind(this));
                }
            },

            start: function () {
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


            connect: function (nombre,pw) {

                this.client = new GameClient(this, this.host, this.port);
                //this.client.connect(started_callback);
                this.client.connect(nombre,pw);

            },


            /**
             * Converts the current mouse position on the screen to world grid coordinates.
             * @returns {Object} An object containing x and y properties.
             (MODIFICADA); */
            getMouseGridPosition: function () {
                var mx = this.mouse.x / __ESCALA__,
                    my = this.mouse.y / __ESCALA__,
                    c = this.renderer.camera,
                    ts = this.renderer.tilesize,
                    offsetX = mx % ts,
                    offsetY = my % ts,
                    x = ((mx - offsetX) / ts) + c.gridX,
                    y = ((my - offsetY) / ts) + c.gridY;

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

            movecursor: function () {
                var mouse = this.getMouseGridPosition(),
                    x = mouse.x,
                    y = mouse.y;

                this.cursorVisible = true;
            },


            click: function () {
                var gridPos = this.getMouseGridPosition();

                /*if (pos.x === this.previousClickPosition.x
                 && pos.y === this.previousClickPosition.y) {
                 return;
                 } else*/
                this.previousClickPosition = gridPos;

                this.processInput(gridPos);
            },

            /**
             * Processes game logic when the user triggers a click/touch event during the game.
             */
            processInput: function (gridPos) {

                // pasar pos normal, fijarse si eso toca la interfaz y sino convertir a gridpos y seguir con lo de abajo

                if (this.logeado)
                    this.client.sendLeftClick(gridPos.x, gridPos.y);
            },

             say: function (message) {
                //#cli guilds
                var regexp = /^\/guild\ (invite|create|accept)\s+([^\s]*)|(guild:)\s*(.*)$|^\/guild\ (leave)$/i;
                var args = message.match(regexp);
                if (args != undefined) {
                    switch (args[1]) {
                        case "invite":
                            if (this.player.hasGuild()) {
                                this.client.sendGuildInvite(args[2]);
                            }
                            else {
                                this.showNotification("Invite " + args[2] + " to where?");
                            }
                            break;
                        case "create":
                            this.client.sendNewGuild(args[2]);
                            break;
                        case undefined:
                            if (args[5] === "leave") {
                                this.client.sendLeaveGuild();
                            }
                            else if (this.player.hasGuild()) {
                                this.client.talkToGuild(args[4]);
                            }
                            else {
                                this.showNotification("You got no-one to talk to…");
                            }
                            break;
                        case "accept":
                            var status;
                            if (args[2] === "yes") {
                                status = this.player.checkInvite();
                                if (status === false) {
                                    this.showNotification("You were not invited anyway…");
                                }
                                else if (status < 0) {
                                    this.showNotification("Sorry to say it's too late…");
                                    setTimeout(function () {
                                        self.showNotification("Find someone and ask for another invite.")
                                    }, 2500);
                                }
                                else {
                                    this.client.sendGuildInviteReply(this.player.invite.guildId, true);
                                }
                            }
                            else if (args[2] === "no") {
                                status = this.player.checkInvite();
                                if (status !== false) {
                                    this.client.sendGuildInviteReply(this.player.invite.guildId, false);
                                    this.player.deleteInvite();
                                }
                                else {
                                    this.showNotification("Whatever…");
                                }
                            }
                            else {
                                this.showNotification("“guild accept” is a YES or NO question!!");
                            }
                            break;
                    }
                }
                this.client.sendChat(message);
            },

            onGameStart: function (callback) {
                this.gamestart_callback = callback;
            },

            onDisconnect: function (callback) {
                this.disconnect_callback = callback;
            },

            onPlayerDeath: function (callback) {
                this.playerdeath_callback = callback;
            },

            onUpdateTarget: function (callback) {
                this.updatetarget_callback = callback;
            },
            onPlayerExpChange: function (callback) {
                this.playerexp_callback = callback;
            },

            onPlayerHealthChange: function (callback) {
                this.playerhp_callback = callback;
            },

            onPlayerHurt: function (callback) {
                this.playerhurt_callback = callback;
            },

            onPlayerEquipmentChange: function (callback) {
                this.equipment_callback = callback;
            },

            onNbPlayersChange: function (callback) {
                this.nbplayers_callback = callback;
            },

            onGuildPopulationChange: function (callback) {
                this.nbguildplayers_callback = callback;
            },

            onNotification: function (callback) {
                this.notification_callback = callback;
            },

            onPlayerInvincible: function (callback) {
                this.invincible_callback = callback
            },

            resize: function () {
                this.renderer.rescale();
                this.uiRenderer.rescale();
                if (this.started)
                    this.uiRenderer.setGameScreen();
                else
                    this.uiRenderer.setLoginScreen();
                //this.renderer.drawMapaIni();
            },

            logearPlayer: function(){
                log.error("logear player");
                this.inicializarPlayer();
                this.renderer.drawMapaIni(this.player.gridX, this.player.gridY);
                this.uiRenderer.setGameScreen();
                log.error("<--- logear player");
                this.logeado = true;
            },
        });

        return Game;
    });
