/**
 * Created by horacio on 3/27/16.
 */

define(['jquery-ui'], function () {

    class PopUp {
        constructor(DOMdata, addiotionalOptions, general) { // los pop ups generales se ven en todas las pantallas (no solo juego) y estan centrados en el medio
            if (!DOMdata)
                throw new Error("DOMdata required");
            this.$this = $(DOMdata);

            var self = this;
            var options = {
                autoOpen: false,
                dialogClass: 'dialog_default',
                close: function (event, ui) {
                    self.hide();
                }
            };
            $.extend(options, addiotionalOptions);
            if (!general) {
                var position = {position: {my: "center", at: "left+40%", of: "#container"}};
                $.extend(options, position);
            }
            this.$this.dialog(options);
            if (this.$this.siblings('#' + this.$this.attr('id')).length) { // TODO: no funciona esto
                throw new Error("pop up inicializado dos veces: " + this.$this.attr('id'));
            }

            this.visible = false;
            this._firstTimeClosed = true; // primera vez en cerrar es automaticamente al crearlo
        }

        getDomElement() {
            return this.$this;
        }

        show() {
            this.$this.dialog("open");
            this.visible = true;
        }

        hide() { // OJO, en algunos se cierra con el comando que viene del server (y se puede cerrar 2 veces)
            log.error("popUP HIDE");
            if (this._firstTimeClosed) { // primera vez en cerrarse es al crearse
                this._firstTimeClosed = false;
                return;
            }
            this.$this.dialog("close");
            this.visible = false;
        }

        clearDom() {
            return;
            this.$this.find('span').text('');
            this.$this.find('input').val('');
        }

    }
    return PopUp;
});