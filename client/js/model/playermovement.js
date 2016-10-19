/**
 * Created by horacio on 7/3/16.
 */

define([], function () {

    class PlayerMovement {

        constructor(game) {
            /*this.game.player = null;*/

            this.game = game;
            this.forcedCaminarQueue = [];
            this.caminandoForzado = false;
            this.dirPressedStack = [];
            this.caminarCallback = null;
            this.puedeCaminarCallback = null;
            this.cambioHeadingCallback = null;

            //this.moveSpeed = 230; // usar la del character?
            this.prevGridPosX = null;
            this.prevGridPosY = null;

            this._enabled = 1;
        }

        get enabled() {
            return this._enabled > 0;
        }

        get disabled() {
            return !this.enabled;
        }

        enable() {
            if (this._enabled < 1) {
                this._enabled++;
            }
        }

        disable() {
            this._enabled--;
        }

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

        setOnMoverseUpdate(callback) { // cb params: x,y
            this._moverseUpdateCallback = callback;
        }

        setOnFinMovimiento(callback) {
            this._finMovimientoCallback = callback;
        }

        _tratarDeCaminar() {
            if (!this.getDirMov() || !this.enabled) {
                return false;
            }
            this.game.player.setSpeed(230); // TODO: una sola vez en otro lugar

            if (this.puedeCaminarCallback(this.getDirMov())) {
                if (this.forcedCaminarQueue.length > 0) {
                    this.caminandoForzado = true;
                }
                this.caminarCallback(this.getDirMov(), this.caminandoForzado);
                this.game.player.heading = this.getDirMov();
                return true;
            }
            else {
                if (this.game.player.heading !== this.getDirMov()) {
                    this.game.player.heading = this.getDirMov();
                    this.game.player.sprite.stopAnimations();
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
            this._finMovimientoCallback();
        }

        tratarDeMover() {
            if ((this.estaCaminando() && !this.game.player.estaMoviendose())) {
                if (this._tratarDeCaminar()) {
                    this.prevGridPosX = this.game.player.gridX;
                    this.prevGridPosY = this.game.player.gridY;
                    let dir = this.getDirMov();
                    this.game.player.mover(dir, this._moverseUpdateCallback, this._hasMoved.bind(this));
                    return true;
                }
            }
            return false;
        }

        forceCaminar(direccion) {
            this.forcedCaminarQueue.push(direccion);
        }

        estaCaminando() {
            return (this.forcedCaminarQueue.length > 0 || this.dirPressedStack.length > 0);
        }

    }

    return PlayerMovement;
});