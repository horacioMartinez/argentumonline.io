/**
 * Created by horacio on 4/18/17.
 */

define(["text!../../../menus/controlsHelper.html!strip", 'ui/popups/popup'], function (DOMdata, PopUp) {

  class ControlsHelper extends PopUp {
    constructor() {
      let options = {
        width: 270,
        height: 380,
        minWidth: 150,
        minHeight: 200
      };
      super(DOMdata, options, true);
      this.$ok = $("#controlsHelperButtonOk");
      this.initCallbacks();
    }

    show(playCb) {
      this.playCb = playCb;
      super.show();
    }

    initCallbacks() {
      this.$ok.click(() => {
        this.playCb();
        this.hide();
      });
    }
  }
  return ControlsHelper;
});

