define(['character',  'enums'], function (Character, Enums) {

    var Player = Character.extend({
        MAX_LEVEL: 10,

        init: function (CharIndex, Body, Head, offHeadX, offHeadY, Heading, X, Y, Weapon, Shield, Helmet, FX, Name, NickColor, Privileges) {

            this._super(CharIndex, Body, Head, offHeadX, offHeadY, Heading, X, Y, Weapon, Shield, Helmet, FX, Name, NickColor, Privileges);

            this.forcedCaminar = []; // vector con las pos de mov forzado
            this.moviendose = 0;
            this.moviendoseForzado = false;
            this.lastDirPressed = [];
            this.caminarCallback = {};
            this.puedeCaminarCallback = {};
            this.cambioHeadingCallback = {};
            this.lastAttackedTarget = null;
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
            if (this.moviendoseForzado) { // moviendoseForzado difiere de forcedcaminar en que este se setea una vez que comienza el movimiento, el otro cuando le llega el mensaje. Es necesario este checkeo porque si llega el mensaje y esta en movimiento, el hasmoved de ese movimiento afectaria al forcedcaminar
                this.moviendose--;
                this.forcedCaminar.shift(); // remueve primer index, ForcedCaminar es una cola con los mensajes de caminar forzado que llegaron
                this.moviendoseForzado = false;
            }
        },

        tratarDeCaminar: function () {

            if (!this.getDirMov())
                return false;
            if (this.puedeCaminarCallback(this.getDirMov()) || this.forcedCaminar[0]) {
                if (this.forcedCaminar[0])
                    this.moviendoseForzado = true;
                this.caminarCallback(this.getDirMov(), this.forcedCaminar[0]);
                this.heading = this.getDirMov();
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
            if ( (this.lastDirPressed.indexOf(direccion) > -1) ) {
                this.moviendose--;
                this.lastDirPressed.splice(this.lastDirPressed.indexOf(direccion), 1);
            }
        },

        getDirMov: function () {
            if (this.forcedCaminar[0])
                return this.forcedCaminar[0];
            return this.lastDirPressed[this.lastDirPressed.length - 1];
        },

        resetMovement: function () {
            if (this.movement.inProgress) {
                this.movement.desactivar();
                //this.movement.startTime -= 140; // numero arbitrario, mientras mas grande menos tiempo desde que pasa de mapa hasta que checkea si estan apretadas las flechas para moverse (esto es para que al pasar de mapas donde quedas apuntando a la salida no te vuelva a cambiar de mapa instantaneamente)
            }
        },

        forceCaminar: function (direccion) {
            this.forcedCaminar.push(direccion);
            this.moviendose++;
        },

    });

    return Player;
});
