/**
 * Created by horacio on 7/7/16.
 */

define([], function () {

    class SolicitudesClan {
        constructor(game, showMensajeCb) {
            this.game = game;
            this.showMensajeCb = showMensajeCb;

            this.$solicitantesNameList = $("#clanesMembershipRequestList");
            this.$botonDetalles = $("#clanesLiderBotonDetalles");
            this.$botonAceptar = $("#clanesLiderBotonAceptar");
            this.$botonRechazar = $("#clanesLiderBotonRechazar");
            this.$botonVerPeticion = $("#clanesLiderBotonVerPeticion");
            this.initCallbacks();
        }

        _getSolicitudSeleccionada() {
            return this.$solicitantesNameList.find('option:selected').text();
        }

        _ejecutarConSolicitante(cbFunc) {
            let pj = this._getSolicitudSeleccionada();
            if (pj) {
                cbFunc(pj);
            } else {
                this.showMensajeCb("Debes seleccionar un personaje");
            }
        }

        setNombresSolicitantes(nombresSolicitantes) {
            this.$solicitantesNameList.empty();
            for (var nombre of nombresSolicitantes) {
                var $nuevoSolicitante = $("<option>").text(nombre);
                this.$solicitantesNameList.append($nuevoSolicitante);
            }
        }

        initCallbacks() {
            this.$botonDetalles.click(() => {
                this._ejecutarConSolicitante(
                    function (pj) {
                        this.game.client.sendGuildMemberInfo(pj);
                    }.bind(this));
            });

            this.$botonAceptar.click(() => {
                this._ejecutarConSolicitante(
                    function (pj) {
                        this.game.client.sendGuildAcceptNewMember(pj);
                        this.game.client.sendRequestGuildLeaderInfo();
                    }.bind(this));
            });

            this.$botonRechazar.click(() => {
                this._ejecutarConSolicitante(
                    function (pj) {
                        this.game.client.sendGuildRejectNewMember(pj);
                        this.game.client.sendRequestGuildLeaderInfo();
                    }.bind(this));
            });
        }
    }

    return SolicitudesClan;
});