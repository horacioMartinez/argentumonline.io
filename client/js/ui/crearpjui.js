/**
 * Created by horacio on 2/27/16.
 */

define(['enums'], function (Enums) {
    var CrearPjUI = Class.extend({
        init: function (mensaje) {
            this._inicializado = false;
            this.LARGO_MINIMO_PASSWORD = 5;
            this.mensaje = mensaje;
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

        updateCabezas: function(){
          /*
           Select Case UserSexo
           Case eGenero.Hombre
           Select Case UserRaza
           Case eRaza.Humano
           If Head > HUMANO_H_ULTIMA_CABEZA Then
           CheckCabeza = HUMANO_H_PRIMER_CABEZA + (Head - HUMANO_H_ULTIMA_CABEZA) - 1
           ElseIf Head < HUMANO_H_PRIMER_CABEZA Then
           CheckCabeza = HUMANO_H_ULTIMA_CABEZA - (HUMANO_H_PRIMER_CABEZA - Head) + 1
           Else
           CheckCabeza = Head
           End If

           Case eRaza.Elfo
           If Head > ELFO_H_ULTIMA_CABEZA Then
           CheckCabeza = ELFO_H_PRIMER_CABEZA + (Head - ELFO_H_ULTIMA_CABEZA) - 1
           ElseIf Head < ELFO_H_PRIMER_CABEZA Then
           CheckCabeza = ELFO_H_ULTIMA_CABEZA - (ELFO_H_PRIMER_CABEZA - Head) + 1
           Else
           CheckCabeza = Head
           End If

           Case eRaza.ElfoOscuro
           If Head > DROW_H_ULTIMA_CABEZA Then
           CheckCabeza = DROW_H_PRIMER_CABEZA + (Head - DROW_H_ULTIMA_CABEZA) - 1
           ElseIf Head < DROW_H_PRIMER_CABEZA Then
           CheckCabeza = DROW_H_ULTIMA_CABEZA - (DROW_H_PRIMER_CABEZA - Head) + 1
           Else
           CheckCabeza = Head
           End If

           Case eRaza.Enano
           If Head > ENANO_H_ULTIMA_CABEZA Then
           CheckCabeza = ENANO_H_PRIMER_CABEZA + (Head - ENANO_H_ULTIMA_CABEZA) - 1
           ElseIf Head < ENANO_H_PRIMER_CABEZA Then
           CheckCabeza = ENANO_H_ULTIMA_CABEZA - (ENANO_H_PRIMER_CABEZA - Head) + 1
           Else
           CheckCabeza = Head
           End If

           Case eRaza.Gnomo
           If Head > GNOMO_H_ULTIMA_CABEZA Then
           CheckCabeza = GNOMO_H_PRIMER_CABEZA + (Head - GNOMO_H_ULTIMA_CABEZA) - 1
           ElseIf Head < GNOMO_H_PRIMER_CABEZA Then
           CheckCabeza = GNOMO_H_ULTIMA_CABEZA - (GNOMO_H_PRIMER_CABEZA - Head) + 1
           Else
           CheckCabeza = Head
           End If

           Case Else
           UserRaza = lstRaza.ListIndex + 1
           CheckCabeza = CheckCabeza(Head)
           End Select

           Case eGenero.Mujer
           Select Case UserRaza
           Case eRaza.Humano
           If Head > HUMANO_M_ULTIMA_CABEZA Then
           CheckCabeza = HUMANO_M_PRIMER_CABEZA + (Head - HUMANO_M_ULTIMA_CABEZA) - 1
           ElseIf Head < HUMANO_M_PRIMER_CABEZA Then
           CheckCabeza = HUMANO_M_ULTIMA_CABEZA - (HUMANO_M_PRIMER_CABEZA - Head) + 1
           Else
           CheckCabeza = Head
           End If

           Case eRaza.Elfo
           If Head > ELFO_M_ULTIMA_CABEZA Then
           CheckCabeza = ELFO_M_PRIMER_CABEZA + (Head - ELFO_M_ULTIMA_CABEZA) - 1
           ElseIf Head < ELFO_M_PRIMER_CABEZA Then
           CheckCabeza = ELFO_M_ULTIMA_CABEZA - (ELFO_M_PRIMER_CABEZA - Head) + 1
           Else
           CheckCabeza = Head
           End If

           Case eRaza.ElfoOscuro
           If Head > DROW_M_ULTIMA_CABEZA Then
           CheckCabeza = DROW_M_PRIMER_CABEZA + (Head - DROW_M_ULTIMA_CABEZA) - 1
           ElseIf Head < DROW_M_PRIMER_CABEZA Then
           CheckCabeza = DROW_M_ULTIMA_CABEZA - (DROW_M_PRIMER_CABEZA - Head) + 1
           Else
           CheckCabeza = Head
           End If

           Case eRaza.Enano
           If Head > ENANO_M_ULTIMA_CABEZA Then
           CheckCabeza = ENANO_M_PRIMER_CABEZA + (Head - ENANO_M_ULTIMA_CABEZA) - 1
           ElseIf Head < ENANO_M_PRIMER_CABEZA Then
           CheckCabeza = ENANO_M_ULTIMA_CABEZA - (ENANO_M_PRIMER_CABEZA - Head) + 1
           Else
           CheckCabeza = Head
           End If

           Case eRaza.Gnomo
           If Head > GNOMO_M_ULTIMA_CABEZA Then
           CheckCabeza = GNOMO_M_PRIMER_CABEZA + (Head - GNOMO_M_ULTIMA_CABEZA) - 1
           ElseIf Head < GNOMO_M_PRIMER_CABEZA Then
           CheckCabeza = GNOMO_M_ULTIMA_CABEZA - (GNOMO_M_PRIMER_CABEZA - Head) + 1
           Else
           CheckCabeza = Head
           End If

           Case Else
           UserRaza = lstRaza.ListIndex + 1
           CheckCabeza = CheckCabeza(Head)
           End Select
           Case Else
           UserSexo = lstGenero.ListIndex + 1
           CheckCabeza = CheckCabeza(Head)
             */
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
    });
    return CrearPjUI;
});

