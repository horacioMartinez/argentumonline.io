/**
 * Created by horacio on 3/27/16.
 */

import $ from 'jquery';



    class PopUp {
        constructor(DOMdata, addiotionalOptions, general, modal) { // los pop ups generales se ven en todas las pantallas (no solo juego) y estan centrados en el medio
            if (!DOMdata) {
                throw new Error("DOMdata required");
            }
            this.$this = $(DOMdata);

            this.parentID = "#container";
            var self = this;
            this.options = {
                appendTo: self.parentID,
                autoOpen: false,
                modal: modal,
                dialogClass: 'dialog_default',
                close: function (event, ui) {
                    self.hide();
                },
                resize: function () { // fix TEMPORAL de bug resize http://stackoverflow.com/a/35912702
                    var heightPadding = parseInt($(this).css('padding-top'), 10) + parseInt($(this).css('padding-bottom'), 10),
                        widthPadding = parseInt($(this).css('padding-left'), 10) + parseInt($(this).css('padding-right'), 10),
                        titlebarMargin = parseInt($(this).prev('.ui-dialog-titlebar').css('margin-bottom'), 10);
                    $(this).height($(this).parent().height() - $(this).prev('.ui-dialog-titlebar').outerHeight(true) - heightPadding - titlebarMargin);

                    $(this).width($(this).prev('.ui-dialog-titlebar').outerWidth(true) - widthPadding);
                },
            };
            $.extend(this.options, addiotionalOptions);
            if (!general) {
                var position = {position: {my: "center", at: "left+40%", of: "#container"}};
                $.extend(this.options, position);
            }

            // Defer dialog creation to ensure DOM and CSS are ready
            this._dialogCreated = false;
            this.visible = false;
        }

        _createDom() {
            // If DOMdata was a string, append it to body first
            if (this.$this.parent().length === 0) {
                this.$this.appendTo('body').hide();
            }
            
            // Check if jQuery UI dialog is available
            if (typeof $.fn.dialog === 'undefined') {
                console.error('jQuery UI dialog is not loaded');
                return;
            }
            
            try {
                this.$this.dialog(this.options);
                if (this.$this.parent('.ui-dialog').length > 0) {
                    this.$this.parent().draggable("option", "containment", this.parentID);
                    // Ensure dialog has proper classes
                    this._ensureDialogClasses();
                }
                this._checkDuplicate();
            } catch (e) {
                console.error('Error creating dialog:', e);
            }
        }

        _ensureDialogClasses() {
            const $dialog = this.$this.parent('.ui-dialog');
            const $titlebar = $dialog.find('.ui-dialog-titlebar');
            const $closeButton = $titlebar.find('.ui-dialog-titlebar-close');
            
            // Add background and border classes
            $dialog.addClass('exterior_border_default background_default');
            
            // Style titlebar with background and border
            $titlebar.addClass('headingFont heading_border_default');
            
            // Style close button
            $closeButton.addClass('defaults_boton');
            
            // Hide the default jQuery UI close icon
            $closeButton.find('.ui-icon').css('display', 'none');
            $closeButton.find('.ui-button-icon-space').css('display', 'none');
            $closeButton.text(''); // Remove any text
        }

        _checkDuplicate() {
            let myID = this.$this.attr('id');
            this.$this.parent().siblings(".ui-dialog").each(function () {
                if ($(this).find('#' + myID).length) {
                    throw new Error("pop up inicializado dos veces: " + myID);
                }
            });
        }


        initButtonsSound(playSoundCallback){
            this.$this.find("button").click(function(event) {
                playSoundCallback($(this));
            });
        }

        _inicializarTabDesactivable($tab) {
            $tab.click(function () {
                if ($(this).hasClass('disabled')) {
                    return false;
                }
            });
        }

        _activarTab($tab) {
            $tab.removeClass('disabled');
        }

        _desactivarTab($tab) {
            $tab.addClass('disabled');
        }

        getDomElement() {
            return this.$this;
        }

        show() {
            // Create dialog on first show to ensure everything is loaded
            if (!this._dialogCreated) {
                this._createDom();
                this._dialogCreated = true;
            }
            this.clearDom();
            this.$this.dialog("open");
            this.visible = true;
        }

        hide() { // OJO, en algunos se cierra con el comando que viene del server (y se puede cerrar 2 veces)
            if (this._dialogCreated) {
                this.$this.dialog("close");
            }
            this.visible = false;
        }

        clearDom() { // todo: ver esto
            //this.$this.find('span').text('');
            this.$this.find('input').val('');
            this.$this.find('input[type=number]').val(1);
        }

    }
    
export default PopUp;