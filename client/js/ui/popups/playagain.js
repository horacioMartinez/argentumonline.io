/**
 * Created by horacio on 4/5/17.
 */

define(["text!../../../menus/playAgain.html!strip", 'ui/popups/popup'], function (DOMdata, PopUp) {

  class playAgain extends PopUp {
    constructor(game) {
      var options = {
        width: 300,
        height: 400,
        minWidth: 150,
        minHeight: 250
      };
      super(DOMdata, options);
      this.game = game;
      this.initCallbacks();
    }

    show() {
      super.show();
    }

    initCallbacks() {
      var self = this;
    }
  }
  return playAgain;
});
