/**
 * Created by horacio on 4/5/17.
 */

// Import HTML template as string (will be handled by Vite)
import DOMdata from '../../../menus/playAgain.html?raw';
import PopUp from '../../ui/popups/popup.js';



  class playAgain extends PopUp {
    constructor(game, setCrearPjScreenCb) {
      var options = {
        width: 220,
        height: 240,
        minWidth: 150,
        minHeight: 200
      };
      super(DOMdata, options);
      this.game = game;
      this.setCrearPjScreenCb = setCrearPjScreenCb;
      this._callbacksInitialized = false;
    }

    show() {
      super.show();
      
      if (!this._callbacksInitialized) {
        this.$playAgain = this.$this.find("#playAgain");
        this.$changeCharacter = this.$this.find("#changeCharacter");
        this.$back = this.$this.find("#playAgainBack");
        this.initCallbacks();
        this._callbacksInitialized = true;
      }
    }

    initCallbacks() {
      let client = this.game.client;

      this.$playAgain.click(() => {

        this.game.client.onDisconnect = () => {
          setTimeout(() => {
            client._connect(() => {
              client.sendThrowDices();
              $('#crearBotonCrear').trigger("click");
            });
          },1);
        };
        this.game.client._desconectar();
        this.hide();
      });

      this.$changeCharacter.click(() => {
        this.game.client.onDisconnect = () => {
          setTimeout(() => {
            client._connect(() => {
              client.sendThrowDices();
              this.setCrearPjScreenCb();
            });
          },1);
        };
        this.game.client._desconectar();
        this.hide();
      });

      this.$back.click(() => {
        this.game.client._desconectar();
        this.hide();
      });

    }
  }
  
export default playAgain;