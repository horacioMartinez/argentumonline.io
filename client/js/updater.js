define([], function () {

    class Updater {
        constructor(game) {
            this.game = game;
        }

        update(delta) {
            if (this.game.logeado) {
                if (this.game.player) {
                    this.updateComenzarMovimientoPlayer();
                }
                this.updateCharacters(delta);
                this.game.renderer.update(delta);
            }
        }

        updateComenzarMovimientoPlayer() {
            this.game.playerMovement.tratarDeMover();
        }

        updateCharacters(delta) {
            this.game.world.forEachCharacter((character) => {
                character.update(delta);
            });
        }

    }

    return Updater;
});
