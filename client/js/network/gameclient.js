define(['../utils/util', 'enums', 'font', 'network/protocol', 'network/bytequeue', 'lib/websock', 'json!../../config.json'], function (Utils, Enums, Font, Protocolo, ByteQueue, __websock, config) {

    class GameClient {
        constructor(game, uiManager, gameUI) {
            this.VER_A = config.version.split(".")[0];
            this.VER_B = config.version.split(".")[1];
            this.VER_C = config.version.split(".")[2];

            this.game = game;

            this.uiManager = uiManager;
            this.gameUI = gameUI;
            this.conectado = false;

            this.protocolo = new Protocolo();
            this.ws = new Websock();
            this.byteQueue = new ByteQueue(this.ws);

        }

        _connect(conectarse_callback) {
            this.ws.open("ws://" + config.ip + ":" + config.port);
            //this.ws.open("wss://dakaraonline.tk:443");
            //this.ws.open("ws://localhost:8666");
            var self = this;
            this.ws.on('open', function () {
                self.conectado = true;
                conectarse_callback();
            });

            this.ws.on('message', function () {
                try {
                    while (self.byteQueue.length() > 0) {
                        self.protocolo.ServerPacketDecodeAndDispatch(self.byteQueue, self);
                    }
                } catch (e) {
                    alert(' Reporte de error - ' + e.name + ': ' + e.message + " - " + e.stack); // TODO: DESCOMENTAR
                    log.error(' Reporte de error - ' + e.name + ': ' + e.message + " - " + e.stack);
                }
            });
            this.ws.on('close', function () {
                self.conectado = false;
                self.disconnect_callback();
            });

        }

        _desconectar() {
            this.ws.close();
        }

        intentarLogear(nombre, pw) {
            if (!this.conectado) {
                var self = this;
                this._connect(function () {
                    self.sendLoginExistingChar(nombre, pw);
                });
            }
            else {
                this.sendLoginExistingChar(nombre, pw);
            }
        }

        intentarCrearPersonaje(callback) {
            if (!this.conectado) {
                var self = this;
                this._connect(function () {
                    callback();
                    self.sendThrowDices();
                });
            }
            else {
                callback();
                this.sendThrowDices();
            }
        }

        setDisconnectCallback(disconnect_callback) {
            this.disconnect_callback = disconnect_callback;
        }

        setLogeadoCallback(logeado_callback) {
            this.logeado_callback = logeado_callback;
        }

        setDadosCallback(dadosCallback) {
            this.dados_callback = dadosCallback;
        }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        handleLogged(Clase) {
            this.game.actualizarBajoTecho();

            this.logeado_callback();
        }

        handleRemoveDialogs() {
            this.game.sacarAllCharacterChats();
        }

        handleRemoveCharDialog(CharIndex) {
            this.game.sacarChatCharacterByID(CharIndex);
        }

        handleNavigateToggle() {
            this.game.playerState.navegando = !this.game.playerState.navegando;
        }

        handleDisconnect() {
            this._desconectar();
        }

        handleCommerceEnd() {
            this.gameUI.hideComerciar(true);
        }

        handleBankEnd() {
            this.gameUI.hideBoveda(true);
        }

        handleCommerceInit() {
            this.gameUI.showComerciar();
        }

        handleBankInit(Banco) {
            this.gameUI.showBoveda();
            this.gameUI.boveda.setOroDisponible(Banco);
        }

        handleUserCommerceInit(DestUserName) {
            log.network("TODO: handleUserCommerceInit ");
        }

        handleUserCommerceEnd() {
            log.network("TODO: handleUserCommerceEnd ");
        }

        handleUserOfferConfirm() {
            log.network("TODO: handleUserOfferConfirm ");
        }

        handleCommerceChat(Chat, FontIndex) {
            log.network("TODO: handleCommerceChat ");
        }

        handleShowBlacksmithForm() {
            log.network("TODO: handleShowBlacksmithForm ");
        }

        handleShowCarpenterForm() {
            log.network("TODO: handleShowCarpenterForm ");
        }

        handleUpdateSta(Value) {
            this.game.atributos.setStamina(Value);
        }

        handleUpdateMana(Value) {
            this.game.atributos.setMana(Value);
        }

        handleUpdateHP(Value) {
            this.game.atributos.setVida(Value);
        }

        handleUpdateGold(Value) {
            this.game.atributos.setOro(Value);
        }

        handleUpdateBankGold(Value) {
            this.gameUI.boveda.setOroDisponible(Value);
        }

        handleUpdateExp(Value) {
            this.game.atributos.setExp(Value);
        }

        handleChangeMap(Map, Version) {
            this.game.cambiarMapa(Map);
        }

        handlePosUpdate(X, Y) {
            this.game.resetPosCharacter(this.game.player.id, X, Y);
        }

        handleChatOverHead(Chat, CharIndex, R, G, B) {
            this.game.escribirChat(Chat, CharIndex, R, G, B);
        }

        handleConsoleMsg(Chat, FontIndex) {
            this.game.escribirMsgConsola(Chat, Font[Font.Index[FontIndex]]);
        }

        handleGuildChat(Chat) {
            this.game.escribirMsgConsola(Chat, Font.CLAN_CHAT);
        }

        handleShowMessageBox(Chat) {
            this.uiManager.showMensaje(Chat);
        }

        handleUserIndexInServer(UserIndex) {
            return;
        }

        handleUserCharIndexInServer(CharIndex) {
            this.game.changePlayerIndex(CharIndex);
        }

        handleCharacterCreate(CharIndex, Body, Head, Heading, X, Y, Weapon, Shield, Helmet, FX, FXLoops, Name, NickColor, Privileges) {
            this.game.agregarCharacter(CharIndex, Body, Head, Heading, X, Y, Weapon, Shield, Helmet, FX, FXLoops, Name, NickColor, Privileges);
        }

        handleCharacterRemove(CharIndex) {
            let c = this.game.world.getCharacter(CharIndex);
            if (!c) {
                log.error("trato de sacar character inexistente");
            } else {
                this.game.sacarEntity(c);
            }
        }

        handleCharacterChangeNick(CharIndex, NewName) {
            log.network("TODO: handleCharacterChangeNick ");
        }

        handleCharacterMove(CharIndex, X, Y) {
            this.game.moverCharacter(CharIndex, X, Y);
        }

        handleForceCharMove(Direction) {
            this.game.forceCaminar(Direction);
        }

        handleCharacterChange(CharIndex, Body, Head, Heading, Weapon, Shield, Helmet, FX, FXLoops) {
            this.game.cambiarCharacter(CharIndex, Body, Head, Heading, Weapon, Shield, Helmet, FX, FXLoops);
        }

        handleObjectCreate(X, Y, GrhIndex) {
            this.game.agregarItem(GrhIndex, X, Y);
        }

        handleObjectDelete(X, Y) {
            this.game.sacarItem(X, Y);
        }

        handleBlockPosition(X, Y, Blocked) {
            this.game.map.setBlockPosition(X, Y, Blocked);
        }

        handlePlayMidi(MidiID, Loops) {
            this.game.assetManager.audio.setMusic(MidiID);
        }

        handlePlayWave(WaveID, X, Y) {
            if (( X < 0 ) || (Y < 0) || this.game.renderer.camera.isVisiblePosition(X, Y, this.game.POSICIONES_EXTRA_SONIDO)) {
                this.game.assetManager.audio.playSound(WaveID);
            }
        }

        handleGuildList(Data) {
            var nombres = Utils.splitNullArray(Data);
            this.game.gameUI.setNombresClanes(nombres);
        }

        handleAreaChanged(X, Y) {
            this.game.cambiarArea(X, Y);
        }

        handlePauseToggle() {
            this.game.togglePausa();
        }

        handleRainToggle() {
            this.game.worldState.lloviendo = !this.game.worldState.lloviendo;
        }

        handleCreateFX(CharIndex, FX, FXLoops) {
            this.game.setCharacterFX(CharIndex, FX, FXLoops);
        }

        handleUpdateUserStats(MaxHp, MinHp, MaxMan, MinMan, MaxSta, MinSta, Gld, Elv, Elu, Exp) {
            this.game.atributos.setVida(MinHp, MaxHp);
            this.game.atributos.setMana(MinMan, MaxMan);
            this.game.atributos.setStamina(MinSta, MaxSta);
            this.game.atributos.setExp(Exp, Elu);
            this.game.atributos.setOro(Gld);
            this.game.atributos.setNivel(Elv);
        }

        handleChangeInventorySlot(Slot, ObjIndex, ObjName, Amount, Equiped, GrhIndex, ObjType, MaxHit, MinHit, MaxDef, MinDef, ObjSalePrice) {
            this.game.cambiarSlotInventario(Slot, ObjIndex, ObjName, Amount, Equiped, GrhIndex, ObjType, MaxHit, MinHit, MaxDef, MinDef, ObjSalePrice);
        }

        handleChangeBankSlot(Slot, ObjIndex, ObjName, Amount, GrhIndex, ObjType, MaxHit, MinHit, MaxDef, MinDef, ObjSalePrice) {
            this.game.cambiarSlotRetirar(Slot, ObjIndex, ObjName, Amount, GrhIndex, ObjType, MaxHit, MinHit, MaxDef, MinDef, ObjSalePrice);
        }

        handleChangeSpellSlot(Slot, SpellID, Name) {
            this.game.cambiarSlotHechizos(Slot, SpellID, Name);
        }

        handleAtributes(Fuerza, Agilidad, Inteligencia, Carisma, Constitucion) {
            this.game.gameUI.setAtributosInfo(Fuerza, Agilidad, Inteligencia, Carisma, Constitucion);
        }

        handleBlacksmithWeapons(Items) {
            /*Item contiene:
             Name: Name,
             GrhIndex: GrhIndex,
             LingH: LingH,
             LingP: LingP,
             LingO: LingO,
             ArmasHerreroIndex: ArmasHerreroIndex,
             ObjUpgrade: ObjUpgrade,
             */
            this.game.gameUI.herreria.setWeapons(Items);
            this.game.gameUI.showHerreria();
        }

        handleBlacksmithArmors(Items) {
            /* Item contiene
             Name: Name,
             GrhIndex: GrhIndex,
             LingH: LingH,
             LingP: LingP,
             LingO: LingO,
             ArmasHerreroIndex: ArmasHerreroIndex,
             ObjUpgrade: ObjUpgrade,
             */
            this.game.gameUI.herreria.setArmors(Items);
            this.game.gameUI.showHerreria();
        }

        handleCarpenterObjects(Items) {
            /* Items contiene
             Name: Name,
             GrhIndex: GrhIndex,
             Madera: Madera,
             MaderaElfica: MaderaElfica,
             ObjCarpinteroIndex: ObjCarpinteroIndex,
             ObjUpgrade: ObjUpgrade,
             */
            this.game.gameUI.showCarpinteria(Items);
        }

        handleRestOK() {
            log.network("TODO: handleRestOK ");
        }

        handleErrorMsg(Message) {
            this._desconectar();
            this.uiManager.showMensaje(Message);
        }

        handleBlind() {
            log.network("TODO: handleBlind ");
        }

        handleDumb() {
            log.network("TODO: handleDumb ");
        }

        handleShowSignal(Texto, Grh) {
            log.network("TODO: handleShowSignal ");
        }

        handleChangeNPCInventorySlot(Slot, ObjName, Amount, Price, GrhIndex, ObjIndex, ObjType, MaxHit, MinHit, MaxDef, MinDef) {
            this.game.cambiarSlotCompra(Slot, ObjName, Amount, Price, GrhIndex, ObjIndex, ObjType, MaxHit, MinHit, MaxDef, MinDef);
        }

        handleUpdateHungerAndThirst(MaxAgu, MinAgu, MaxHam, MinHam) {
            this.game.atributos.setAgua(MinAgu, MaxAgu);
            this.game.atributos.setHambre(MinHam, MaxHam);
        }

        handleFame(Asesino, Bandido, Burgues, Ladron, Noble, Plebe, Promedio) {
            this.game.gameUI.setFameInfo(Asesino, Bandido, Burgues, Ladron, Noble, Plebe, Promedio);
        }

        handleMiniStats(CiudadanosMatados, CriminalesMatados, UsuariosMatados, NpcsMuertos, Clase, Pena) {
            this.game.gameUI.setMiniStats(CiudadanosMatados, CriminalesMatados, UsuariosMatados, NpcsMuertos, Clase, Pena);
        }

        handleLevelUp(SkillPoints) {
            this.game.skills.agregarSkillsLibres(SkillPoints);
        }

        handleAddForumMsg(ForumType, Title, Author, Message) {
            log.network("TODO: handleAddForumMsg ");
        }

        handleShowForumForm(Visibilidad, CanMakeSticky) {
            log.network("TODO: handleShowForumForm ");
        }

        handleSetInvisible(charIndex, invisible) {
            var char = this.game.world.getCharacter(charIndex);
            if (char) {
                this.game.renderer.setCharVisible(char, !invisible);
            }
        }

        handleDiceRoll(Fuerza, Agilidad, Inteligencia, Carisma, Constitucion) {
            this.dados_callback(Fuerza, Agilidad, Inteligencia, Carisma, Constitucion);
        }

        handleMeditateToggle() {
            this.game.playerState.meditando = !this.game.playerState.meditando;
        }

        handleBlindNoMore() {
            log.network("TODO: handleBlindNoMore ");
        }

        handleDumbNoMore() {
            log.network("TODO: handleDumbNoMore ");
        }

        handleSendSkills(Skills) {
            this.game.skills.setSkills(Skills);
            this.uiManager.gameUI.updateSkillsData();
        }

        handleTrainerCreatureList(Data) {
            log.network("TODO: handleTrainerCreatureList ");
        }

        handleGuildNews(News, EnemiesList, AlliesList) {
            let enemigos = Utils.splitNullArray(EnemiesList);
            let aliados = Utils.splitNullArray(AlliesList);
            this.game.gameUI.showNoticiasClan(News, enemigos, aliados);
        }

        handleOfferDetails(Details) {
            log.network("TODO: handleOfferDetails ");
        }

        handleAlianceProposalsList(Data) {
            log.network("TODO: handleAlianceProposalsList ");
        }

        handlePeaceProposalsList(Data) {
            log.network("TODO: handlePeaceProposalsList ");
        }

        handleCharacterInfo(CharName, Race, Class, Gender, Level, Gold, Bank, Reputation, PreviousPetitions, CurrentGuild, PreviousGuilds, RoyalArmy, ChaosLegion, CiudadanosMatados, CriminalesMatados) {
            let previousGuilds = /*Utils.joinNullArray*/(PreviousGuilds);
            let previousPetitions = /*Utils.joinNullArray*/(PreviousPetitions);
            this.game.gameUI.showDetallesPersonaje(CharName, Race, Class, Gender, Level, Gold, Bank, Reputation, previousPetitions, CurrentGuild, previousGuilds, RoyalArmy, ChaosLegion, CiudadanosMatados, CriminalesMatados);
        }

        handleGuildLeaderInfo(GuildList, MemberList, GuildNews, JoinRequests) {
            //TODO: usar GuildNews
            this.handleGuildMemberInfo(GuildList, MemberList);
            log.error(aspirantes);
            var aspirantes = Utils.splitNullArray(JoinRequests);
            if (aspirantes[0]) {
                this.game.gameUI.clanes.setNombresSolicitantes(aspirantes);
            } else{
                this.game.gameUI.clanes.setNombresSolicitantes([]);
            }
        }

        handleGuildMemberInfo(GuildList, MemberList) {
            this.handleGuildList(GuildList);
            var nombresMiembros = Utils.splitNullArray(MemberList);
            this.game.gameUI.clanes.setNombresMiembros(nombresMiembros);
        }

        handleGuildDetails(GuildName, Founder, FoundationDate, Leader, URL, MemberCount, ElectionsOpen, Aligment, EnemiesCount, AlliesCount, AntifactionPoints, Codex, GuildDesc) {
            this.game.gameUI.detallesClan.setClanInfo(GuildName, Founder, FoundationDate, Leader, URL, MemberCount, ElectionsOpen, Aligment, EnemiesCount, AlliesCount, AntifactionPoints, Codex, GuildDesc);
        }

        handleShowGuildFundationForm() {
            this.game.gameUI.showCrearClan();
        }

        handleParalizeOK() {
            this.game.playerState.paralizado = !this.game.playerState.paralizado;
        }

        handleShowUserRequest(Details) {
            log.network("TODO: handleShowUserRequest ");
        }

        handleTradeOK() {
            //this.game.assetManager.audio.playSound(Enums.SONIDOS.comprar_vender);
            log.network("TODO: handleTradeOK ");
        }

        handleBankOK() {
            this.game.assetManager.audio.playSound(Enums.SONIDOS.retirar_depositar);
        }

        handleChangeUserTradeSlot(OfferSlot, ObjIndex, Amount, GrhIndex, ObjType, MaxHit, MinHit, MaxDef, MinDef, Price, ObjName) {
            log.network("TODO: handleChangeUserTradeSlot ");
        }

        handleSendNight(Night) {
            log.network("TODO: handleSendNight ");
        }

        handlePong() {
            log.network("TODO: handlePong ");
        }

        handleUpdateTagAndStatus(CharIndex, NickColor, Tag) {
            // TODO: arreglar en el server, siempre manda charIndex = 1
            var char = this.game.world.getCharacter(CharIndex);
            if (!char) {
                return;
            }

            var nombre, clan;
            if (Tag.indexOf("<") > 0) {
                nombre = Tag.slice(Tag, Tag.indexOf("<") - 1);
                clan = Tag.slice(Tag.indexOf("<"), Tag.length);
            }
            else {
                nombre = Tag;
                clan = null;
            }
            char.setName(nombre, clan, NickColor);

        }

        handleSpawnList(Data) {
            log.network("TODO: handleSpawnList ");
        }

        handleShowSOSForm(Data) {
            log.network("TODO: handleShowSOSForm ");
        }

        handleShowMOTDEditionForm(Data) {
            log.network("TODO: handleShowMOTDEditionForm ");
        }

        handleShowGMPanelForm() {
            log.network("TODO: handleShowGMPanelForm ");
        }

        handleUserNameList(Data) {
            log.network("TODO: handleUserNameList ");
        }

        handleShowDenounces(Data) {
            log.network("TODO: handleShowDenounces ");
        }

        handleRecordList(Items) {
            log.network("TODO: handleRecordList ");
        }

        handleRecordDetails(Creador, Motivo, Online, IP, OnlineTime, Obs) {
            log.network("TODO: handleRecordDetails ");
        }

        handleShowGuildAlign() {
            this.game.gameUI.showEleccionFaccionClan();
        }

        handleShowPartyForm(EsLider, Data, Exp) {
            Data = Utils.splitNullArray(Data);
            this.game.gameUI.showParty(EsLider, Data, Exp);
        }

        handleUpdateStrenghtAndDexterity(Fuerza, Agilidad) {
            this.gameUI.interfaz.updateAgilidad(Agilidad);
            this.gameUI.interfaz.updateFuerza(Fuerza);
        }

        handleUpdateStrenght(Fuerza) {
            this.gameUI.interfaz.updateFuerza(Fuerza);
        }

        handleUpdateDexterity(Agilidad) {
            this.gameUI.interfaz.updateAgilidad(Agilidad);
        }

        handleAddSlots(Mochila) {
            log.network("TODO: handleAddSlots ");
        }

        handleNPCHitUser(parteCuerpo, danio) {
            this.game.recibirDanioCriatura(parteCuerpo, danio);
        }

        handleUserHitNPC(danio) {
            this.game.realizarDanioCriatura(danio);
        }

        handleUserAttackedSwing(attackerIndex) {
            let attackerName = this.game.world.getCharacter(attackerIndex).nombre;
            let text = Enums.MensajeConsola.MENSAJE_1 + attackerName + Enums.MensajeConsola.ATAQUE_FALLO;
            this.game.escribirMsgConsola(text, Font.FIGHT);
        }

        handleUserHittedByUser(attackerIndex, bodyPart, danio) {
            this.game.recibirDanioUser(bodyPart, danio, attackerIndex);
        }

        handleUserHittedUser(victimIndex, bodyPart, danio) {
            this.game.realizarDanioPlayer(danio, bodyPart, victimIndex);
        }

        handleWorkRequestTarget(skill) {
            switch (skill) {
                case Enums.Skill.magia:
                    this.game.escribirMsgConsola(Enums.MensajeConsola.TRABAJO_MAGIA, Font.SKILLINFO);
                    break;
                case Enums.Skill.pesca:
                    this.game.escribirMsgConsola(Enums.MensajeConsola.TRABAJO_PESCA, Font.SKILLINFO);
                    break;
                case Enums.Skill.talar:
                    this.game.escribirMsgConsola(Enums.MensajeConsola.TRABAJO_TALAR, Font.SKILLINFO);
                    break;
                case Enums.Skill.mineria:
                    this.game.escribirMsgConsola(Enums.MensajeConsola.TRABAJO_MINERIA, Font.SKILLINFO);
                    break;
                case Enums.Skill.fundirmetal:
                    this.game.escribirMsgConsola(Enums.MensajeConsola.TRABAJO_FUNDIRMETAL, Font.SKILLINFO);
                    break;
                case Enums.Skill.proyectiles:
                    this.game.escribirMsgConsola(Enums.MensajeConsola.TRABAJO_PROYECTILES, Font.SKILLINFO);
                    break;
                case Enums.Skill.robar:
                    this.game.escribirMsgConsola(Enums.MensajeConsola.TRABAJO_ROBAR, Font.SKILLINFO);
                    break;
                case Enums.Skill.domar:
                    this.game.escribirMsgConsola(Enums.MensajeConsola.TRABAJO_DOMAR, Font.SKILLINFO);
                    break;
                default:
                    log.error("Numero de skill invalido: " + skill);
            }
            this.game.setTrabajoPendiente(skill);
        }

        handleHaveKilledUser(victimIndex, exp) {
            let victimName = this.game.world.getCharacter(victimIndex).nombre;
            this.game.escribirMsgConsola(Enums.MensajeConsola.HAS_MATADO_A + victimName + Enums.MensajeConsola.MENSAJE_22, Font.FIGHT);
            this.game.escribirMsgConsola(Enums.MensajeConsola.HAS_GANADO_EXPE_1 + exp + Enums.MensajeConsola.HAS_GANADO_EXPE_2, Font.FIGHT);

        }

        handleHome(distancia, tiempoEnSegundos, hogar) {
            let minutes = Math.floor(tiempoEnSegundos / 60);
            let seconds = tiempoEnSegundos - minutes * 60;
            let msg;
            if (minutes) {
                msg = minutes + " minutos y " + seconds + " segundos.";
            } else {
                msg = seconds + " segundos.";
            }

            this.game.escribirMsgConsola("Te encuentras a " + distancia + " mapas de la " + hogar + ", este viaje durará " + msg, Font.INFO);
            this.game.playerMovement.disable();
        }

        handleDontSeeAnything() {
            this.game.escribirMsgConsola(Enums.MensajeConsola.NO_VES_NADA_INTERESANTE, Font.INFO);
        }

        handleUserKill(attackerIndex) {
            let attackerName = this.game.world.getCharacter(attackerIndex).nombre;
            this.game.escribirMsgConsola(attackerName + Enums.MensajeConsola.TE_HA_MATADO, Font.FIGHT);
        }

        handleNPCSwing() {
            this.game.escribirMsgConsola(Enums.MensajeConsola.CRIATURA_FALLA_GOLPE, Font.FIGHT);
        }

        handleNPCKillUser() {
            this.game.escribirMsgConsola(Enums.MensajeConsola.CRIATURA_MATADO, Font.FIGHT);
        }

        handleBlockedWithShieldUser() {
            this.game.escribirMsgConsola(Enums.MensajeConsola.RECHAZO_ATAQUE_ESCUDO, Font.FIGHT);
        }

        handleBlockedWithShieldOther() {
            this.game.escribirMsgConsola(Enums.MensajeConsola.USUARIO_RECHAZO_ATAQUE_ESCUDO, Font.FIGHT);
        }

        handleUserSwing() {
            this.game.escribirMsgConsola(Enums.MensajeConsola.FALLADO_GOLPE, Font.FIGHT);
        }

        handleSafeModeOn() {
            this.game.seguroAtacarActivado = true;
            this.gameUI.interfaz.setSeguroAtacar(true);
            this.game.escribirMsgConsola(Enums.MensajeConsola.SEGURO_ACTIVADO, Font.WARNING);
        }

        handleSafeModeOff() {
            this.game.seguroAtacarActivado = false;
            this.gameUI.interfaz.setSeguroAtacar(false);
            this.game.escribirMsgConsola(Enums.MensajeConsola.SEGURO_DESACTIVADO, Font.WARNING);
        }

        handleResuscitationSafeOff() {
            this.game.seguroResucitacionActivado = false;
            this.gameUI.interfaz.setSeguroResucitacion(false);
            this.game.escribirMsgConsola(Enums.MensajeConsola.SEGURO_RESU_OFF, Font.WARNING);
        }

        handleResuscitationSafeOn() {
            this.game.seguroResucitacionActivado = true;
            this.gameUI.interfaz.setSeguroResucitacion(true);
            this.game.escribirMsgConsola(Enums.MensajeConsola.SEGURO_RESU_ON, Font.WARNING);
        }

        handleNobilityLost() {
            this.game.escribirMsgConsola(Enums.MensajeConsola.PIERDE_NOBLEZA, Font.FIGHT);
        }

        handleCantUseWhileMeditating() {
            this.game.escribirMsgConsola(Enums.MensajeConsola.USAR_MEDITANDO, Font.NOTIFICATION);
        }

        handleEarnExp() {
            log.network("TODO: handleEarnExp");
        }

        handleFinishHome() {
            this.game.escribirMsgConsola(Enums.MensajeConsola.MENSAJE_HOGAR, Font.INFO);
            this.game.playerMovement.enable();
        }

        handleCancelHome() {
            this.game.escribirMsgConsola(Enums.MensajeConsola.MENSAJE_HOGAR_CANCEL, Font.INFO);
            this.game.playerMovement.enable();
        }

        handleStopWorking() {
            log.network("TODO: handleStopWorking ");
        }

        handleCancelOfferItem(Slot) {
            log.network("TODO: handleCancelOfferItem ");
        }

        sendLoginExistingChar(UserName, Password) {
            var p = this.protocolo.BuildLoginExistingChar(UserName, Password, this.VER_A, this.VER_B, this.VER_C);
            p.serialize(this.byteQueue);
        }

        sendThrowDices() {
            var p = this.protocolo.BuildThrowDices();
            p.serialize(this.byteQueue);
        }

        sendLoginNewChar(UserName, Password, Race, Gender, Class, Head, Mail, Homeland) {
            var p = this.protocolo.BuildLoginNewChar(UserName, Password, this.VER_A, this.VER_B, this.VER_C, Race, Gender, Class, Head, Mail, Homeland);
            p.serialize(this.byteQueue);
        }

        sendTalk(Chat) {
            var p = this.protocolo.BuildTalk(Chat);
            p.serialize(this.byteQueue);
        }

        sendYell(Chat) {
            var p = this.protocolo.BuildYell(Chat);
            p.serialize(this.byteQueue);
        }

        sendWhisper(TargetName, Chat) {
            var p = this.protocolo.BuildWhisper(TargetName, Chat);
            p.serialize(this.byteQueue);
        }

        sendWalk(Heading) {
            var p = this.protocolo.BuildWalk(Heading);
            p.serialize(this.byteQueue);
        }

        sendRequestPositionUpdate() {
            var p = this.protocolo.BuildRequestPositionUpdate();
            p.serialize(this.byteQueue);
        }

        sendAttack() {
            var p = this.protocolo.BuildAttack();
            p.serialize(this.byteQueue);
        }

        sendPickUp() {
            var p = this.protocolo.BuildPickUp();
            p.serialize(this.byteQueue);
        }

        sendSafeToggle() {
            var p = this.protocolo.BuildSafeToggle();
            p.serialize(this.byteQueue);
        }

        sendResuscitationSafeToggle() {
            var p = this.protocolo.BuildResuscitationSafeToggle();
            p.serialize(this.byteQueue);
        }

        sendRequestGuildLeaderInfo() {
            var p = this.protocolo.BuildRequestGuildLeaderInfo();
            p.serialize(this.byteQueue);
        }

        sendRequestAtributes() {
            var p = this.protocolo.BuildRequestAtributes();
            p.serialize(this.byteQueue);
        }

        sendRequestFame() {
            var p = this.protocolo.BuildRequestFame();
            p.serialize(this.byteQueue);
        }

        sendRequestSkills() {
            var p = this.protocolo.BuildRequestSkills();
            p.serialize(this.byteQueue);
        }

        sendRequestMiniStats() {
            var p = this.protocolo.BuildRequestMiniStats();
            p.serialize(this.byteQueue);
        }

        sendCommerceEnd() {
            var p = this.protocolo.BuildCommerceEnd();
            p.serialize(this.byteQueue);
        }

        sendUserCommerceEnd() {
            var p = this.protocolo.BuildUserCommerceEnd();
            p.serialize(this.byteQueue);
        }

        sendUserCommerceConfirm() {
            var p = this.protocolo.BuildUserCommerceConfirm();
            p.serialize(this.byteQueue);
        }

        sendCommerceChat(Chat) {
            var p = this.protocolo.BuildCommerceChat(Chat);
            p.serialize(this.byteQueue);
        }

        sendBankEnd() {
            var p = this.protocolo.BuildBankEnd();
            p.serialize(this.byteQueue);
        }

        sendUserCommerceOk() {
            var p = this.protocolo.BuildUserCommerceOk();
            p.serialize(this.byteQueue);
        }

        sendUserCommerceReject() {
            var p = this.protocolo.BuildUserCommerceReject();
            p.serialize(this.byteQueue);
        }

        sendDrop(Slot, Amount) {
            var p = this.protocolo.BuildDrop(Slot, Amount);
            p.serialize(this.byteQueue);
        }

        sendCastSpell(Spell) {
            var p = this.protocolo.BuildCastSpell(Spell);
            p.serialize(this.byteQueue);
        }

        sendLeftClick(X, Y) {
            var p = this.protocolo.BuildLeftClick(X, Y);
            p.serialize(this.byteQueue);
        }

        sendDoubleClick(X, Y) {
            var p = this.protocolo.BuildDoubleClick(X, Y);
            p.serialize(this.byteQueue);
        }

        sendWork(Skill) {
            var p = this.protocolo.BuildWork(Skill);
            p.serialize(this.byteQueue);
        }

        sendUseSpellMacro() {
            var p = this.protocolo.BuildUseSpellMacro();
            p.serialize(this.byteQueue);
        }

        sendUseItem(Slot) {
            var p = this.protocolo.BuildUseItem(Slot);
            p.serialize(this.byteQueue);
        }

        sendCraftBlacksmith(Item) {
            var p = this.protocolo.BuildCraftBlacksmith(Item);
            p.serialize(this.byteQueue);
        }

        sendCraftCarpenter(Item) {
            var p = this.protocolo.BuildCraftCarpenter(Item);
            p.serialize(this.byteQueue);
        }

        sendWorkLeftClick(X, Y, Skill) {
            var p = this.protocolo.BuildWorkLeftClick(X, Y, Skill);
            p.serialize(this.byteQueue);
        }

        sendCreateNewGuild(Desc, GuildName, Site, Codex) {
            var p = this.protocolo.BuildCreateNewGuild(Desc, GuildName, Site, Codex);
            p.serialize(this.byteQueue);
        }

        sendSpellInfo(Slot) {
            var p = this.protocolo.BuildSpellInfo(Slot);
            p.serialize(this.byteQueue);
        }

        sendEquipItem(Slot) {
            var p = this.protocolo.BuildEquipItem(Slot);
            p.serialize(this.byteQueue);
        }

        sendChangeHeading(Heading) {
            var p = this.protocolo.BuildChangeHeading(Heading);
            p.serialize(this.byteQueue);
        }

        sendModifySkills(Skills) { // Skills : vector de 20 pos conteniendo los puntos a adicionar a cada skill
            var p = this.protocolo.BuildModifySkills(Skills);
            p.serialize(this.byteQueue);
        }

        sendTrain(PetIndex) {
            var p = this.protocolo.BuildTrain(PetIndex);
            p.serialize(this.byteQueue);
        }

        sendCommerceBuy(Slot, Amount) {
            var p = this.protocolo.BuildCommerceBuy(Slot, Amount);
            p.serialize(this.byteQueue);
        }

        sendBankExtractItem(Slot, Amount) {
            var p = this.protocolo.BuildBankExtractItem(Slot, Amount);
            p.serialize(this.byteQueue);
        }

        sendCommerceSell(Slot, Amount) {
            var p = this.protocolo.BuildCommerceSell(Slot, Amount);
            p.serialize(this.byteQueue);
        }

        sendBankDeposit(Slot, Amount) {
            var p = this.protocolo.BuildBankDeposit(Slot, Amount);
            p.serialize(this.byteQueue);
        }

        sendForumPost(MsgType, Title, Post) {
            var p = this.protocolo.BuildForumPost(MsgType, Title, Post);
            p.serialize(this.byteQueue);
        }

        sendMoveSpell(Direction, Slot) {
            var p = this.protocolo.BuildMoveSpell(Direction, Slot);
            p.serialize(this.byteQueue);
        }

        sendMoveBank(Direction, Slot) {
            var p = this.protocolo.BuildMoveBank(Direction, Slot);
            p.serialize(this.byteQueue);
        }

        sendClanCodexUpdate(Desc, Codex) {
            var p = this.protocolo.BuildClanCodexUpdate(Desc, Codex);
            p.serialize(this.byteQueue);
        }

        sendUserCommerceOffer(Slot, Amount, OfferSlot) {
            var p = this.protocolo.BuildUserCommerceOffer(Slot, Amount, OfferSlot);
            p.serialize(this.byteQueue);
        }

        sendGuildAcceptPeace(Guild) {
            var p = this.protocolo.BuildGuildAcceptPeace(Guild);
            p.serialize(this.byteQueue);
        }

        sendGuildRejectAlliance(Guild) {
            var p = this.protocolo.BuildGuildRejectAlliance(Guild);
            p.serialize(this.byteQueue);
        }

        sendGuildRejectPeace(Guild) {
            var p = this.protocolo.BuildGuildRejectPeace(Guild);
            p.serialize(this.byteQueue);
        }

        sendGuildAcceptAlliance(Guild) {
            var p = this.protocolo.BuildGuildAcceptAlliance(Guild);
            p.serialize(this.byteQueue);
        }

        sendGuildOfferPeace(Guild, Proposal) {
            var p = this.protocolo.BuildGuildOfferPeace(Guild, Proposal);
            p.serialize(this.byteQueue);
        }

        sendGuildOfferAlliance(Guild, Proposal) {
            var p = this.protocolo.BuildGuildOfferAlliance(Guild, Proposal);
            p.serialize(this.byteQueue);
        }

        sendGuildAllianceDetails(Guild) {
            var p = this.protocolo.BuildGuildAllianceDetails(Guild);
            p.serialize(this.byteQueue);
        }

        sendGuildPeaceDetails(Guild) {
            var p = this.protocolo.BuildGuildPeaceDetails(Guild);
            p.serialize(this.byteQueue);
        }

        sendGuildRequestJoinerInfo(User) {
            var p = this.protocolo.BuildGuildRequestJoinerInfo(User);
            p.serialize(this.byteQueue);
        }

        sendGuildAlliancePropList() {
            var p = this.protocolo.BuildGuildAlliancePropList();
            p.serialize(this.byteQueue);
        }

        sendGuildPeacePropList() {
            var p = this.protocolo.BuildGuildPeacePropList();
            p.serialize(this.byteQueue);
        }

        sendGuildDeclareWar(Guild) {
            var p = this.protocolo.BuildGuildDeclareWar(Guild);
            p.serialize(this.byteQueue);
        }

        sendGuildNewWebsite(Website) {
            var p = this.protocolo.BuildGuildNewWebsite(Website);
            p.serialize(this.byteQueue);
        }

        sendGuildAcceptNewMember(UserName) {
            var p = this.protocolo.BuildGuildAcceptNewMember(UserName);
            p.serialize(this.byteQueue);
        }

        sendGuildRejectNewMember(UserName, Reason) {
            var p = this.protocolo.BuildGuildRejectNewMember(UserName, Reason);
            p.serialize(this.byteQueue);
        }

        sendGuildKickMember(UserName) {
            var p = this.protocolo.BuildGuildKickMember(UserName);
            p.serialize(this.byteQueue);
        }

        sendGuildUpdateNews(News) {
            var p = this.protocolo.BuildGuildUpdateNews(News);
            p.serialize(this.byteQueue);
        }

        sendGuildMemberInfo(UserName) {
            var p = this.protocolo.BuildGuildMemberInfo(UserName);
            p.serialize(this.byteQueue);
        }

        sendGuildOpenElections() {
            var p = this.protocolo.BuildGuildOpenElections();
            p.serialize(this.byteQueue);
        }

        sendGuildRequestMembership(Guild, Application) {
            var p = this.protocolo.BuildGuildRequestMembership(Guild, Application);
            p.serialize(this.byteQueue);
        }

        sendGuildRequestDetails(Guild) {
            var p = this.protocolo.BuildGuildRequestDetails(Guild);
            p.serialize(this.byteQueue);
        }

        sendOnline() {
            var p = this.protocolo.BuildOnline();
            p.serialize(this.byteQueue);
        }

        sendQuit() {
            var p = this.protocolo.BuildQuit();
            p.serialize(this.byteQueue);
        }

        sendGuildLeave() {
            var p = this.protocolo.BuildGuildLeave();
            p.serialize(this.byteQueue);
        }

        sendRequestAccountState() {
            var p = this.protocolo.BuildRequestAccountState();
            p.serialize(this.byteQueue);
        }

        sendPetStand() {
            var p = this.protocolo.BuildPetStand();
            p.serialize(this.byteQueue);
        }

        sendPetFollow() {
            var p = this.protocolo.BuildPetFollow();
            p.serialize(this.byteQueue);
        }

        sendReleasePet() {
            var p = this.protocolo.BuildReleasePet();
            p.serialize(this.byteQueue);
        }

        sendTrainList() {
            var p = this.protocolo.BuildTrainList();
            p.serialize(this.byteQueue);
        }

        sendRest() {
            var p = this.protocolo.BuildRest();
            p.serialize(this.byteQueue);
        }

        sendMeditate() {
            var p = this.protocolo.BuildMeditate();
            p.serialize(this.byteQueue);
        }

        sendResucitate() {
            var p = this.protocolo.BuildResucitate();
            p.serialize(this.byteQueue);
        }

        sendHeal() {
            var p = this.protocolo.BuildHeal();
            p.serialize(this.byteQueue);
        }

        sendHelp() {
            var p = this.protocolo.BuildHelp();
            p.serialize(this.byteQueue);
        }

        sendRequestStats() {
            var p = this.protocolo.BuildRequestStats();
            p.serialize(this.byteQueue);
        }

        sendCommerceStart() {
            var p = this.protocolo.BuildCommerceStart();
            p.serialize(this.byteQueue);
        }

        sendBankStart() {
            var p = this.protocolo.BuildBankStart();
            p.serialize(this.byteQueue);
        }

        sendEnlist() {
            var p = this.protocolo.BuildEnlist();
            p.serialize(this.byteQueue);
        }

        sendInformation() {
            var p = this.protocolo.BuildInformation();
            p.serialize(this.byteQueue);
        }

        sendReward() {
            var p = this.protocolo.BuildReward();
            p.serialize(this.byteQueue);
        }

        sendRequestMOTD() {
            var p = this.protocolo.BuildRequestMOTD();
            p.serialize(this.byteQueue);
        }

        sendUpTime() {
            var p = this.protocolo.BuildUpTime();
            p.serialize(this.byteQueue);
        }

        sendPartyLeave() {
            var p = this.protocolo.BuildPartyLeave();
            p.serialize(this.byteQueue);
        }

        sendPartyCreate() {
            var p = this.protocolo.BuildPartyCreate();
            p.serialize(this.byteQueue);
        }

        sendPartyJoin() {
            var p = this.protocolo.BuildPartyJoin();
            p.serialize(this.byteQueue);
        }

        sendInquiry() {
            var p = this.protocolo.BuildInquiry();
            p.serialize(this.byteQueue);
        }

        sendGuildMessage(Chat) {
            var p = this.protocolo.BuildGuildMessage(Chat);
            p.serialize(this.byteQueue);
        }

        sendPartyMessage(Chat) {
            var p = this.protocolo.BuildPartyMessage(Chat);
            p.serialize(this.byteQueue);
        }

        sendCentinelReport(Code) {
            var p = this.protocolo.BuildCentinelReport(Code);
            p.serialize(this.byteQueue);
        }

        sendGuildOnline() {
            var p = this.protocolo.BuildGuildOnline();
            p.serialize(this.byteQueue);
        }

        sendPartyOnline() {
            var p = this.protocolo.BuildPartyOnline();
            p.serialize(this.byteQueue);
        }

        sendCouncilMessage(Chat) {
            var p = this.protocolo.BuildCouncilMessage(Chat);
            p.serialize(this.byteQueue);
        }

        sendRoleMasterRequest(Request) {
            var p = this.protocolo.BuildRoleMasterRequest(Request);
            p.serialize(this.byteQueue);
        }

        sendGMRequest() {
            var p = this.protocolo.BuildGMRequest();
            p.serialize(this.byteQueue);
        }

        sendBugReport(Report) {
            var p = this.protocolo.BuildBugReport(Report);
            p.serialize(this.byteQueue);
        }

        sendChangeDescription(Description) {
            var p = this.protocolo.BuildChangeDescription(Description);
            p.serialize(this.byteQueue);
        }

        sendGuildVote(Vote) {
            var p = this.protocolo.BuildGuildVote(Vote);
            p.serialize(this.byteQueue);
        }

        sendPunishments(Name) {
            var p = this.protocolo.BuildPunishments(Name);
            p.serialize(this.byteQueue);
        }

        sendChangePassword(OldPass, NewPass) {
            var p = this.protocolo.BuildChangePassword(OldPass, NewPass);
            p.serialize(this.byteQueue);
        }

        sendGamble(Amount) {
            var p = this.protocolo.BuildGamble(Amount);
            p.serialize(this.byteQueue);
        }

        sendInquiryVote(Opt) {
            var p = this.protocolo.BuildInquiryVote(Opt);
            p.serialize(this.byteQueue);
        }

        sendLeaveFaction() {
            var p = this.protocolo.BuildLeaveFaction();
            p.serialize(this.byteQueue);
        }

        sendBankExtractGold(Amount) {
            var p = this.protocolo.BuildBankExtractGold(Amount);
            p.serialize(this.byteQueue);
        }

        sendBankDepositGold(Amount) {
            var p = this.protocolo.BuildBankDepositGold(Amount);
            p.serialize(this.byteQueue);
        }

        sendDenounce(Text) {
            var p = this.protocolo.BuildDenounce(Text);
            p.serialize(this.byteQueue);
        }

        sendGuildFundate() {
            var p = this.protocolo.BuildGuildFundate();
            p.serialize(this.byteQueue);
        }

        sendGuildFundation(ClanType) {
            var p = this.protocolo.BuildGuildFundation(ClanType);
            p.serialize(this.byteQueue);
        }

        sendPartyKick(UserName) {
            var p = this.protocolo.BuildPartyKick(UserName);
            p.serialize(this.byteQueue);
        }

        sendPartySetLeader(UserName) {
            var p = this.protocolo.BuildPartySetLeader(UserName);
            p.serialize(this.byteQueue);
        }

        sendPartyAcceptMember(UserName) {
            var p = this.protocolo.BuildPartyAcceptMember(UserName);
            p.serialize(this.byteQueue);
        }

        sendPing() {
            var p = this.protocolo.BuildPing();
            p.serialize(this.byteQueue);
        }

        sendRequestPartyForm() {
            var p = this.protocolo.BuildRequestPartyForm();
            p.serialize(this.byteQueue);
        }

        sendItemUpgrade(ItemIndex) {
            var p = this.protocolo.BuildItemUpgrade(ItemIndex);
            p.serialize(this.byteQueue);
        }

        sendGMCommands() {
            var p = this.protocolo.BuildGMCommands();
            p.serialize(this.byteQueue);
        }

        sendInitCrafting(TotalItems, ItemsPorCiclo) {
            var p = this.protocolo.BuildInitCrafting(TotalItems, ItemsPorCiclo);
            p.serialize(this.byteQueue);
        }

        sendHome() {
            var p = this.protocolo.BuildHome();
            p.serialize(this.byteQueue);
        }

        sendShowGuildNews() {
            var p = this.protocolo.BuildShowGuildNews();
            p.serialize(this.byteQueue);
        }

        sendShareNpc() {
            var p = this.protocolo.BuildShareNpc();
            p.serialize(this.byteQueue);
        }

        sendStopSharingNpc() {
            var p = this.protocolo.BuildStopSharingNpc();
            p.serialize(this.byteQueue);
        }

        sendConsultation() {
            var p = this.protocolo.BuildConsultation();
            p.serialize(this.byteQueue);
        }

        sendMoveItem(OldSlot, NewSlot) {
            var p = this.protocolo.BuildMoveItem(OldSlot, NewSlot);
            p.serialize(this.byteQueue);
        }

        sendGMMessage(Chat) {
            var p = this.protocolo.BuildGMMessage(Chat);
            p.serialize(this.byteQueue);
        }

        sendShowName() {
            var p = this.protocolo.BuildShowName();
            p.serialize(this.byteQueue);
        }

        sendOnlineRoyalArmy() {
            var p = this.protocolo.BuildOnlineRoyalArmy();
            p.serialize(this.byteQueue);
        }

        sendOnlineChaosLegion() {
            var p = this.protocolo.BuildOnlineChaosLegion();
            p.serialize(this.byteQueue);
        }

        sendGoNearby(UserName) {
            var p = this.protocolo.BuildGoNearby(UserName);
            p.serialize(this.byteQueue);
        }

        sendComment(Data) {
            var p = this.protocolo.BuildComment(Data);
            p.serialize(this.byteQueue);
        }

        sendServerTime() {
            var p = this.protocolo.BuildServerTime();
            p.serialize(this.byteQueue);
        }

        sendWhere(UserName) {
            var p = this.protocolo.BuildWhere(UserName);
            p.serialize(this.byteQueue);
        }

        sendCreaturesInMap(Map) {
            var p = this.protocolo.BuildCreaturesInMap(Map);
            p.serialize(this.byteQueue);
        }

        sendWarpMeToTarget() {
            var p = this.protocolo.BuildWarpMeToTarget();
            p.serialize(this.byteQueue);
        }

        sendWarpChar(UserName, Map, X, Y) {
            var p = this.protocolo.BuildWarpChar(UserName, Map, X, Y);
            p.serialize(this.byteQueue);
        }

        sendSilence(UserName) {
            var p = this.protocolo.BuildSilence(UserName);
            p.serialize(this.byteQueue);
        }

        sendSOSShowList() {
            var p = this.protocolo.BuildSOSShowList();
            p.serialize(this.byteQueue);
        }

        sendSOSRemove(UserName) {
            var p = this.protocolo.BuildSOSRemove(UserName);
            p.serialize(this.byteQueue);
        }

        sendGoToChar(UserName) {
            var p = this.protocolo.BuildGoToChar(UserName);
            p.serialize(this.byteQueue);
        }

        sendInvisible() {
            var p = this.protocolo.BuildInvisible();
            p.serialize(this.byteQueue);
        }

        sendGMPanel() {
            var p = this.protocolo.BuildGMPanel();
            p.serialize(this.byteQueue);
        }

        sendRequestUserList() {
            var p = this.protocolo.BuildRequestUserList();
            p.serialize(this.byteQueue);
        }

        sendWorking() {
            var p = this.protocolo.BuildWorking();
            p.serialize(this.byteQueue);
        }

        sendHiding() {
            var p = this.protocolo.BuildHiding();
            p.serialize(this.byteQueue);
        }

        sendJail(UserName, Reason, JailTime) {
            var p = this.protocolo.BuildJail(UserName, Reason, JailTime);
            p.serialize(this.byteQueue);
        }

        sendKillNPC() {
            var p = this.protocolo.BuildKillNPC();
            p.serialize(this.byteQueue);
        }

        sendWarnUser(UserName, Reason) {
            var p = this.protocolo.BuildWarnUser(UserName, Reason);
            p.serialize(this.byteQueue);
        }

        sendEditChar(UserName, Opcion, Arg1, Arg2) {
            var p = this.protocolo.BuildEditChar(UserName, Opcion, Arg1, Arg2);
            p.serialize(this.byteQueue);
        }

        sendRequestCharInfo(TargetName) {
            var p = this.protocolo.BuildRequestCharInfo(TargetName);
            p.serialize(this.byteQueue);
        }

        sendRequestCharStats(UserName) {
            var p = this.protocolo.BuildRequestCharStats(UserName);
            p.serialize(this.byteQueue);
        }

        sendRequestCharGold(UserName) {
            var p = this.protocolo.BuildRequestCharGold(UserName);
            p.serialize(this.byteQueue);
        }

        sendRequestCharInventory(UserName) {
            var p = this.protocolo.BuildRequestCharInventory(UserName);
            p.serialize(this.byteQueue);
        }

        sendRequestCharBank(UserName) {
            var p = this.protocolo.BuildRequestCharBank(UserName);
            p.serialize(this.byteQueue);
        }

        sendRequestCharSkills(UserName) {
            var p = this.protocolo.BuildRequestCharSkills(UserName);
            p.serialize(this.byteQueue);
        }

        sendReviveChar(UserName) {
            var p = this.protocolo.BuildReviveChar(UserName);
            p.serialize(this.byteQueue);
        }

        sendOnlineGM() {
            var p = this.protocolo.BuildOnlineGM();
            p.serialize(this.byteQueue);
        }

        sendOnlineMap(Map) {
            var p = this.protocolo.BuildOnlineMap(Map);
            p.serialize(this.byteQueue);
        }

        sendForgive(UserName) {
            var p = this.protocolo.BuildForgive(UserName);
            p.serialize(this.byteQueue);
        }

        sendKick(UserName) {
            var p = this.protocolo.BuildKick(UserName);
            p.serialize(this.byteQueue);
        }

        sendExecute(UserName) {
            var p = this.protocolo.BuildExecute(UserName);
            p.serialize(this.byteQueue);
        }

        sendBanChar(UserName, Reason) {
            var p = this.protocolo.BuildBanChar(UserName, Reason);
            p.serialize(this.byteQueue);
        }

        sendUnbanChar(UserName) {
            var p = this.protocolo.BuildUnbanChar(UserName);
            p.serialize(this.byteQueue);
        }

        sendNPCFollow() {
            var p = this.protocolo.BuildNPCFollow();
            p.serialize(this.byteQueue);
        }

        sendSummonChar(UserName) {
            var p = this.protocolo.BuildSummonChar(UserName);
            p.serialize(this.byteQueue);
        }

        sendSpawnListRequest() {
            var p = this.protocolo.BuildSpawnListRequest();
            p.serialize(this.byteQueue);
        }

        sendSpawnCreature(NPC) {
            var p = this.protocolo.BuildSpawnCreature(NPC);
            p.serialize(this.byteQueue);
        }

        sendResetNPCInventory() {
            var p = this.protocolo.BuildResetNPCInventory();
            p.serialize(this.byteQueue);
        }

        sendCleanWorld() {
            var p = this.protocolo.BuildCleanWorld();
            p.serialize(this.byteQueue);
        }

        sendServerMessage(Message) {
            var p = this.protocolo.BuildServerMessage(Message);
            p.serialize(this.byteQueue);
        }

        sendNickToIP(UserName) {
            var p = this.protocolo.BuildNickToIP(UserName);
            p.serialize(this.byteQueue);
        }

        sendIPToNick(A, B, C, D) {
            var p = this.protocolo.BuildIPToNick(A, B, C, D);
            p.serialize(this.byteQueue);
        }

        sendGuildOnlineMembers(GuildName) {
            var p = this.protocolo.BuildGuildOnlineMembers(GuildName);
            p.serialize(this.byteQueue);
        }

        sendTeleportCreate(Map, X, Y, Radio) {
            var p = this.protocolo.BuildTeleportCreate(Map, X, Y, Radio);
            p.serialize(this.byteQueue);
        }

        sendTeleportDestroy() {
            var p = this.protocolo.BuildTeleportDestroy();
            p.serialize(this.byteQueue);
        }

        sendRainToggle() {
            var p = this.protocolo.BuildRainToggle();
            p.serialize(this.byteQueue);
        }

        sendSetCharDescription(Description) {
            var p = this.protocolo.BuildSetCharDescription(Description);
            p.serialize(this.byteQueue);
        }

        sendForceMIDIToMap(MidiID, Map) {
            var p = this.protocolo.BuildForceMIDIToMap(MidiID, Map);
            p.serialize(this.byteQueue);
        }

        sendForceWAVEToMap(Wave, Map, X, Y) {
            var p = this.protocolo.BuildForceWAVEToMap(Wave, Map, X, Y);
            p.serialize(this.byteQueue);
        }

        sendRoyalArmyMessage(Message) {
            var p = this.protocolo.BuildRoyalArmyMessage(Message);
            p.serialize(this.byteQueue);
        }

        sendChaosLegionMessage(Message) {
            var p = this.protocolo.BuildChaosLegionMessage(Message);
            p.serialize(this.byteQueue);
        }

        sendCitizenMessage(Message) {
            var p = this.protocolo.BuildCitizenMessage(Message);
            p.serialize(this.byteQueue);
        }

        sendCriminalMessage(Message) {
            var p = this.protocolo.BuildCriminalMessage(Message);
            p.serialize(this.byteQueue);
        }

        sendTalkAsNPC(Message) {
            var p = this.protocolo.BuildTalkAsNPC(Message);
            p.serialize(this.byteQueue);
        }

        sendDestroyAllItemsInArea() {
            var p = this.protocolo.BuildDestroyAllItemsInArea();
            p.serialize(this.byteQueue);
        }

        sendAcceptRoyalCouncilMember(UserName) {
            var p = this.protocolo.BuildAcceptRoyalCouncilMember(UserName);
            p.serialize(this.byteQueue);
        }

        sendAcceptChaosCouncilMember(UserName) {
            var p = this.protocolo.BuildAcceptChaosCouncilMember(UserName);
            p.serialize(this.byteQueue);
        }

        sendItemsInTheFloor() {
            var p = this.protocolo.BuildItemsInTheFloor();
            p.serialize(this.byteQueue);
        }

        sendMakeDumb(UserName) {
            var p = this.protocolo.BuildMakeDumb(UserName);
            p.serialize(this.byteQueue);
        }

        sendMakeDumbNoMore(UserName) {
            var p = this.protocolo.BuildMakeDumbNoMore(UserName);
            p.serialize(this.byteQueue);
        }

        sendDumpIPTables() {
            var p = this.protocolo.BuildDumpIPTables();
            p.serialize(this.byteQueue);
        }

        sendCouncilKick(UserName) {
            var p = this.protocolo.BuildCouncilKick(UserName);
            p.serialize(this.byteQueue);
        }

        sendSetTrigger(Trigger) {
            var p = this.protocolo.BuildSetTrigger(Trigger);
            p.serialize(this.byteQueue);
        }

        sendAskTrigger() {
            var p = this.protocolo.BuildAskTrigger();
            p.serialize(this.byteQueue);
        }

        sendBannedIPList() {
            var p = this.protocolo.BuildBannedIPList();
            p.serialize(this.byteQueue);
        }

        sendBannedIPReload() {
            var p = this.protocolo.BuildBannedIPReload();
            p.serialize(this.byteQueue);
        }

        sendGuildMemberList(GuildName) {
            var p = this.protocolo.BuildGuildMemberList(GuildName);
            p.serialize(this.byteQueue);
        }

        sendGuildBan(GuildName) {
            var p = this.protocolo.BuildGuildBan(GuildName);
            p.serialize(this.byteQueue);
        }

        sendBanIP(IP, Reason) {
            var p = this.protocolo.BuildBanIP(IP, Reason);
            p.serialize(this.byteQueue);
        }

        sendUnbanIP(IP) {
            var p = this.protocolo.BuildUnbanIP(IP);
            p.serialize(this.byteQueue);
        }

        sendCreateItem(Item) {
            var p = this.protocolo.BuildCreateItem(Item);
            p.serialize(this.byteQueue);
        }

        sendDestroyItems() {
            var p = this.protocolo.BuildDestroyItems();
            p.serialize(this.byteQueue);
        }

        sendChaosLegionKick(UserName, Reason) {
            var p = this.protocolo.BuildChaosLegionKick(UserName, Reason);
            p.serialize(this.byteQueue);
        }

        sendRoyalArmyKick(UserName, Reason) {
            var p = this.protocolo.BuildRoyalArmyKick(UserName, Reason);
            p.serialize(this.byteQueue);
        }

        sendForceMIDIAll(MidiID) {
            var p = this.protocolo.BuildForceMIDIAll(MidiID);
            p.serialize(this.byteQueue);
        }

        sendForceWAVEAll(WaveID) {
            var p = this.protocolo.BuildForceWAVEAll(WaveID);
            p.serialize(this.byteQueue);
        }

        sendRemovePunishment(UserName, Punishment, NewText) {
            var p = this.protocolo.BuildRemovePunishment(UserName, Punishment, NewText);
            p.serialize(this.byteQueue);
        }

        sendTileBlockedToggle() {
            var p = this.protocolo.BuildTileBlockedToggle();
            p.serialize(this.byteQueue);
        }

        sendKillNPCNoRespawn() {
            var p = this.protocolo.BuildKillNPCNoRespawn();
            p.serialize(this.byteQueue);
        }

        sendKillAllNearbyNPCs() {
            var p = this.protocolo.BuildKillAllNearbyNPCs();
            p.serialize(this.byteQueue);
        }

        sendLastIP(UserName) {
            var p = this.protocolo.BuildLastIP(UserName);
            p.serialize(this.byteQueue);
        }

        sendChangeMOTD() {
            var p = this.protocolo.BuildChangeMOTD();
            p.serialize(this.byteQueue);
        }

        sendSetMOTD(Motd) {
            var p = this.protocolo.BuildSetMOTD(Motd);
            p.serialize(this.byteQueue);
        }

        sendSystemMessage(Message) {
            var p = this.protocolo.BuildSystemMessage(Message);
            p.serialize(this.byteQueue);
        }

        sendCreateNPC(NpcIndex) {
            var p = this.protocolo.BuildCreateNPC(NpcIndex);
            p.serialize(this.byteQueue);
        }

        sendCreateNPCWithRespawn(NpcIndex) {
            var p = this.protocolo.BuildCreateNPCWithRespawn(NpcIndex);
            p.serialize(this.byteQueue);
        }

        sendImperialArmour(Index, ObjIndex) {
            var p = this.protocolo.BuildImperialArmour(Index, ObjIndex);
            p.serialize(this.byteQueue);
        }

        sendChaosArmour(Index, ObjIndex) {
            var p = this.protocolo.BuildChaosArmour(Index, ObjIndex);
            p.serialize(this.byteQueue);
        }

        sendNavigateToggle() {
            var p = this.protocolo.BuildNavigateToggle();
            p.serialize(this.byteQueue);
        }

        sendServerOpenToUsersToggle() {
            var p = this.protocolo.BuildServerOpenToUsersToggle();
            p.serialize(this.byteQueue);
        }

        sendTurnOffServer() {
            var p = this.protocolo.BuildTurnOffServer();
            p.serialize(this.byteQueue);
        }

        sendTurnCriminal(UserName) {
            var p = this.protocolo.BuildTurnCriminal(UserName);
            p.serialize(this.byteQueue);
        }

        sendResetFactions(UserName) {
            var p = this.protocolo.BuildResetFactions(UserName);
            p.serialize(this.byteQueue);
        }

        sendRemoveCharFromGuild(UserName) {
            var p = this.protocolo.BuildRemoveCharFromGuild(UserName);
            p.serialize(this.byteQueue);
        }

        sendRequestCharMail(UserName) {
            var p = this.protocolo.BuildRequestCharMail(UserName);
            p.serialize(this.byteQueue);
        }

        sendAlterPassword(UserName, CopyFrom) {
            var p = this.protocolo.BuildAlterPassword(UserName, CopyFrom);
            p.serialize(this.byteQueue);
        }

        sendAlterMail(UserName, NewMail) {
            var p = this.protocolo.BuildAlterMail(UserName, NewMail);
            p.serialize(this.byteQueue);
        }

        sendAlterName(UserName, NewName) {
            var p = this.protocolo.BuildAlterName(UserName, NewName);
            p.serialize(this.byteQueue);
        }

        sendToggleCentinelActivated() {
            var p = this.protocolo.BuildToggleCentinelActivated();
            p.serialize(this.byteQueue);
        }

        sendDoBackUp() {
            var p = this.protocolo.BuildDoBackUp();
            p.serialize(this.byteQueue);
        }

        sendShowGuildMessages(GuildName) {
            var p = this.protocolo.BuildShowGuildMessages(GuildName);
            p.serialize(this.byteQueue);
        }

        sendSaveMap() {
            var p = this.protocolo.BuildSaveMap();
            p.serialize(this.byteQueue);
        }

        sendChangeMapInfoPK(Pk) {
            var p = this.protocolo.BuildChangeMapInfoPK(Pk);
            p.serialize(this.byteQueue);
        }

        sendChangeMapInfoBackup(Backup) {
            var p = this.protocolo.BuildChangeMapInfoBackup(Backup);
            p.serialize(this.byteQueue);
        }

        sendChangeMapInfoRestricted(RestrictedTo) {
            var p = this.protocolo.BuildChangeMapInfoRestricted(RestrictedTo);
            p.serialize(this.byteQueue);
        }

        sendChangeMapInfoNoMagic(NoMagic) {
            var p = this.protocolo.BuildChangeMapInfoNoMagic(NoMagic);
            p.serialize(this.byteQueue);
        }

        sendChangeMapInfoNoInvi(NoInvi) {
            var p = this.protocolo.BuildChangeMapInfoNoInvi(NoInvi);
            p.serialize(this.byteQueue);
        }

        sendChangeMapInfoNoResu(NoResu) {
            var p = this.protocolo.BuildChangeMapInfoNoResu(NoResu);
            p.serialize(this.byteQueue);
        }

        sendChangeMapInfoLand(Data) {
            var p = this.protocolo.BuildChangeMapInfoLand(Data);
            p.serialize(this.byteQueue);
        }

        sendChangeMapInfoZone(Data) {
            var p = this.protocolo.BuildChangeMapInfoZone(Data);
            p.serialize(this.byteQueue);
        }

        sendChangeMapInfoStealNpc(RoboNpc) {
            var p = this.protocolo.BuildChangeMapInfoStealNpc(RoboNpc);
            p.serialize(this.byteQueue);
        }

        sendChangeMapInfoNoOcultar(NoOcultar) {
            var p = this.protocolo.BuildChangeMapInfoNoOcultar(NoOcultar);
            p.serialize(this.byteQueue);
        }

        sendChangeMapInfoNoInvocar(NoInvocar) {
            var p = this.protocolo.BuildChangeMapInfoNoInvocar(NoInvocar);
            p.serialize(this.byteQueue);
        }

        sendSaveChars() {
            var p = this.protocolo.BuildSaveChars();
            p.serialize(this.byteQueue);
        }

        sendCleanSOS() {
            var p = this.protocolo.BuildCleanSOS();
            p.serialize(this.byteQueue);
        }

        sendShowServerForm() {
            var p = this.protocolo.BuildShowServerForm();
            p.serialize(this.byteQueue);
        }

        sendNight() {
            var p = this.protocolo.BuildNight();
            p.serialize(this.byteQueue);
        }

        sendKickAllChars() {
            var p = this.protocolo.BuildKickAllChars();
            p.serialize(this.byteQueue);
        }

        sendReloadNPCs() {
            var p = this.protocolo.BuildReloadNPCs();
            p.serialize(this.byteQueue);
        }

        sendReloadServerIni() {
            var p = this.protocolo.BuildReloadServerIni();
            p.serialize(this.byteQueue);
        }

        sendReloadSpells() {
            var p = this.protocolo.BuildReloadSpells();
            p.serialize(this.byteQueue);
        }

        sendReloadObjects() {
            var p = this.protocolo.BuildReloadObjects();
            p.serialize(this.byteQueue);
        }

        sendRestart() {
            var p = this.protocolo.BuildRestart();
            p.serialize(this.byteQueue);
        }

        sendResetAutoUpdate() {
            var p = this.protocolo.BuildResetAutoUpdate();
            p.serialize(this.byteQueue);
        }

        sendChatColor(R, G, B) {
            var p = this.protocolo.BuildChatColor(R, G, B);
            p.serialize(this.byteQueue);
        }

        sendIgnored() {
            var p = this.protocolo.BuildIgnored();
            p.serialize(this.byteQueue);
        }

        sendCheckSlot(UserName, Slot) {
            var p = this.protocolo.BuildCheckSlot(UserName, Slot);
            p.serialize(this.byteQueue);
        }

        sendSetIniVar(Seccion, Clave, Valor) {
            var p = this.protocolo.BuildSetIniVar(Seccion, Clave, Valor);
            p.serialize(this.byteQueue);
        }

        sendCreatePretorianClan(Map, X, Y) {
            var p = this.protocolo.BuildCreatePretorianClan(Map, X, Y);
            p.serialize(this.byteQueue);
        }

        sendRemovePretorianClan(Map) {
            var p = this.protocolo.BuildRemovePretorianClan(Map);
            p.serialize(this.byteQueue);
        }

        sendEnableDenounces() {
            var p = this.protocolo.BuildEnableDenounces();
            p.serialize(this.byteQueue);
        }

        sendShowDenouncesList() {
            var p = this.protocolo.BuildShowDenouncesList();
            p.serialize(this.byteQueue);
        }

        sendMapMessage(Message) {
            var p = this.protocolo.BuildMapMessage(Message);
            p.serialize(this.byteQueue);
        }

        sendSetDialog(Message) {
            var p = this.protocolo.BuildSetDialog(Message);
            p.serialize(this.byteQueue);
        }

        sendImpersonate() {
            var p = this.protocolo.BuildImpersonate();
            p.serialize(this.byteQueue);
        }

        sendImitate() {
            var p = this.protocolo.BuildImitate();
            p.serialize(this.byteQueue);
        }

        sendRecordAdd(UserName, Reason) {
            var p = this.protocolo.BuildRecordAdd(UserName, Reason);
            p.serialize(this.byteQueue);
        }

        sendRecordRemove(Index) {
            var p = this.protocolo.BuildRecordRemove(Index);
            p.serialize(this.byteQueue);
        }

        sendRecordAddObs(Index, Obs) {
            var p = this.protocolo.BuildRecordAddObs(Index, Obs);
            p.serialize(this.byteQueue);
        }

        sendRecordListRequest() {
            var p = this.protocolo.BuildRecordListRequest();
            p.serialize(this.byteQueue);
        }

        sendRecordDetailsRequest(Index) {
            var p = this.protocolo.BuildRecordDetailsRequest(Index);
            p.serialize(this.byteQueue);
        }

        sendAlterGuildName(OldGuildName, NewGuildName) {
            var p = this.protocolo.BuildAlterGuildName(OldGuildName, NewGuildName);
            p.serialize(this.byteQueue);
        }

        sendHigherAdminsMessage(Message) {
            var p = this.protocolo.BuildHigherAdminsMessage(Message);
            p.serialize(this.byteQueue);
        }
    }

    return GameClient;
});
