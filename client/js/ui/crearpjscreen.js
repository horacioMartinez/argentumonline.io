/**
 * Created by horacio on 2/2/16.
 */

define(['jquery','ui/screen','enums'],
    function ($,Screen,Enums) {
        var CrearPjScreen = Screen.extend({
            init: function(tirar_dados_callback, crear_callback, volver_callback){
                this._super();

                this.crear = crear_callback;
                this.volver = volver_callback;
                this.tirarDados = tirar_dados_callback;
                var nombreInput = this.agregarInput(235,40,300,15,15);
                var passwordInput = this.agregarInput(235,75,120,15,15,"",true);
                var repetirPasswordInput = this.agregarInput(375,75,120,15,15,"",true);
                var mailInput = this.agregarInput(235,107,300,15,15);

                //this.agregarBotonInivisible(20,140,65,65,this.tirarDados);
                var self = this;
                this.agregarBotonInivisible(20,140,65,65,function(){
                    log.error("hola");
                    log.error(self.ciudad.getSelectedSlot());
                    log.error(self.ciudad.getSelectedText());
                    });

                var xListas= 400;
                var yListas = 160;
                var deltaListas = 30;
                this.ciudad = this.agregarLista(false,xListas,yListas);
                this.ciudad.modificarSlot(Enums.Ciudad.Ullathorpe,"Ullathorpe");
                this.ciudad.modificarSlot(Enums.Ciudad.Nix,"Nix");
                this.ciudad.modificarSlot(Enums.Ciudad.Banderbill,"Banderbill");
                this.ciudad.modificarSlot(Enums.Ciudad.Lindos,"Lindos");
                this.ciudad.modificarSlot(Enums.Ciudad.Arghal,"Arghal");

                this.raza = this.agregarLista(false,xListas,yListas + deltaListas);
                this.raza.modificarSlot(Enums.Raza.humano,"Humano");
                this.raza.modificarSlot(Enums.Raza.elfo,"Elfo");
                this.raza.modificarSlot(Enums.Raza.elfoOscuro,"Elfo Oscuro");
                this.raza.modificarSlot(Enums.Raza.gnomo,"Gnome");
                this.raza.modificarSlot(Enums.Raza.enano,"Enano");

                this.clase = this.agregarLista(false,xListas,yListas + deltaListas*2);
                this.clase.modificarSlot(Enums.Clase.mago,"Mago");
                this.clase.modificarSlot(Enums.Clase.clerigo,"Clérigo");
                this.clase.modificarSlot(Enums.Clase.guerrero,"Guerrero");
                this.clase.modificarSlot(Enums.Clase.asesino,"Asesino");
                this.clase.modificarSlot(Enums.Clase.ladron,"Ladrón");
                this.clase.modificarSlot(Enums.Clase.bardo,"Bardo");
                this.clase.modificarSlot(Enums.Clase.druida,"Druida");
                this.clase.modificarSlot(Enums.Clase.bandido,"Bandido");
                this.clase.modificarSlot(Enums.Clase.paladin,"Paladín");
                this.clase.modificarSlot(Enums.Clase.cazador,"Cazador");
                this.clase.modificarSlot(Enums.Clase.trabajador,"Trabajador");
                this.clase.modificarSlot(Enums.Clase.pirata,"Pirata");

                this.genero =  this.agregarLista(false,xListas,yListas + deltaListas*3);
                this.genero.modificarSlot(Enums.Genero.hombre, "Hombre");
                this.genero.modificarSlot(Enums.Genero.mujer, "Mujer");

            }
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