/**
 * Created by horacio on 7/6/16.
 */

define(['../../utils/searchinputfilter'], function (SearchInputFilter) {

    class ClanesSearch {
        constructor(game, detallesClan, showMensajeCb, solicitudClanCb) {
            this.game = game;
            this.detallesClan = detallesClan;
            this.showMensajeCb = showMensajeCb;
            this.solicitudClanCb = solicitudClanCb;

            this.$inputClanName = $("#clanesSearchTabInputNombre");
            this.$clanesNameList = $("#clanesSearchListaClanes");
            this.$botonCrearClan = $("#clanesSearchBotonCrear");
            this.$botonIngresarClan = $("#clanesSearchBotonIngresar");
            this.$botonDetallesClan = $("#clanesSearchBotonDetalles");
            this.initCallbacks();
        }

        onShow() {
            this.game.client.sendRequestGuildLeaderInfo();
        }

        setNombresClanes(nombresClanes) {
            this.$clanesNameList.empty();
            for (var nombre of nombresClanes) {
                var $nuevoClan = $("<option>").text(nombre);
                this.$clanesNameList.append($nuevoClan);
            }
        }

        _getClanSeleccionado() {
            return this.$clanesNameList.find('option:selected').text();
        }

        initCallbacks() {
            var self = this;


            SearchInputFilter.makeInputFilterElement(this.$inputClanName, this.$clanesNameList, 'option');

            this.$botonDetallesClan.click(function () {
                var clanSeleccionado = self._getClanSeleccionado();
                if (!clanSeleccionado) {
                    self.showMensajeCb("Debes seleccionar un clan");
                } else {
                    self.detallesClan.show(clanSeleccionado);
                }
            });
            this.$botonIngresarClan.click(function () {
                var clanSeleccionado = self._getClanSeleccionado();
                if (!clanSeleccionado) {
                    self.showMensajeCb("Debes seleccionar un clan");
                } else {
                    self.solicitudClanCb(clanSeleccionado);
                }
            });
            this.$botonCrearClan.click(function () {
                if (self.game.atributos.nivel > 24) { // todo: checkear skills ?
                    self.game.client.sendGuildFundate();
                } else {
                    self.showMensajeCb("Para fundar un clan tienes que ser nivel 25 y tener 90 skills en liderazgo.");
                }
            });
        }
    }

    return ClanesSearch;
});