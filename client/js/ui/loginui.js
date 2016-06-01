/**
 * Created by horacio on 4/6/16.
 */

define([], function () {
    class LoginUI {
        constructor() {
        }

        setBotonJugarCallback(cb) {
            $('#botonJugar').click(function () {
                cb();
            });
        }

        setBotonCrearCallback(cb) {
            $('#botonCrearPJ').click(function () {
                cb();
            });
        }

        setPlayButtonState(enabled) {
            var $playButton = $('#botonJugar');

            if (enabled) {
                $playButton.prop('disabled', false);
            } else {
                $playButton.prop('disabled', true);
            }
        }

        setCrearButtonState(enabled) {
            var $crearButton = $('#botonCrearPJ');

            if (enabled) {
                $crearButton.prop('disabled', false);
            } else {
                $crearButton.prop('disabled', true);
            }
        }

        getUsername() {
            return $('#loginNombre').val();
        }

        getPassword() {
            return $('#loginContrasenia').val();
        }
    }
    return LoginUI;
});
