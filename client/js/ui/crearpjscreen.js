/**
 * Created by horacio on 2/2/16.
 */

define(['jquery', 'ui/screen', 'enums'],
    function ($, Screen, Enums) {
        var CrearPjScreen = Screen.extend({
            init: function (tirar_dados_callback, volver_callback, crear_callback) {
                this._super();
                this.LARGO_MINIMO_PASSWORD = 5;

                this.nombreInput = this.agregarInput(235, 40, 300, 15, 15);
                this.passwordInput = this.agregarInput(235, 75, 120, 15, 15, "", true);
                this.repetirPasswordInput = this.agregarInput(375, 75, 120, 15, 15, "", true);
                this.mailInput = this.agregarInput(235, 107, 300, 15, 15);

                this.agregarBotonInivisible(20, 140, 65, 65, tirar_dados_callback);
                this.agregarBotonInivisible(70, 440, 100, 30, volver_callback);
                this.agregarBotonInivisible(610, 440, 176, 30, this.crearPJFunc(crear_callback));

                var xListas = 400;
                var yListas = 160;
                var deltaListas = 30;

                this.ciudad = this.agregarLista(false, xListas, yListas);
                this.ciudad.modificarSlot(Enums.Ciudad.Ullathorpe, "Ullathorpe");
                this.ciudad.modificarSlot(Enums.Ciudad.Nix, "Nix");
                this.ciudad.modificarSlot(Enums.Ciudad.Banderbill, "Banderbill");
                this.ciudad.modificarSlot(Enums.Ciudad.Lindos, "Lindos");
                this.ciudad.modificarSlot(Enums.Ciudad.Arghal, "Arghal");

                this.raza = this.agregarLista(false, xListas, yListas + deltaListas);
                this.raza.modificarSlot(Enums.Raza.humano, "Humano");
                this.raza.modificarSlot(Enums.Raza.elfo, "Elfo");
                this.raza.modificarSlot(Enums.Raza.elfoOscuro, "Elfo Oscuro");
                this.raza.modificarSlot(Enums.Raza.gnomo, "Gnome");
                this.raza.modificarSlot(Enums.Raza.enano, "Enano");

                this.clase = this.agregarLista(false, xListas, yListas + deltaListas * 2);
                this.clase.modificarSlot(Enums.Clase.mago, "Mago");
                this.clase.modificarSlot(Enums.Clase.clerigo, "Clérigo");
                this.clase.modificarSlot(Enums.Clase.guerrero, "Guerrero");
                this.clase.modificarSlot(Enums.Clase.asesino, "Asesino");
                this.clase.modificarSlot(Enums.Clase.ladron, "Ladrón");
                this.clase.modificarSlot(Enums.Clase.bardo, "Bardo");
                this.clase.modificarSlot(Enums.Clase.druida, "Druida");
                this.clase.modificarSlot(Enums.Clase.bandido, "Bandido");
                this.clase.modificarSlot(Enums.Clase.paladin, "Paladín");
                this.clase.modificarSlot(Enums.Clase.cazador, "Cazador");
                this.clase.modificarSlot(Enums.Clase.trabajador, "Trabajador");
                this.clase.modificarSlot(Enums.Clase.pirata, "Pirata");

                this.genero = this.agregarLista(false, xListas, yListas + deltaListas * 3);
                this.genero.modificarSlot(Enums.Genero.hombre, "Hombre");
                this.genero.modificarSlot(Enums.Genero.mujer, "Mujer");

            },

            crearPJFunc: function (callback) {
                var self = this;
                return function () {
                    var nombre = $(self.nombreInput).val();
                    var password = $(self.passwordInput).val();
                    var password2 = $(self.repetirPasswordInput).val();
                    var mail = $(self.mailInput).val();
                    var raza = self.raza.getSelectedSlot();
                    var genero = self.genero.getSelectedSlot();
                    var clase = self.clase.getSelectedSlot();
                    var cabeza = 40; // todo!!! <----
                    var ciudad = self.ciudad.getSelectedSlot();

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

                    callback(nombre, password, raza, genero, clase, cabeza, mail, ciudad);
                }
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
        return CrearPjScreen;
    });

/*


 Private Function CheckCabeza(ByVal Head As Integer) As Integer

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
 End Select


 */