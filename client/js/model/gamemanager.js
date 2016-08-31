/**
 * Created by horacio on 5/3/16.
 */

define(['model/game', 'model/intervalos', 'model/acciones', 'model/comandoschat'], function (Game, Intervalos, Acciones, ComandosChat) {

    class GameManager {
        constructor(assetManager, renderer) {
            this.renderer = renderer; // temporal, pasarselo directamente al constructor de game ?
            this.game = new Game(assetManager); // todo: esta clase deberia llamarse world y solo encargarse de agregar, sacar cosas del mundo y ese tipo de cosas

            this.intervalos = new Intervalos();
            this.acciones = new Acciones(this.game, this.intervalos);
            this.comandosChat = new ComandosChat(this.game, this.acciones);
        }

        setup(client, gameUI) {
            this.game.setup(client, gameUI, this.renderer);
        }

        resetGame(escala) {
            this.renderer.clean(escala);
            var ui = this.game.gameUI;
            var client = this.game.client;
            this.game.assetManager.audio.reset();
            this.game.init(this.game.assetManager);
            this.game.setup(client, ui, this.renderer);
        }

    }
    return GameManager;
});