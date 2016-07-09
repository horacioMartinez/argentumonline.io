/**
 * Created by horacio on 7/9/16.
 */

define(["text!../../../menus/detallesPersonaje.html!strip", 'ui/popups/popup'], function (DOMdata, PopUp) {

    class DetallesPersonaje extends PopUp {
        constructor(game) {

            var options = {
                width: 500,
                height: 400,
                minWidth: 250,
                minHeight: 300
            };
            super(DOMdata, options);

            this.game = game;
            this.clan = "";
            this.$botonCerrar = $("#detallesPersonaje_botonCerrar");

            this.initCallbacks();
        }

        show(CharName, Race, Class, Gender, Level, Gold, Bank, Reputation, PreviousPetitions, CurrentGuild, PreviousGuilds, RoyalArmy, ChaosLegion, CiudadanosMatados, CriminalesMatados) {
            this.setPersonajeInfo(CharName, Race, Class, Gender, Level, Gold, Bank, Reputation, PreviousPetitions, CurrentGuild, PreviousGuilds, RoyalArmy, ChaosLegion, CiudadanosMatados, CriminalesMatados);
            super.show();
        }

        setPersonajeInfo(CharName, Race, Class, Gender, Level, Gold, Bank, Reputation, PreviousPetitions, CurrentGuild, PreviousGuilds, RoyalArmy, ChaosLegion, CiudadanosMatados, CriminalesMatados) {

            $("#detallesPersonaje_nombre").text(CharName);
            $("#detallesPersonaje_raza").text(Race);
            $("#detallesPersonaje_clase").text(Class);
            $("#detallesPersonaje_genero").text(Gender);
            $("#detallesPersonaje_nivel").text(Level);
            $("#detallesPersonaje_oro").text(Gold);
            $("#detallesPersonaje_banco").text(Bank);
            $("#detallesPersonaje_clan").text(CurrentGuild);
            $("#detallesPersonaje_faccion").text(RoyalArmy);
            $("#detallesPersonaje_ciudadanosAsesinados").text(CiudadanosMatados);
            $("#detallesPersonaje_criminalesAsesinados").text(CriminalesMatados);
            $("#detallesPersonaje_reputacion").text(Reputation);
            $("#detallesPersonaje_alineacion").text(ChaosLegion);
            $("#detallesPersonaje_SolicitudesIngreso").text(PreviousPetitions);
            $("#detallesPersonaje_clanesIntegrados").text(PreviousGuilds);
        }

        initCallbacks() {
            var self = this;

            this.$botonCerrar.click(function () {
                self.hide();
            });
        }

    }

    return DetallesPersonaje;
});
