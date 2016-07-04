/**
 * Created by horacio on 7/3/16.
 */

define([], function () {

    class PlayerState {
        constructor() {
            /*this.muerto = false;*/
            this.navegando = false;
            this.paralizado = false;
            this.meditando = false;
        }
    }

    return PlayerState;
});
