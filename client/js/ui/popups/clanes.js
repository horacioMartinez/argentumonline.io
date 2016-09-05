/**
 * Created by horacio on 6/16/16.
 */

define(["text!../../../menus/clanes.html!strip", 'ui/popups/popup', 'ui/popups/tabs/clanesSearch',
    'ui/popups/tabs/miembrosclan','ui/popups/tabs/solicitudesclan','ui/popups/tabs/settingsclan'],
    function (DOMdata, PopUp, ClanesSearchTab, MiembrosClanTab, SolicitudesClanTab, SettingsClanTab) {

    class Clanes extends PopUp {

        constructor(game, detallesClan, showMensajeCb, solicitudClanCb) {

            var options = {
                width: 550,
                height: 500,
                minWidth: 250,
                minHeight: 150
            };
            super(DOMdata, options);


            this.game = game;
            this.detallesClan = detallesClan;
            this.showMensajeCb = showMensajeCb;

            this.searchTab = new ClanesSearchTab(game, detallesClan, showMensajeCb, solicitudClanCb);
            this.miembrosTab = new MiembrosClanTab(game, showMensajeCb);
            this.solicitudesTab = new SolicitudesClanTab(game,showMensajeCb);
            this.settingsTab = new SettingsClanTab();

            this.$miembrosTabButton = $("#clanesMiembrosTabButton");
            this.$solicitudesTabButton = $("#clanesSolicitudesTabButton");
            this.$settingsTabButton = $("#clanesSettingsTabButton");

            this._initTabs();
            this.initCallbacks();

        }

        show() {
            super.show();
            this.game.client.sendRequestGuildLeaderInfo();
        }

        setNombresClanes(nombresClanes) {
            this.searchTab.setNombresClanes(nombresClanes);
        }

        setNombresMiembros(nombresMiembros) {
            this._activarTab(this.$miembrosTabButton);
            this.miembrosTab.setNombresMiembros(nombresMiembros);
        }

        setNombresSolicitantes(nombresSolicitantes) {
            this._activarTab(this.$solicitudesTabButton);
            this._activarTab(this.$settingsTabButton);
            this.solicitudesTab.setNombresSolicitantes(nombresSolicitantes);
        }

        hide(incomingFromServer) {
            super.hide();
            this._desactivarTab(this.$solicitudesTabButton);
            this._desactivarTab(this.$miembrosTabButton);
            this._desactivarTab(this.$settingsTabButton);
        }

        initCallbacks() {
            var self = this;
            
        }
        
        _initTabs(){
            this._inicializarTabDesactivable(this.$solicitudesTabButton);
            this._inicializarTabDesactivable(this.$miembrosTabButton);
            this._inicializarTabDesactivable(this.$settingsTabButton);
        }

        clearDom() {
            super.clearDom();
        }
    }

    return Clanes;
});
