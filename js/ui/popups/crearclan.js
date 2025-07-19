/**
 * Created by horacio on 7/8/16.
 */

// Import HTML template as string (will be handled by Vite)
import DOMdata from '../../../menus/crearClan.html?raw';
import PopUp from '../../ui/popups/popup.js';
import Utils from '../../utils/util.js';



    class CrearClan extends PopUp {
        constructor(game, showMensajeCb) {

            var options = {
                width: 500,
                height: 400,
                minWidth: 250,
                minHeight: 300
            };
            super(DOMdata, options);

            this.game = game;
            this.showMensajeCb = showMensajeCb;
            
            this.$botonCrear = $("#crearClanBotonCrear");
            this.$botonCancelar = $("#crearClanBotonCancelar");

            this.$inputNombre = $("#crearClanNombre");
            this.$inputWebsite = $("#crearClanWebsite");
            this.$inputDescripcion = $("#crearClanDescripcion");
            this.prefixCodex = "crearClanCodex_";

            this.initCallbacks();
        }

        _getCodexText() {
            let NUMBER_OF_LINES = 8;
            let MINIMUM_LINES = 4;
            let result = [];
            let completedLines = 0;
            for (let i = 0; i < NUMBER_OF_LINES; i++) {
                let $inputLine = $('#' + this.prefixCodex + i);
                let text = $inputLine.val();
                if (text) {
                    completedLines++;
                    result.push(text);
                }
            }
            if (completedLines < 4) {
                return false;
            }
            return Utils.joinNullArray(result);
        }

        _verificarCampos() {
            return !(!this.$inputNombre.val() || !this.$inputWebsite.val() || !this.$inputDescripcion.val() || !this._getCodexText());
        }

        initCallbacks() {
            var self = this;

            this.$botonCancelar.click(function () {
                self.hide();
            });

            this.$botonCrear.click(function () {
                if (!self._verificarCampos()){
                    self.showMensajeCb("Debes completar todos los campos");
                    return;
                }
                self.game.client.sendCreateNewGuild(self.$inputDescripcion.val(), self.$inputNombre.val(),
                    self.$inputWebsite.val(), self._getCodexText());
                self.hide();
            });
        }

    }

    
export default CrearClan;