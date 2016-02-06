define(['character',  'enums'], function (Character, Enums) {

    var Player = Character.extend({
        MAX_LEVEL: 10,

        init: function (CharIndex, Body, Head, offHeadX, offHeadY, Heading, X, Y, Weapon, Shield, Helmet, FX, Name, NickColor, Privileges) {

            this._super(CharIndex, Body, Head, offHeadX, offHeadY, Heading, X, Y, Weapon, Shield, Helmet, FX, Name, NickColor, Privileges);

            this.pw = "SACAME";

            this.forcedCaminar = 0;
            this.moviendose = 0;
            this.lastDirPressed = [];
            this.caminarCallback = {};
            this.puedeCaminarCallback = {};
            this.cambioHeadingCallback = {};

        },

        comenzarCaminar: function (direccion) {
            this.moviendose++;
            this.lastDirPressed.push(direccion);
        },

        onCaminar: function (callback) {
            this.caminarCallback = callback;
        },

        onPuedeCaminar: function (callback) {
            this.puedeCaminarCallback = callback;
        },

        onCambioHeading: function (callback) {
            this.cambioHeadingCallback = callback;
        },

        hasMoved: function () {
            if (this.moviendoseForzado) { // moviendoseForzado difiere de forcedcaminar en que este se setea una vez que comienza el movimiento, el otro cuando le llega el mensaje. Es necesario porque, si llega el mensaje y esta en movimiento, el hasmoved de ese movimiento afectaria al forcedcaminar
                this.forcedCaminar = 0;
                this.moviendose--;
                this.moviendoseForzado = false;
            }
        },

        puedeCaminar: function () {

            if (!this.getDirMov())
                return false;
            if (this.puedeCaminarCallback(this.getDirMov()) || this.forcedCaminar) {
                this.caminarCallback(this.getDirMov(), this.forcedCaminar);
                this.heading = this.getDirMov();
                if (this.forcedCaminar)
                    this.moviendoseForzado = true;
                return true;
            }
            else {
                if (this.heading !== this.getDirMov()) {
                    this.heading = this.getDirMov();
                    this.cambioHeadingCallback(this.heading);
                }
                return false;
            }
        },

        terminarDeCaminar: function (direccion) {
            if (this.lastDirPressed.indexOf(direccion) > -1) {
                this.moviendose--;
                this.lastDirPressed.splice(this.lastDirPressed.indexOf(direccion), 1);
            }
        },

        getDirMov: function () {
            if (this.forcedCaminar)
                return this.forcedCaminar;
            return this.lastDirPressed[this.lastDirPressed.length - 1];
        },

        resetMovement: function () {
            this.movement.desactivar();
            this.movement.startTime -= 140; // numero arbitrario, mientras mas grande menos tiempo desde que pasa de mapa hasta que checkea si estan apretadas las flechas para moverse (esto es para que al pasar de mapas donde quedas apuntando a la salida no te vuelva a cambiar de mapa instantaneamente)
        },

        forceCaminar: function (direccion) {
            this.forcedCaminar = direccion;
            this.moviendose++;
        },

    });

    return Player;
});
