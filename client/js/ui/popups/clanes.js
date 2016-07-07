/**
 * Created by horacio on 6/16/16.
 */

define(["text!../../../menus/clanes.html!strip", 'ui/popups/popup', 'ui/popups/tabs/clanesSearch','ui/popups/tabs/miembrosClan','ui/popups/tabs/solicitudesClan'], function (DOMdata, PopUp, ClanesSearchTab, MiembrosClanTab, SolicitudesClanTab) {

    class Clanes extends PopUp {

        constructor(game, detallesClan, showMensajeCb, solicitudClanCb) {

            var options = {
                width: 800,
                height: 600,
                minWidth: 250,
                minHeight: 300
            };
            super(DOMdata, options);


            this.game = game;
            this.detallesClan = detallesClan;
            this.showMensajeCb = showMensajeCb;

            this.searchTab = new ClanesSearchTab(game, detallesClan, showMensajeCb, solicitudClanCb);
            this.miembrosTab = new MiembrosClanTab();
            this.solicitudesTab = new SolicitudesClanTab();
            
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
            this.miembrosTab.setNombresMiembros(nombresMiembros);
        }

        setNombresSolicitantes(nombresSolicitantes) {
            this.solicitudesTab.setNombresSolicitantes(nombresSolicitantes);
        }

        hide(incomingFromServer) {
            super.hide();
        }

        initCallbacks() {
            var self = this;
            
        }

        clearDom() {
            super.clearDom();
        }
    }

    return Clanes;
});
