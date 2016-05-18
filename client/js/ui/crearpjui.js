/**
 * Created by horacio on 2/27/16.
 */

define(['enums', 'ui/game/itemgrid'], function (Enums, ItemGrid) {
    var CrearPjUI = Class.extend({
        init: function (assetManager, mensaje) {
            this.assetManager = assetManager;
            this.mensaje = mensaje;
            this._inicializado = false;
            this.LARGO_MINIMO_PASSWORD = 5;
            this.cabezasGrid = null;
        },

        inicializar: function () {
            if (this._inicializado)
                return;
            else
                this._inicializado = true;

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
            $sel.change(function(){
                self.updateCabezas();
            });

            id = "crearSelectClase";
            $sel = $('#' + id);
            this.modificarSlotInput($sel, id, Enums.Clase.mago, "Mago");
            this.modificarSlotInput($sel, id, Enums.Clase.clerigo, "Clérigo");
            this.modificarSlotInput($sel, id, Enums.Clase.guerrero, "Guerrero");
            this.modificarSlotInput($sel, id, Enums.Clase.asesino, "Asesino");
            this.modificarSlotInput($sel, id, Enums.Clase.ladron, "Ladrón");
            this.modificarSlotInput($sel, id, Enums.Clase.bardo, "Bardo");
            this.modificarSlotInput($sel, id, Enums.Clase.druida, "Druida");
            this.modificarSlotInput($sel, id, Enums.Clase.bandido, "Bandido");
            this.modificarSlotInput($sel, id, Enums.Clase.paladin, "Paladín");
            this.modificarSlotInput($sel, id, Enums.Clase.cazador, "Cazador");
            this.modificarSlotInput($sel, id, Enums.Clase.trabajador, "Trabajador");
            this.modificarSlotInput($sel, id, Enums.Clase.pirata, "Pirata");

            id = "crearSelectGenero";
            $sel = $('#' + id);
            this.modificarSlotInput($sel, id, Enums.Genero.hombre, "Hombre");
            this.modificarSlotInput($sel, id, Enums.Genero.mujer, "Mujer");
            $sel.change(function(){
                self.updateCabezas();
            });

            this.cabezasGrid = new ItemGrid('crearPjSeleccionCabeza');
            this.updateCabezas();
        },

        modificarSlotInput: function ($sel, id, slot, texto) {
            var elemento = $('#' + id + ' option[value=' + slot + ']');
            if (!elemento.length) { // nuevo elemento
                $sel.append($("<option>").attr('value', slot).text(texto));
            }
            else {
                $(elemento).text(texto);
            }
        },

        setBotonTirarDadosCallback: function (cb) {

            $('#crearBotonTirarDados').click(function () {
                cb();
            });
        },

        setBotonVolverCallback: function (cb) {
            $('#crearBotonVolver').click(function () {
                cb();
            });
        },

        setBotonCrearCallback: function (cb) {
            var self = this;
            $('#crearBotonCrear').click(function () {
                var nombre = $("#crearNombreInput").val();
                var password = $("#crearPasswordInput").val();
                var password2 = $("#crearRepetirPasswordInput").val();
                var mail = $("#crearMailInput").val();
                var raza = $("#crearSelectRaza").val();
                var genero = $("#crearSelectGenero").val();
                var clase = $("#crearSelectClase").val();
                var ciudad = $("#crearSelectCiudad").val();
                var cabeza = self.cabezasGrid.getSelectedSlot();

                if (!cabeza){
                    self.mensaje.show("Debes elegir una cabeza");
                }

                if (!(nombre && password && password2 && raza && genero && clase && cabeza && mail && ciudad)) {
                    self.mensaje.show("Debes completar todos los campos");
                    return;
                }
                if (!self.emailValido(mail)) {
                    self.mensaje.show("Mail invalido");
                    return;
                }
                if (!self.passwordValido(password)) {
                    self.mensaje.show("El password debe contener " + self.LARGO_MINIMO_PASSWORD + " o mas caracteres");
                    return;
                }

                if (!( password === password2)) {
                    self.mensaje.show("Los passwords ingresados no coinciden");
                    return;
                }

                cb(nombre, password, raza, genero, clase, cabeza, mail, ciudad);
            });
        },

        updateCabezas: function () {
            var raza = $("#crearSelectRaza").val();
            var genero = $("#crearSelectGenero").val();

            this.cabezasGrid.clear();
            var cabezas = this.getPrimerYUltimaCabezaNum(genero, raza);

            for (var i = cabezas.primera; i <= cabezas.ultima; i++) {
                var numGraf = this.assetManager.getFaceGrafFromNum(i);
                this.cabezasGrid.modificarSlot(i, '', numGraf);
            }
        },

        updateDados: function (Fuerza, Agilidad, Inteligencia, Carisma, Constitucion) {
            $('#crearDadoFuerza').text("Fuerza: " + Fuerza);
            $('#crearDadoAgilidad').text("Agilidad: " + Agilidad);
            $('#crearDadoInteligencia').text("Inteligencia: " + Inteligencia);
            $('#crearDadoCarisma').text("Carisma: " + Carisma);
            $('#crearDadoConstitucion').text("Constitucion: " + Constitucion);
        },

        emailValido: function (email) {
            // Regex borrowed from http://stackoverflow.com/a/46181/393005
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },

        passwordValido: function (pw) {
            return (!(pw.length < this.LARGO_MINIMO_PASSWORD))
        },

        getPrimerYUltimaCabezaNum: function (genero, raza) {
            var genero = parseInt(genero);
            var raza = parseInt(raza);

            var HUMANO_H_PRIMER_CABEZA = 1;
            var HUMANO_H_ULTIMA_CABEZA = 51;
            var HUMANO_H_CUERPO_DESNUDO = 21;
            var ELFO_H_PRIMER_CABEZA = 101;
            var ELFO_H_ULTIMA_CABEZA = 122;
            var ELFO_H_CUERPO_DESNUDO = 210;
            var DROW_H_PRIMER_CABEZA = 201;
            var DROW_H_ULTIMA_CABEZA = 221;
            var DROW_H_CUERPO_DESNUDO = 32;
            var ENANO_H_PRIMER_CABEZA = 301;
            var ENANO_H_ULTIMA_CABEZA = 319;
            var ENANO_H_CUERPO_DESNUDO = 53;
            var GNOMO_H_PRIMER_CABEZA = 401;
            var GNOMO_H_ULTIMA_CABEZA = 416;
            var GNOMO_H_CUERPO_DESNUDO = 222;
            //**************************************************
            var HUMANO_M_PRIMER_CABEZA = 70;
            var HUMANO_M_ULTIMA_CABEZA = 89;
            var HUMANO_M_CUERPO_DESNUDO = 39;
            var ELFO_M_PRIMER_CABEZA = 170;
            var ELFO_M_ULTIMA_CABEZA = 188;
            var ELFO_M_CUERPO_DESNUDO = 259;
            var DROW_M_PRIMER_CABEZA = 270;
            var DROW_M_ULTIMA_CABEZA = 288;
            var DROW_M_CUERPO_DESNUDO = 40;
            var ENANO_M_PRIMER_CABEZA = 370;
            var ENANO_M_ULTIMA_CABEZA = 384;
            var ENANO_M_CUERPO_DESNUDO = 60;
            var GNOMO_M_PRIMER_CABEZA = 470;
            var GNOMO_M_ULTIMA_CABEZA = 484;
            var GNOMO_M_CUERPO_DESNUDO = 260;

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
                        log.error("raza invalida")
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
                        log.error("raza invalida")
                }
            }

        },
    });
    return CrearPjUI;
});

