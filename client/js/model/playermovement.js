/**
 * Created by horacio on 7/3/16.
 */

define(['model/character'], function (Character) {

    class PlayerMovement{

        constructor(game) {
            /*this.game.player = null;*/

            this.game = game;
            this.forcedCaminarQueue = [];
            this.caminandoForzado = false;
            this.dirPressedStack = [];
            this.caminarCallback = null;
            this.puedeCaminarCallback = null;
            this.cambioHeadingCallback = null;
            this.lastAttackedTarget = null;

            this.moveSpeed = 230; // usar la del character?
        }

        // TODO: aceleracion al comenzar y terminar de caminar ?
        comenzarCaminar(direccion) {
            this.dirPressedStack.push(direccion);
        }

        setOnCaminar(callback) {
            this.caminarCallback = callback;
        }

        setOnPuedeCaminar(callback) {
            this.puedeCaminarCallback = callback;
        }

        setOnCambioHeading(callback) {
            this.cambioHeadingCallback = callback;
        }

        // moverse tiene que ver con el renderer, caminar con enviar mensajes del sv
        setOnMoverse(callback) { // cb params: x,y
            this._moverseCallback = callback;
        }

        setOnMoverseBegin(cb) {
            this._comenzarMoverseCallback = cb;
        }

        _tratarDeCaminar() {

            if (!this.getDirMov()) {
                return false;
            }
            if (this.puedeCaminarCallback(this.getDirMov())) {
                if ( this.forcedCaminarQueue.length > 0) {
                    this.caminandoForzado = true;
                }
                this.caminarCallback(this.getDirMov(), this.caminandoForzado);
                this.game.player.cambiarHeading(this.getDirMov());
                return true;
            }
            else {
                if (this.game.player.heading !== this.getDirMov()) {
                    this.game.player.cambiarHeading(this.getDirMov());
                    this.cambioHeadingCallback(this.game.player.heading);
                }
                return false;
            }
        }

        terminarDeCaminar(direccion) {
            if ((this.dirPressedStack.indexOf(direccion) > -1)) {
                this.dirPressedStack.splice(this.dirPressedStack.indexOf(direccion), 1);
            }
        }

        getDirMov() {
            if (this.forcedCaminarQueue[0]) {
                return this.forcedCaminarQueue[0];
            }
            return this.dirPressedStack[this.dirPressedStack.length - 1];
        }

        _hasMoved() { //llamdo por el hasmoved del player
            if (this.caminandoForzado) { // moviendoseForzado difiere de forcedcaminar en que este se setea una vez que comienza el movimiento, el otro cuando le llega el mensaje. Es necesario este checkeo porque si llega el mensaje y esta en movimiento, el hasmoved de ese movimiento afectaria al forcedcaminar
                this.forcedCaminarQueue.shift(); // remueve primer index, ForcedCaminar es una cola con los mensajes de caminar forzado que llegaron
                this.caminandoForzado = false;
            }
        }

        tratarDeMover() {
            if ((this.estaMoviendose() && this.game.player.movementTransition.inProgress === false)) {
                if (this._tratarDeCaminar()) {
                    let dir = this.getDirMov();
                    this._comenzarMoverseCallback(dir);
                    this.game.player.mover(dir,this._moverseCallback, this._hasMoved.bind(this));
                    return true;
                }
            }
            return false;
        }

        forceCaminar(direccion) {
            this.forcedCaminarQueue.push(direccion);
        }

        estaMoviendose(){
            return (this.forcedCaminarQueue.length > 0 || this.dirPressedStack.length > 0);
        }

    }

    return PlayerMovement;
});
