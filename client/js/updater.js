define([], function () {

    class Updater {
        constructor(game) {
            this.game = game;
        }

        update() {
            if (this.game.logeado) {
                if (this.game.player) {
                    this.updateComenzarMovimientoPlayer();
                }
            }
        }

        updateComenzarMovimientoPlayer() { // todo: hacerlo dentro de player y sacar por completo esta clase
            this.game.playerMovement.tratarDeMover();
        }

    }

    return Updater;
});
