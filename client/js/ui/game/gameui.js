/**
 * Created by horacio on 2/21/16.
 */

define(['enums', 'ui/game/keymouselistener', 'ui/popups/popupskills', 'ui/popups/comerciar', 'ui/popups/ingamemensaje',
        'ui/game/interfaz', 'ui/popups/tirar', 'ui/popups/boveda', 'ui/popups/guiamapa', 'ui/popups/opciones', 'ui/popups/carpinteria',
        'ui/popups/herreria', 'ui/popups/clanes', 'ui/popups/detallesclan', 'ui/popups/solicitudclan', 'ui/popups/eleccionfaccionclan',
        'ui/popups/crearclan', 'ui/popups/noticiasclan', 'ui/popups/detallespersonaje', 'ui/popups/estadisticas'],
    function (Enums, KeyMouseListener, popUpSkills, Comerciar, InGameMensaje, Interfaz, Tirar, Boveda, GuiaMapa, Opciones,
              Carpinteria, Herreria, Clanes, DetallesClan, SolicitudClan, EleccionFaccionClan, CrearClan, NoticiasClan,
              DetallesPersonaje, Estadisticas) {

        //TODO: crear los popups en run time con jquery y borrarlos cuando se cierran ?

        class GameUI {
            constructor(gameManager, storage) {
                var game = gameManager.game;
                var acciones = gameManager.acciones;
                var comandosChat = gameManager.comandosChat;
                this.acciones = acciones;
                this.game = game;
                this.storage = storage;

                let showMensajeFunction = this.showMensaje.bind(this);

                this.inGameMensaje = new InGameMensaje();
                this.comerciar = new Comerciar(game, acciones);
                this.tirar = new Tirar(game, acciones);
                this.boveda = new Boveda(game, acciones);
                this.guiaMapa = new GuiaMapa();

                this.opciones = new Opciones(game, storage, this.updateKeysCallback.bind(this), showMensajeFunction);
                this.skills = new popUpSkills(game);

                this.detallesClan = new DetallesClan(game, this._showSolicitudClan.bind(this));
                this.clanes = new Clanes(game, this.detallesClan, showMensajeFunction, this._showSolicitudClan.bind(this));
                this.solicitudClan = new SolicitudClan(game);
                this.eleccionFaccionClan = new EleccionFaccionClan(game);
                this.crearClan = new CrearClan(game, showMensajeFunction);
                this.noticiasClan = new NoticiasClan();
                this.detallesPersonaje = new DetallesPersonaje();

                this.estadisticas = new Estadisticas(game);

                this.carpinteria = new Carpinteria(game);
                this.herreria = new Herreria(game);

                this.interfaz = new Interfaz(game, acciones);
                this.keyMouseListener = new KeyMouseListener(game, acciones, storage.getKeys(), comandosChat);
                this.initDOM();
            }

            initDOM() {
                this.interfaz.inicializar();
                this.keyMouseListener.initListeners();
                var self = this;
                $(window).blur(function () {
                    self.keyMouseListener.upKeyTeclasCaminar();
                });
            }

            resize(escala) {
                this.game.resize(escala); // todo <- este resize del renderer deberia ir fuera de game
            }

            updateKeysCallback(keys) { // todo: en otro lado esto y que a gameui solo le llegue keys
                this.keyMouseListener.setKeys(keys);
            }

            hayPopUpActivo() {
                return ($('#container').children('.ui-dialog:visible').length != 0)
            }

            showComerciar() {
                this.comerciar.show();
            }

            hideComerciar(incomingFromServer) {
                this.comerciar.hide(incomingFromServer);
            }

            showMensaje(msj) {
                this.inGameMensaje.show(msj);
            }

            showBoveda() {
                this.boveda.show();
            }

            hideBoveda(incomingFromServer) {
                this.boveda.hide(incomingFromServer);
            }

            showTirar(tirandoOro) {
                this.tirar.show(tirandoOro);
            }

            showSkills() {
                this.skills.show();
            }

            showOpciones() {
                this.opciones.show();
            }

            hideTirar() {
                this.tirar.hide();
            }

            showMapa() {
                this.guiaMapa.show();
            }

            showCarpinteria() {
                this.carpinteria.show();
            }

            showHerreria() {
                this.herreria.show();
            }

            showClanes() {
                this.clanes.show();
            }

            _showSolicitudClan(clan) {
                this.solicitudClan.show(clan);
            }

            setNombresClanes(nombres) {
                this.clanes.setNombresClanes(nombres);
            }

            showEleccionFaccionClan() {
                this.eleccionFaccionClan.show();
            }

            showCrearClan() {
                this.crearClan.show();
            }

            showNoticiasClan(noticias, enemigos, aliados) {
                this.noticiasClan.show(noticias, enemigos, aliados);
            }

            showDetallesPersonaje(CharName, Race, Class, Gender, Level, Gold, Bank, Reputation, PreviousPetitions, CurrentGuild, PreviousGuilds, RoyalArmy, ChaosLegion, CiudadanosMatados, CriminalesMatados) {
                this.detallesPersonaje.show(CharName, Race, Class, Gender, Level, Gold, Bank, Reputation, PreviousPetitions, CurrentGuild, PreviousGuilds, RoyalArmy, ChaosLegion, CiudadanosMatados, CriminalesMatados);
            }

            showEstadisticas() {
                this.estadisticas.show();
            }

            setAtributosInfo(Fuerza, Agilidad, Inteligencia, Carisma, Constitucion) {
                this.estadisticas.setAtributosInfo(Fuerza, Agilidad, Inteligencia, Carisma, Constitucion);
            }

            setFameInfo(Asesino, Bandido, Burgues, Ladron, Noble, Plebe, Promedio) {
                this.estadisticas.setFameInfo(Asesino, Bandido, Burgues, Ladron, Noble, Plebe, Promedio);
            }

            setMiniStats(CiudadanosMatados, CriminalesMatados, UsuariosMatados, NpcsMuertos, Clase, Pena) {
                this.estadisticas.setMiniStats(CiudadanosMatados, CriminalesMatados, UsuariosMatados, NpcsMuertos, Clase, Pena);

            }

            updateSlotUser(numSlot, slot) { //todo: feo todo esto!
                if (slot) {
                    var numGrafico = this.game.assetManager.getNumGraficoFromGrh(slot.grh);
                    this.interfaz.cambiarSlotInventario(numSlot, slot.cantidad, numGrafico, slot.equipado);
                    if (this.comerciar.visible) {
                        this.comerciar.cambiarSlotVenta(numSlot, slot.cantidad, numGrafico);
                    }
                    if (this.boveda.visible) {
                        this.boveda.cambiarSlotDepositar(numSlot, slot.cantidad, numGrafico);
                    }
                }
                else {
                    this.interfaz.borrarSlotInventario(numSlot);
                    if (this.comerciar.visible) {
                        this.comerciar.borrarSlotVenta(numSlot);
                    }
                    if (this.boveda.visible) {
                        this.boveda.borrarSlotDepositar(numSlot);
                    }
                }
            }

            updateSlotShop(numSlot, slot) {
                if (slot) {
                    var numGrafico = this.game.assetManager.getNumGraficoFromGrh(slot.grh);
                    this.comerciar.cambiarSlotCompra(numSlot, slot.cantidad, numGrafico);
                }
                else {
                    this.comerciar.borrarSlotCompra(numSlot);
                }
            }

            updateSlotBank(numSlot, slot) {
                if (slot) {
                    var numGrafico = this.game.assetManager.getNumGraficoFromGrh(slot.grh);
                    this.boveda.cambiarSlotRetirar(numSlot, slot.cantidad, numGrafico);
                } else {
                    this.boveda.borrarSlotRetirar(numSlot);
                }
            }

            updateSkillsData(skills) {
                if (this.skills.visible) {
                    this.skills.updateSkillsData(skills);
                }
                if (this.estadisticas.visible) {
                    this.estadisticas.updateSkillsData(skills);
                }
            }

        }

        return GameUI;
    });