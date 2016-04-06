/**
 * Created by horacio on 3/27/16.
 */

define(['jquery-ui'], function () {

    var PopUp = Class.extend({
        init: function (domID) {
            this.DOMid = domID;

            this.$this  = $('#' + domID);
            this.$container = $("#container");
            this.$this.draggable({
                cursor: "move",
                /*containment: "parent"*/
            });
            this.visible = false;
        },

        show: function () {
            this.clearDom();
            this.$this.show();

            //centrado:
            this.$this.css("top", (this.$container.height() / 2) - (this.$this.outerHeight() / 2));
            this.$this.css("left", (this.$container.width() / 2) - (this.$this.outerWidth() / 2));

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