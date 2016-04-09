define(['model/character'], function (Character) {

    var Player = Character.extend({
        MAX_LEVEL: 10,

        init: function (CharIndex, X, Y, Heading, Name, clan) {

            this._super(CharIndex, X, Y, Heading, Name, clan);

            this.forcedCaminar = []; // vector con las pos de mov forzado
            this.moviendose = 0;
            this.moviendoseForzado = false;
            this.lastDirPressed = [];
            this.caminarCallback = {};
            this.puedeCaminarCallback = {};
            this.cambioHeadingCallback = {};
            this.lastAttackedTarget = null;

            this.navegando = false;

            this.paralizado = false;
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

        // moverse tiene que ver con el renderer, caminar con enviar mensajes del sv
        setOnMoverse: function(callback){ // params: x,y
          this._moverseCallback = callback;
        },

        setOnMoverseBegin: function(cb){
            this._comenzarMoverseCallback = cb;
        },


        hasMoved: function () {
            if (this.moviendoseForzado) { // moviendoseForzado difiere de forcedcaminar en que este se setea una vez que comienza el movimiento, el otro cuando le llega el mensaje. Es necesario este checkeo porque si llega el mensaje y esta en movimiento, el hasmoved de ese movimiento afectaria al forcedcaminar
                this.moviendose--;
                this.forcedCaminar.shift(); // remueve primer index, ForcedCaminar es una cola con los mensajes de caminar forzado que llegaron
                this.moviendoseForzado = false;
            }
            PIXI.ticker.shared.remove(this._updateMovement, this);
        },

        tratarDeCaminar: function () {

            if (!this.getDirMov())
                return false;
            if (this.puedeCaminarCallback(this.getDirMov()) || this.forcedCaminar[0]) {
                if (this.forcedCaminar[0])
                    this.moviendoseForzado = true;
                this.caminarCallback(this.getDirMov(), this.forcedCaminar[0]);
                this._setHeading(this.getDirMov());
                return true;
            }
            else {
                if (this.heading !== this.getDirMov()) {
                    this._setHeading(this.getDirMov());
                    this.cambioHeadingCallback(this.heading);
                }
                return false;
            }
        },

        terminarDeCaminar: function (direccion) {
            if ((this.lastDirPressed.indexOf(direccion) > -1)) {
                this.moviendose--;
                this.lastDirPressed.splice(this.lastDirPressed.indexOf(direccion), 1);
            }
        },

        getDirMov: function () {
            if (this.forcedCaminar[0])
                return this.forcedCaminar[0];
            return this.lastDirPressed[this.lastDirPressed.length - 1];
        },
        /*
         resetMovement: function () {
         log.error("RESET MOVEMENT!");

         if (this.movement.inProgress) {
         this.movement.stop();
         if (this.movement.stopFunction)
         this.movement.stopFunction();
         //log.error("resetmovemente!, name: " + this.Name);
         }

         if (this.movement.inProgress) {
         this.movement.desactivar();
         //this.movement.startTime -= 140; // numero arbitrario, mientras mas grande menos tiempo desde que pasa de mapa hasta que checkea si estan apretadas las flechas para moverse (esto es para que al pasar de mapas donde quedas apuntando a la salida no te vuelva a cambiar de mapa instantaneamente)
         }

         },
         */
        tratarDeMover: function(){
            if ( (this.moviendose && this.movement.inProgress === false) && this.tratarDeCaminar()) {
                this._comenzarMoverseCallback(this.getDirMov());
                this._crearMovimiento(this._moverseCallback);
                return true;
            }
            return false;
        },

        mover: function (callback_mov) {
            log.error("usar caminar en player no mover!")
        },

        forceCaminar: function (direccion) {
            this.forcedCaminar.push(direccion);
            this.moviendose++;
        },

    });

    return Player;
});
