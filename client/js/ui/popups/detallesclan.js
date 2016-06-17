/**
 * Created by horacio on 6/17/16.
 */

define(["text!../../../menus/detallesClan.html!strip", 'ui/popups/popup'], function (DOMdata, PopUp) {

    class DetallesClan extends PopUp {
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

            this.initCallbacks();
        }

        show(targetClan) {
            super.show();
            this.game.client.sendGuildRequestDetails(targetClan);
            this.clan = targetClan;
        }

        setClanInfo(GuildName, Founder, FoundationDate, Leader, URL, MemberCount, ElectionsOpen, Aligment, EnemiesCount, AlliesCount, AntifactionPoints, Codex, GuildDesc) {
            //TODO
        }

        initCallbacks() {
            var self = this;

            $("#detallesClanBotonEnviarSolicitud").click(function () {
                var textoSolicitud = $("#detallesClanInputSolicitud").val();
                self.game.client.sendGuildRequestMembership(self.clan, textoSolicitud);
            });

        }

    }

    return DetallesClan;
});
