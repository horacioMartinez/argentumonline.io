/**
 * Created by horacio on 6/17/16.
 */

define(["text!../../../menus/detallesClan.html!strip", 'ui/popups/popup'], function (DOMdata, PopUp) {

    class DetallesClan extends PopUp {
        constructor(game,solicitudClanCb) {

            var options = {
                width: 500,
                height: 400,
                minWidth: 250,
                minHeight: 300
            };
            super(DOMdata, options);

            this.game = game;
            this.clan = "";
            this.$botonAbrirSolicitud = $("#detallesClan_botonAplicarse");
            this.$botonCerrar = $("#detallesClan_botonCerrar");

            this.solicitudClanCb = solicitudClanCb;
            this.initCallbacks();
        }

        show(targetClan) {
            super.show();
            this.game.client.sendGuildRequestDetails(targetClan);
            this.clan = targetClan;
        }


        setClanInfo(GuildName, Founder, FoundationDate, Leader, URL, MemberCount, ElectionsOpen, Aligment, EnemiesCount, AlliesCount, AntifactionPoints, Codex, GuildDesc) {
            $("#detallesClan_nombre").text(GuildName);
            $("#detallesClan_miembros").text(MemberCount);
            $("#detallesClan_fundador").text(Founder);
            $("#detallesClan_lider").text(Leader);
            $("#detallesClan_web").text(URL);
            $("#detallesClan_enemigos").text(EnemiesCount);
            $("#detallesClan_aliados").text(AlliesCount);
            $("#detallesClan_puntosAntifaccion").text(AntifactionPoints);
            $("#detallesClan_fechaCreacion").text(FoundationDate);
            $("#detallesClan_elecciones").text(ElectionsOpen);
            $("#detallesClan_alineacion").text(Aligment);
            $("#detallesClan_codex").text(Codex);
            $("#detallesClan_descripcion").text(GuildDesc);
        }

        initCallbacks() {
            var self = this;

            this.$botonAbrirSolicitud.click(function () {
                self.solicitudClanCb(self.clan);
            });

            this.$botonCerrar.click(function(){
                self.hide();
            });
        }

    }

    return DetallesClan;
});
