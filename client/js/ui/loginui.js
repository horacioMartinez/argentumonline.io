/**
 * Created by horacio on 4/6/16.
 */

define(['utils/charcodemap'], function (CharcodeMap) {
    class LoginUI {
        constructor() {
            this.enableLoginPressingEnter();
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

        enableLoginPressingEnter() {

            let loginKeyPressFunc = (keyNumber) => {

                if (keyNumber === CharcodeMap.keys.indexOf("ENTER")) {
                    let $playButton = $('#botonJugar');
                    if (!$playButton.prop('disabled')) {
                        $playButton.click();
                    }
                    return false;
                }
            };

            $('#loginNombre').keypress(function (e) {
                loginKeyPressFunc(e.which);
            });

            $('#loginContrasenia').keypress(function (e) {
                loginKeyPressFunc(e.which);
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
