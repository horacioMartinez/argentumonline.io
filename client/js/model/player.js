define(['model/character'], function (Character) {

    class Player extends Character {

        constructor(CharIndex, X, Y, Heading, Name, clan) {

            super(CharIndex, X, Y, Heading, Name, clan);

            // this.forcedCaminarQueue = [];
            // this.moviendose = 0;
            // this.moviendoseForzado = false;
            // this.dirPressedStack = [];
            // this.caminarCallback = null;
            // this.puedeCaminarCallback = null;
            // this.cambioHeadingCallback = null;
            // this.lastAttackedTarget = null;
            //
            // this.moveSpeed = 230; // PJ TODO: setear bien estos valores, fijarse que en lo posible no haya resetmovements (esto pasa si la animacion es mas lenta que el llamado a cambiar de pos)
        }
        //
        // // TODO: aceleracion al comenzar y terminar de caminar ?
        // comenzarCaminar(direccion) {
        //     this.dirPressedStack.push(direccion);
        // }
        //
        // setOnCaminar(callback) {
        //     this.caminarCallback = callback;
        // }
        //
        // setOnPuedeCaminar(callback) {
        //     this.puedeCaminarCallback = callback;
        // }
        //
        // setOnCambioHeading(callback) {
        //     this.cambioHeadingCallback = callback;
        // }
        //
        // // moverse tiene que ver con el renderer, caminar con enviar mensajes del sv
        // setOnMoverse(callback) { // cb params: x,y
        //     this._moverseCallback = callback;
        // }
        //
        // setOnMoverseBegin(cb) {
        //     this._comenzarMoverseCallback = cb;
        // }
        //
        // hasMoved() {
        //     if (this.moviendoseForzado) { // moviendoseForzado difiere de forcedcaminar en que este se setea una vez que comienza el movimiento, el otro cuando le llega el mensaje. Es necesario este checkeo porque si llega el mensaje y esta en movimiento, el hasmoved de ese movimiento afectaria al forcedcaminar
        //         this.forcedCaminarQueue.shift(); // remueve primer index, ForcedCaminar es una cola con los mensajes de caminar forzado que llegaron
        //         this.moviendoseForzado = false;
        //     }
        //     PIXI.ticker.shared.remove(this._updateMovement, this);
        //     //this.tratarDeMover();
        // }
        //
        // _tratarDeCaminar() {
        //
        //     if (!this.getDirMov()) {
        //         return false;
        //     }
        //     if (this.puedeCaminarCallback(this.getDirMov())) {
        //         if ( this.forcedCaminarQueue.length > 0) {
        //             this.moviendoseForzado = true;
        //         }
        //         this.caminarCallback(this.getDirMov(), this.moviendoseForzado);
        //         this._setHeading(this.getDirMov());
        //         return true;
        //     }
        //     else {
        //         if (this.heading !== this.getDirMov()) {
        //             this._setHeading(this.getDirMov());
        //             this.cambioHeadingCallback(this.heading);
        //         }
        //         return false;
        //     }
        // }
        //
        // terminarDeCaminar(direccion) {
        //     if ((this.dirPressedStack.indexOf(direccion) > -1)) {
        //         this.dirPressedStack.splice(this.dirPressedStack.indexOf(direccion), 1);
        //     }
        // }
        //
        // getDirMov() {
        //     if (this.forcedCaminarQueue[0]) {
        //         return this.forcedCaminarQueue[0];
        //     }
        //     return this.dirPressedStack[this.dirPressedStack.length - 1];
        // }
        //
        // tratarDeMover() {
        //     if ((this.estaMoviendose() && this.movementTransition.inProgress === false)) {
        //         if (this._tratarDeCaminar()) {
        //             let dir = this.getDirMov();
        //             this._comenzarMoverseCallback(dir);
        //             this.mover(dir,this._moverseCallback);
        //             return true;
        //         }
        //     }
        //     return false;
        // }
        //
        // forceCaminar(direccion) {
        //     this.forcedCaminarQueue.push(direccion);
        //     this.moviendose++;
        // }
        //
        // estaMoviendose(){
        //     return (this.forcedCaminarQueue.length > 0 || this.dirPressedStack.length > 0);
        // }

    }

    return Player;
});
