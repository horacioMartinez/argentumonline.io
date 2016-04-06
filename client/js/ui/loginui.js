/**
 * Created by horacio on 4/6/16.
 */

define([],function () {
    var LoginUI = Class.extend({
        init: function () {
        },

        setBotonJugarCallback: function (cb) {
            $('#botonJugar').click(function () {
                cb();
            });
        },

        setBotonCrearCallback: function (cb) {
            $('#botonCrearPJ').click(function () {
                cb();
            });
        },

        setPlayButtonState: function (enabled) {
            var $playButton = $('#botonJugar');

            if (enabled) {
                $playButton.prop('disabled', false);
            } else {
                $playButton.prop('disabled', true);
            }
        },

        setCrearButtonState: function (enabled) {
            var $crearButton = $('#botonCrearPJ');

            if (enabled) {
                $crearButton.prop('disabled', false);
            } else {
                $crearButton.prop('disabled', true);
            }
        },

        getUsername: function(){
            return $('#loginNombre').val();
        },

        getPassword: function(){
            return $('#loginContrasenia').val();
        }
    });
    return LoginUI;
});
