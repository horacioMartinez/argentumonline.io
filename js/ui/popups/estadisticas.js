/**
 * Created by horacio on 7/10/16.
 */

// Import HTML template as string (will be handled by Vite)
import DOMdata from '../../../menus/estadisticas.html?raw';
import PopUp from '../../ui/popups/popup.js';
import Enums from '../../enums.js';



    class Estadisticas extends PopUp {
        constructor(game) {

            var options = {
                width: 500,
                height: 400,
                minWidth: 250,
                minHeight: 300
            };
            super(DOMdata, options);

            this.game = game;
            this.skills = this.game.skills;
            this._callbacksInitialized = false;
        }

        show() {
            super.show();
            
            if (!this._callbacksInitialized) {
                this._initializeDOMReferences();
                this.initCallbacks();
                this._callbacksInitialized = true;
            }
            
            this.game.client.sendRequestAtributes();
            this.game.client.sendRequestSkills();
            this.game.client.sendRequestMiniStats();
            this.game.client.sendRequestFame();
        }
        
        _initializeDOMReferences() {
            this.$botonCerrar = this.$this.find("#estadisticas_botonCerrar");
            this.$contenedorSkills = this.$this.find("#estadisticasContenedorSkills");
        }

        setAtributosInfo(Fuerza, Agilidad, Inteligencia, Carisma, Constitucion) {
            this.$this.find("#estadisticas_fuerza").text(Fuerza);
            this.$this.find("#estadisticas_agilidad").text(Agilidad);
            this.$this.find("#estadisticas_inteligencia").text(Inteligencia);
            this.$this.find("#estadisticas_carisma").text(Carisma);
            this.$this.find("#estadisticas_constitucion").text(Constitucion);
        }

        setFameInfo(Asesino, Bandido, Burgues, Ladron, Noble, Plebe, Promedio) {
            this.$this.find("#estadisticas_asesino").text(Asesino);
            this.$this.find("#estadisticas_bandido").text(Bandido);
            this.$this.find("#estadisticas_burgues").text(Burgues);
            this.$this.find("#estadisticas_ladron").text(Ladron);
            this.$this.find("#estadisticas_noble").text(Noble);
            this.$this.find("#estadisticas_plebe").text(Plebe);
            if (Promedio < 0) {
                this.$this.find("#estadisticas_status").text("Criminal");
            } else {
                this.$this.find("#estadisticas_status").text("Ciudadano");
            }
        }

        setMiniStats(CiudadanosMatados, CriminalesMatados, UsuariosMatados, NpcsMuertos, Clase, Pena) {
            this.$this.find("#estadisticas_ciudadanosMatados").text(CiudadanosMatados);
            this.$this.find("#estadisticas_criminalesMatados").text(CriminalesMatados);
            this.$this.find("#estadisticas_usuariosMatados").text(UsuariosMatados);
            this.$this.find("#estadisticas_criaturasMatadas").text(NpcsMuertos);
            this.$this.find("#estadisticas_clase").text(Enums.NombreClase[Clase]);
            this.$this.find("#estadisticas_tiempoRestanteCarcel").text(Pena);
        }

        updateSkillsData() {
            this.$contenedorSkills.empty();
            var self = this;
            this.skills.forEachSkill(function (numSkill, puntos, porcentaje, nombre) {
                self.$contenedorSkills.append('<tr>'
                    + '<td class="secondaryColor">'+nombre+'</td>'
                    + '<td class="everywhereBoldFont">'+puntos+'</td>'
                    + '<td class="everywhereBoldFont">'+porcentaje+"%"+'</td>'
                    + '</tr>');
            });
        }

        initCallbacks() {
            var self = this;

            this.$botonCerrar.click(function () {
                self.hide();
            });
        }

    }

    
export default Estadisticas;