define(['player', 'protocol', 'bytequeue', 'lib/websock', 'enums'], function (Player, Protocolo, ByteQueue, __websock) {

    var GameClient = Class.extend({
        init: function (game, host, port) {
            this.VER_A = 0;
            this.VER_B = 13;
            this.VER_C = 2;

            this.game = game;
            this.host = host;
            this.port = port;
            this.conectado = false;

            this.protocolo = new Protocolo();
            this.ws = new Websock();
            this.byteQueue = new ByteQueue(this.ws);

        },// TODO: cambiar en el protocolo los peekbyte por readbyte y sacar los readbyte de cada uno

        _connect: function (conectarse_callback) {
            this.ws.open("ws://localhost:8666");
            /*server.dakara.com.ar*/
            var self = this;
            this.ws.on('open', function () {
                self.conectado = true;
                conectarse_callback();
            });

            this.ws.on('message', function () {
                //try {
                while (self.byteQueue.length() > 1)
                    self.protocolo.ServerPacketDecodeAndDispatch(self.byteQueue, self);
                //} catch (e) {
                //    log.error(e.name + ': ' + e.message);
                //}
            });
            this.ws.on('close', function () {
                self.conectado = false;
                self.disconnect_callback();
                //disconnect();
                //log.error("Disconnected");
            });

        },

        intentarLogear: function (nombre, pw) {
            if (!this.conectado) {
                var self = this;
                this._connect(function () {
                    self.sendLoginExistingChar(nombre, pw);
                });
            }
            else {
                this.sendLoginExistingChar(nombre, pw);
            }
        },

        intentarCrearPersonaje: function (callback) {
            if (!this.conectado) {
                var self = this;
                this._connect(function () {
                    callback();
                    self.sendThrowDices();
                });
            }
            else {
                callback();
                this.sendThrowDices()
            }
        },

        setDisconnectCallback: function (disconnect_callback) {
            this.disconnect_callback = disconnect_callback;
        },
        setLogeadoCallback: function (logeado_callback) {
            this.logeado_callback = logeado_callback;
        },

        setDadosCallback: function (dadosCallback) {
            this.dados_callback = dadosCallback;
        },
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        handleLogged: function (Clase) {
            this.logeado_callback();
        },

        handleRemoveDialogs: function () {
            console.log("TODO: handleRemoveDialogs ");
        },

        handleRemoveCharDialog: function (CharIndex) {
            console.log("TODO: handleRemoveCharDialog ");
        },

        handleNavigateToggle: function () {
            this.game.player.navegando = !this.game.player.navegando;
            console.log("TODO: handleNavigateToggle ");
        },

        handleDisconnect: function () {
            console.log("TODO: handleDisconnect ");
        },

        handleCommerceEnd: function () {
            this.game.uiManager.hideComerciar();
        },

        handleBankEnd: function () {
            console.log("TODO: handleBankEnd ");
        },

        handleCommerceInit: function () {
            this.game.uiManager.showComerciar();
        },

        handleBankInit: function (Banco) {
            console.log("TODO: handleBankInit ");
        },

        handleUserCommerceInit: function (DestUserName) {
            console.log("TODO: handleUserCommerceInit ");
        },

        handleUserCommerceEnd: function () {
            console.log("TODO: handleUserCommerceEnd ");
        },

        handleUserOfferConfirm: function () {
            console.log("TODO: handleUserOfferConfirm ");
        },

        handleCommerceChat: function (Chat, FontIndex) {
            console.log("TODO: handleCommerceChat ");
        },

        handleShowBlacksmithForm: function () {
            console.log("TODO: handleShowBlacksmithForm ");
        },

        handleShowCarpenterForm: function () {
            console.log("TODO: handleShowCarpenterForm ");
        },

        handleUpdateSta: function (Value) {
            this.game.setStamina(Value);
        },

        handleUpdateMana: function (Value) {
            this.game.setMana(Value);
            console.log("TODO: handleUpdateMana ");
        },

        handleUpdateHP: function (Value) {
            this.game.setVida(Value);
            console.log("TODO: handleUpdateHP ");
        },

        handleUpdateGold: function (Value) {
            this.game.uiManager.interfaz.updateOro(Value);
            console.log("TODO: handleUpdateGold ");
        },

        handleUpdateBankGold: function (Value) {
            console.log("TODO: handleUpdateBankGold ");
        },

        handleUpdateExp: function (Value) {
            this.game.setExp(Value);
            console.log("TODO: handleUpdateExp ");
        },

        handleChangeMap: function (Map, Version) {
            this.game.cambiarMapa(Map);
            console.log("TODO: handleChangeMap ");
        },

        handlePosUpdate: function (X, Y) {
            this.game.resetPosCharacter(this.game.player.id, X, Y);
            console.log("TODO: handlePosUpdate ");
        },

        handleChatOverHead: function (Chat, CharIndex, R, G, B) {
            this.game.escribirChat(Chat, CharIndex, R, G, B);
            console.log("TODO: handleChatOverHead ");
        },

        handleConsoleMsg: function (Chat, FontIndex) {
            this.game.escribirMsgConsola(Chat, Enums.Font[Enums.FontIndex[FontIndex]]);
        },

        handleGuildChat: function (Chat) {
            console.log("TODO: handleGuildChat ");
        },

        handleShowMessageBox: function (Chat) {
            console.log("TODO: handleShowMessageBox ");
        },

        handleUserIndexInServer: function (UserIndex) {
            console.log("TODO: handleUserIndexInServer ");
        },

        handleUserCharIndexInServer: function (CharIndex) {
            if (this.game.player.id !== CharIndex) {
                log.error("WTF EL CHARINDEX CAMBIA?: playerID" + this.game.player.id + " cambiado a charindex " + CharIndex);

                this.game.characters[this.game.player.id] = null;

                if (this.game.characters[CharIndex]){
                    this.game.sacarEntity(this.game.characters[CharIndex]);
                }

                this.game.player.id = CharIndex;
                this.game.characters[CharIndex] = this.game.player;
            }
        },

        handleCharacterCreate: function (CharIndex, Body, Head, Heading, X, Y, Weapon, Shield, Helmet, FX, FXLoops, Name, NickColor, Privileges) {
            this.game.agregarCharacter(CharIndex, Body, Head, Heading, X, Y, Weapon, Shield, Helmet, FX, FXLoops, Name, NickColor, Privileges);
        },

        handleCharacterRemove: function (CharIndex) {
            if (CharIndex === this.game.player.id) {
                log.error("trato de saccar al player");
                return;
            }
            if (!this.game.characters[CharIndex])
                log.error("trato de sacar entity inexistente");
            else
                this.game.sacarEntity(this.game.characters[CharIndex]);
            console.log("TODO: handleCharacterRemove ");
        },

        handleCharacterChangeNick: function (CharIndex, NewName) {
            console.log("TODO: handleCharacterChangeNick ");
        },

        handleCharacterMove: function (CharIndex, X, Y) {
            this.game.moverCharacter(CharIndex, X, Y);
        },

        handleForceCharMove: function (Direction) {
            this.game.forceCaminar(Direction);
        },

        handleCharacterChange: function (CharIndex, Body, Head, Heading, Weapon, Shield, Helmet, FX, FXLoops) {
            this.game.cambiarCharacter(CharIndex, Body, Head, Heading, Weapon, Shield, Helmet, FX, FXLoops);
        },

        handleObjectCreate: function (X, Y, GrhIndex) {
            this.game.agregarItem(GrhIndex, X, Y);
        },

        handleObjectDelete: function (X, Y) {
            this.game.sacarItem(X, Y);
        },

        handleBlockPosition: function (X, Y, Blocked) {
            this.game.map.setBlockPosition(X, Y, Blocked);
        },

        handlePlayMidi: function (MidiID, Loops) {
            this.game.assetManager.setMusic(MidiID);
        },

        handlePlayWave: function (WaveID, X, Y) {
            this.game.assetManager.playSound(WaveID);
        },

        handleGuildList: function (Data) {
            console.log("TODO: handleGuildList ");
        },

        handleAreaChanged: function (X, Y) {
            this.game.cambiarArea(X, Y);
        },

        handlePauseToggle: function () {
            this.game.togglePausa();
        },

        handleRainToggle: function () {
            console.log("TODO: handleRainToggle ");
        },

        handleCreateFX: function (CharIndex, FX, FXLoops) {
            this.game.setCharacterFX(CharIndex, FX, FXLoops);
        },

        handleUpdateUserStats: function (MaxHp, MinHp, MaxMan, MinMan, MaxSta, MinSta, Gld, Elv, Elu, Exp) {
            this.game.setVida(MinHp, MaxHp);
            this.game.setMana(MinMan, MaxMan);
            this.game.setStamina(MinSta, MaxSta);
            this.game.setExp(Exp,Elu);
            this.game.uiManager.interfaz.updateOro(Gld);
            this.game.player.oro = Gld;
            this.game.player.nivel = Elv;
        },
        handleChangeInventorySlot: function (Slot, ObjIndex, ObjName, Amount, Equiped, GrhIndex, ObjType, MaxHit, MinHit, MaxDef, MinDef, ObjSalePrice) {
            this.game.cambiarSlotInventario(Slot, ObjIndex, ObjName, Amount, Equiped, GrhIndex, ObjType, MaxHit, MinHit, MaxDef, MinDef, ObjSalePrice);
        },

        handleChangeBankSlot: function (Slot, ObjIndex, ObjName, Amount, GrhIndex, ObjType, MaxHit, MinHit, MaxDef, MinDef, ObjSalePrice) {
            console.log("TODO: handleChangeBankSlot ");
        },

        handleChangeSpellSlot: function (Slot, SpellID, Name) {
            this.game.cambiarSlotHechizos(Slot, SpellID, Name);
        },

        handleAtributes: function (Fuerza, Agilidad, Inteligencia, Carisma, Constitucion) {
            console.log("TODO: handleAtributes ");
        },

        handleBlacksmithWeapons: function (Items) {
            /*Item contiene:
             Name: Name,
             GrhIndex: GrhIndex,
             LingH: LingH,
             LingP: LingP,
             LingO: LingO,
             ArmasHerreroIndex: ArmasHerreroIndex,
             ObjUpgrade: ObjUpgrade,
             */
            console.log("TODO: handleBlacksmithWeapons ");
        },

        handleBlacksmithArmors: function (Items) {
            /* Item contiene
             Name: Name,
             GrhIndex: GrhIndex,
             LingH: LingH,
             LingP: LingP,
             LingO: LingO,
             ArmasHerreroIndex: ArmasHerreroIndex,
             ObjUpgrade: ObjUpgrade,
             */
            console.log("TODO: handleBlacksmithArmors ");
        },

        handleCarpenterObjects: function (Items) {
            /* Items contiene
             Name: Name,
             GrhIndex: GrhIndex,
             Madera: Madera,
             MaderaElfica: MaderaElfica,
             ObjCarpinteroIndex: ObjCarpinteroIndex,
             ObjUpgrade: ObjUpgrade,
             */
            console.log("TODO: handleCarpenterObjects ");
        },

        handleRestOK: function () {
            console.log("TODO: handleRestOK ");
        },

        handleErrorMsg: function (Message) {
            log.error(Message);
            console.log("TODO: handleErrorMsg ");
        },

        handleBlind: function () {
            console.log("TODO: handleBlind ");
        },

        handleDumb: function () {
            console.log("TODO: handleDumb ");
        },

        handleShowSignal: function (Texto, Grh) {
            console.log("TODO: handleShowSignal ");
        },

        handleChangeNPCInventorySlot: function (Slot, ObjName, Amount, Price, GrhIndex, ObjIndex, ObjType, MaxHit, MinHit, MaxDef, MinDef) {
            this.game.cambiarSlotCompra(Slot, ObjName, Amount, Price, GrhIndex, ObjIndex, ObjType, MaxHit, MinHit, MaxDef, MinDef);
        },

        handleUpdateHungerAndThirst: function (MaxAgu, MinAgu, MaxHam, MinHam) {
            this.game.setAgua(MinAgu, MaxAgu);
            this.game.setHambre(MinHam, MaxHam);
        },

        handleFame: function (Asesino, Bandido, Burgues, Ladron, Noble, Plebe, Promedio) {
            console.log("TODO: handleFame ");
        },

        handleMiniStats: function (CiudadanosMatados, CriminalesMatados, UsuariosMatados, NpcsMuertos, Clase, Pena) {
            console.log("TODO: handleMiniStats ");
        },

        handleLevelUp: function (SkillPoints) {
            console.log("TODO: handleLevelUp ");
        },

        handleAddForumMsg: function (ForumType, Title, Author, Message) {
            console.log("TODO: handleAddForumMsg ");
        },

        handleShowForumForm: function (Visibilidad, CanMakeSticky) {
            console.log("TODO: handleShowForumForm ");
        },

        handleSetInvisible: function (charIndex, invisible) {
            var char = this.game.characters[charIndex];
            if (char)
                this.game.renderer.setCharVisible(char, !invisible);
        },

        handleDiceRoll: function (Fuerza, Agilidad, Inteligencia, Carisma, Constitucion) {
            this.dados_callback(Fuerza, Agilidad, Inteligencia, Carisma, Constitucion);
        },

        handleMeditateToggle: function () {
            console.log("TODO: handleMeditateToggle ");
        },

        handleBlindNoMore: function () {
            console.log("TODO: handleBlindNoMore ");
        },

        handleDumbNoMore: function () {
            console.log("TODO: handleDumbNoMore ");
        },

        handleSendSkills: function (Skills) {
            console.log("TODO: handleSendSkills ");
        },

        handleTrainerCreatureList: function (Data) {
            console.log("TODO: handleTrainerCreatureList ");
        },

        handleGuildNews: function (News, EnemiesList, AlliesList) {
            console.log("TODO: handleGuildNews ");
        },

        handleOfferDetails: function (Details) {
            console.log("TODO: handleOfferDetails ");
        },

        handleAlianceProposalsList: function (Data) {
            console.log("TODO: handleAlianceProposalsList ");
        },

        handlePeaceProposalsList: function (Data) {
            console.log("TODO: handlePeaceProposalsList ");
        },

        handleCharacterInfo: function (CharName, Race, Class, Gender, Level, Gold, Bank, Reputation, PreviousPetitions, CurrentGuild, PreviousGuilds, RoyalArmy, ChaosLegion, CiudadanosMatados, CriminalesMatados) {
            console.log("TODO: handleCharacterInfo ");
        },

        handleGuildLeaderInfo: function (GuildList, MemberList, GuildNews, JoinRequests) {
            console.log("TODO: handleGuildLeaderInfo ");
        },

        handleGuildMemberInfo: function (GuildList, MemberList) {
            console.log("TODO: handleGuildMemberInfo ");
        },

        handleGuildDetails: function (GuildName, Founder, FoundationDate, Leader, URL, MemberCount, ElectionsOpen, Aligment, EnemiesCount, AlliesCount, AntifactionPoints, Codex, GuildDesc) {
            console.log("TODO: handleGuildDetails ");
        },

        handleShowGuildFundationForm: function () {
            console.log("TODO: handleShowGuildFundationForm ");
        },

        handleParalizeOK: function () {
            console.log("TODO: handleParalizeOK ");
        },

        handleShowUserRequest: function (Details) {
            console.log("TODO: handleShowUserRequest ");
        },

        handleTradeOK: function () {
            console.log("TODO: handleTradeOK ");
        },

        handleBankOK: function () {
            console.log("TODO: handleBankOK ");
        },

        handleChangeUserTradeSlot: function (OfferSlot, ObjIndex, Amount, GrhIndex, ObjType, MaxHit, MinHit, MaxDef, MinDef, Price, ObjName) {
            console.log("TODO: handleChangeUserTradeSlot ");
        },

        handleSendNight: function (Night) {
            console.log("TODO: handleSendNight ");
        },

        handlePong: function () {
            console.log("TODO: handlePong ");
        },

        handleUpdateTagAndStatus: function (CharIndex, NickColor, Tag) {
            console.log("TODO: handleUpdateTagAndStatus ");
        },

        handleSpawnList: function (Data) {
            console.log("TODO: handleSpawnList ");
        },

        handleShowSOSForm: function (Data) {
            console.log("TODO: handleShowSOSForm ");
        },

        handleShowMOTDEditionForm: function (Data) {
            console.log("TODO: handleShowMOTDEditionForm ");
        },

        handleShowGMPanelForm: function () {
            console.log("TODO: handleShowGMPanelForm ");
        },

        handleUserNameList: function (Data) {
            console.log("TODO: handleUserNameList ");
        },

        handleShowDenounces: function (Data) {
            console.log("TODO: handleShowDenounces ");
        },

        handleRecordList: function (Items) {
            console.log("TODO: handleRecordList ");
        },

        handleRecordDetails: function (Creador, Motivo, Online, IP, OnlineTime, Obs) {
            console.log("TODO: handleRecordDetails ");
        },

        handleShowGuildAlign: function () {
            console.log("TODO: handleShowGuildAlign ");
        },

        handleShowPartyForm: function (EsLider, Data, Exp) {
            console.log("TODO: handleShowPartyForm ");
        },

        handleUpdateStrenghtAndDexterity: function (Fuerza, Agilidad) {
            this.game.uiManager.interfaz.updateAgilidad(Agilidad);
            this.game.uiManager.interfaz.updateFuerza(Fuerza);
            console.log("TODO: handleUpdateStrenghtAndDexterity ");
        },

        handleUpdateStrenght: function (Fuerza) {
            this.game.uiManager.interfaz.updateFuerza(Fuerza);
            console.log("TODO: handleUpdateStrenght ");
        },

        handleUpdateDexterity: function (Agilidad) {
            this.game.uiManager.interfaz.updateAgilidad(Agilidad);
            console.log("TODO: handleUpdateDexterity ");
        },

        handleAddSlots: function (Mochila) {
            console.log("TODO: handleAddSlots ");
        },

        handleNPCHitUser: function (parteCuerpo, danio) {
            this.game.recibirDanio(parteCuerpo, danio);
        },

        handleUserHitNPC: function (danio) {
            this.game.realizarDanio(danio);
        },

        handleUserAttackedSwing: function (a) {
            console.log("TODO: handleUserAttackedSwing");
        },

        handleUserHittedByUser: function (attackerIndex, bodyPart, danio) {
            console.log("TODO: handleUserHittedByUser");
            /*
             Dim AttackerName As String

             AttackerName = GetRawName(charlist(incomingData.ReadInteger()).Nombre)
             BodyPart = incomingData.ReadByte()
             Daño = incomingData.ReadInteger()

             Select Case BodyPart
             Case bCabeza
             Call AddtoRichTextBox(frmMain.RecTxt, MENSAJE_1 & AttackerName & MENSAJE_RECIBE_IMPACTO_CABEZA & Daño & MENSAJE_2, 255, 0, 0, True, False, True)

             Case bBrazoIzquierdo
             Call AddtoRichTextBox(frmMain.RecTxt, MENSAJE_1 & AttackerName & MENSAJE_RECIBE_IMPACTO_BRAZO_IZQ & Daño & MENSAJE_2, 255, 0, 0, True, False, True)

             Case bBrazoDerecho
             Call AddtoRichTextBox(frmMain.RecTxt, MENSAJE_1 & AttackerName & MENSAJE_RECIBE_IMPACTO_BRAZO_DER & Daño & MENSAJE_2, 255, 0, 0, True, False, True)

             Case bPiernaIzquierda
             Call AddtoRichTextBox(frmMain.RecTxt, MENSAJE_1 & AttackerName & MENSAJE_RECIBE_IMPACTO_PIERNA_IZQ & Daño & MENSAJE_2, 255, 0, 0, True, False, True)

             Case bPiernaDerecha
             Call AddtoRichTextBox(frmMain.RecTxt, MENSAJE_1 & AttackerName & MENSAJE_RECIBE_IMPACTO_PIERNA_DER & Daño & MENSAJE_2, 255, 0, 0, True, False, True)

             Case bTorso
             Call AddtoRichTextBox(frmMain.RecTxt, MENSAJE_1 & AttackerName & MENSAJE_RECIBE_IMPACTO_TORSO & Daño & MENSAJE_2, 255, 0, 0, True, False, True)
             End Select
             */
        },

        handleUserHittedUser: function (attackerIndex, bodyPart, danio) {
            console.log("TODO: handleUserHittedUser");
        },

        handleWorkRequestTarget: function (skill) {
            switch (skill) {
                case Enums.Skill.magia:
                    this.game.escribirMsgConsola(Enums.MensajeConsola.TRABAJO_MAGIA, Enums.Font.SKILLINFO);
                    break;
                case Enums.Skill.pesca:
                    this.game.escribirMsgConsola(Enums.MensajeConsola.TRABAJO_PESCA, Enums.Font.SKILLINFO);
                    break;
                case Enums.Skill.robar:
                    this.game.escribirMsgConsola(Enums.MensajeConsola.TRABAJO_ROBAR, Enums.Font.SKILLINFO);
                    break;
                case Enums.Skill.talar:
                    this.game.escribirMsgConsola(Enums.MensajeConsola.TRABAJO_TALAR, Enums.Font.SKILLINFO);
                    break;
                case Enums.Skill.mineria:
                    this.game.escribirMsgConsola(Enums.MensajeConsola.TRABAJO_MINERIA, Enums.Font.SKILLINFO);
                    break;
                case Enums.Skill.fundirmetal:
                    this.game.escribirMsgConsola(Enums.MensajeConsola.TRABAJO_FUNDIRMETAL, Enums.Font.SKILLINFO);
                    break;
                case Enums.Skill.proyectiles:
                    this.game.escribirMsgConsola(Enums.MensajeConsola.TRABAJO_PROYECTILES, Enums.Font.SKILLINFO);
                    break;
                default:
                    log.error("Numero de skill invalido: " + skill)
            }
            this.game.setTrabajoPendiente(skill);
        },

        handleHaveKilledUser: function (victimIndex, exp) {
            /* '"¡" & .name & " te ha matado!" */
            console.log("TODO: handleHaveKilledUser");
        },
        handleHome: function (a, b, c) {
            console.log("TODO:handleHome ");
        },

        handleDontSeeAnything: function () {
            this.game.escribirMsgConsola(Enums.MensajeConsola.NO_VES_NADA_INTERESANTE, Enums.Font.INFO);
        },

        handleUserKill: function (attackerIndex) {
            console.log("TODO: handleUserKill");
        },

        handleNPCSwing: function () {
            this.game.escribirMsgConsola(Enums.MensajeConsola.CRIATURA_FALLA_GOLPE, Enums.Font.FIGHT);
        },

        handleNPCKillUser: function () {
            this.game.escribirMsgConsola(Enums.MensajeConsola.CRIATURA_MATADO, Enums.Font.FIGHT);
        },

        handleBlockedWithShieldUser: function () {
            this.game.escribirMsgConsola(Enums.MensajeConsola.RECHAZO_ATAQUE_ESCUDO, Enums.Font.FIGHT);
        },

        handleBlockedWithShieldOther: function () {
            this.game.escribirMsgConsola(Enums.MensajeConsola.USUARIO_RECHAZO_ATAQUE_ESCUDO, Enums.Font.FIGHT);
        },

        handleUserSwing: function () {
            this.game.escribirMsgConsola(Enums.MensajeConsola.FALLADO_GOLPE, Enums.Font.FIGHT);
        },

        handleSafeModeOn: function () {
            console.log("TODO: handleSafeModeOn");
        },

        handleSafeModeOff: function () {
            console.log("TODO: handleSafeModeOff");
        },

        handleResuscitationSafeOff: function () {
            console.log("TODO: handleResuscitationSafeOff");
        },

        handleResuscitationSafeOn: function () {
            console.log("TODO: handleResuscitationSafeOn");
        },

        handleNobilityLost: function () {
            this.game.escribirMsgConsola(Enums.MensajeConsola.PIERDE_NOBLEZA, Enums.Font.FIGHT);
        },

        handleCantUseWhileMeditating: function () {
            this.game.escribirMsgConsola(Enums.MensajeConsola.USAR_MEDITANDO, Enums.Font.FIGHT);
        },

        handleEarnExp: function () {
            console.log("TODO: handleEarnExp");
        },

        handleFinishHome: function () {
            console.log("TODO: handleFinishHome");
        },

        handleCancelHome: function () {
            console.log("TODO: handleCancelHome");
        },

        /* Public Sub HandleMultiMessage()
         '***************************************************
         'Author: Unknown
         'Last Modification: 11/16/2010
         ' 09/28/2010: C4b3z0n - Ahora se le saco la "," a los minutos de distancia del /hogar, ya que a veces quedaba "12,5 minutos y 30segundos"
         ' 09/21/2010: C4b3z0n - Now the fragshooter operates taking the screen after the change of killed charindex to ghost only if target charindex is visible to the client, else it will take screenshot like before.
         ' 11/16/2010: Amraphen - Recoded how the FragShooter works.
         '***************************************************
         Dim BodyPart As Byte
         Dim Daño As Integer

         With incomingData
         Call .ReadByte

         Select Case .ReadByte
         Case eMessages.DontSeeAnything
         Call AddtoRichTextBox(frmMain.RecTxt, MENSAJE_NO_VES_NADA_INTERESANTE, 65, 190, 156, False, False, True)

         Case eMessages.NPCSwing
         Call AddtoRichTextBox(frmMain.RecTxt, MENSAJE_CRIATURA_FALLA_GOLPE, 255, 0, 0, True, False, True)

         Case eMessages.NPCKillUser
         Call AddtoRichTextBox(frmMain.RecTxt, MENSAJE_CRIATURA_MATADO, 255, 0, 0, True, False, True)

         Case eMessages.BlockedWithShieldUser
         Call AddtoRichTextBox(frmMain.RecTxt, MENSAJE_RECHAZO_ATAQUE_ESCUDO, 255, 0, 0, True, False, True)

         Case eMessages.BlockedWithShieldOther
         Call AddtoRichTextBox(frmMain.RecTxt, MENSAJE_USUARIO_RECHAZO_ATAQUE_ESCUDO, 255, 0, 0, True, False, True)

         Case eMessages.UserSwing
         Call AddtoRichTextBox(frmMain.RecTxt, MENSAJE_FALLADO_GOLPE, 255, 0, 0, True, False, True)

         Case eMessages.SafeModeOn
         Call frmMain.ControlSM(eSMType.sSafemode, True)

         Case eMessages.SafeModeOff
         Call frmMain.ControlSM(eSMType.sSafemode, False)

         Case eMessages.ResuscitationSafeOff
         Call frmMain.ControlSM(eSMType.sResucitation, False)

         Case eMessages.ResuscitationSafeOn
         Call frmMain.ControlSM(eSMType.sResucitation, True)

         Case eMessages.NobilityLost
         Call AddtoRichTextBox(frmMain.RecTxt, MENSAJE_PIERDE_NOBLEZA, 255, 0, 0, False, False, True)

         Case eMessages.CantUseWhileMeditating
         Call AddtoRichTextBox(frmMain.RecTxt, MENSAJE_USAR_MEDITANDO, 255, 0, 0, False, False, True)

         Case eMessages.NPCHitUser
         Select Case incomingData.ReadByte()
         Case bCabeza
         Call AddtoRichTextBox(frmMain.RecTxt, MENSAJE_GOLPE_CABEZA & CStr(incomingData.ReadInteger()) & "!!", 255, 0, 0, True, False, True)

         Case bBrazoIzquierdo
         Call AddtoRichTextBox(frmMain.RecTxt, MENSAJE_GOLPE_BRAZO_IZQ & CStr(incomingData.ReadInteger()) & "!!", 255, 0, 0, True, False, True)

         Case bBrazoDerecho
         Call AddtoRichTextBox(frmMain.RecTxt, MENSAJE_GOLPE_BRAZO_DER & CStr(incomingData.ReadInteger()) & "!!", 255, 0, 0, True, False, True)

         Case bPiernaIzquierda
         Call AddtoRichTextBox(frmMain.RecTxt, MENSAJE_GOLPE_PIERNA_IZQ & CStr(incomingData.ReadInteger()) & "!!", 255, 0, 0, True, False, True)

         Case bPiernaDerecha
         Call AddtoRichTextBox(frmMain.RecTxt, MENSAJE_GOLPE_PIERNA_DER & CStr(incomingData.ReadInteger()) & "!!", 255, 0, 0, True, False, True)

         Case bTorso
         Call AddtoRichTextBox(frmMain.RecTxt, MENSAJE_GOLPE_TORSO & CStr(incomingData.ReadInteger() & "!!"), 255, 0, 0, True, False, True)
         End Select

         Case eMessages.UserHitNPC
         Call AddtoRichTextBox(frmMain.RecTxt, MENSAJE_GOLPE_CRIATURA_1 & CStr(incomingData.ReadLong()) & MENSAJE_2, 255, 0, 0, True, False, True)

         Case eMessages.UserAttackedSwing
         Call AddtoRichTextBox(frmMain.RecTxt, MENSAJE_1 & charlist(incomingData.ReadInteger()).Nombre & MENSAJE_ATAQUE_FALLO, 255, 0, 0, True, False, True)

         Case eMessages.UserHittedByUser
         Dim AttackerName As String

         AttackerName = GetRawName(charlist(incomingData.ReadInteger()).Nombre)
         BodyPart = incomingData.ReadByte()
         Daño = incomingData.ReadInteger()

         Select Case BodyPart
         Case bCabeza
         Call AddtoRichTextBox(frmMain.RecTxt, MENSAJE_1 & AttackerName & MENSAJE_RECIBE_IMPACTO_CABEZA & Daño & MENSAJE_2, 255, 0, 0, True, False, True)

         Case bBrazoIzquierdo
         Call AddtoRichTextBox(frmMain.RecTxt, MENSAJE_1 & AttackerName & MENSAJE_RECIBE_IMPACTO_BRAZO_IZQ & Daño & MENSAJE_2, 255, 0, 0, True, False, True)

         Case bBrazoDerecho
         Call AddtoRichTextBox(frmMain.RecTxt, MENSAJE_1 & AttackerName & MENSAJE_RECIBE_IMPACTO_BRAZO_DER & Daño & MENSAJE_2, 255, 0, 0, True, False, True)

         Case bPiernaIzquierda
         Call AddtoRichTextBox(frmMain.RecTxt, MENSAJE_1 & AttackerName & MENSAJE_RECIBE_IMPACTO_PIERNA_IZQ & Daño & MENSAJE_2, 255, 0, 0, True, False, True)

         Case bPiernaDerecha
         Call AddtoRichTextBox(frmMain.RecTxt, MENSAJE_1 & AttackerName & MENSAJE_RECIBE_IMPACTO_PIERNA_DER & Daño & MENSAJE_2, 255, 0, 0, True, False, True)

         Case bTorso
         Call AddtoRichTextBox(frmMain.RecTxt, MENSAJE_1 & AttackerName & MENSAJE_RECIBE_IMPACTO_TORSO & Daño & MENSAJE_2, 255, 0, 0, True, False, True)
         End Select

         Case eMessages.UserHittedUser

         Dim VictimName As String

         VictimName = GetRawName(charlist(incomingData.ReadInteger()).Nombre)
         BodyPart = incomingData.ReadByte()
         Daño = incomingData.ReadInteger()

         Select Case BodyPart
         Case bCabeza
         Call AddtoRichTextBox(frmMain.RecTxt, MENSAJE_PRODUCE_IMPACTO_1 & VictimName & MENSAJE_PRODUCE_IMPACTO_CABEZA & Daño & MENSAJE_2, 255, 0, 0, True, False, True)

         Case bBrazoIzquierdo
         Call AddtoRichTextBox(frmMain.RecTxt, MENSAJE_PRODUCE_IMPACTO_1 & VictimName & MENSAJE_PRODUCE_IMPACTO_BRAZO_IZQ & Daño & MENSAJE_2, 255, 0, 0, True, False, True)

         Case bBrazoDerecho
         Call AddtoRichTextBox(frmMain.RecTxt, MENSAJE_PRODUCE_IMPACTO_1 & VictimName & MENSAJE_PRODUCE_IMPACTO_BRAZO_DER & Daño & MENSAJE_2, 255, 0, 0, True, False, True)

         Case bPiernaIzquierda
         Call AddtoRichTextBox(frmMain.RecTxt, MENSAJE_PRODUCE_IMPACTO_1 & VictimName & MENSAJE_PRODUCE_IMPACTO_PIERNA_IZQ & Daño & MENSAJE_2, 255, 0, 0, True, False, True)

         Case bPiernaDerecha
         Call AddtoRichTextBox(frmMain.RecTxt, MENSAJE_PRODUCE_IMPACTO_1 & VictimName & MENSAJE_PRODUCE_IMPACTO_PIERNA_DER & Daño & MENSAJE_2, 255, 0, 0, True, False, True)

         Case bTorso
         Call AddtoRichTextBox(frmMain.RecTxt, MENSAJE_PRODUCE_IMPACTO_1 & VictimName & MENSAJE_PRODUCE_IMPACTO_TORSO & Daño & MENSAJE_2, 255, 0, 0, True, False, True)
         End Select

         Case eMessages.WorkRequestTarget
         UsingSkill = incomingData.ReadByte()

         frmMain.MousePointer = 2

         Select Case UsingSkill
         Case Magia
         Call AddtoRichTextBox(frmMain.RecTxt, MENSAJE_TRABAJO_MAGIA, 100, 100, 120, 0, 0)

         Case Pesca
         Call AddtoRichTextBox(frmMain.RecTxt, MENSAJE_TRABAJO_PESCA, 100, 100, 120, 0, 0)

         Case Robar
         Call AddtoRichTextBox(frmMain.RecTxt, MENSAJE_TRABAJO_ROBAR, 100, 100, 120, 0, 0)

         Case Talar
         Call AddtoRichTextBox(frmMain.RecTxt, MENSAJE_TRABAJO_TALAR, 100, 100, 120, 0, 0)

         Case Mineria
         Call AddtoRichTextBox(frmMain.RecTxt, MENSAJE_TRABAJO_MINERIA, 100, 100, 120, 0, 0)

         Case FundirMetal
         Call AddtoRichTextBox(frmMain.RecTxt, MENSAJE_TRABAJO_FUNDIRMETAL, 100, 100, 120, 0, 0)

         Case Proyectiles
         Call AddtoRichTextBox(frmMain.RecTxt, MENSAJE_TRABAJO_PROYECTILES, 100, 100, 120, 0, 0)
         End Select

         Case eMessages.HaveKilledUser
         Dim KilledUser As Integer
         Dim Exp As Long

         KilledUser = .ReadInteger
         Exp = .ReadLong

         Call ShowConsoleMsg(MENSAJE_HAS_MATADO_A & charlist(KilledUser).Nombre & MENSAJE_22, 255, 0, 0, True, False)
         Call ShowConsoleMsg(MENSAJE_HAS_GANADO_EXPE_1 & Exp & MENSAJE_HAS_GANADO_EXPE_2, 255, 0, 0, True, False)

         'Sacamos un screenshot si está activado el FragShooter:
         If ClientSetup.bKill And ClientSetup.bActive Then
         If Exp \ 2 > ClientSetup.byMurderedLevel Then
         FragShooterNickname = charlist(KilledUser).Nombre
         FragShooterKilledSomeone = True

         FragShooterCapturePending = True
         End If
         End If

         Case eMessages.UserKill
         Dim KillerUser As Integer

         KillerUser = .ReadInteger

         Call ShowConsoleMsg(charlist(KillerUser).Nombre & MENSAJE_TE_HA_MATADO, 255, 0, 0, True, False)

         'Sacamos un screenshot si está activado el FragShooter:
         If ClientSetup.bDie And ClientSetup.bActive Then
         FragShooterNickname = charlist(KillerUser).Nombre
         FragShooterKilledSomeone = False

         FragShooterCapturePending = True
         End If

         Case eMessages.EarnExp
         'Call ShowConsoleMsg(MENSAJE_HAS_GANADO_EXPE_1 & .ReadLong & MENSAJE_HAS_GANADO_EXPE_2, 255, 0, 0, True, False)

         Case eMessages.GoHome
         Dim Distance As Byte
         Dim Hogar As String
         Dim tiempo As Integer
         Dim msg As String

         Distance = .ReadByte
         tiempo = .ReadInteger
         Hogar = .ReadASCIIString

         If tiempo >= 60 Then
         If tiempo Mod 60 = 0 Then
         msg = tiempo / 60 & " minutos."
         Else
         msg = CInt(tiempo \ 60) & " minutos y " & tiempo Mod 60 & " segundos."  'Agregado el CInt() asi el número no es con , [C4b3z0n - 09/28/2010]
         End If
         Else
         msg = tiempo & " segundos."
         End If

         Call ShowConsoleMsg("Te encuentras a " & Distance & " mapas de la " & Hogar & ", este viaje durará " & msg, 255, 0, 0, True)
         Traveling = True

         Case eMessages.FinishHome
         Call ShowConsoleMsg(MENSAJE_HOGAR, 255, 255, 255)
         Traveling = False

         Case eMessages.CancelGoHome
         Call ShowConsoleMsg(MENSAJE_HOGAR_CANCEL, 255, 0, 0, True)
         Traveling = False
         End Select
         End With
         End Sub */

        handleStopWorking: function () {
            console.log("TODO: handleStopWorking ");
        },

        handleCancelOfferItem: function (Slot) {
            console.log("TODO: handleCancelOfferItem ");
        },

        sendLoginExistingChar: function (UserName, Password) {
            p = this.protocolo.BuildLoginExistingChar(UserName, Password, this.VER_A, this.VER_B, this.VER_C);
            p.serialize(this.byteQueue);
        },

        sendThrowDices: function () {
            p = this.protocolo.BuildThrowDices();
            p.serialize(this.byteQueue);
        },

        sendLoginNewChar: function (UserName, Password, Race, Gender, Class, Head, Mail, Homeland) {
            p = this.protocolo.BuildLoginNewChar(UserName, Password, this.VER_A, this.VER_B, this.VER_C, Race, Gender, Class, Head, Mail, Homeland);
            p.serialize(this.byteQueue);
        },

        sendTalk: function (Chat) {
            p = this.protocolo.BuildTalk(Chat);
            p.serialize(this.byteQueue);
        },

        sendYell: function (Chat) {
            p = this.protocolo.BuildYell(Chat);
            p.serialize(this.byteQueue);
        },

        sendWhisper: function (TargetName, Chat) {
            p = this.protocolo.BuildWhisper(TargetName, Chat);
            p.serialize(this.byteQueue);
        },

        sendWalk: function (Heading) {
            p = this.protocolo.BuildWalk(Heading);
            p.serialize(this.byteQueue);
        },

        sendRequestPositionUpdate: function () {
            p = this.protocolo.BuildRequestPositionUpdate();
            p.serialize(this.byteQueue);
        },

        sendAttack: function () {
            p = this.protocolo.BuildAttack();
            p.serialize(this.byteQueue);
        },

        sendPickUp: function () {
            p = this.protocolo.BuildPickUp();
            p.serialize(this.byteQueue);
        },

        sendSafeToggle: function () {
            p = this.protocolo.BuildSafeToggle();
            p.serialize(this.byteQueue);
        },

        sendResuscitationSafeToggle: function () {
            p = this.protocolo.BuildResuscitationSafeToggle();
            p.serialize(this.byteQueue);
        },

        sendRequestGuildLeaderInfo: function () {
            p = this.protocolo.BuildRequestGuildLeaderInfo();
            p.serialize(this.byteQueue);
        },

        sendRequestAtributes: function () {
            p = this.protocolo.BuildRequestAtributes();
            p.serialize(this.byteQueue);
        },

        sendRequestFame: function () {
            p = this.protocolo.BuildRequestFame();
            p.serialize(this.byteQueue);
        },

        sendRequestSkills: function () {
            p = this.protocolo.BuildRequestSkills();
            p.serialize(this.byteQueue);
        },

        sendRequestMiniStats: function () {
            p = this.protocolo.BuildRequestMiniStats();
            p.serialize(this.byteQueue);
        },

        sendCommerceEnd: function () {
            p = this.protocolo.BuildCommerceEnd();
            p.serialize(this.byteQueue);
        },

        sendUserCommerceEnd: function () {
            p = this.protocolo.BuildUserCommerceEnd();
            p.serialize(this.byteQueue);
        },

        sendUserCommerceConfirm: function () {
            p = this.protocolo.BuildUserCommerceConfirm();
            p.serialize(this.byteQueue);
        },

        sendCommerceChat: function (Chat) {
            p = this.protocolo.BuildCommerceChat(Chat);
            p.serialize(this.byteQueue);
        },

        sendBankEnd: function () {
            p = this.protocolo.BuildBankEnd();
            p.serialize(this.byteQueue);
        },

        sendUserCommerceOk: function () {
            p = this.protocolo.BuildUserCommerceOk();
            p.serialize(this.byteQueue);
        },

        sendUserCommerceReject: function () {
            p = this.protocolo.BuildUserCommerceReject();
            p.serialize(this.byteQueue);
        },

        sendDrop: function (Slot, Amount) {
            p = this.protocolo.BuildDrop(Slot, Amount);
            p.serialize(this.byteQueue);
        },

        sendCastSpell: function (Spell) {
            p = this.protocolo.BuildCastSpell(Spell);
            p.serialize(this.byteQueue);
        },

        sendLeftClick: function (X, Y) {
            p = this.protocolo.BuildLeftClick(X, Y);
            p.serialize(this.byteQueue);
        },

        sendDoubleClick: function (X, Y) {
            p = this.protocolo.BuildDoubleClick(X, Y);
            p.serialize(this.byteQueue);
        },

        sendWork: function (Skill) {
            p = this.protocolo.BuildWork(Skill);
            p.serialize(this.byteQueue);
        },

        sendUseSpellMacro: function () {
            p = this.protocolo.BuildUseSpellMacro();
            p.serialize(this.byteQueue);
        },

        sendUseItem: function (Slot) {
            p = this.protocolo.BuildUseItem(Slot);
            p.serialize(this.byteQueue);
        },

        sendCraftBlacksmith: function (Item) {
            p = this.protocolo.BuildCraftBlacksmith(Item);
            p.serialize(this.byteQueue);
        },

        sendCraftCarpenter: function (Item) {
            p = this.protocolo.BuildCraftCarpenter(Item);
            p.serialize(this.byteQueue);
        },

        sendWorkLeftClick: function (X, Y, Skill) {
            p = this.protocolo.BuildWorkLeftClick(X, Y, Skill);
            p.serialize(this.byteQueue);
        },

        sendCreateNewGuild: function (Desc, GuildName, Site, Codex) {
            p = this.protocolo.BuildCreateNewGuild(Desc, GuildName, Site, Codex);
            p.serialize(this.byteQueue);
        },

        sendSpellInfo: function (Slot) {
            p = this.protocolo.BuildSpellInfo(Slot);
            p.serialize(this.byteQueue);
        },

        sendEquipItem: function (Slot) {
            p = this.protocolo.BuildEquipItem(Slot);
            p.serialize(this.byteQueue);
        },

        sendChangeHeading: function (Heading) {
            p = this.protocolo.BuildChangeHeading(Heading);
            p.serialize(this.byteQueue);
        },

        sendModifySkills: function (Skills) {
            p = this.protocolo.BuildModifySkills(Skills);
            p.serialize(this.byteQueue);
        },

        sendTrain: function (PetIndex) {
            p = this.protocolo.BuildTrain(PetIndex);
            p.serialize(this.byteQueue);
        },

        sendCommerceBuy: function (Slot, Amount) {
            p = this.protocolo.BuildCommerceBuy(Slot, Amount);
            p.serialize(this.byteQueue);
        },

        sendBankExtractItem: function (Slot, Amount) {
            p = this.protocolo.BuildBankExtractItem(Slot, Amount);
            p.serialize(this.byteQueue);
        },

        sendCommerceSell: function (Slot, Amount) {
            p = this.protocolo.BuildCommerceSell(Slot, Amount);
            p.serialize(this.byteQueue);
        },

        sendBankDeposit: function (Slot, Amount) {
            p = this.protocolo.BuildBankDeposit(Slot, Amount);
            p.serialize(this.byteQueue);
        },

        sendForumPost: function (MsgType, Title, Post) {
            p = this.protocolo.BuildForumPost(MsgType, Title, Post);
            p.serialize(this.byteQueue);
        },

        sendMoveSpell: function (Direction, Slot) {
            p = this.protocolo.BuildMoveSpell(Direction, Slot);
            p.serialize(this.byteQueue);
        },

        sendMoveBank: function (Direction, Slot) {
            p = this.protocolo.BuildMoveBank(Direction, Slot);
            p.serialize(this.byteQueue);
        },

        sendClanCodexUpdate: function (Desc, Codex) {
            p = this.protocolo.BuildClanCodexUpdate(Desc, Codex);
            p.serialize(this.byteQueue);
        },

        sendUserCommerceOffer: function (Slot, Amount, OfferSlot) {
            p = this.protocolo.BuildUserCommerceOffer(Slot, Amount, OfferSlot);
            p.serialize(this.byteQueue);
        },

        sendGuildAcceptPeace: function (Guild) {
            p = this.protocolo.BuildGuildAcceptPeace(Guild);
            p.serialize(this.byteQueue);
        },

        sendGuildRejectAlliance: function (Guild) {
            p = this.protocolo.BuildGuildRejectAlliance(Guild);
            p.serialize(this.byteQueue);
        },

        sendGuildRejectPeace: function (Guild) {
            p = this.protocolo.BuildGuildRejectPeace(Guild);
            p.serialize(this.byteQueue);
        },

        sendGuildAcceptAlliance: function (Guild) {
            p = this.protocolo.BuildGuildAcceptAlliance(Guild);
            p.serialize(this.byteQueue);
        },

        sendGuildOfferPeace: function (Guild, Proposal) {
            p = this.protocolo.BuildGuildOfferPeace(Guild, Proposal);
            p.serialize(this.byteQueue);
        },

        sendGuildOfferAlliance: function (Guild, Proposal) {
            p = this.protocolo.BuildGuildOfferAlliance(Guild, Proposal);
            p.serialize(this.byteQueue);
        },

        sendGuildAllianceDetails: function (Guild) {
            p = this.protocolo.BuildGuildAllianceDetails(Guild);
            p.serialize(this.byteQueue);
        },

        sendGuildPeaceDetails: function (Guild) {
            p = this.protocolo.BuildGuildPeaceDetails(Guild);
            p.serialize(this.byteQueue);
        },

        sendGuildRequestJoinerInfo: function (User) {
            p = this.protocolo.BuildGuildRequestJoinerInfo(User);
            p.serialize(this.byteQueue);
        },

        sendGuildAlliancePropList: function () {
            p = this.protocolo.BuildGuildAlliancePropList();
            p.serialize(this.byteQueue);
        },

        sendGuildPeacePropList: function () {
            p = this.protocolo.BuildGuildPeacePropList();
            p.serialize(this.byteQueue);
        },

        sendGuildDeclareWar: function (Guild) {
            p = this.protocolo.BuildGuildDeclareWar(Guild);
            p.serialize(this.byteQueue);
        },

        sendGuildNewWebsite: function (Website) {
            p = this.protocolo.BuildGuildNewWebsite(Website);
            p.serialize(this.byteQueue);
        },

        sendGuildAcceptNewMember: function (UserName) {
            p = this.protocolo.BuildGuildAcceptNewMember(UserName);
            p.serialize(this.byteQueue);
        },

        sendGuildRejectNewMember: function (UserName, Reason) {
            p = this.protocolo.BuildGuildRejectNewMember(UserName, Reason);
            p.serialize(this.byteQueue);
        },

        sendGuildKickMember: function (UserName) {
            p = this.protocolo.BuildGuildKickMember(UserName);
            p.serialize(this.byteQueue);
        },

        sendGuildUpdateNews: function (News) {
            p = this.protocolo.BuildGuildUpdateNews(News);
            p.serialize(this.byteQueue);
        },

        sendGuildMemberInfo: function (UserName) {
            p = this.protocolo.BuildGuildMemberInfo(UserName);
            p.serialize(this.byteQueue);
        },

        sendGuildOpenElections: function () {
            p = this.protocolo.BuildGuildOpenElections();
            p.serialize(this.byteQueue);
        },

        sendGuildRequestMembership: function (Guild, Application) {
            p = this.protocolo.BuildGuildRequestMembership(Guild, Application);
            p.serialize(this.byteQueue);
        },

        sendGuildRequestDetails: function (Guild) {
            p = this.protocolo.BuildGuildRequestDetails(Guild);
            p.serialize(this.byteQueue);
        },

        sendOnline: function () {
            p = this.protocolo.BuildOnline();
            p.serialize(this.byteQueue);
        },

        sendQuit: function () {
            p = this.protocolo.BuildQuit();
            p.serialize(this.byteQueue);
        },

        sendGuildLeave: function () {
            p = this.protocolo.BuildGuildLeave();
            p.serialize(this.byteQueue);
        },

        sendRequestAccountState: function () {
            p = this.protocolo.BuildRequestAccountState();
            p.serialize(this.byteQueue);
        },

        sendPetStand: function () {
            p = this.protocolo.BuildPetStand();
            p.serialize(this.byteQueue);
        },

        sendPetFollow: function () {
            p = this.protocolo.BuildPetFollow();
            p.serialize(this.byteQueue);
        },

        sendReleasePet: function () {
            p = this.protocolo.BuildReleasePet();
            p.serialize(this.byteQueue);
        },

        sendTrainList: function () {
            p = this.protocolo.BuildTrainList();
            p.serialize(this.byteQueue);
        },

        sendRest: function () {
            p = this.protocolo.BuildRest();
            p.serialize(this.byteQueue);
        },

        sendMeditate: function () {
            p = this.protocolo.BuildMeditate();
            p.serialize(this.byteQueue);
        },

        sendResucitate: function () {
            p = this.protocolo.BuildResucitate();
            p.serialize(this.byteQueue);
        },

        sendHeal: function () {
            p = this.protocolo.BuildHeal();
            p.serialize(this.byteQueue);
        },

        sendHelp: function () {
            p = this.protocolo.BuildHelp();
            p.serialize(this.byteQueue);
        },

        sendRequestStats: function () {
            p = this.protocolo.BuildRequestStats();
            p.serialize(this.byteQueue);
        },

        sendCommerceStart: function () {
            p = this.protocolo.BuildCommerceStart();
            p.serialize(this.byteQueue);
        },

        sendBankStart: function () {
            p = this.protocolo.BuildBankStart();
            p.serialize(this.byteQueue);
        },

        sendEnlist: function () {
            p = this.protocolo.BuildEnlist();
            p.serialize(this.byteQueue);
        },

        sendInformation: function () {
            p = this.protocolo.BuildInformation();
            p.serialize(this.byteQueue);
        },

        sendReward: function () {
            p = this.protocolo.BuildReward();
            p.serialize(this.byteQueue);
        },

        sendRequestMOTD: function () {
            p = this.protocolo.BuildRequestMOTD();
            p.serialize(this.byteQueue);
        },

        sendUpTime: function () {
            p = this.protocolo.BuildUpTime();
            p.serialize(this.byteQueue);
        },

        sendPartyLeave: function () {
            p = this.protocolo.BuildPartyLeave();
            p.serialize(this.byteQueue);
        },

        sendPartyCreate: function () {
            p = this.protocolo.BuildPartyCreate();
            p.serialize(this.byteQueue);
        },

        sendPartyJoin: function () {
            p = this.protocolo.BuildPartyJoin();
            p.serialize(this.byteQueue);
        },

        sendInquiry: function () {
            p = this.protocolo.BuildInquiry();
            p.serialize(this.byteQueue);
        },

        sendGuildMessage: function (Chat) {
            p = this.protocolo.BuildGuildMessage(Chat);
            p.serialize(this.byteQueue);
        },

        sendPartyMessage: function (Chat) {
            p = this.protocolo.BuildPartyMessage(Chat);
            p.serialize(this.byteQueue);
        },

        sendCentinelReport: function (Code) {
            p = this.protocolo.BuildCentinelReport(Code);
            p.serialize(this.byteQueue);
        },

        sendGuildOnline: function () {
            p = this.protocolo.BuildGuildOnline();
            p.serialize(this.byteQueue);
        },

        sendPartyOnline: function () {
            p = this.protocolo.BuildPartyOnline();
            p.serialize(this.byteQueue);
        },

        sendCouncilMessage: function (Chat) {
            p = this.protocolo.BuildCouncilMessage(Chat);
            p.serialize(this.byteQueue);
        },

        sendRoleMasterRequest: function (Request) {
            p = this.protocolo.BuildRoleMasterRequest(Request);
            p.serialize(this.byteQueue);
        },

        sendGMRequest: function () {
            p = this.protocolo.BuildGMRequest();
            p.serialize(this.byteQueue);
        },

        sendBugReport: function (Report) {
            p = this.protocolo.BuildBugReport(Report);
            p.serialize(this.byteQueue);
        },

        sendChangeDescription: function (Description) {
            p = this.protocolo.BuildChangeDescription(Description);
            p.serialize(this.byteQueue);
        },

        sendGuildVote: function (Vote) {
            p = this.protocolo.BuildGuildVote(Vote);
            p.serialize(this.byteQueue);
        },

        sendPunishments: function (Name) {
            p = this.protocolo.BuildPunishments(Name);
            p.serialize(this.byteQueue);
        },

        sendChangePassword: function (OldPass, NewPass) {
            p = this.protocolo.BuildChangePassword(OldPass, NewPass);
            p.serialize(this.byteQueue);
        },

        sendGamble: function (Amount) {
            p = this.protocolo.BuildGamble(Amount);
            p.serialize(this.byteQueue);
        },

        sendInquiryVote: function (Opt) {
            p = this.protocolo.BuildInquiryVote(Opt);
            p.serialize(this.byteQueue);
        },

        sendLeaveFaction: function () {
            p = this.protocolo.BuildLeaveFaction();
            p.serialize(this.byteQueue);
        },

        sendBankExtractGold: function (Amount) {
            p = this.protocolo.BuildBankExtractGold(Amount);
            p.serialize(this.byteQueue);
        },

        sendBankDepositGold: function (Amount) {
            p = this.protocolo.BuildBankDepositGold(Amount);
            p.serialize(this.byteQueue);
        },

        sendDenounce: function (Text) {
            p = this.protocolo.BuildDenounce(Text);
            p.serialize(this.byteQueue);
        },

        sendGuildFundate: function () {
            p = this.protocolo.BuildGuildFundate();
            p.serialize(this.byteQueue);
        },

        sendGuildFundation: function (ClanType) {
            p = this.protocolo.BuildGuildFundation(ClanType);
            p.serialize(this.byteQueue);
        },

        sendPartyKick: function (UserName) {
            p = this.protocolo.BuildPartyKick(UserName);
            p.serialize(this.byteQueue);
        },

        sendPartySetLeader: function (UserName) {
            p = this.protocolo.BuildPartySetLeader(UserName);
            p.serialize(this.byteQueue);
        },

        sendPartyAcceptMember: function (UserName) {
            p = this.protocolo.BuildPartyAcceptMember(UserName);
            p.serialize(this.byteQueue);
        },

        sendPing: function () {
            p = this.protocolo.BuildPing();
            p.serialize(this.byteQueue);
        },

        sendRequestPartyForm: function () {
            p = this.protocolo.BuildRequestPartyForm();
            p.serialize(this.byteQueue);
        },

        sendItemUpgrade: function (ItemIndex) {
            p = this.protocolo.BuildItemUpgrade(ItemIndex);
            p.serialize(this.byteQueue);
        },

        sendGMCommands: function () {
            p = this.protocolo.BuildGMCommands();
            p.serialize(this.byteQueue);
        },

        sendInitCrafting: function (TotalItems, ItemsPorCiclo) {
            p = this.protocolo.BuildInitCrafting(TotalItems, ItemsPorCiclo);
            p.serialize(this.byteQueue);
        },

        sendHome: function () {
            p = this.protocolo.BuildHome();
            p.serialize(this.byteQueue);
        },

        sendShowGuildNews: function () {
            p = this.protocolo.BuildShowGuildNews();
            p.serialize(this.byteQueue);
        },

        sendShareNpc: function () {
            p = this.protocolo.BuildShareNpc();
            p.serialize(this.byteQueue);
        },

        sendStopSharingNpc: function () {
            p = this.protocolo.BuildStopSharingNpc();
            p.serialize(this.byteQueue);
        },

        sendConsultation: function () {
            p = this.protocolo.BuildConsultation();
            p.serialize(this.byteQueue);
        },

        sendMoveItem: function (OldSlot, NewSlot) {
            p = this.protocolo.BuildMoveItem(OldSlot, NewSlot);
            p.serialize(this.byteQueue);
        },

        sendGMMessage: function (Chat) {
            p = this.protocolo.BuildGMMessage(Chat);
            p.serialize(this.byteQueue);
        },

        sendShowName: function () {
            p = this.protocolo.BuildShowName();
            p.serialize(this.byteQueue);
        },

        sendOnlineRoyalArmy: function () {
            p = this.protocolo.BuildOnlineRoyalArmy();
            p.serialize(this.byteQueue);
        },

        sendOnlineChaosLegion: function () {
            p = this.protocolo.BuildOnlineChaosLegion();
            p.serialize(this.byteQueue);
        },

        sendGoNearby: function (UserName) {
            p = this.protocolo.BuildGoNearby(UserName);
            p.serialize(this.byteQueue);
        },

        sendComment: function (Data) {
            p = this.protocolo.BuildComment(Data);
            p.serialize(this.byteQueue);
        },

        sendServerTime: function () {
            p = this.protocolo.BuildServerTime();
            p.serialize(this.byteQueue);
        },

        sendWhere: function (UserName) {
            p = this.protocolo.BuildWhere(UserName);
            p.serialize(this.byteQueue);
        },

        sendCreaturesInMap: function (Map) {
            p = this.protocolo.BuildCreaturesInMap(Map);
            p.serialize(this.byteQueue);
        },

        sendWarpMeToTarget: function () {
            p = this.protocolo.BuildWarpMeToTarget();
            p.serialize(this.byteQueue);
        },

        sendWarpChar: function (UserName, Map, X, Y) {
            p = this.protocolo.BuildWarpChar(UserName, Map, X, Y);
            p.serialize(this.byteQueue);
        },

        sendSilence: function (UserName) {
            p = this.protocolo.BuildSilence(UserName);
            p.serialize(this.byteQueue);
        },

        sendSOSShowList: function () {
            p = this.protocolo.BuildSOSShowList();
            p.serialize(this.byteQueue);
        },

        sendSOSRemove: function (UserName) {
            p = this.protocolo.BuildSOSRemove(UserName);
            p.serialize(this.byteQueue);
        },

        sendGoToChar: function (UserName) {
            p = this.protocolo.BuildGoToChar(UserName);
            p.serialize(this.byteQueue);
        },

        sendInvisible: function () {
            p = this.protocolo.BuildInvisible();
            p.serialize(this.byteQueue);
        },

        sendGMPanel: function () {
            p = this.protocolo.BuildGMPanel();
            p.serialize(this.byteQueue);
        },

        sendRequestUserList: function () {
            p = this.protocolo.BuildRequestUserList();
            p.serialize(this.byteQueue);
        },

        sendWorking: function () {
            p = this.protocolo.BuildWorking();
            p.serialize(this.byteQueue);
        },

        sendHiding: function () {
            p = this.protocolo.BuildHiding();
            p.serialize(this.byteQueue);
        },

        sendJail: function (UserName, Reason, JailTime) {
            p = this.protocolo.BuildJail(UserName, Reason, JailTime);
            p.serialize(this.byteQueue);
        },

        sendKillNPC: function () {
            p = this.protocolo.BuildKillNPC();
            p.serialize(this.byteQueue);
        },

        sendWarnUser: function (UserName, Reason) {
            p = this.protocolo.BuildWarnUser(UserName, Reason);
            p.serialize(this.byteQueue);
        },

        sendEditChar: function (UserName, Opcion, Arg1, Arg2) {
            p = this.protocolo.BuildEditChar(UserName, Opcion, Arg1, Arg2);
            p.serialize(this.byteQueue);
        },

        sendRequestCharInfo: function (TargetName) {
            p = this.protocolo.BuildRequestCharInfo(TargetName);
            p.serialize(this.byteQueue);
        },

        sendRequestCharStats: function (UserName) {
            p = this.protocolo.BuildRequestCharStats(UserName);
            p.serialize(this.byteQueue);
        },

        sendRequestCharGold: function (UserName) {
            p = this.protocolo.BuildRequestCharGold(UserName);
            p.serialize(this.byteQueue);
        },

        sendRequestCharInventory: function (UserName) {
            p = this.protocolo.BuildRequestCharInventory(UserName);
            p.serialize(this.byteQueue);
        },

        sendRequestCharBank: function (UserName) {
            p = this.protocolo.BuildRequestCharBank(UserName);
            p.serialize(this.byteQueue);
        },

        sendRequestCharSkills: function (UserName) {
            p = this.protocolo.BuildRequestCharSkills(UserName);
            p.serialize(this.byteQueue);
        },

        sendReviveChar: function (UserName) {
            p = this.protocolo.BuildReviveChar(UserName);
            p.serialize(this.byteQueue);
        },

        sendOnlineGM: function () {
            p = this.protocolo.BuildOnlineGM();
            p.serialize(this.byteQueue);
        },

        sendOnlineMap: function (Map) {
            p = this.protocolo.BuildOnlineMap(Map);
            p.serialize(this.byteQueue);
        },

        sendForgive: function (UserName) {
            p = this.protocolo.BuildForgive(UserName);
            p.serialize(this.byteQueue);
        },

        sendKick: function (UserName) {
            p = this.protocolo.BuildKick(UserName);
            p.serialize(this.byteQueue);
        },

        sendExecute: function (UserName) {
            p = this.protocolo.BuildExecute(UserName);
            p.serialize(this.byteQueue);
        },

        sendBanChar: function (UserName, Reason) {
            p = this.protocolo.BuildBanChar(UserName, Reason);
            p.serialize(this.byteQueue);
        },

        sendUnbanChar: function (UserName) {
            p = this.protocolo.BuildUnbanChar(UserName);
            p.serialize(this.byteQueue);
        },

        sendNPCFollow: function () {
            p = this.protocolo.BuildNPCFollow();
            p.serialize(this.byteQueue);
        },

        sendSummonChar: function (UserName) {
            p = this.protocolo.BuildSummonChar(UserName);
            p.serialize(this.byteQueue);
        },

        sendSpawnListRequest: function () {
            p = this.protocolo.BuildSpawnListRequest();
            p.serialize(this.byteQueue);
        },

        sendSpawnCreature: function (NPC) {
            p = this.protocolo.BuildSpawnCreature(NPC);
            p.serialize(this.byteQueue);
        },

        sendResetNPCInventory: function () {
            p = this.protocolo.BuildResetNPCInventory();
            p.serialize(this.byteQueue);
        },

        sendCleanWorld: function () {
            p = this.protocolo.BuildCleanWorld();
            p.serialize(this.byteQueue);
        },

        sendServerMessage: function (Message) {
            p = this.protocolo.BuildServerMessage(Message);
            p.serialize(this.byteQueue);
        },

        sendNickToIP: function (UserName) {
            p = this.protocolo.BuildNickToIP(UserName);
            p.serialize(this.byteQueue);
        },

        sendIPToNick: function (A, B, C, D) {
            p = this.protocolo.BuildIPToNick(A, B, C, D);
            p.serialize(this.byteQueue);
        },

        sendGuildOnlineMembers: function (GuildName) {
            p = this.protocolo.BuildGuildOnlineMembers(GuildName);
            p.serialize(this.byteQueue);
        },

        sendTeleportCreate: function (Map, X, Y, Radio) {
            p = this.protocolo.BuildTeleportCreate(Map, X, Y, Radio);
            p.serialize(this.byteQueue);
        },

        sendTeleportDestroy: function () {
            p = this.protocolo.BuildTeleportDestroy();
            p.serialize(this.byteQueue);
        },

        sendRainToggle: function () {
            p = this.protocolo.BuildRainToggle();
            p.serialize(this.byteQueue);
        },

        sendSetCharDescription: function (Description) {
            p = this.protocolo.BuildSetCharDescription(Description);
            p.serialize(this.byteQueue);
        },

        sendForceMIDIToMap: function (MidiID, Map) {
            p = this.protocolo.BuildForceMIDIToMap(MidiID, Map);
            p.serialize(this.byteQueue);
        },

        sendForceWAVEToMap: function (Wave, Map, X, Y) {
            p = this.protocolo.BuildForceWAVEToMap(Wave, Map, X, Y);
            p.serialize(this.byteQueue);
        },

        sendRoyalArmyMessage: function (Message) {
            p = this.protocolo.BuildRoyalArmyMessage(Message);
            p.serialize(this.byteQueue);
        },

        sendChaosLegionMessage: function (Message) {
            p = this.protocolo.BuildChaosLegionMessage(Message);
            p.serialize(this.byteQueue);
        },

        sendCitizenMessage: function (Message) {
            p = this.protocolo.BuildCitizenMessage(Message);
            p.serialize(this.byteQueue);
        },

        sendCriminalMessage: function (Message) {
            p = this.protocolo.BuildCriminalMessage(Message);
            p.serialize(this.byteQueue);
        },

        sendTalkAsNPC: function (Message) {
            p = this.protocolo.BuildTalkAsNPC(Message);
            p.serialize(this.byteQueue);
        },

        sendDestroyAllItemsInArea: function () {
            p = this.protocolo.BuildDestroyAllItemsInArea();
            p.serialize(this.byteQueue);
        },

        sendAcceptRoyalCouncilMember: function (UserName) {
            p = this.protocolo.BuildAcceptRoyalCouncilMember(UserName);
            p.serialize(this.byteQueue);
        },

        sendAcceptChaosCouncilMember: function (UserName) {
            p = this.protocolo.BuildAcceptChaosCouncilMember(UserName);
            p.serialize(this.byteQueue);
        },

        sendItemsInTheFloor: function () {
            p = this.protocolo.BuildItemsInTheFloor();
            p.serialize(this.byteQueue);
        },

        sendMakeDumb: function (UserName) {
            p = this.protocolo.BuildMakeDumb(UserName);
            p.serialize(this.byteQueue);
        },

        sendMakeDumbNoMore: function (UserName) {
            p = this.protocolo.BuildMakeDumbNoMore(UserName);
            p.serialize(this.byteQueue);
        },

        sendDumpIPTables: function () {
            p = this.protocolo.BuildDumpIPTables();
            p.serialize(this.byteQueue);
        },

        sendCouncilKick: function (UserName) {
            p = this.protocolo.BuildCouncilKick(UserName);
            p.serialize(this.byteQueue);
        },

        sendSetTrigger: function (Trigger) {
            p = this.protocolo.BuildSetTrigger(Trigger);
            p.serialize(this.byteQueue);
        },

        sendAskTrigger: function () {
            p = this.protocolo.BuildAskTrigger();
            p.serialize(this.byteQueue);
        },

        sendBannedIPList: function () {
            p = this.protocolo.BuildBannedIPList();
            p.serialize(this.byteQueue);
        },

        sendBannedIPReload: function () {
            p = this.protocolo.BuildBannedIPReload();
            p.serialize(this.byteQueue);
        },

        sendGuildMemberList: function (GuildName) {
            p = this.protocolo.BuildGuildMemberList(GuildName);
            p.serialize(this.byteQueue);
        },

        sendGuildBan: function (GuildName) {
            p = this.protocolo.BuildGuildBan(GuildName);
            p.serialize(this.byteQueue);
        },

        sendBanIP: function (IP, Reason) {
            p = this.protocolo.BuildBanIP(IP, Reason);
            p.serialize(this.byteQueue);
        },

        sendUnbanIP: function (IP) {
            p = this.protocolo.BuildUnbanIP(IP);
            p.serialize(this.byteQueue);
        },

        sendCreateItem: function (Item) {
            p = this.protocolo.BuildCreateItem(Item);
            p.serialize(this.byteQueue);
        },

        sendDestroyItems: function () {
            p = this.protocolo.BuildDestroyItems();
            p.serialize(this.byteQueue);
        },

        sendChaosLegionKick: function (UserName, Reason) {
            p = this.protocolo.BuildChaosLegionKick(UserName, Reason);
            p.serialize(this.byteQueue);
        },

        sendRoyalArmyKick: function (UserName, Reason) {
            p = this.protocolo.BuildRoyalArmyKick(UserName, Reason);
            p.serialize(this.byteQueue);
        },

        sendForceMIDIAll: function (MidiID) {
            p = this.protocolo.BuildForceMIDIAll(MidiID);
            p.serialize(this.byteQueue);
        },

        sendForceWAVEAll: function (WaveID) {
            p = this.protocolo.BuildForceWAVEAll(WaveID);
            p.serialize(this.byteQueue);
        },

        sendRemovePunishment: function (UserName, Punishment, NewText) {
            p = this.protocolo.BuildRemovePunishment(UserName, Punishment, NewText);
            p.serialize(this.byteQueue);
        },

        sendTileBlockedToggle: function () {
            p = this.protocolo.BuildTileBlockedToggle();
            p.serialize(this.byteQueue);
        },

        sendKillNPCNoRespawn: function () {
            p = this.protocolo.BuildKillNPCNoRespawn();
            p.serialize(this.byteQueue);
        },

        sendKillAllNearbyNPCs: function () {
            p = this.protocolo.BuildKillAllNearbyNPCs();
            p.serialize(this.byteQueue);
        },

        sendLastIP: function (UserName) {
            p = this.protocolo.BuildLastIP(UserName);
            p.serialize(this.byteQueue);
        },

        sendChangeMOTD: function () {
            p = this.protocolo.BuildChangeMOTD();
            p.serialize(this.byteQueue);
        },

        sendSetMOTD: function (Motd) {
            p = this.protocolo.BuildSetMOTD(Motd);
            p.serialize(this.byteQueue);
        },

        sendSystemMessage: function (Message) {
            p = this.protocolo.BuildSystemMessage(Message);
            p.serialize(this.byteQueue);
        },

        sendCreateNPC: function (NpcIndex) {
            p = this.protocolo.BuildCreateNPC(NpcIndex);
            p.serialize(this.byteQueue);
        },

        sendCreateNPCWithRespawn: function (NpcIndex) {
            p = this.protocolo.BuildCreateNPCWithRespawn(NpcIndex);
            p.serialize(this.byteQueue);
        },

        sendImperialArmour: function (Index, ObjIndex) {
            p = this.protocolo.BuildImperialArmour(Index, ObjIndex);
            p.serialize(this.byteQueue);
        },

        sendChaosArmour: function (Index, ObjIndex) {
            p = this.protocolo.BuildChaosArmour(Index, ObjIndex);
            p.serialize(this.byteQueue);
        },

        sendNavigateToggle: function () {
            p = this.protocolo.BuildNavigateToggle();
            p.serialize(this.byteQueue);
        },

        sendServerOpenToUsersToggle: function () {
            p = this.protocolo.BuildServerOpenToUsersToggle();
            p.serialize(this.byteQueue);
        },

        sendTurnOffServer: function () {
            p = this.protocolo.BuildTurnOffServer();
            p.serialize(this.byteQueue);
        },

        sendTurnCriminal: function (UserName) {
            p = this.protocolo.BuildTurnCriminal(UserName);
            p.serialize(this.byteQueue);
        },

        sendResetFactions: function (UserName) {
            p = this.protocolo.BuildResetFactions(UserName);
            p.serialize(this.byteQueue);
        },

        sendRemoveCharFromGuild: function (UserName) {
            p = this.protocolo.BuildRemoveCharFromGuild(UserName);
            p.serialize(this.byteQueue);
        },

        sendRequestCharMail: function (UserName) {
            p = this.protocolo.BuildRequestCharMail(UserName);
            p.serialize(this.byteQueue);
        },

        sendAlterPassword: function (UserName, CopyFrom) {
            p = this.protocolo.BuildAlterPassword(UserName, CopyFrom);
            p.serialize(this.byteQueue);
        },

        sendAlterMail: function (UserName, NewMail) {
            p = this.protocolo.BuildAlterMail(UserName, NewMail);
            p.serialize(this.byteQueue);
        },

        sendAlterName: function (UserName, NewName) {
            p = this.protocolo.BuildAlterName(UserName, NewName);
            p.serialize(this.byteQueue);
        },

        sendToggleCentinelActivated: function () {
            p = this.protocolo.BuildToggleCentinelActivated();
            p.serialize(this.byteQueue);
        },

        sendDoBackUp: function () {
            p = this.protocolo.BuildDoBackUp();
            p.serialize(this.byteQueue);
        },

        sendShowGuildMessages: function (GuildName) {
            p = this.protocolo.BuildShowGuildMessages(GuildName);
            p.serialize(this.byteQueue);
        },

        sendSaveMap: function () {
            p = this.protocolo.BuildSaveMap();
            p.serialize(this.byteQueue);
        },

        sendChangeMapInfoPK: function (Pk) {
            p = this.protocolo.BuildChangeMapInfoPK(Pk);
            p.serialize(this.byteQueue);
        },

        sendChangeMapInfoBackup: function (Backup) {
            p = this.protocolo.BuildChangeMapInfoBackup(Backup);
            p.serialize(this.byteQueue);
        },

        sendChangeMapInfoRestricted: function (RestrictedTo) {
            p = this.protocolo.BuildChangeMapInfoRestricted(RestrictedTo);
            p.serialize(this.byteQueue);
        },

        sendChangeMapInfoNoMagic: function (NoMagic) {
            p = this.protocolo.BuildChangeMapInfoNoMagic(NoMagic);
            p.serialize(this.byteQueue);
        },

        sendChangeMapInfoNoInvi: function (NoInvi) {
            p = this.protocolo.BuildChangeMapInfoNoInvi(NoInvi);
            p.serialize(this.byteQueue);
        },

        sendChangeMapInfoNoResu: function (NoResu) {
            p = this.protocolo.BuildChangeMapInfoNoResu(NoResu);
            p.serialize(this.byteQueue);
        },

        sendChangeMapInfoLand: function (Data) {
            p = this.protocolo.BuildChangeMapInfoLand(Data);
            p.serialize(this.byteQueue);
        },

        sendChangeMapInfoZone: function (Data) {
            p = this.protocolo.BuildChangeMapInfoZone(Data);
            p.serialize(this.byteQueue);
        },

        sendChangeMapInfoStealNpc: function (RoboNpc) {
            p = this.protocolo.BuildChangeMapInfoStealNpc(RoboNpc);
            p.serialize(this.byteQueue);
        },

        sendChangeMapInfoNoOcultar: function (NoOcultar) {
            p = this.protocolo.BuildChangeMapInfoNoOcultar(NoOcultar);
            p.serialize(this.byteQueue);
        },

        sendChangeMapInfoNoInvocar: function (NoInvocar) {
            p = this.protocolo.BuildChangeMapInfoNoInvocar(NoInvocar);
            p.serialize(this.byteQueue);
        },

        sendSaveChars: function () {
            p = this.protocolo.BuildSaveChars();
            p.serialize(this.byteQueue);
        },

        sendCleanSOS: function () {
            p = this.protocolo.BuildCleanSOS();
            p.serialize(this.byteQueue);
        },

        sendShowServerForm: function () {
            p = this.protocolo.BuildShowServerForm();
            p.serialize(this.byteQueue);
        },

        sendNight: function () {
            p = this.protocolo.BuildNight();
            p.serialize(this.byteQueue);
        },

        sendKickAllChars: function () {
            p = this.protocolo.BuildKickAllChars();
            p.serialize(this.byteQueue);
        },

        sendReloadNPCs: function () {
            p = this.protocolo.BuildReloadNPCs();
            p.serialize(this.byteQueue);
        },

        sendReloadServerIni: function () {
            p = this.protocolo.BuildReloadServerIni();
            p.serialize(this.byteQueue);
        },

        sendReloadSpells: function () {
            p = this.protocolo.BuildReloadSpells();
            p.serialize(this.byteQueue);
        },

        sendReloadObjects: function () {
            p = this.protocolo.BuildReloadObjects();
            p.serialize(this.byteQueue);
        },

        sendRestart: function () {
            p = this.protocolo.BuildRestart();
            p.serialize(this.byteQueue);
        },

        sendResetAutoUpdate: function () {
            p = this.protocolo.BuildResetAutoUpdate();
            p.serialize(this.byteQueue);
        },

        sendChatColor: function (R, G, B) {
            p = this.protocolo.BuildChatColor(R, G, B);
            p.serialize(this.byteQueue);
        },

        sendIgnored: function () {
            p = this.protocolo.BuildIgnored();
            p.serialize(this.byteQueue);
        },

        sendCheckSlot: function (UserName, Slot) {
            p = this.protocolo.BuildCheckSlot(UserName, Slot);
            p.serialize(this.byteQueue);
        },

        sendSetIniVar: function (Seccion, Clave, Valor) {
            p = this.protocolo.BuildSetIniVar(Seccion, Clave, Valor);
            p.serialize(this.byteQueue);
        },

        sendCreatePretorianClan: function (Map, X, Y) {
            p = this.protocolo.BuildCreatePretorianClan(Map, X, Y);
            p.serialize(this.byteQueue);
        },

        sendRemovePretorianClan: function (Map) {
            p = this.protocolo.BuildRemovePretorianClan(Map);
            p.serialize(this.byteQueue);
        },

        sendEnableDenounces: function () {
            p = this.protocolo.BuildEnableDenounces();
            p.serialize(this.byteQueue);
        },

        sendShowDenouncesList: function () {
            p = this.protocolo.BuildShowDenouncesList();
            p.serialize(this.byteQueue);
        },

        sendMapMessage: function (Message) {
            p = this.protocolo.BuildMapMessage(Message);
            p.serialize(this.byteQueue);
        },

        sendSetDialog: function (Message) {
            p = this.protocolo.BuildSetDialog(Message);
            p.serialize(this.byteQueue);
        },

        sendImpersonate: function () {
            p = this.protocolo.BuildImpersonate();
            p.serialize(this.byteQueue);
        },

        sendImitate: function () {
            p = this.protocolo.BuildImitate();
            p.serialize(this.byteQueue);
        },

        sendRecordAdd: function (UserName, Reason) {
            p = this.protocolo.BuildRecordAdd(UserName, Reason);
            p.serialize(this.byteQueue);
        },

        sendRecordRemove: function (Index) {
            p = this.protocolo.BuildRecordRemove(Index);
            p.serialize(this.byteQueue);
        },

        sendRecordAddObs: function (Index, Obs) {
            p = this.protocolo.BuildRecordAddObs(Index, Obs);
            p.serialize(this.byteQueue);
        },

        sendRecordListRequest: function () {
            p = this.protocolo.BuildRecordListRequest();
            p.serialize(this.byteQueue);
        },

        sendRecordDetailsRequest: function (Index) {
            p = this.protocolo.BuildRecordDetailsRequest(Index);
            p.serialize(this.byteQueue);
        },

        sendAlterGuildName: function (OldGuildName, NewGuildName) {
            p = this.protocolo.BuildAlterGuildName(OldGuildName, NewGuildName);
            p.serialize(this.byteQueue);
        },

        sendHigherAdminsMessage: function (Message) {
            p = this.protocolo.BuildHigherAdminsMessage(Message);
            p.serialize(this.byteQueue);
        }
    });

    return GameClient;
});
