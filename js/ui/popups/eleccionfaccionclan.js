/**
 * Created by horacio on 7/7/16.
 */

// Import HTML template as string (will be handled by Vite)
import DOMdata from '../../../menus/eleccionFaccionClan.html?raw';
import Enums from '../../enums.js';
import PopUp from '../../ui/popups/popup.js';



    class EleccionFaccionClan extends PopUp {
        constructor(game) {

            var options = {
                width: 550,
                height: 500,
                minWidth: 50,
                minHeight: 200
            };
            super(DOMdata, options, true);

            this.game = game;
            this.initCallbacks();
        }

        _seleccionarAlineacion(alineacion) {
            this.game.client.sendGuildFundation(alineacion);
            this.hide();
        }

        initCallbacks() {
            var self = this;

            $("#faccionClan_alineacionReal").click(function () {
                self._seleccionarAlineacion(Enums.ClanType.ROYAL_ARMY);
            });
            $("#faccionClan_alineacionLegal").click(function () {
                self._seleccionarAlineacion(Enums.ClanType.LEGAL);
            });
            $("#faccionClan_alineacionNeutral").click(function () {
                self._seleccionarAlineacion(Enums.ClanType.NEUTRAL);
            });
            $("#faccionClan_alineacionCriminal").click(function () {
                self._seleccionarAlineacion(Enums.ClanType.CRIMINAL);
            });
            $("#faccionClan_alineacionCaos").click(function () {
                self._seleccionarAlineacion(Enums.ClanType.EVIL);
            });
            $("#faccionClanBotonCancelar").click(function () {
                self.hide();
            });
        }
    }

    
export default EleccionFaccionClan;