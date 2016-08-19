/**
 * Created by horacio on 2/27/16.
 */

define(['enums', 'utils/util', 'ui/popups/crearpersonaje'], function (Enums, Utils, DialogCrearPersonaje) {
    class CrearPjUI {
        constructor(assetManager, showMensajeCb) {
            this.assetManager = assetManager;
            this.showMensajeCb = showMensajeCb;

            this._inicializado = false;
            this.offsetSelectedCabeza = 0;

            this.$imgCabezaIzq = $('#crearPjSeleccionCabezaImagenIzq');
            this.$imgCabezaCentro = $('#crearPjSeleccionCabezaImagenCenter');
            this.$imgCabezaDer = $('#crearPjSeleccionCabezaImagenDer');

            this.$imagenCuerpo = $('#crearPjImagenPersonaje');
            this.$imagenCabezaCuerpo = $('#crearPjImagenCabezaPersonaje');

            this._dialogCrearPersonaje = null;
        }

        get dialogCrearPersonaje() {
            this._dialogCrearPersonaje = this._dialogCrearPersonaje || new DialogCrearPersonaje(this.showMensajeCb);
            return this._dialogCrearPersonaje;
        }

        inicializar() {
            if (this._inicializado) {
                return;
            } else {
                this._inicializado = true;
            }

            var self = this;

            var id = "crearSelectCiudad";
            var $sel = $('#' + id);
            this.modificarSlotInput($sel, id, Enums.Ciudad.Ullathorpe, "Ullathorpe");
            this.modificarSlotInput($sel, id, Enums.Ciudad.Nix, "Nix");
            this.modificarSlotInput($sel, id, Enums.Ciudad.Banderbill, "Banderbill");
            this.modificarSlotInput($sel, id, Enums.Ciudad.Lindos, "Lindos");
            this.modificarSlotInput($sel, id, Enums.Ciudad.Arghal, "Arghal");

            id = "crearSelectRaza";
            $sel = $('#' + id);
            this.modificarSlotInput($sel, id, Enums.Raza.humano, "Humano");
            this.modificarSlotInput($sel, id, Enums.Raza.elfo, "Elfo");
            this.modificarSlotInput($sel, id, Enums.Raza.elfoOscuro, "Elfo Oscuro");
            this.modificarSlotInput($sel, id, Enums.Raza.gnomo, "Gnomo");
            this.modificarSlotInput($sel, id, Enums.Raza.enano, "Enano");
            $sel.change(function () {
                self._updatePJ();
            });

            id = "crearSelectClase";
            $sel = $('#' + id);
            this.modificarSlotInput($sel, id, Enums.Clase.clerigo, Enums.NombreClase[Enums.Clase.clerigo]);
            this.modificarSlotInput($sel, id, Enums.Clase.guerrero, Enums.NombreClase[Enums.Clase.guerrero]);
            this.modificarSlotInput($sel, id, Enums.Clase.mago, Enums.NombreClase[Enums.Clase.mago]);
            this.modificarSlotInput($sel, id, Enums.Clase.paladin, Enums.NombreClase[Enums.Clase.paladin]);
            this.modificarSlotInput($sel, id, Enums.Clase.asesino, Enums.NombreClase[Enums.Clase.asesino]);
            this.modificarSlotInput($sel, id, Enums.Clase.ladron, Enums.NombreClase[Enums.Clase.ladron]);
            this.modificarSlotInput($sel, id, Enums.Clase.bardo, Enums.NombreClase[Enums.Clase.bardo]);
            this.modificarSlotInput($sel, id, Enums.Clase.druida, Enums.NombreClase[Enums.Clase.druida]);
            this.modificarSlotInput($sel, id, Enums.Clase.bandido, Enums.NombreClase[Enums.Clase.bandido]);
            this.modificarSlotInput($sel, id, Enums.Clase.cazador, Enums.NombreClase[Enums.Clase.cazador]);
            this.modificarSlotInput($sel, id, Enums.Clase.trabajador, Enums.NombreClase[Enums.Clase.trabajador]);
            this.modificarSlotInput($sel, id, Enums.Clase.pirata, Enums.NombreClase[Enums.Clase.pirata]);

            $("#crearBotonGeneroMasculino").addClass('selected');
            $("#crearBotonGeneroFemenino").removeClass('selected');

            $("#crearBotonGeneroMasculino").click(() => {
                $("#crearBotonGeneroMasculino").toggleClass('selected');
                $("#crearBotonGeneroFemenino").toggleClass('selected');
                this._updatePJ();
            });

            $("#crearBotonGeneroFemenino").click(() => {
                $("#crearBotonGeneroMasculino").toggleClass('selected');
                $("#crearBotonGeneroFemenino").toggleClass('selected');
                this._updatePJ();
            });

            $('#crearPjSeleccionCabezaBotonIzq').click(() => {
                this.offsetSelectedCabeza--;
                this._updatePJ();
            });
            $('#crearPjSeleccionCabezaBotonDer').click(() => {
                this.offsetSelectedCabeza++;
                this._updatePJ();
            });
            this._updatePJ();
        }

        _getGenero() {
            return $("#crearBotonGeneroMasculino").hasClass('selected') ? Enums.Genero.hombre : Enums.Genero.mujer;
        }

        _getRaza() {
            return parseInt($("#crearSelectRaza").val());
        }

        modificarSlotInput($sel, id, slot, texto) {
            var elemento = $('#' + id + ' option[value=' + slot + ']');
            if (!elemento.length) { // nuevo elemento
                $sel.append($("<option>").attr('value', slot).text(texto));
            }
            else {
                $(elemento).text(texto);
            }
        }

        setBotonTirarDadosCallback(cb) {

            $('#crearBotonTirarDados').click(() => {
                cb();
                this.assetManager.audio.playSound(Enums.SONIDOS.dados);
            });
        }

        setBotonVolverCallback(cb) {
            var self = this;
            $('#crearBotonVolver').click(function () {
                self.dialogCrearPersonaje.hide();
                cb();
            });
        }

        setBotonCrearCallback(cb) {
            var self = this;

            self.dialogCrearPersonaje.crearCb = cb;

            $('#crearBotonCrear').click(function () {
                var raza = self._getRaza();
                var genero = self._getGenero();
                var clase = $("#crearSelectClase").val();
                var ciudad = $("#crearSelectCiudad").val();
                var cabeza = self._getCabezaNum(self.offsetSelectedCabeza);

                self.dialogCrearPersonaje.show(raza, genero, clase, ciudad, cabeza);
            });
        }

        _getCabezaNum(offset) {
            var cabezas = this.getPrimerYUltimaCabezaNum();
            var incremento = Utils.modulo(offset, (cabezas.ultima - cabezas.primera));

            return cabezas.primera + incremento;
        }

        _updatePJ() {
            this._actualizarAlturaPJ();
            this._updateCabezas();
            this._updateCuerpo();
        }

        _actualizarAlturaPJ() {
            let raza = this._getRaza();
            let petizo = (raza === Enums.Raza.gnomo || raza === Enums.Raza.enano);
            if (petizo) {
                this.$imagenCabezaCuerpo.addClass('petizo');
            } else {
                this.$imagenCabezaCuerpo.removeClass('petizo');
            }
        }

        _updateCabezas() {
            var cabezaIzq = this._getCabezaNum(this.offsetSelectedCabeza - 1);
            var cabezaCentro = this._getCabezaNum(this.offsetSelectedCabeza);
            var cabezaDer = this._getCabezaNum(this.offsetSelectedCabeza + 1);
            var numGrafIzq = this.assetManager.getFaceGrafFromNum(cabezaIzq);
            var numGrafCentro = this.assetManager.getFaceGrafFromNum(cabezaCentro);
            var numGrafDer = this.assetManager.getFaceGrafFromNum(cabezaDer);

            var url = "url(graficos/css/" + numGrafIzq + ".png)";
            this.$imgCabezaIzq.css('background-image', url);
            url = "url(graficos/css/" + numGrafDer + ".png)";
            this.$imgCabezaDer.css('background-image', url);
            url = "url(graficos/css/" + numGrafCentro + ".png)";
            this.$imgCabezaCentro.css('background-image', url);
            this.$imagenCabezaCuerpo.css('background-image', url);
        }

        _updateCuerpo() {
            var raza = this._getRaza();
            var genero = this._getGenero();

            var numCuerpo = this._getCuerpoNum(genero, raza);
            var numGraf = this.assetManager.getBodyGrafFromNum(numCuerpo);
            var url = "url(graficos/css/" + numGraf + ".png)";
            this.$imagenCuerpo.css('background-image', url);
        }

        updateDados(Fuerza, Agilidad, Inteligencia, Carisma, Constitucion) {
            $('#crearDadoFuerza').text("Fuerza: " + Fuerza);
            $('#crearDadoAgilidad').text("Agilidad: " + Agilidad);
            $('#crearDadoInteligencia').text("Inteligencia: " + Inteligencia);
            $('#crearDadoCarisma').text("Carisma: " + Carisma);
            $('#crearDadoConstitucion').text("Constitucion: " + Constitucion);
        }

        getPrimerYUltimaCabezaNum() {
            let genero = this._getGenero();
            let raza = this._getRaza();

            var HUMANO_H_PRIMER_CABEZA = 1;
            var HUMANO_H_ULTIMA_CABEZA = 40;//TODO: deberia ser 51 pero el sv las toma como invalidas
            var ELFO_H_PRIMER_CABEZA = 101;
            var ELFO_H_ULTIMA_CABEZA = 122;
            var DROW_H_PRIMER_CABEZA = 201;
            var DROW_H_ULTIMA_CABEZA = 221;
            var ENANO_H_PRIMER_CABEZA = 301;
            var ENANO_H_ULTIMA_CABEZA = 319;
            var GNOMO_H_PRIMER_CABEZA = 401;
            var GNOMO_H_ULTIMA_CABEZA = 416;
            //**************************************************
            var HUMANO_M_PRIMER_CABEZA = 70;
            var HUMANO_M_ULTIMA_CABEZA = 89;
            var ELFO_M_PRIMER_CABEZA = 170;
            var ELFO_M_ULTIMA_CABEZA = 188;
            var DROW_M_PRIMER_CABEZA = 270;
            var DROW_M_ULTIMA_CABEZA = 288;
            var ENANO_M_PRIMER_CABEZA = 370;
            var ENANO_M_ULTIMA_CABEZA = 384;
            var GNOMO_M_PRIMER_CABEZA = 470;
            var GNOMO_M_ULTIMA_CABEZA = 484;

            if (genero === Enums.Genero.hombre) {
                switch (raza) {
                    case Enums.Raza.humano:
                        return {primera: HUMANO_H_PRIMER_CABEZA, ultima: HUMANO_H_ULTIMA_CABEZA};
                        break;
                    case Enums.Raza.elfo:
                        return {primera: ELFO_H_PRIMER_CABEZA, ultima: ELFO_H_ULTIMA_CABEZA};
                        break;
                    case Enums.Raza.elfoOscuro:
                        return {primera: DROW_H_PRIMER_CABEZA, ultima: DROW_H_ULTIMA_CABEZA};
                        break;
                    case Enums.Raza.enano:
                        return {primera: ENANO_H_PRIMER_CABEZA, ultima: ENANO_H_ULTIMA_CABEZA};
                        break;
                    case Enums.Raza.gnomo:
                        return {primera: GNOMO_H_PRIMER_CABEZA, ultima: GNOMO_H_ULTIMA_CABEZA};
                        break;
                    default:
                        log.error("raza invalida");
                }
            }
            if (genero === Enums.Genero.mujer) {
                switch (raza) {
                    case Enums.Raza.humano:
                        return {primera: HUMANO_M_PRIMER_CABEZA, ultima: HUMANO_M_ULTIMA_CABEZA};
                        break;
                    case Enums.Raza.elfo:
                        return {primera: ELFO_M_PRIMER_CABEZA, ultima: ELFO_M_ULTIMA_CABEZA};
                        break;
                    case Enums.Raza.elfoOscuro:
                        return {primera: DROW_M_PRIMER_CABEZA, ultima: DROW_M_ULTIMA_CABEZA};
                        break;
                    case Enums.Raza.enano:
                        return {primera: ENANO_M_PRIMER_CABEZA, ultima: ENANO_M_ULTIMA_CABEZA};
                        break;
                    case Enums.Raza.gnomo:
                        return {primera: GNOMO_M_PRIMER_CABEZA, ultima: GNOMO_M_ULTIMA_CABEZA};
                        break;
                    default:
                        log.error("raza invalida");
                }
            }
        }

        _getCuerpoNum() {
            let genero = this._getGenero();
            let raza = this._getRaza();

            var HUMANO_H_CUERPO_DESNUDO = 21;
            var ELFO_H_CUERPO_DESNUDO = 210;
            var DROW_H_CUERPO_DESNUDO = 32;
            var ENANO_H_CUERPO_DESNUDO = 53;
            var GNOMO_H_CUERPO_DESNUDO = 222;
            //**************************************************
            var HUMANO_M_CUERPO_DESNUDO = 39;
            var ELFO_M_CUERPO_DESNUDO = 259;
            var DROW_M_CUERPO_DESNUDO = 40;
            var ENANO_M_CUERPO_DESNUDO = 60;
            var GNOMO_M_CUERPO_DESNUDO = 260;
            if (genero === Enums.Genero.hombre) {
                switch (raza) {
                    case Enums.Raza.humano:
                        return HUMANO_H_CUERPO_DESNUDO;
                        break;
                    case Enums.Raza.elfo:
                        return ELFO_H_CUERPO_DESNUDO;
                        break;
                    case Enums.Raza.elfoOscuro:
                        return DROW_H_CUERPO_DESNUDO;
                        break;
                    case Enums.Raza.enano:
                        return ENANO_H_CUERPO_DESNUDO;
                        break;
                    case Enums.Raza.gnomo:
                        return GNOMO_H_CUERPO_DESNUDO;
                        break;
                    default:
                        log.error("raza invalida");
                }
            }
            if (genero === Enums.Genero.mujer) {
                switch (raza) {
                    case Enums.Raza.humano:
                        return HUMANO_M_CUERPO_DESNUDO;
                        break;
                    case Enums.Raza.elfo:
                        return ELFO_M_CUERPO_DESNUDO;
                        break;
                    case Enums.Raza.elfoOscuro:
                        return DROW_M_CUERPO_DESNUDO;
                        break;
                    case Enums.Raza.enano:
                        return ENANO_M_CUERPO_DESNUDO;
                        break;
                    case Enums.Raza.gnomo:
                        return GNOMO_M_CUERPO_DESNUDO;
                        break;
                    default:
                        log.error("raza invalida");
                }
            }

        }
    }

    return CrearPjUI;
});

