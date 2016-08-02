/**
 * Created by horacio on 7/3/16.
 */

define([], function () {

    class PlayerState {
        constructor() {
            this.lastAttackedTarget = null; //reveer esto
            this.navegando = false;
            this.paralizado = false;
            this.meditando = false;
        }
    }

    return PlayerState;
});
