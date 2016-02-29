/**
 * Created by horacio on 2/27/16.
 */

define(['jquery'],
    function ($) {
        var CrearPJ = Class.extend({
            init: function () {
                this._inicializado = false;
                this.LARGO_MINIMO_PASSWORD = 5;
            },

            inicializar: function () {
                if (this._inicializado)
                    return;
                else
                    this._inicializado = true;

                var id = "crearSelectCiudad";
                var $sel = $('#' + id);
                this.modificarSlot($sel, id, Enums.Ciudad.Ullathorpe, "Ullathorpe");
                this.modificarSlot($sel, id, Enums.Ciudad.Nix, "Nix");
                this.modificarSlot($sel, id, Enums.Ciudad.Banderbill, "Banderbill");
                this.modificarSlot($sel, id, Enums.Ciudad.Lindos, "Lindos");
                this.modificarSlot($sel, id, Enums.Ciudad.Arghal, "Arghal");

                id = "crearSelectRaza";
                $sel = $('#' + id);
                this.modificarSlot($sel, id, Enums.Raza.humano, "Humano");
                this.modificarSlot($sel, id, Enums.Raza.elfo, "Elfo");
                this.modificarSlot($sel, id, Enums.Raza.elfoOscuro, "Elfo Oscuro");
                this.modificarSlot($sel, id, Enums.Raza.gnomo, "Gnomo");
                this.modificarSlot($sel, id, Enums.Raza.enano, "Enano");

                id = "crearSelectClase";
                $sel = $('#' + id);
                this.modificarSlot($sel, id, Enums.Clase.mago, "Mago");
                this.modificarSlot($sel, id, Enums.Clase.clerigo, "Clérigo");
                this.modificarSlot($sel, id, Enums.Clase.guerrero, "Guerrero");
                this.modificarSlot($sel, id, Enums.Clase.asesino, "Asesino");
                this.modificarSlot($sel, id, Enums.Clase.ladron, "Ladrón");
                this.modificarSlot($sel, id, Enums.Clase.bardo, "Bardo");
                this.modificarSlot($sel, id, Enums.Clase.druida, "Druida");
                this.modificarSlot($sel, id, Enums.Clase.bandido, "Bandido");
                this.modificarSlot($sel, id, Enums.Clase.paladin, "Paladín");
                this.modificarSlot($sel, id, Enums.Clase.cazador, "Cazador");
                this.modificarSlot($sel, id, Enums.Clase.trabajador, "Trabajador");
                this.modificarSlot($sel, id, Enums.Clase.pirata, "Pirata");

                id = "crearSelectGenero";
                $sel = $('#' + id);
                this.modificarSlot($sel, id, Enums.Genero.hombre, "Hombre");
                this.modificarSlot($sel, id, Enums.Genero.mujer, "Mujer");
            },

            modificarSlot: function ($sel, id, slot, texto) {
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
                    var cabeza = 40; // todo!!! <----

                    if (!(nombre && password && password2 && raza && genero && clase && cabeza && mail && ciudad)) {
                        log.error("Debes completar todos los campos");
                        return;
                    }
                    if (!self.emailValido(mail)) {
                        log.error("Mail invalido");
                        return;
                    }
                    if (!self.passwordValido(password)) {
                        log.error("El password contener " + self.LARGO_MINIMO_PASSWORD + " o mas caracteres");
                        return;
                    }

                    if (!( password === password2)) {
                        log.error("Los passwords ingresados no coinciden");
                        return;
                    }

                    cb(nombre, password, raza, genero, clase, cabeza, mail, ciudad);
                });
            },

            updateDados: function (Fuerza, Agilidad, Inteligencia, Carisma, Constitucion) {
                $('#crearDadoFuerza').text(Fuerza);
                $('#crearDadoAgilidad').text(Agilidad);
                $('#crearDadoInteligencia').text(Inteligencia);
                $('#crearDadoCarisma').text(Carisma);
                $('#crearDadoConstitucion').text(Constitucion);
            },

            emailValido: function (email) {
                // Regex borrowed from http://stackoverflow.com/a/46181/393005
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            },

            passwordValido: function (pw) {
                return (! (pw.length < this.LARGO_MINIMO_PASSWORD))
            },
        });
        return CrearPJ;
    });

