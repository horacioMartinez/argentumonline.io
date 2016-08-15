/**
 * Created by horacio on 09/08/2016.
 */

define(["text!../../../menus/crearPersonaje.html!strip", 'ui/popups/popup'], function (DOMdata, PopUp) {

    class CrearPersonaje extends PopUp {
        constructor(showMensajeCb) {
            var options = {
                width: 280,
                height: 400,
                minWidth: 150,
                minHeight: 280
            };
            super(DOMdata, options, true);
            this.LARGO_MINIMO_PASSWORD = 5;

            this.showMensajeCb = showMensajeCb;
            this.crearCb = null;

            this.raza = null;
            this.genero = null;
            this.clase = null;
            this.ciudad = null;
            this.cabeza = null;

            this.initCallbacks();
        }

        show(raza, genero, clase, ciudad, cabeza) {
            super.show();

            this.raza = raza;
            this.genero = genero;
            this.clase = clase;
            this.ciudad = ciudad;
            this.cabeza = cabeza;
        }

        initCallbacks() {
            $("#botonCrearPersonajeCrear").click(()=> {
                let nombre = $("#crearNombreInput").val();
                let password = $("#crearPasswordInput").val();
                let password2 = $("#crearRepetirPasswordInput").val();
                let mail = $("#crearMailInput").val();

                if (!(nombre && password && password2 && this.raza && this.genero && this.clase &&
                    this.cabeza && mail && this.ciudad)) {
                    this.showMensajeCb.show("Debes completar todos los campos");
                    return;
                }
                if (!this.emailValido(mail)) {
                    this.showMensajeCb.show("Mail invalido");
                    return;
                }
                if (!this.passwordValido(password)) {
                    this.showMensajeCb.show("El password debe contener " + this.LARGO_MINIMO_PASSWORD + " o mas caracteres");
                    return;
                }

                if (password !== password2) {
                    this.showMensajeCb.show("Los passwords ingresados no coinciden");
                    return;
                }

                this.hide();
                this.crearCb(nombre, password, this.raza, this.genero, this.clase, this.cabeza, mail, this.ciudad);
            });
        }

        emailValido(email) {
            // Regex borrowed from http://stackoverflow.com/a/46181/393005
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }

        passwordValido(pw) {
            return (pw.length >= this.LARGO_MINIMO_PASSWORD);
        }
    }

    return CrearPersonaje;
});

