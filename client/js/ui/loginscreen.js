/**
 * Created by horacio on 1/26/16.
 */

define(['jquery','ui/screen'],
    function ($,Screen) {
        var LoginScreen = Screen.extend({
            init: function(loginCallback,crearCallback){
                this._super();

                this.login = loginCallback;
                this.crear = crearCallback;
                var nombreInput = this.agregarInput(325,213,165,14,15,"");

                var passwordInput = this.agregarInput(325,248,165,14,15,"",true);

                var self= this;
                var botonConectarse = this.agregarBoton("BotonConectarse",363,266, function (){
                    self.login($(nombreInput).val(),$(passwordInput).val());
                });

                var botonCrearPj = this.agregarBoton("BotonCrearPersonajeConectar",363,300, function (){
                    self.crear();
                });

            }
    });
return LoginScreen;
});

