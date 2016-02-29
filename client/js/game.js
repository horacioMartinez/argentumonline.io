define(['enums', 'animacion', 'mapa', 'infomanager', 'renderer',
        'gameclient', 'updater', 'transition',
        'item', 'player', 'character', 'assetmanager', 'intervalos', 'uimanager'],
    function (__enums__, Animacion, Mapa, InfoManager, Renderer,
              GameClient, Updater, Transition,
              Item, Player, Character, AssetManager, Intervalos, UIManager) {
        var Game = Class.extend({
            init: function (app, assetManager) {
                this.uiManager = new UIManager(this);

                this.MAXIMO_LARGO_CHAT = 15; // maximo largo en caracters hasta hacer nueva linea de chat (notar las palabras se escriben completa, por lo que puede pasar los 10 caracteres)

                this.map = new Mapa();
                this.assetManager = assetManager;
                this.indices = this.assetManager.getIndices();
                this.armas = this.assetManager.getArmas();
                this.cabezas = this.assetManager.getCabezas();
                this.cascos = this.assetManager.getCascos();
                this.cuerpos = this.assetManager.getCuerpos();
                this.escudos = this.assetManager.getEscudos();
                this.escudos = this.assetManager.getEscudos();
                this.fxs = this.assetManager.getFxs();

                this.app = app;
                this.ready = false;
                this.started = false;
                this.isPaused = false;

                this.renderer = null;
                this.updater = null;
                this.chatinput = null;

                // items: se ven abajo de tod0 (items, sprites de sangre, etc) , characters: npcs, bichos, jugadores (incluye el propio) ambos osn entity
                this.entityGrid = null;
                this.characters = []; // characters indexeados por ID
                this.items = []; // idem items
                this.username = null;
                // Player
                this.playerId = null; //charindex
                this.player = {}; // se inicializa con el msj logged, ver la funcion inicializarPlayer
                this.logeado = false; // NOTA: se pone logeado cuando llega el mensaje de logged, este es el ultimo de los mensajes al conectarse, asi que antes llega los mensajes de hechizos inventarios, etc. Deberia primero llegar esto y listo.. tambien deberia llegar el chardinex de tu pj al principio con este mensaje
                this.inventario = [];
                this.inventarioCompra = [];
                this.hechizos = [];
                this.intervalos = new Intervalos(0);

                // Game state
                this.itemGrid = null;
                this.currentCursor = null;
                this.mouse = {x: 0, y: 0};

                this.cursorVisible = true;

                // combat
                this.infoManager = new InfoManager(this);

                this.cursors = {};

            },

            setup: function (canvas, background, foreground, input) {
                this.setRenderer(new Renderer(this, canvas, background, foreground, this.assetManager));
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
                this.infoManager.addConsoleInfo(txt, Enums.Font.FIGHT);
            },

            realizarDanio: function (danio) {
                var char = this.player.lastAttackedTarget;
                if (char) {
                    this.infoManager.addHoveringInfo(danio, char, Enums.Font.CANVAS_DANIO_REALIZADO);
                    this.infoManager.addConsoleInfo(Enums.MensajeConsola.MENSAJE_GOLPE_CRIATURA_1 + danio + Enums.MensajeConsola.MENSAJE_2, Enums.Font.FIGHT);
                }
            },

            escribirMsgConsola: function (texto, font) {
                if (!font)
                    font = Enums.Font.INFO;
                this.infoManager.addConsoleInfo(texto, font);
            },

            formatearChat: function (str) {
                var resultado = [];
                while ((str.length > this.MAXIMO_LARGO_CHAT) && (str.indexOf(' ') > (-1))) {
                    var idx = str.indexOf(' ');
                    var posUltimoEspacioPrimerBloque = idx;
                    while ((idx != -1) && (idx < this.MAXIMO_LARGO_CHAT - 1 )) {
                        idx = str.indexOf(' ', idx + 1);
                        if (idx > 0)
                            posUltimoEspacioPrimerBloque = idx;
                    }
                    if (posUltimoEspacioPrimerBloque > 0)
                        resultado.push(str.slice(0, posUltimoEspacioPrimerBloque));
                    str = str.slice(posUltimoEspacioPrimerBloque + 1, str.length);
                }
                resultado.push(str);
                return resultado;
            },

            escribirChat: function (chat, charIndex, r, g, b) { // TODO: colores?
                if (this.characters[charIndex]) {
                    this.characters[charIndex].chat = this.formatearChat(chat);
                    this.characters[charIndex].tiempoChatInicial = this.currentTime;
                }
                //this.createBubble(charIndex, chat);
            },

            checkearYescribirMuerto: function () {
                if (this.player.muerto) {
                    this.escribirMsgConsola(Enums.MensajeConsola.ESTAS_MUERTO, Enums.Font.INFO);
                    return true;
                }
                return false;
            },

            enviarChat: function (message) {
                //#cli guilds
                if (message[0] === '/') {
                    var args = message.match(/\S+/g);
                    var valido = true;
                    if (args != undefined) {
                        var comando = args[0].toUpperCase();
                        args.shift();
                        switch (comando) {
                            case "/ONLINE":
                                this.client.sendOnline();
                                break;

                            case "/SALIR":
                                if (this.player.paralizado)
                                    this.escribirMsgConsola("No puedes salir estando paralizado.", Enums.Font.WARNING);
                                else {
                                    if (this.macroActivado)
                                        this.desactivarMacro();
                                    this.client.sendQuit();
                                }
                                break;

                            case "/SALIRCLAN":
                                this.client.sendGuildLeave();
                                break;
                            case "/BALANCE":
                                if (!this.checkearYescribirMuerto())
                                    this.client.sendRequestAccountState();
                                break;

                            case "/QUIETO":
                                if (!this.checkearYescribirMuerto())
                                    this.client.sendPetStand();
                                break;

                            case "/ACOMPAÑAR":
                                if (!this.checkearYescribirMuerto())
                                    this.client.sendPetFollow();
                                break;

                            case "/LIBERAR":
                                if (!this.checkearYescribirMuerto())
                                    this.client.sendReleasePet();
                                break;

                            case "/ENTRENAR":
                                if (!this.checkearYescribirMuerto())
                                    this.client.sendTrainList();
                                break;

                            case "/DESCANSAR":
                                if (!this.checkearYescribirMuerto())
                                    this.client.sendRest();
                                break;

                            case "/MEDITAR":

                                if (!this.checkearYescribirMuerto()) {
                                    if (this.player.mana === this.player.maxMana)
                                        this.escribirMsgConsola("Tu mana ya está llena", Enums.Font.INFO);
                                    else
                                        this.client.sendMeditate();
                                }
                                break;

                            case "/CONSULTA":
                                this.client.sendConsultation();

                                break;
                            case "/RESUCITAR":
                                this.client.sendResucitate();

                                break;
                            case "/CURAR":
                                this.client.sendHeal();

                                break;
                            case "/EST":
                                this.client.sendRequestStats();

                                break;
                            case "/AYUDA":
                                this.client.sendHelp();

                                break;
                            case "/COMERCIAR":
                                if (!this.checkearYescribirMuerto) {

                                    if (this.comerciando)
                                        this.escribirMsgConsola("Ya estás comerciando", Enums.Font.INFO);
                                    else
                                        this.client.sendCommerceStart();
                                }

                                break;
                            case "/BOVEDA":
                                if (!this.checkearYescribirMuerto)
                                    this.client.sendBankStart();

                                break;
                            case "/ENLISTAR":
                                this.client.sendEnlist();

                                break;
                            case "/INFORMACION":
                                this.client.sendInformation();

                                break;
                            case "/RECOMPENSA":
                                this.client.sendReward();

                                break;
                            case "/MOTD":
                                this.client.sendRequestMOTD();

                                break;
                            case "/UPTIME":
                                this.client.sendUpTime();

                                break;
                            case "/SALIRPARTY":
                                this.client.sendPartyLeave();

                                break;
                            case "/CREARPARTY":
                                if (!this.checkearYescribirMuerto)
                                    this.client.sendPartyCreate();

                                break;
                            case "/PARTY":
                                if (!this.checkearYescribirMuerto)
                                    this.client.sendPartyJoin();
                                break;

                            case "/COMPARTIRNPC":
                                if (!this.checkearYescribirMuerto)
                                    this.client.sendShareNpc();

                                break;
                            case "/NOCOMPARTIRNPC":
                                if (!this.checkearYescribirMuerto)
                                    this.client.sendStopSharingNpc();

                                break;
                            case "/ENCUESTA":
                                if (args.length === 0)
                                    this.client.sendInquiry();
                                else {
                                    if (!isNaN(args[0]) && (args[0] < 256))
                                        this.client.sendInquiryVote(args[0]);
                                    else
                                        this.escribirMsgConsola("Para votar una opción, escribe /encuesta NUMERODEOPCION, por ejemplo para votar la opcion 1, escribe /encuesta 1.", Enums.Font.WARNING);
                                }

                                break;
                            case "/CMSG":
                                if (args.length)
                                    this.client.sendGuildMessage(args.join(" "));
                                else
                                    this.escribirMsgConsola("Escriba un mensaje.", Enums.Font.INFO);

                                break;
                            case "/PMSG":
                                if (args.length)
                                    this.client.sendPartyMessage(args.join(" "));
                                else
                                    this.escribirMsgConsola("Escriba un mensaje.");

                                break;
                            case "/CENTINELA":
                                if (args.length) {
                                    if (!isNaN(args[0]) && (args[0] < 65536))
                                        this.client.sendCentinelReport(CInt(ArgumentosRaw))();
                                    else
                                        this.escribirMsgConsola("El código de verificación debe ser numérico. Utilice /centinela X, siendo X el código de verificación.");
                                }
                                else
                                    this.escribirMsgConsola("Faltan parámetros. Utilice /centinela X, siendo X el código de verificación.");
                                break;

                            case "/ONLINECLAN":
                                this.client.sendGuildOnline();

                                break;
                            case "/ONLINEPARTY":
                                this.client.sendPartyOnline();

                                break;
                            case "/BMSG":
                                if (args.length)
                                    this.client.sendCouncilMessage(args.join(" "));
                                else
                                    this.escribirMsgConsola("Escriba un mensaje.");

                                break;
                            case "/ROL":
                                if (args.length)
                                    this.client.sendRoleMasterRequest(args.join(" "));
                                else
                                    this.escribirMsgConsola("Escriba una pregunta.");

                                break;
                            case "/GM":
                                this.client.sendGMRequest();

                                break;
                            case "/_BUG":
                                if (args.length)
                                    this.client.sendBugReport(args.join(" "));
                                else
                                    this.escribirMsgConsola("Escriba una descripción del bug.");

                                break;
                            case "/DESC":
                                if (!this.checkearYescribirMuerto())
                                    this.client.sendChangeDescription(args.join(" "));

                                break;
                            case "/VOTO":
                                if (args.length)
                                    this.client.sendGuildVote(args.join(" "));
                                else

                                    this.escribirMsgConsola("Faltan parámetros. Utilice /voto NICKNAME.");

                                break;
                            case "/PENAS":
                                if (args.length)
                                    this.client.sendPunishments(args.join(" "));
                                else

                                    this.escribirMsgConsola("Faltan parámetros. Utilice /penas NICKNAME.");

                                break;
                            case "/CONTRASEÑA":
                                this.client.frmNewPassword.Show(vbModal, frmMain);

                                break;
                            case "/APOSTAR":
                                if (!this.checkearYescribirMuerto()) {
                                    if (args.length) {
                                        if (!isNaN(args[0]) && (args[0] < 65536))
                                            this.client.sendGamble(args[0]);
                                        else
                                            this.escribirMsgConsola("Cantidad incorrecta. Utilice /apostar CANTIDAD.");
                                    }
                                    else
                                        this.escribirMsgConsola("Faltan parámetros. Utilice /apostar CANTIDAD.");
                                }

                                break;
                            case "/RETIRARFACCION":
                                if (!this.checkearYescribirMuerto())
                                    this.client.sendLeaveFaction();

                                break;
                            case "/RETIRAR":
                                if (!this.checkearYescribirMuerto()) {

                                    if (args.length) {
                                        if (!isNaN(args[0]))
                                            this.client.sendBankExtractGold(args[0]);
                                        else
                                            this.escribirMsgConsola("Cantidad incorrecta. Utilice /retirar CANTIDAD.");
                                    }
                                    else
                                        this.escribirMsgConsola("Cantidad incorrecta. Utilice /retirar CANTIDAD.");

                                }

                                break;
                            case "/DEPOSITAR":
                                if (!this.checkearYescribirMuerto()) {

                                    if (args.length) {
                                        if (!isNaN(args[0]))
                                            this.client.sendBankDepositGold(args[0]);
                                        else
                                            this.escribirMsgConsola("Cantidad incorecta. Utilice /depositar CANTIDAD.");
                                    }
                                    else
                                        this.escribirMsgConsola("Faltan parámetros. Utilice /depositar CANTIDAD.");
                                }

                                break;
                            case "/DENUNCIAR":
                                if (args.length)
                                    this.client.sendDenounce(args.join(" "));
                                else
                                    this.escribirMsgConsola("Formule su denuncia.");

                                break;
                            case "/FUNDARCLAN":
                                if (this.player.nivel > 24)
                                    this.client.sendGuildFundate();
                                else
                                    this.escribirMsgConsola("Para fundar un clan tienes que ser nivel 25 y tener 90 skills en liderazgo.");

                                break;
                            case "/FUNDARCLANGM":
                                this.client.sendGuildFundation(eClanType.ct_GM);
                                break;

                            case "/ECHARPARTY":
                                if (args.length)
                                    this.client.sendPartyKick(args.join(" "));
                                else
                                    this.escribirMsgConsola("Faltan parámetros. Utilice /echarparty NICKNAME.");

                                break;
                            case "/PARTYLIDER":
                                if (args.length)
                                    this.client.sendPartySetLeader(args.join(" "));
                                else

                                    this.escribirMsgConsola("Faltan parámetros. Utilice /partylider NICKNAME.");

                                break;
                            case "/ACCEPTPARTY":
                                if (args.length)
                                    this.client.sendPartyAcceptMember(args.join(" "));
                                else

                                    this.escribirMsgConsola("Faltan parámetros. Utilice /acceptparty NICKNAME.");
                                break;

                            default:
                                valido = false;
                                break;

                        }

                    }
                    else
                        valido = false;
                    if (!valido)
                        this.escribirMsgConsola("Comando invalido", Enums.Font.WARNING);
                }

                else {
                    this.client.sendTalk(message);
                }
            },
            /*

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
                }
            },

            getGrhOAnim: function (numGrh, loops) {
                if (!numGrh)
                    return 0;

                if (this.indices[numGrh].frames) {   // es animacion
                    if ((!loops) && (loops !== 0))
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

                // TODO!!!: que solo cambie los que son diferentes!
                c.setBodyGrh(this.desindexear(Body, this.cuerpos));
                c.offHeadX = this.cuerpos[Body].offHeadX;
                c.offHeadY = this.cuerpos[Body].offHeadY;
                c.setHeadGrh(this.desindexear(Head, this.cabezas));
                c.setWeaponGrh(this.desindexear(Weapon, this.armas));
                c.setShieldGrh(this.desindexear(Shield, this.escudos));
                c.setHelmetGrh(this.desindexear(Helmet, this.cascos));

                if ((Head === Enums.Muerto.cabezaCasper) || (Body === Enums.Muerto.cuerpoFragataFantasmal))
                    c.muerto = true;
                else
                    c.muerto = false;
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
                    Name, NickColor, Privileges);

                if ((Head === Enums.Muerto.cabezaCasper) || (Body === Enums.Muerto.cuerpoFragataFantasmal))
                    c.muerto = true;
                else
                    c.muerto = false;

                this.entityGrid[X][Y][1] = c;
                this.characters[CharIndex] = c;

                this.setCharacterFX(CharIndex, FX, FXLoops);
            },

            agregarItem: function (grhIndex, gridX, gridY) {
                var id = 0;
                while (this.items[id])
                    id++;
                item = new Item(id, this.getGrhOAnim(grhIndex, 0), gridX, gridY);
                this.entityGrid[gridX][gridY][0] = item;
                this.items[id] = item;
            },

            sacarItem: function (gridX, gridY) {
                this.items[this.entityGrid[gridX][gridY][0].id] = null;
                this.entityGrid[gridX][gridY][0] = null;
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
                    var numGrafico = this.indices[GrhIndex].grafico;
                    this.uiManager.interfaz.cambiarSlotInventario(Slot, Amount, numGrafico);
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
                this.uiManager.interfaz.modificarSlotHechizo(slot,nombre);
                /*if (this.logeado)
                 this.uiRenderer.modificarSlotHechizos(slot, nombre);*/
            },

            inicializarPlayer: function () { // Es necesario porque el server manda el charindex de tu pj despues de crear characters TODO: esto anda siempre? si tira algun comando cuando recien entra que use this.player puede que no este seteado? (ACEPTAR COMANDOS DESPUES DE LOGGED)
                if (!this.characters[this.playerId])
                    log.error("No se pudo inicializar el jugador");

                // sacamos el character y metemos clase player
                char = this.characters[this.playerId];

                this.player = new Player(char.id, char.bodyGrhs, char.headGrhs, char.offHeadX, char.offHeadY, char.heading, char.gridX, char.gridY, char.weaponGrhs,
                    char.shieldGrhs, char.helmetGrhs, char.Name, char.NickColor, char.Privileges);
                this.player.muerto = char.muerto;

                for (var i = 0; i < char.getFXs().length; i++) {
                    if (char.getFXs()[i])
                        this.player.setFX(char.getFXs()[i].anim, char.getFXs()[i].offX, char.getFXs()[i].offY);
                }

                this.characters[this.playerId] = this.player;
                this.entityGrid[this.player.gridX][this.player.gridY][1] = this.player;
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
                this.map = new Mapa(numeroMapa, this.assetManager.getMapaSync(numeroMapa));
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
                    var numGrafico = this.indices[GrhIndex].grafico;
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
                    this.characters[CharIndex].stopFXsInfinitos();
                    return;
                }
                FXLoops = FXLoops + 1;
                var numGrh = this.fxs[FX].animacion;
                var fx = new Animacion(this.indices[numGrh].frames, this.indices[numGrh].velocidad, FXLoops);
                fx.start();
                this.characters[CharIndex].setFX(fx, this.fxs[FX].offX, this.fxs[FX].offY);
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
                for (var i = 1; i < this.map.height + 1; i += 1) {
                    this.entityGrid[i] = [];
                    for (var j = 1; j < this.map.width + 1; j += 1) {
                        this.entityGrid[i][j] = []; // [1] = son cosas que bloquena (PJS,NPCS, ETC) , [0] son cosas pisables, items , etc
                    }
                }
                log.info("Initialized the entity grid.");
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

            inicializar: function (username) {
                this.username = username;
                this.setUpdater(new Updater(this));
                this.camera = this.renderer.camera;
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

                this.previousClickPosition = gridPos;
                if (this.logeado)
                    this.client.sendLeftClick(gridPos.x, gridPos.y);
            },

            doubleclick: function () {
                var gridPos = this.getMouseGridPosition();
                this.previousClickPosition = gridPos;
                if (this.logeado)
                    this.client.sendDoubleClick(gridPos.x, gridPos.y);
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
                /*
                 if (this.started)
                 this.setGameScreen();
                 else
                 this.setLoginScreen();
                 */
                //this.renderer.drawMapaIni();
            },

        });

        return Game;
    });
