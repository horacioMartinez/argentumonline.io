/**
 * Created by horacio on 3/27/16.
 */

define(['jquery-ui'], function () {

    var PopUp = Class.extend({
        init: function (domID) {
            this.DOMid = domID;

            this.$this  = $('#' + domID);
            this.$this.draggable({cursor: "move"});
            this.visible = false;
        },

        show: function () {
            this.clearDom();
            this.$this.show();
            this.visible = true;
        },

        hide: function () {
            this.$this.hide();
            this.visible = false;
        },

        clearDom: function () {
            $('#'+ this.DOMid + ' span').text('');
            $('#'+ this.DOMid + ' input').val('');
        },
    });

    return PopUp;
});