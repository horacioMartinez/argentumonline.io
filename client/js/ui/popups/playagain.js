/**
 * Created by horacio on 4/5/17.
 */

define(["text!../../../menus/playAgain.html!strip", 'ui/popups/popup'], function (DOMdata, PopUp) {

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
      this.$playAgain = $("#playAgain");
      this.$changeCharacter = $("#changeCharacter");
      this.$back = $("#playAgainBack");

      this.initCallbacks();
    }

    show() {
      super.show();
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
  return playAgain;
});
