/**
 * Created by horacio on 3/9/16.
 */

define(['enums', 'font'], function (Enums, Font) {

    class ComandosChat {
        constructor(game, acciones) {
            this.game = game;
            this.acciones = acciones;
        }

        _checkearYescribirMuerto() {
            if (this.game.player.muerto) {
                this.game.escribirMsgConsola(Enums.MensajeConsola.ESTAS_MUERTO, Font.NOTIFICATION);
                return true;
            }
            return false;
        }

        parsearChat(message) {
            //#cli guilds
            if (message[0] === '/') {
                var args = message.match(/\S+/g);
                var valido = true;
                if (args !== undefined) {
                    var comando = args[0].toUpperCase();
                    args.shift();
                    switch (comando) {
                        case "/ONLINE":
                            this.game.client.sendOnline();
                            break;

                        case "/SALIR":
                            if (this.game.playerState.paralizado) {
                                this.game.escribirMsgConsola("No puedes salir estando paralizado.", Font.WARNING);
                            } else {
                                if (this.game.macroActivado) {
                                    this.game.desactivarMacro();
                                }
                                this.game.client.sendQuit();
                            }
                            break;

                        case "/SALIRCLAN":
                            this.game.client.sendGuildLeave();
                            break;
                        case "/BALANCE":
                            if (!this._checkearYescribirMuerto()) {
                                this.game.client.sendRequestAccountState();
                            }
                            break;
                        
                        case "/QUIETO":
                            if (!this._checkearYescribirMuerto()) {
                                this.game.client.sendPetStand();
                            }
                            break;

                        case "/ACOMPAÑAR":
                            if (!this._checkearYescribirMuerto()) {
                                this.game.client.sendPetFollow();
                            }
                            break;

                        case "/LIBERAR":
                            if (!this._checkearYescribirMuerto()) {
                                this.game.client.sendReleasePet();
                            }
                            break;

                        case "/ENTRENAR":
                            if (!this._checkearYescribirMuerto()) {
                                this.game.client.sendTrainList();
                            }
                            break;

                        case "/DESCANSAR":
                            if (!this._checkearYescribirMuerto()) {
                                this.game.client.sendRest();
                            }
                            break;

                        case "/MEDITAR":

                            this.acciones.meditar();
                            break;

                        case "/CONSULTA":
                            this.game.client.sendConsultation();

                            break;
                        case "/RESUCITAR":
                            this.game.client.sendResucitate();

                            break;
                        case "/CURAR":
                            this.game.client.sendHeal();

                            break;
                        case "/EST":
                            this.game.client.sendRequestStats();

                            break;
                        case "/AYUDA":
                            this.game.client.sendHelp();

                            break;
                        case "/COMERCIAR":
                            if (!this._checkearYescribirMuerto()) {

                                if (this.game.comerciando) {
                                    this.game.escribirMsgConsola("Ya estás comerciando", Font.INFO);
                                } else {
                                    this.game.client.sendCommerceStart();
                                }
                            }

                            break;
                        case "/BOVEDA":
                            if (!this._checkearYescribirMuerto()) {
                                this.game.client.sendBankStart();
                            }

                            break;
                        case "/ENLISTAR":
                            this.game.client.sendEnlist();

                            break;
                        case "/INFORMACION":
                            this.game.client.sendInformation();

                            break;
                        case "/RECOMPENSA":
                            this.game.client.sendReward();

                            break;
                        case "/MOTD":
                            this.game.client.sendRequestMOTD();

                            break;
                        case "/UPTIME":
                            this.game.client.sendUpTime();

                            break;
                        case "/SALIRPARTY":
                            this.game.client.sendPartyLeave();

                            break;
                        case "/CREARPARTY":
                            if (!this._checkearYescribirMuerto()) {
                                this.game.client.sendPartyCreate();
                            }

                            break;
                        case "/PARTY":
                            if (!this._checkearYescribirMuerto()) {
                                this.game.client.sendPartyJoin();
                            }
                            break;

                        case "/COMPARTIRNPC":
                            if (!this._checkearYescribirMuerto()) {
                                this.game.client.sendShareNpc();
                            }

                            break;
                        case "/NOCOMPARTIRNPC":
                            if (!this._checkearYescribirMuerto()) {
                                this.game.client.sendStopSharingNpc();
                            }

                            break;
                        case "/ENCUESTA":
                            if (args.length === 0) {
                                this.game.client.sendInquiry();
                            } else {
                                if (!isNaN(args[0]) && (args[0] < 256)) {
                                    this.game.client.sendInquiryVote(args[0]);
                                } else {
                                    this.game.escribirMsgConsola("Para votar una opción, escribe /encuesta NUMERODEOPCION, por ejemplo para votar la opcion 1, escribe /encuesta 1.", Font.WARNING);
                                }
                            }

                            break;
                        case "/CMSG":
                            if (args.length) {
                                this.game.client.sendGuildMessage(args.join(" "));
                            } else {
                                this.game.escribirMsgConsola("Escriba un mensaje.", Font.INFO);
                            }

                            break;
                        case "/PMSG":
                            if (args.length) {
                                this.game.client.sendPartyMessage(args.join(" "));
                            } else {
                                this.game.escribirMsgConsola("Escriba un mensaje.");
                            }

                            break;
                        case "/CENTINELA":
                            if (args.length) {
                                if (!isNaN(args[0]) && (args[0] < 65536)) {
                                    this.game.client.sendCentinelReport(args[0]);
                                } else {
                                    this.game.escribirMsgConsola("El código de verificación debe ser numérico. Utilice /centinela X, siendo X el código de verificación.");
                                }
                            }
                            else {
                                this.game.escribirMsgConsola("Faltan parámetros. Utilice /centinela X, siendo X el código de verificación.");
                            }
                            break;

                        case "/ONLINECLAN":
                            this.game.client.sendGuildOnline();

                            break;
                        case "/ONLINEPARTY":
                            this.game.client.sendPartyOnline();

                            break;
                        case "/BMSG":
                            if (args.length) {
                                this.game.client.sendCouncilMessage(args.join(" "));
                            } else {
                                this.game.escribirMsgConsola("Escriba un mensaje.");
                            }

                            break;
                        case "/ROL":
                            if (args.length) {
                                this.game.client.sendRoleMasterRequest(args.join(" "));
                            } else {
                                this.game.escribirMsgConsola("Escriba una pregunta.");
                            }

                            break;
                        case "/GM":
                            this.game.client.sendGMRequest();

                            break;
                        case "/_BUG":
                            if (args.length) {
                                this.game.client.sendBugReport(args.join(" "));
                            } else {
                                this.game.escribirMsgConsola("Escriba una descripción del bug.");
                            }

                            break;
                        case "/DESC":
                            if (!this._checkearYescribirMuerto()) {
                                this.game.client.sendChangeDescription(args.join(" "));
                            }

                            break;
                        case "/VOTO":
                            if (args.length) {
                                this.game.client.sendGuildVote(args.join(" "));
                            } else {
                                this.game.escribirMsgConsola("Faltan parámetros. Utilice /voto NICKNAME.");
                            }

                            break;
                        case "/PENAS":
                            if (args.length) {
                                this.game.client.sendPunishments(args.join(" "));
                            } else {
                                this.game.escribirMsgConsola("Faltan parámetros. Utilice /penas NICKNAME.");
                            }

                            break;
                        case "/CONTRASEÑA":
                            this.game.client.frmNewPassword.Show(vbModal, frmMain);

                            break;
                        case "/APOSTAR":
                            if (!this._checkearYescribirMuerto()) {
                                if (args.length) {
                                    if (!isNaN(args[0]) && (args[0] < 65536)) {
                                        this.game.client.sendGamble(args[0]);
                                    } else {
                                        this.game.escribirMsgConsola("Cantidad incorrecta. Utilice /apostar CANTIDAD.");
                                    }
                                }
                                else {
                                    this.game.escribirMsgConsola("Faltan parámetros. Utilice /apostar CANTIDAD.");
                                }
                            }

                            break;
                        case "/RETIRARFACCION":
                            if (!this._checkearYescribirMuerto()) {
                                this.game.client.sendLeaveFaction();
                            }

                            break;
                        case "/RETIRAR":
                            if (!this._checkearYescribirMuerto()) {

                                if (args.length) {
                                    if (!isNaN(args[0])) {
                                        this.game.client.sendBankExtractGold(args[0]);
                                    } else {
                                        this.game.escribirMsgConsola("Cantidad incorrecta. Utilice /retirar CANTIDAD.");
                                    }
                                }
                                else {
                                    this.game.escribirMsgConsola("Cantidad incorrecta. Utilice /retirar CANTIDAD.");
                                }

                            }

                            break;
                        case "/DEPOSITAR":
                            if (!this._checkearYescribirMuerto()) {

                                if (args.length) {
                                    if (!isNaN(args[0])) {
                                        this.game.client.sendBankDepositGold(args[0]);
                                    } else {
                                        this.game.escribirMsgConsola("Cantidad incorecta. Utilice /depositar CANTIDAD.");
                                    }
                                }
                                else {
                                    this.game.escribirMsgConsola("Faltan parámetros. Utilice /depositar CANTIDAD.");
                                }
                            }

                            break;
                        case "/DENUNCIAR":
                            if (args.length) {
                                this.game.client.sendDenounce(args.join(" "));
                            } else {
                                this.game.escribirMsgConsola("Formule su denuncia.");
                            }

                            break;
                        case "/FUNDARCLAN":
                            if (this.game.atributos.nivel > 24) {
                                this.game.client.sendGuildFundate();
                            } else {
                                this.game.escribirMsgConsola("Para fundar un clan tienes que ser nivel 25 y tener 90 skills en liderazgo.");
                            }

                            break;

                        case "/ECHARPARTY":
                            if (args.length) {
                                this.game.client.sendPartyKick(args.join(" "));
                            } else {
                                this.game.escribirMsgConsola("Faltan parámetros. Utilice /echarparty NICKNAME.");
                            }

                            break;
                        case "/PARTYLIDER":
                            if (args.length) {
                                this.game.client.sendPartySetLeader(args.join(" "));
                            } else {
                                this.game.escribirMsgConsola("Faltan parámetros. Utilice /partylider NICKNAME.");
                            }

                            break;
                        case "/ACCEPTPARTY":
                            if (args.length) {
                                this.game.client.sendPartyAcceptMember(args.join(" "));
                            } else {
                                this.game.escribirMsgConsola("Faltan parámetros. Utilice /acceptparty NICKNAME.");
                            }
                            break;

                        case "/HOGAR":
                            this.game.client.sendHome();
                            break;

                        default:
                            valido = false;
                            break;

                    }

                }
                else {
                    valido = false;
                }
                if (!valido) {
                    this.game.escribirMsgConsola("Comando invalido", Font.WARNING);
                }
            }

            else {
                return message;
            }
        }

    }

    return ComandosChat;
});

/*TODO: agregar comandos gm... :

 '
 ' BEGIN GM COMMANDS
 '
 case "/FUNDARCLANGM":
 this.game.client.sendGuildFundation(eClanType.ct_GM);
 break;

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