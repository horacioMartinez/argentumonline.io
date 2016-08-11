/**
 * Created by horacio on 7/10/16.
 */

define(["text!../../../menus/estadisticas.html!strip", 'ui/popups/popup', 'enums'], function (DOMdata, PopUp, Enums) {

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

            this.$botonCerrar = $("#estadisticas_botonCerrar");
            this.$contenedorSkills = $("#estadisticasContenedorSkills");

            this.skills = this.game.skills;
            this.skillsInicializados = false;

            this.initCallbacks();
        }

        show() {
            super.show();
            this.game.client.sendRequestAtributes();
            this.game.client.sendRequestSkills();
            this.game.client.sendRequestMiniStats();
            this.game.client.sendRequestFame();
        }

        setAtributosInfo(Fuerza, Agilidad, Inteligencia, Carisma, Constitucion) {
            $("#estadisticas_fuerza").text(Fuerza);
            $("#estadisticas_agilidad").text(Agilidad);
            $("#estadisticas_inteligencia").text(Inteligencia);
            $("#estadisticas_carisma").text(Carisma);
            $("#estadisticas_constitucion").text(Constitucion);
        }

        setFameInfo(Asesino, Bandido, Burgues, Ladron, Noble, Plebe, Promedio) {
            $("#estadisticas_asesino").text(Asesino);
            $("#estadisticas_bandido").text(Bandido);
            $("#estadisticas_burgues").text(Burgues);
            $("#estadisticas_ladron").text(Ladron);
            $("#estadisticas_noble").text(Noble);
            $("#estadisticas_plebe").text(Plebe);
            if (Promedio < 0) {
                $("#estadisticas_status").text("Criminal");
            } else {
                $("#estadisticas_status").text("Ciudadano");
            }
        }

        setMiniStats(CiudadanosMatados, CriminalesMatados, UsuariosMatados, NpcsMuertos, Clase, Pena) {
            $("#estadisticas_ciudadanosMatados").text(CiudadanosMatados);
            $("#estadisticas_criminalesMatados").text(CriminalesMatados);
            $("#estadisticas_usuariosMatados").text(UsuariosMatados);
            $("#estadisticas_criaturasMatadas").text(NpcsMuertos);
            $("#estadisticas_clase").text(Enums.NombreClase[Clase]);
            $("#estadisticas_tiempoRestanteCarcel").text(Pena);
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

    return Estadisticas;
});