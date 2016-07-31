/**
 * Created by horacio on 7/7/16.
 */

define(['../../utils/searchinputfilter'], function (SearchInputFilter) {

    class MiembrosClan {
        constructor(game, showMensajeCb) {
            this.game = game;

            this.showMensajeCb = showMensajeCb;

            this.$inputSearchMember = $("#clanesMiembrosTabInputNombre");
            this.$miembrosNameList = $("#clanesMembersList");
            this.$botonNoticias = $("#clanesMiembrosBotonNoticias");
            this.$botonDetalles = $("#clanesMiembrosBotonDetalles");
            this.$botonHechar = $("#clanesMiembrosBotonHechar");

            this.initCallbacks();
        }

        setNombresMiembros(nombresMiembros) {
            this.$miembrosNameList.empty();
            for (var nombre of nombresMiembros) {
                var $nuevoMiembro = $("<option>").text(nombre);
                this.$miembrosNameList.append($nuevoMiembro);
            }
        }

        _getMiembroSeleccionado() {
            return this.$miembrosNameList.find('option:selected').text();
        }

        initCallbacks() {
            var self = this;

            SearchInputFilter.makeInputFilterElement(this.$inputSearchMember, this.$miembrosNameList, 'option' );
            
            this.$botonNoticias.click(function () {
                self.game.client.sendShowGuildNews();
            });

            this.$botonDetalles.click(function () {
                let pj = self._getMiembroSeleccionado();
                if (pj) {
                    self.game.client.sendGuildMemberInfo(pj);
                } else{
                    self.showMensajeCb("Debes seleccionar un personaje");
                }
            });
            this.$botonHechar.click( function(){
                let pj = self._getMiembroSeleccionado();
                if (pj) {
                    self.game.client.sendGuildKickMember(pj);
                    self.game.client.sendRequestGuildLeaderInfo();
                } else{
                    self.showMensajeCb("Debes seleccionar un personaje");
                }
            });
        }
    }

    return MiembrosClan;
});