/**
 * Created by horacio on 4/5/17.
 */

define(["text!../../../menus/playAgain.html!strip", 'ui/popups/popup'], function (DOMdata, PopUp) {

  class playAgain extends PopUp {
    constructor(game) {
      var options = {
        width: 220,
        height: 240,
        minWidth: 150,
        minHeight: 200
      };
      super(DOMdata, options);
      this.game = game;
      this.$playAgain = $("#playAgain");
      this.$changeCharacter = $("#changeCharacter");
      this.$back = $("#playAgainBack");

      this.initCallbacks();
    }

    show() {
      super.show();
    }

    initCallbacks() {
      this.$playAgain.click(() => {
        this.game.client._desconectar();
        $('#crearBotonCrear').trigger("click");
        this.hide();
      });

      this.$changeCharacter.click(() => {
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
