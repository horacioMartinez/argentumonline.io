/**
 * Created by horacio on 5/3/16.
 */

import Game from '../model/game.js';
import Intervalos from '../model/intervalos.js';
import Acciones from '../model/acciones.js';
import ComandosChat from '../model/comandoschat.js';



    class GameManager {
        constructor(assetManager, renderer) {
            this.renderer = renderer; // temporal, pasarselo directamente al constructor de game ?
            this.assetManaget = assetManager;
            this.game = new Game(assetManager);

            this.intervalos = new Intervalos();
            this.acciones = new Acciones(this.game, this.intervalos);
            this.comandosChat = new ComandosChat(this.game, this.acciones);
        }

        setup(client, gameUI) {
            this.game.setup(client, gameUI, this.renderer, this.assetManaget.audio);
        }

        resetGame(escala) {
            this.renderer.clean(escala);
            var ui = this.game.gameUI;
            var client = this.game.client;

            this.assetManaget.audio.reset();
            this.game.init(this.assetManaget);
            this.game.setup(client, ui, this.renderer, this.assetManaget.audio);
        }


    }
    
export default GameManager;