/**
 * Created by horacio on 3/27/16.
 */

define(['jquery-ui'], function () {

    var PopUp = Class.extend({
        init: function (domID, general) { // los pop ups generales se ven en todas las pantallas (no solo juego) y estan centrados en el medio
            this.DOMid = domID;
            this.general = general;

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
            if (this.general)
                this.$this.css("left", (this.$container.width() / 2) - (this.$this.outerWidth() / 2));
            else
                this.$this.css("left", ((this.$container.width() / 2)*0.8 - (this.$this.outerWidth() / 2)));

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